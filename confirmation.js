(function () {
	'use strict';

	angular
		.module('able')
		.directive('confirmationElement', confirmationDirective)


	function confirmationDirective() {
		var directive = {
			restrict: 'A',
			controller: confirmationController,
			controllerAs: 'confirmation',
			bindToController: true
		}
		return directive
	}

	function confirmationController(orders) {
		var vm = this;


	} // end controller




})();
