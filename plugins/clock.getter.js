
var getVars = function( callback ){
    var result = new Date().toLocaleString();
    callback( result );
};

exports.getVars = getVars;

