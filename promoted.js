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

		vm.putOne = function(){
			cart.putOne(vm.promoted);
			vm.quantity = cart.items_selected[vm.promoted.path];
		}
		vm.takeOne = function(){
			cart.takeOne(vm.promoted)
			vm.quantity = cart.items_selected[vm.promoted.path];
		}


	}





})();
