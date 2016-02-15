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

	function confirmationController($rootScope) {
		var vm = this;
		vm.last = $rootScope.last
		// vm.reset = reset
		// function reset(){
		// 	$state.go('storePage.offerPage')
		// }


	} // end controller




})();
