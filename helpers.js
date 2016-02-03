

Object.prototype.removeItem = function (key) {
   if (!this.hasOwnProperty(key))
      return
   if (isNaN(parseInt(key)) || !(this instanceof Array))
      delete this[key]
   else
      this.splice(key, 1)
};


//
// angular.module('able').directive('hires', hiresDirective)
// function hiresDirective(){
// 	var directive = {
// 	restrict: 'A',
// 	scope:{hires:@},
// 	link: function(scope, element, attrs) {
// 		console.log('here')
// 		element.bind('load', function() {
// 		    console.log('load fired')
// 		    element.attr('src', scope.hires)
// 		    element.unbind('load')
// 		});
// 	}
// 	return directive
// }

//usage:
//<img hires="http://localhost/hi-res-image.jpg" src="http://localhost/low-res-image.jpg" />
