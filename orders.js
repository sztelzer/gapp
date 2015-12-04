(function () {
	'use strict';

	angular
		.module('able')
		.directive('elementOrders', ordersDirective)


	function ordersDirective() {
		var directive = {
			restrict: 'A',
			templateUrl: 'orders.template.html',
			controller: ordersController,
			controllerAs: 'orders',
			bindToController: true
		}
		return directive
	}

	function ordersController() {
		var vm = this;



	} // end controller




})();
