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
    var atomScreen = require('screen');
    var size = atomScreen.getPrimaryDisplay().workAreaSize;

    //console.log(atomScreen.getCursorScreenPoint());

    mainWindow = new BrowserWindow({
        width: 200,
        height: 600,
        x : size.width,
        y : 0,
        resizable : false,
        transparent: true,
        frame: false
    });

    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});

ipc.on('openDevTools', function(event, arg) {
    mainWindow.openDevTools({detach:true});
});

ipc.on('appClose', function(event, arg) {
    app.quit();
});

//console.log(process);

