const { app, BrowserWindow, Menu } = require("electron");
const menuTemplate = require("./src/menuTemplate");
// 用于判断本地环境还是生产环境
const isDev = require("electron-is-dev");
let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const urlLocation = isDev ? "http://localhost:3000" : "dummyUrl";
  mainWindow.loadURL(urlLocation);
  // 打开调式窗口
  // mainWindow.webContents.openDevTools();
  // 设置菜单
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
});
