(function() {
	'use strict';

	angular
		.module('able')
		.directive('leftMenu', leftMenuDirective)
		.directive('toolbar', toolbarDirective)

	function toolbarDirective() {
		var directive = {
			restrict: 'A',
			controller: toolbarController,
			controllerAs: 'toolbar',
			bindToController: true
		}
		return directive;
	}

	function toolbarController($mdSidenav, $state){
		var vm = this;
		vm.toggleLeftMenu = toggleLeftMenu
		vm.back = back
		function toggleLeftMenu(menuId) {
			$mdSidenav(menuId).toggle();
		}
		function back(){
			$state.go('storePage.offerPage')
		}
	}

	function leftMenuDirective() {
		var directive = {
			restrict: 'A',
			controller: leftMenuController,
			controllerAs: 'leftmenu',
			bindToController: true
		}
		return directive;
	}

	function leftMenuController(auth, $state, $mdSidenav) {
		var vm = this;
		vm.user = auth.id;
		vm.go = go
		function go(state){
			$state.go(state);
			$mdSidenav('able-left-menu').toggle();
		}
	}

})();
