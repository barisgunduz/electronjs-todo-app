const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainwindow, addWindow;
let todoList = [];

app.on("ready", () => {
	mainwindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	mainwindow.setResizable(false);
	// Pencerenin oluşturulması
	mainwindow.loadURL(
		url.format({
			pathname: path.join(__dirname, "pages/mainWindow.html"),
			protocol: "file:",
			slashes: true,
		})
	);
	// Menünün oluşturulması
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	Menu.setApplicationMenu(mainMenu);

	mainwindow.on("close", () => {
		app.quit();
	});

	// NewTODO Penceresi Eventleri...
	ipcMain.on("newTodo:close", () => {
		addWindow.close();
		addWindow = null;
	});
	ipcMain.on("newTodo:save", (err, data) => {
		console.log(data);
		if (data) {
			todoList.push({
				id: todoList.length + 1,
				text: data,
			});
            console.log(todoList)
			addWindow.close();
			addWindow = null;
		}
	});
});

const mainMenuTemplate = [
	{
		label: "Dosya",
		submenu: [
			{
				label: "Yeni TODO Ekle",
				click() {
					createWindow();
				},
			},
			{
				label: "Tümünü sil",
			},
			{
				label: "Çıkış",
				accelerator:
					process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
				role: "quit",
			},
		],
	},
];

if (process.platform == "darwin") {
	mainMenuTemplate.unshift({
		label: app.getName(),
		role: "TODO",
	});
}

if (process.env.NODE_ENV !== "production") {
	mainMenuTemplate.push({
		label: "Geliştirici Araçları",
		submenu: [
			{
				label: "Geliştirici Araçları",
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				},
			},
			{
				label: "Yenile",
				role: "reload",
			},
		],
	});
}

function createWindow() {
	addWindow = new BrowserWindow({
		frame: false,
		width: 475,
		height: 175,
		title: "Yeni pencere",
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	addWindow.setResizable(false);

	addWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, "pages/newTodo.html"),
			protocol: "file:",
			slashes: true,
		})
	);

	addWindow.on("close", () => {
		addWindow = null;
	});
}

function getTodoList() {
	console.log(todoList) ;
}
