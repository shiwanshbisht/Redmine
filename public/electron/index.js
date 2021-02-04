const { app, BrowserWindow, BrowserView, ipcMain } = require("electron");
const path = require("path");
function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        minWidth: 760,
        transparent: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: path.join(__dirname, "./koders.png"),
    });
    const url1 =
        process.env.url ||
        `file://${path.join(__dirname, "../../build/index.html")}`;

    const url2 = process.env.url.trim() + "/pomodoro";

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
    const view1 = new BrowserView({
        webPreferences: {
            contextIsolation: false,
        },
    });
    const view2 = new BrowserView({
        webPreferences: {
            contextIsolation: false,
        },
    });

    view1.webContents.loadURL(url1);
    view2.webContents.loadURL(url2);
    const bounds = mainWindow.getBounds();
    view1.setBounds({
        x: 0,
        y: 30,
        width: bounds.width,
        height: bounds.height,
    });
    view1.setAutoResize({ width: true, height: true });
    view2.setBounds({
        x: 0,
        y: 30,
        width: bounds.width,
        height: bounds.height + 50,
    });
    view2.setAutoResize({ width: true, height: true });
    mainWindow.loadURL(`file://${path.join(__dirname, "./koder.html")}`);
    setTimeout(() => {
        mainWindow.loadURL(`file://${path.join(__dirname, "./index.html")}`);
        mainWindow.addBrowserView(view1);
        mainWindow.addBrowserView(view2);
        mainWindow.setBrowserView(view1);
        view1.setAutoResize({ width: true, height: true });
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
                y: 30,
                width: bounds.width,
                height: bounds.height,
            });
        } else if (arg === "pomodoro") {
            mainWindow.setBrowserView(view2);
            view2.setBounds({
                x: 0,
                y: 30,
                width: bounds.width,
                height: bounds.height - 30,
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
