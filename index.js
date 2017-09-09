const spawn = require("projector-spawn");
const throat = require("throat");

class ElectronTestRunner {
  constructor(globalConfig) {
    this._globalConfig = globalConfig;
  }

  async runTests(tests, watcher, onStart, onResult, onFailure, options) {
    const mutex = throat(this._globalConfig.maxWorkers);
    return Promise.all(
      tests.map(test =>
        mutex(async () => {
          if (watcher.isInterrupted()) {
            throw new CancelRun();
          }

          await onStart(test);
          const { stdout, stderr } = await spawn("electron", [
            "./electron-runner.js",
            "--file",
            test.path,
            "--globalConfig",
            JSON.stringify(this._globalConfig),
            "--config",
            JSON.stringify(test.context.config)
          ]);

          const result = JSON.parse(stdout);
          if (result.type === "error") {
            throw new Error(result.data);
          }
          return result.data;
        })
          .then(result => onResult(test, result))
          .catch(e => onFailure(test, e))
      )
    );
  }
}

class CancelRun extends Error {}

module.exports = ElectronTestRunner;

// TODO: Fix colors
// TODO: Make it work on Node 4+
// TODO: Clean up a little bit
// TODO: Readme and Example
// TODO: Coverage
