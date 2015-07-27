'use strict';

var ipc = require('ipc');
var app = require('app');
var BrowserWindow = require('browser-window');
require('crash-reporter').start();
var mainWindow = null;

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 200,
        height: 600,
//        transparent: true,
//        frame: false
    });
    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});

ipc.on('openDevTools', function(event, arg) {
    mainWindow.openDevTools();
});

ipc.on('appClose', function(event, arg) {
    app.quit();
});

//console.log(process);

