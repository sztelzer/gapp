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

	function signinController(auth, $state, $scope) {
		var vm = this;
		vm.signin = Signin

		function Signin(){
			auth.login.email = $scope.signinForm.email;
			auth.login.password = $scope.signinForm.password;
			var signin = auth.signin();
			signin.then(
				function(resolve){
					$state.go('storePage')
				},
				function(reject){
					$scope.signinForm.email = '';
					$scope.signinForm.password = '';
					window.alert('invalid login');

				}

			)




		}

	} // end controller




})();
