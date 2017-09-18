const path = require("path");
const spawn = require("child_process").spawn;
const electron = require("electron");
const throat = require("throat");
const supportsColor = require("supports-color");

class ElectronTestRunner {
  constructor(globalConfig) {
    this._globalConfig = globalConfig;
  }

  runTests(tests, watcher, onStart, onResult, onFailure, options) {
    const mutex = throat(this._globalConfig.maxWorkers);
    return Promise.all(
      tests.map(test =>
        mutex(
          () =>
            new Promise((resolve, reject) => {
              if (watcher.isInterrupted()) {
                throw new CancelRun();
              }

              const env = Object.assign({}, process.env, {
                FORCE_COLOR: supportsColor.level
              });

              onStart(test)
                .then(() =>
                  spawn(
                    electron,
                    [path.join(__dirname, "electron-transport.js")],
                    { stdio: ["ipc"], env }
                  )
                )
                .then(electron => {
                  process.on("exit", code => {
                    electron.kill();
                  });

                  electron.on("message", message => {
                    if (message.type === "ready") {
                      return electron.send({
                        file: test.path,
                        globalConfig: this._globalConfig,
                        config: test.context.config
                      });
                    }

                    if (message.type === "error") {
                      return reject(new Error(message.data));
                    }

                    resolve(message.data);
                  });
                })
                .catch(e => {
                  reject(e);
                });
            })
        )
          .then(result => onResult(test, result))
          .catch(e => onFailure(test, e))
      )
    );
  }
}

class CancelRun extends Error {}

module.exports = ElectronTestRunner;
