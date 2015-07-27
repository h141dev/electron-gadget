
var d3 = require('d3');
var remote = require('remote');
var getter = remote.require('./plugins/clock.getter.js');

var init = function(){
    d3.select('#clock').append('div').text('時計');
    d3.select('#clock').append('div').attr('id', 'clock_now');
    render();
};

exports.init = init;

function render(){
    getter.getVars(function(result){
        d3.select('#clock_now').text(result);
    });

    setTimeout( render,1000 );
};

