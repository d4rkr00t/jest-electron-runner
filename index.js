const spawn = require("projector-spawn");
const throat = require("throat");
const { formatResultsErrors } = require("jest-message-util");

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

              onStart(test)
                .then(() =>
                  spawn("electron", [
                    "./electron-transport.js",
                    "--file",
                    test.path,
                    "--globalConfig",
                    JSON.stringify(this._globalConfig),
                    "--config",
                    JSON.stringify(test.context.config)
                  ])
                )
                .then(({ stdout }) => {
                  const result = JSON.parse(stdout);
                  if (result.type === "error") {
                    return reject(new Error(result.data));
                  }

                  const data = result.data;
                  data.failureMessage = formatResultsErrors(
                    data.testResults,
                    test.context.config,
                    this._globalConfig,
                    test.path
                  );

                  return resolve(data);
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

// TODO: Readme and Example
// TODO: Coverage
