(function () {
	'use strict';

	angular
		.module('able')
		.directive('elementConfirmation', confirmationDirective)
		.factory('confirmation', confirmationService)

	function confirmationService() {
		var service = {
			data:''
		}
		return service

	}


	function confirmationDirective() {
		var directive = {
			restrict: 'A',
			controller: confirmationController,
			controllerAs: 'confirmation',
			bindToController: true
		}
		return directive
	}

	function confirmationController(confirmation) {
		var vm = this;
		vm.data = confirmation.data


	} // end controller




})();
