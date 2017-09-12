const { app, BrowserWindow, ipcMain } = require("electron");
const minimist = require("minimist");

const args = minimist(process.argv.slice(2));

function run() {
  let runner = new BrowserWindow({
    title: "Jest",
    show: false,
    contextIsolation: true
  });

  ipcMain.on("test-results", (evt, result) => {
    process.send({ type: "result", data: result });
  });

  ipcMain.on("error", (evt, error) => {
    process.send({ type: "error", data: error });
  });

  runner.loadURL(`file://${__dirname}/runner.html`);

  process.on("message", msg => {
    runner.webContents.on("did-finish-load", () => {
      runner.webContents.send("run", {
        file: msg.file,
        globalConfig: msg.globalConfig,
        config: msg.config
      });
    });
  });

  process.send({ type: "ready" });
}

app.on("ready", run);

app.on("window-all-closed", function() {
  app.quit();
});

if (process.platform === "darwin") {
  app.dock.hide();
}
