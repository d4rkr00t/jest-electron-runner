const { FakeTimers, installCommonGlobals } = require("jest-util");
const mock = require("jest-mock");

class ElectronEnvironment {
  constructor(config) {
    const global = (this.global = window);
    installCommonGlobals(global, config.globals);
    this.moduleMocker = new mock.ModuleMocker(global);
    this.fakeTimers = new FakeTimers(global, this.moduleMocker, config);
  }

  dispose() {
    if (this.fakeTimers) {
      this.fakeTimers.dispose();
    }
    this.fakeTimers = null;
  }

  runScript(script) {
    return script.runInThisContext();
  }
}

module.exports = ElectronEnvironment;
