(function () {
	'use strict';

	angular
		.module('able')
		.directive('signinElement', signinDirective)

	function signinDirective() {
		var directive = {
			restrict: 'A',
			controller: signinController,
			controllerAs: 'signin',
			bindToController: true
		}
		return directive
	}

	function signinController(auth, $state, $scope, $mdToast) {
		var vm = this;
		vm.email = '';
		vm.password = '';
		vm.signin = signin;

		function signin(){
			var signin = auth.signin(vm.email, vm.password);
			signin.then(
				function(resolve){
					$state.go('storePage.offerPage');
					vm.email = '';
					vm.password = '';
				},
				function(reject){
					vm.password = '';
					toast("That's a no-no :(");
				}
			)
		}

		function toast(msg){$mdToast.show($mdToast.simple().textContent(msg).hideDelay(3000))};


	} // end controller




})();
