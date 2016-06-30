(function() {
	'use strict';
	angular.module('able').directive('accordionElement', accordionDirective)

	function accordionDirective() {
		var directive = {
			restrict: 'A',
			controller: accordionController,
			controllerAs: 'accordion',
			bindToController: true
		}
		return directive
	}

	function accordionController($sce) {
		var vm = this
		vm.toggle = toggle
		vm.short = short()

		function short() {
			vm.expanded = false
			vm.class = "short"
			vm.signal = "... +"
		}

		function long() {
			vm.expanded = true
			vm.class = "long"
			vm.signal = " -"
		}

		function toggle() {
			vm.expanded ? short() : long()
		}
	}
})();
