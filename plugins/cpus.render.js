
var d3 = require('d3');
var svg = null;
var coreN = 0;
var remote = require('remote');
var getter = remote.require('./plugins/cpus.getter.js');

var init = function(){
    d3.select('#cpus').append('div').text('CPU');
    svg = d3.select('#cpus').append('svg');
    render();
};

exports.init = init;

function render(){
    getter.getVars(function(result){
        var list = [];
        for( var i = 0; i < result.coreN; i++ ){
            list.push( result['cpu'+i].active );
        }

        if( ! coreN ){
            coreN = result.coreN;
            var svgWidth = 200;
            var svgHeight = coreN * 5;
            svg.attr('width', svgWidth)
                .attr('height', svgHeight)
                .selectAll('rect')
                .data(list)
                .enter()
                .append('rect');
            return;
        }

        svg.selectAll('rect')
            .datum(list)
            .call( graphBar );
    });

    setTimeout( render,1000 );
};

function graphBar(svg){
    svg.attr('x', 0)
        .attr('y', function(d,i){ return i * 5; })
        .attr('width', function(d,i){ return (d[i]*2) +'px'; })
        .attr('height', '5')
        .attr('style', 'fill:rgb(255,0,0)');
};

