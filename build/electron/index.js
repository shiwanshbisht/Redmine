const os = require("os");
const {
    app,
    BrowserWindow,
    BrowserView,
    ipcMain,
    screen,
} = require("electron");
const path = require("path");
const axios = require("axios");

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

ipcMain.on("webhook", async (evt, arg) => {
    const { title, content, timer } = arg;
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
                        value: timer,
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
        // await axios.post(
        //     "https://discord.com/api/webhooks/780830846575312927/h_NKiNA2NyQ3YOioLVjDOedsyBhowWIf2TW7YIQuTdjT134elK_SxOTSE1tmaY-PRn5O",
        //     embed
        // );
        await axios.post(
            "https://discord.com/api/webhooks/808061916152070194/d0q51NFs8eWDHaQVJPKfsk1UbTYE1WlhF4r7CChWNAADOxZQs4Ke2c0n1qIuSIruFihH",
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
