
var d3 = require('d3');

var init = function(){
    d3.select('#menu').append('a').attr('onclick', 'openDev()').text('[Tool]');
    d3.select('#menu').append('a').attr('onclick', 'appClose()').text('[X]').style('float','right');
};

exports.init = init;


