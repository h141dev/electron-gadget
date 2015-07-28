'use strict';

var ipc = require('ipc');
var app = require('app');
var Menu = require('menu');
var Tray = require('tray');
var BrowserWindow = require('browser-window');
require('crash-reporter').start();
var mainWindow = null;
var appIcon = null;

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function() {
    var iconpath = __dirname + '/info-128.png';
    appIcon = new Tray(iconpath.toString());
    var contextMenu = Menu.buildFromTemplate([
            { label: 'OpenDevTools', click: function(){ mainWindow.openDevTools({detach:true}); } },
            { label: 'Quit', click: function(){ app.quit(); } },
    ]);
    appIcon.setToolTip('Electron Desktop Gadget.');
    appIcon.setContextMenu(contextMenu);

    var atomScreen = require('screen');
    var size = atomScreen.getPrimaryDisplay().workAreaSize;

    //console.log(atomScreen.getCursorScreenPoint());

    mainWindow = new BrowserWindow({
        width: 200,
        height: 600,
        x : size.width - 200,
        y : 0,
        resizable : false,
        transparent: true,
        frame: false,
    });

    mainWindow.setAlwaysOnTop(true);
    mainWindow.setSkipTaskbar(true);

    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});

//console.log(process);

