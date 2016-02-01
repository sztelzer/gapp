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

	function confirmationController(orders, $state) {
		var vm = this;
		vm.reset = reset

		function reset(){
			$state.go('storePage.offerPage')
		}


	} // end controller




})();
