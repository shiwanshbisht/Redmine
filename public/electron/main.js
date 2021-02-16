const {
    app,
    BrowserWindow,
    BrowserView,
    ipcMain,
    screen,
} = require("electron");
const path = require("path");

function createWindow() {
    let { bounds } = screen.getPrimaryDisplay();
    const width = parseInt(bounds.width * 0.8);
    const height = parseInt(bounds.height * 0.9);
    const mainWindow = new BrowserWindow({
        width: width,
        height: height,
        minWidth: 760,
        transparent: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: path.join(__dirname, "./koders.png"),
    });
    const url1 = "https://kore.koders.in/";
    const url2 =
        process.env.url ||
        `file://${path.join(__dirname, "../../build/index.html")}`;

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
    const view1 = new BrowserView({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    const view2 = new BrowserView({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    view1.webContents.loadURL(url1);
    view2.webContents.loadURL(url2);
    bounds = mainWindow.getBounds();
    const y1 = parseInt(height * 0.028);
    view1.setBounds({
        x: 0,
        y: y1,
        width: bounds.width,
        height: bounds.height + y1,
    });
    view1.setAutoResize({ width: true, height: true });
    view2.setBounds({
        x: 0,
        y: y1,
        width: bounds.width,
        height: bounds.height + y1,
    });
    view2.setAutoResize({ width: true, height: true });
    mainWindow.addBrowserView(view1);
    mainWindow.addBrowserView(view2);
    mainWindow.loadURL(`file://${path.join(__dirname, "./koder.html")}`);
    setTimeout(() => {
        mainWindow.loadURL(`file://${path.join(__dirname, "./index.html")}`);
        mainWindow.setBrowserView(view1);
    }, 3000);

    ipcMain.on("minimize", (evt, arg) => {
        mainWindow.minimize();
    });
    ipcMain.on("maximize", (evt, arg) => {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    });
    ipcMain.on("navbar", (evt, arg) => {
        const bounds = mainWindow.getBounds();
        if (arg === "kore") {
            mainWindow.setBrowserView(view1);
            view1.setBounds({
                x: 0,
                y: y1,
                width: bounds.width,
                height: bounds.height - y1,
            });
        } else if (arg === "pomodoro") {
            mainWindow.setBrowserView(view2);
            view2.setBounds({
                x: 0,
                y: y1,
                width: bounds.width,
                height: bounds.height - y1,
            });
        }
    });
}
ipcMain.on("close", (evt, arg) => {
    app.quit();
});

app.whenReady().then(() => {
    createWindow();
    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});
