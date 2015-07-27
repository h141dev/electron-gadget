
var gulp = require('gulp');
var electron = require('electron-connect').server.create();

var pluginsDir = 'plugins';

gulp.task('default', function(){
        electron.start();
        gulp.watch(['index.js', pluginsDir+'/*.getter.js'], electron.restart);
        gulp.watch(['index.html', 'gadget.js', pluginsDir+'/*.render.js', pluginsDir+'/*.css'], electron.reload);
});

