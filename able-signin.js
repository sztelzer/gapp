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

	function signinController(auth, $state, $scope, $mdToast, $http, config) {
		var vm = this
		vm.email = ''
		vm.password = ''
		vm.signin = signin
		vm.reset = reset
		vm.working = false
		vm.workingReset = false


		function signin(){
			vm.working = true;
			var signin = auth.signin(vm.email, vm.password);
			signin.then(
				function(resolve){
					$state.go('storePage.offerPage')
					vm.email = ''
					vm.password = ''
				},
				function(reject){
					// console.log(reject)
					vm.password = ''
					vm.working = false;
					if(reject.status == -1){
						toast("Verifique sua conexão.")
					} else {
						toast("That's a no-no :(")
					}
				}
			)
		}


		function reset(){
			var emailPattern = new RegExp(/^.+@.+\..+$/)
			if(!emailPattern.test(vm.email)){
				console.log("no email")
				toast("Digite um e-mail válido no campo E-mail.")
				return
			}

			var payload = {'email':vm.email};
			$http.patch(config.api + '/tokens', payload)
				.then(
				function successCallback(response) {
					console.log("ok")
					toastex("Enviamos um e-mail com instruções de recuperação da senha para "+vm.email)
				},
				function errorCallback(response) {
					console.log("nok")
					if(response.status == -1){
						toast("Verifique sua conexão.")
						return
					}
					if(response.data && response.data.errors && response.data.errors[0]){
						toast(response.data.errors[0].error)
						return
					}
					toast("That's a no-no :(")
				});
		}

		function toast(msg){$mdToast.show($mdToast.simple().textContent(msg).hideDelay(3000))};
		function toastex(msg){$mdToast.show($mdToast.simple().textContent(msg).hideDelay(9000))};





	} // end controller




})();
