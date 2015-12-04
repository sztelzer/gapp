(function() {
	'use strict';

	angular
		.module('able')
		.directive('elementToolbar', ableToolbarDirective)
		.directive('elementToolbarExit', ableToolbarExitDirective)
		.directive('ableLeftMenuButton', leftMenuButtonDirective)
		.directive('ableLeftMenu', leftMenuDirective)


	function ableToolbarDirective() {
		var directive = {
			restrict: 'A',
			templateUrl: 'menus/toolbar.template.html',
		}
		return directive;
	}

	function ableToolbarExitDirective() {
		var directive = {
			restrict: 'A',
			templateUrl: 'menus/toolbarExit.template.html',
		}
		return directive;
	}


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
			controllerAs: 'lm',
			bindToController: true
		}
		return directive;
	}

	function LeftMenuController(auth) {
		var vm = this;
		vm.user = auth.id;
	}


	function LeftMenuButtonController($mdSidenav) {
		var vm = this;
		vm.toggleLeftMenu = toggleLeftMenu
		function toggleLeftMenu(menuId) {
  			$mdSidenav(menuId).toggle();
		}

	}


})();
