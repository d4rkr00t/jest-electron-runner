const { app, BrowserWindow, ipcMain } = require("electron");
const minimist = require("minimist");

const args = minimist(process.argv.slice(2));

function run(file, config) {
  let runner = new BrowserWindow({
    title: "Jest",
    show: false,
    contextIsolation: true
  });

  ipcMain.on("test-results", (evt, result) => {
    console.log(JSON.stringify({ type: "result", data: result }));
  });

  ipcMain.on("error", (evt, error) => {
    console.log(JSON.stringify({ type: "error", data: error }));
  });

  runner.loadURL(`file://${__dirname}/runner.html`);
  runner.webContents.on("did-finish-load", () => {
    runner.webContents.send("run", {
      file: args.file,
      globalConfig: JSON.parse(args.globalConfig),
      config: JSON.parse(args.config)
    });
  });
}

app.on("ready", run);

app.on("window-all-closed", function() {
  app.quit();
});
