const spawn = require("projector-spawn");

class ElectronTestRunner {
  constructor(globalConfig) {
    this._globalConfig = globalConfig;
  }

  async runTests(tests, watcher, onStart, onResult, onFailure, options) {
    return Promise.all(
      tests.map(test => {
        return new Promise((resolve, reject) => {
          (async () => {
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
          })()
            .then(result => {
              onResult(test, result);
              resolve();
            })
            .catch(e => {
              onFailure(test, e);
            });
        });
      })
    );
  }
}

class CancelRun extends Error {}

module.exports = ElectronTestRunner;

// TODO: Parallel run
// TODO: Fix colors
// TODO: Clean up a little bit
// TODO: Readme and Example
// TODO: Coverage
