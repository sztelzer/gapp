(function () {
	'use strict';

	angular
		.module('able')
		.directive('startElement', startDirective)

	function startDirective() {
		var directive = {
			restrict: 'A',
			controller: startController,
			controllerAs: 'start',
			bindToController: true
		}
		return directive
	}

	function startController(auth, $window) {
		var vm = this;
		if (auth.logout == true) {
			$window.location.reload(true)
		}
	} // end controller




})();
