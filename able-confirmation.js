(function() {
	'use strict';

	angular
		.module('able')
		.directive('confirmationElement', confirmationDirective)


	function confirmationDirective() {
		var directive = {
			restrict: 'A',
			controller: confirmationController,
			controllerAs: 'confirmation',
			bindToController: true
		}
		return directive
	}

	function confirmationController($rootScope, $state, auth, config, $http) {
		var vm = this;
		vm.last = $rootScope.last
		vm.phone = ''
		vm.save = save
		vm.back = back


		function get() {
			var req_config = {
				headers: {
					'Authorization': auth.token
				}
			};
			$http.get(config.api + '/users/' + auth.id, req_config)
				.then(
					function successCallback(response) {
						vm.phone = response.data.object.phone
					},
					function errorCallback(response) {
						if (response.status == 401) {
							if (navigator && navigator.notification) {
								navigator.notification.alert('Você precisa se logar novamente.', false, 'Able', 'Ok')
							} else {
								window.alert('Você precisa se logar novamente.')
							}
							auth.signout()
							return
						}

						if (response.status == 403) {
							if (navigator && navigator.notification) {
								navigator.notification.alert(response.data.errors[0].error, false, 'Able', 'Ok')
							} else {
								window.alert(response.data.errors[0].error)
							}
							return
						}

						if (navigator && navigator.notification) {
							navigator.notification.alert('Verifique sua conexão.', false, 'Able', 'Ok')
							return
						} else {
							window.alert('Verifique sua conexão.')
							return
						}
					});
		}
		get();

		function back() {
			$state.go('storePage.offerPage')
		}

		function save() {
			var req_config = {
				headers: {
					'Authorization': auth.token
				}
			};
			var payload = {
				phone: vm.phone
			};

			$http.patch(config.api + '/users/' + auth.id, payload, req_config)
				.then(
					function successCallback(response) {
						$state.go('storePage.offerPage')
					},
					function errorCallback(response) {
						if (response.status == 401) {
							if (navigator && navigator.notification) {
								navigator.notification.alert('Você precisa se logar novamente.', false, 'Able', 'Ok')
							} else {
								window.alert('Você precisa se logar novamente.')
							}
							auth.signout()
							return
						}

						if (response.status == 403) {
							if (navigator && navigator.notification) {
								navigator.notification.alert(response.data.errors[0].error, false, 'Able', 'Ok')
							} else {
								window.alert(response.data.errors[0].error)
							}
							return
						}

						if (navigator && navigator.notification) {
							navigator.notification.alert('Verifique sua conexão.', false, 'Able', 'Ok')
							return
						} else {
							window.alert('Verifique sua conexão.')
							return
						}

					});

		}

	} // end controller




})();