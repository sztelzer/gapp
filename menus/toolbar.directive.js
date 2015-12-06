(function() {
	'use strict';

	angular
		.module('able')
		.directive('ableLeftMenuButton', leftMenuButtonDirective)
		.directive('ableLeftMenu', leftMenuDirective)

	function leftMenuButtonDirective() {
		var directive = {
			restrict: 'A',
			controller: LeftMenuButtonController,
			controllerAs: 'lmb',
			bindToController: true
		}
		return directive;
	}

	function leftMenuDirective() {
		var directive = {
			restrict: 'E',
			templateUrl: 'menus/left.template.html',
			controller: LeftMenuController,
			controllerAs: 'vm',
			bindToController: true
		}
		return directive;
	}

	function LeftMenuController(auth, $state, $mdSidenav) {
		var vm = this;
		vm.user = auth.id;
		vm.go = go
		function go(state){
			$state.go(state);
			$mdSidenav('able-left-menu').toggle();
		}
	}

	function LeftMenuButtonController($mdSidenav) {
		var vm = this;
		vm.toggleLeftMenu = toggleLeftMenu
		function toggleLeftMenu(menuId) {
  			$mdSidenav(menuId).toggle();
		}
	}


})();
