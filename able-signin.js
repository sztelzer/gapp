(function() {
	'use strict';
	angular.module('able').directive('signinElement', signinDirective)

	function signinDirective() {
		var directive = {
			restrict: 'A',
			controller: signinController,
			controllerAs: 'signin',
			bindToController: true
		}
		return directive
	}

	function signinController(auth, $state, $scope, $http, config) {
		var vm = this
		vm.email = ''
		vm.password = ''
		vm.signin = signin
		vm.reset = reset
		vm.sending = false

		function signin() {
			vm.sending = true;
			var signin = auth.signin(vm.email, vm.password);
			signin.then(function(resolve) {
				$state.go('storePage.offerPage')
				vm.email = ''
				vm.password = ''
			}, function(reject) {
				vm.password = ''
				vm.sending = false;
				if (reject.status == -1) {
					if (navigator && navigator.notification) {
						navigator.notification.alert("Verifique sua conexão.", false, 'Able', 'Ok')
					} else {
						window.alert("Verifique sua conexão.")
					}
				} else {
					if (navigator && navigator.notification) {
						navigator.notification.alert("Verifique seus dados e tente novamente.", false, 'Able', 'Ok')
					} else {
						window.alert("Verifique seus dados e tente novamente.")
					}
				}
			})
		}

		function reset() {
			vm.sending = true
			var emailPattern = new RegExp(/^.+@.+\..+$/)
			if (!emailPattern.test(vm.email)) {
				if (navigator && navigator.notification) {
					navigator.notification.alert("Digite um e-mail válido no campo E-mail.", false, 'Able', 'Ok')
				} else {
					window.alert("Digite um e-mail válido no campo E-mail.")
				}
				vm.sending = false
				return
			}
			var payload = {
				'email': vm.email
			};
			$http.patch(config.api + '/tokens', payload).then(function successCallback(response) {
				vm.sending = false
				if (navigator && navigator.notification) {
					navigator.notification.alert("Enviamos um e-mail com instruções de recuperação da senha para " + vm.email, false, 'Able', 'Ok')
				} else {
					window.alert("Enviamos um e-mail com instruções de recuperação da senha para " + vm.email)
				}
			}, function errorCallback(response) {
				vm.sending = false
				if (response.data && response.data.errors && response.data.errors[0]) {
					if (navigator && navigator.notification) {
						navigator.notification.alert(response.data.errors[0].error, false, 'Able', 'Ok')
					} else {
						window.alert(response.data.errors[0].error)
					}
					return
				}
				if (navigator && navigator.notification) {
					navigator.notification.alert("Verifique sua conexão.", false, 'Able', 'Ok')
				} else {
					window.alert("Verifique sua conexão.")
				}
			});
		}
	} // end controller
})();
