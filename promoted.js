(function () {
	'use strict';

	angular
		.module('able')
		.directive('elementPromoted', promotedDirective)

	function promotedDirective() {
		var directive = {
			restrict: 'A',
			templateUrl: 'promoted.template.html',
			controller: promotedController,
			controllerAs: 'vm',
			bindToController: true
		}
		return directive
	}

	function promotedController(cart){
		var vm = this;
		vm.quantity = 0;
		vm.putOne = function(promoted){
			cart.putOne(promoted);
			vm.quantity = cart.items_selected[promoted.path];
		}
		vm.takeOne = function(promoted){
			cart.takeOne(promoted)
			vm.quantity = cart.items_selected[promoted.path];
		}


	}





})();
