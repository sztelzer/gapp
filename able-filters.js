(function () {
	'use strict';

	angular
	.module('able')

	.filter('secondsToTime', function() {
	    return function(seconds) {
	        var d = new Date(0,0,0,0,0,0,0);
	        d.setSeconds(Math.round(seconds));
	        return d;
    	}
	})



});
