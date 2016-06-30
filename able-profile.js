(function() {
	'use strict';
	angular.module('able').directive('profileElement', profileDirective)

	function profileDirective() {
		var directive = {
			restrict: 'A',
			controller: profileController,
			controllerAs: 'profile',
			bindToController: true
		}
		return directive
	}

	function profileController($scope, auth, $http, config) {
		var vm = this
		vm.save = save
		vm.sending = false
		vm.resetPass = reset
		auth.getUser()
		$scope.$watch(function w(scope) {
			return (auth.user)
		}, function c(n, o) {
			vm.user = auth.user
		});
		// $scope.$watch(function w(scope){return( vm.user )},function c(n,o){
		//     auth.user === vm.user ? vm.synced = true : vm.synced = false;
		//     console.log(vm.synced)
		// });
		function save() {
			vm.sending = true
			if (Keyboard) {
				Keyboard.close()
			}
			var payload = {
				name: vm.user.name,
				document: vm.user.document,
				phone: vm.user.phone
			}
			auth.patchUser(payload).then(function(resolve) {
				vm.sending = false
				$scope.profileForm.$setPristine()
			}, function(reject) {
				vm.sending = false
			});
		}

		function reset() {
			var payload = {
				'email': auth.user.email
			};
			$http.patch(config.api + '/tokens', payload).then(function successCallback(response) {
				if (navigator && navigator.notification) {
					navigator.notification.alert("Enviamos um e-mail com instruções de recuperação da senha para " + auth.user.email, false, 'Able', 'Ok')
					return
				} else {
					window.alert("Enviamos um e-mail com instruções de recuperação da senha para " + auth.user.email)
					return
				}
			}, function errorCallback(response) {
				if (response.status == -1) {
					if (navigator && navigator.notification) {
						navigator.notification.alert("Verifique a sua conexão.", false, 'Able', 'Ok')
						return
					} else {
						window.alert("Verifique a sua conexão.")
						return
					}
				}
				if (response.data && response.data.errors && response.data.errors[0]) {
					if (navigator && navigator.notification) {
						navigator.notification.alert(response.data.errors[0].error, false, 'Able', 'Ok')
						return
					} else {
						window.alert(response.data.errors[0].error)
						return
					}
				}
			});
		}
	}
})();
