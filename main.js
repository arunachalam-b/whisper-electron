const { app, BrowserWindow, ipcMain } = require("electron");
const { exec } = require("child_process");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Consider using preload script for security
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);

ipcMain.handle("transcribe", async (event, audioPath) => {
  return new Promise((resolve, reject) => {
    const modelPath = path.join(__dirname, "whisper.cpp/models/ggml-base.en.bin");
    console.log("Model Path ========= ", modelPath, audioPath);
    const command = `whisper.cpp/build/bin/whisper-cli -m ${modelPath} -f ${audioPath}`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error 1234: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
});
