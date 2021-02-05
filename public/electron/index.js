const os = require("os");
const { app, BrowserWindow, BrowserView, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios");
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

ipcMain.on("webhook", async (evt, arg) => {
    const { title, content } = arg;
    const user = os.userInfo().username;
    const hostname = os.hostname();
    const device = os.platform() + " " + os.arch();
    const time = new Date();
    const timeStamp = time.toLocaleDateString();
    const type = title.split(" ").pop();
    let embed = {
        content: null,
        embeds: [
            {
                title: content,
                color: 5814783,
                fields: [
                    {
                        name: "Date",
                        value: timeStamp,
                    },
                    {
                        name: "Type",
                        value: type,
                        inline: true,
                    },
                    {
                        name: "Timer",
                        value: "00:00",
                        inline: true,
                    },
                    {
                        name: "Hostname",
                        value: hostname,
                    },
                    {
                        name: "Platform",
                        value: device,
                        inline: true,
                    },
                ],
                author: {
                    name: `Timer ran by ${user}`,
                },
                footer: {
                    text: "Made with ❤ by Koders",
                    icon_url:
                        "https://media.discordapp.net/attachments/700257704723087360/709710823207206952/K_without_bg_1.png",
                },
                timestamp: time,
            },
        ],
    };
    try {
        await axios.post(
            "https://discord.com/api/webhooks/780830846575312927/h_NKiNA2NyQ3YOioLVjDOedsyBhowWIf2TW7YIQuTdjT134elK_SxOTSE1tmaY-PRn5O",
            embed
        );
    } catch (err) {
        console.log(err);
    }
});
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
