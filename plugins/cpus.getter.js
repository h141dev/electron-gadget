
var exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    child;

var getVars = function( callback ){

    if( process.platform == 'linux' ){
        getVarsLinux( callback );
    };
    if( process.platform == 'win32' ){
        getVarsWin32( callback );
    };
    // FIXME
//    if( process.platform == 'darwin' ){
//        getVarsDarwin( callback );
//    }
//    if( process.platform == 'freebsd' ){
//        getVarsFreebsd( callback );
//    }

};

exports.getVars = getVars;

// typeperf -q 取得可能な物一覧。
function getVarsWin32( callback ){
    child = spawn('typeperf', ['-sc', 1, '\\Processor(*)\\% Processor Time']);
    var buf = null;
    child.stdout.on('data', function(data) {
        buf += data.toString('utf8');
    });

    child.on('exit', function(code){
        buf = buf.split('\r\n')[2].split(',');
        buf.shift(); // 先頭はタイムスタンプなので捨てる。
        var retVars = {};
        retVars.coreN = buf.length - 1;
        for( var i = 0; i < buf.length; i++ ){
            retVars['cpu'+i] = {};
            retVars['cpu'+i].active = parseInt(buf[i].replace(/['"]/g,''));
        }
        callback( retVars );
    });
}


// /proc/stat は起動時からのデータを蓄積しているので、
// 差分を取って表示する。
var prevVars = [];

function getVarsLinux( callback ){
    child = exec('cat /proc/stat', function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }

        var coreN = -1;
        var curVars = {};
        var retVars = {};
        var result = stdout;

        result = result.split('\n');

        for( var i = 0; i < result.length; i++ ){
            var cpu = result[i].match(/^cpu.*$/);
            if( cpu == null ) continue;

            coreN++;
            var ar = cpu[0].split(' ');
            var core = ar.shift();
            curVars[core] = {};

            if( ar.length == 11 ) ar.shift();

            curVars[core].user = parseInt(ar.shift());
            curVars[core].nice = parseInt(ar.shift());
            curVars[core].sys  = parseInt(ar.shift());
            curVars[core].idle = parseInt(ar.shift());

            if( typeof prevVars[core] !== 'undefined' ){
                retVars[core] = {};
                retVars[core].user = curVars[core].user - prevVars[core].user;
                retVars[core].nice = curVars[core].nice - prevVars[core].nice;
                retVars[core].sys  = curVars[core].sys  - prevVars[core].sys;
                retVars[core].idle = curVars[core].idle - prevVars[core].idle;
                retVars[core].total =
                            retVars[core].user +
                            retVars[core].nice +
                            retVars[core].sys  +
                            retVars[core].idle;

                retVars[core].user   = parseInt(retVars[core].user / retVars[core].total * 100);
                retVars[core].nice   = parseInt(retVars[core].nice / retVars[core].total * 100);
                retVars[core].sys    = parseInt(retVars[core].sys  / retVars[core].total * 100);
                retVars[core].idle   = parseInt(retVars[core].idle / retVars[core].total * 100);
                retVars[core].active = (100 - retVars[core].idle);
            }

            prevVars[core] = {};
            prevVars[core].user = curVars[core].user;
            prevVars[core].nice = curVars[core].nice;
            prevVars[core].sys  = curVars[core].sys;
            prevVars[core].idle = curVars[core].idle;

        };
        retVars.coreN = coreN;
        callback( retVars );
    });
};

