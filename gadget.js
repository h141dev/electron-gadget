
'use strict';

var gadgetList = [
    'clock',
    'cpus',
];

window.addEventListener( 'load', gadgetStart );

function gadgetStart(){
    var d3 = require('d3');

    gadgetList.forEach(function(pluginName){
        d3.select('head').append('link').attr('rel','stylesheet').attr('href','plugins/'+pluginName+'.css');
        d3.select('body').append('div').attr('id', pluginName);

        var plugin = require( './plugins/' + pluginName + '.render.js' );
        plugin.init();
    });
};

