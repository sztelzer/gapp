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

	function confirmationController($state, cart) {
		var vm = this;
		vm.reset = reset
		vm.last = cart.last

		function reset(){
			cart.reset = true
			console.log(cart.reset)
			$state.go('storePage.offerPage')
		}


	} // end controller




})();
