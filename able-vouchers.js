(function() {
	'use strict';

	angular
		.module('able')
		.directive('vouchersElement', vouchersDirective)


	function vouchersDirective() {
		var directive = {
			restrict: 'A',
			controller: vouchersController,
			controllerAs: 'vouchers',
			bindToController: true
		}
		return directive
	}

	function vouchersController($localStorage, $rootScope, $scope, auth, $http, config, $q) {
		var vm = this
		vm.loading = false
		vm.vouchers = []
		vm.get = get
		vm.save = save
		vm.activate = activate

		if (typeof $localStorage.voucher == "undefined") {
			$localStorage.voucher = {}
		}
		vm.active = $localStorage.voucher
		$rootScope.voucher = $localStorage.voucher


		get()

		function get() {
			var req_config = {
				headers: {
					'Authorization': auth.token
				}
			}
			$http.get(config.api + '/users/' + auth.id + '/vouchers', req_config)
				.then(
					function successCallback(response) {
						for (var key in response.data.resources) {
							vm.vouchers.push(response.data.resources[key])
						}
						$rootScope.vouchers = response.data.resources
						if (vm.vouchers.length == 1) {
							activate(vm.vouchers[0])
						}
						if (vm.vouchers.length > 1) {
							for (var k in vm.vouchers) {
								if (!vm.vouchers[k].object.burns.burnt) {
									activate(vm.vouchers[k])
								}
							}
						}
						vm.loading = false
					},
					function errorCallback(response) {
						vm.loading = false
						if (response.status == 401 || response.status == 403 || response.status == 404) {
							if (navigator && navigator.notification) {
								navigator.notification.alert('Você precisa se logar novamente.', false, 'Able', 'Ok')
							} else {
								window.alert('Você precisa se logar novamente.')
							}
							auth.signout()
							return
						}

						if (navigator && navigator.notification) {
							navigator.notification.alert('Verifique sua conexão.', get, 'Able', 'Ok')
							return
						} else {
							window.alert('Verifique sua conexão.')
							get()
							return
						}

					})
		}

		function save() {
			vm.sending = true
			var payload = {
				code: vm.code
			}
			var req_config = {
				headers: {
					'Authorization': auth.token
				}
			}
			$http.post(config.api + '/users/' + auth.id + '/vouchers', payload, req_config).then(
				function successCallback(response) {
					console.log(response)
					vm.vouchers.push(response.data)
					$rootScope.vouchers = vm.vouchers
					if (!response.data.object.burns.burnt) {
						activate(response.data)
					}
					vm.code = ''
					$scope.voucherForm.$setPristine()
					$scope.voucherForm.$setUntouched()
					vm.sending = false
				},
				function errorCallback(response) {
					vm.code = ''
					$scope.voucherForm.$setPristine()
					$scope.voucherForm.$setUntouched()
					vm.sending = false

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
						var message
						switch (response.data.errors[0].reference) {
							case "not_found":
								message = "Este cupom não é válido."
								break
							case "already_installed":
								message = "Você já usou este cupom."
								break
							case "not_authorized":
								message = "Você não deveria estar tentando isso."
								break
							case "self_voucher":
								message = "Você não pode usar o seu próprio código. Você precisa divulgar para outros ;)"
								break

						}

						console.log(navigator.notification)

						if (navigator && navigator.notification) {
							navigator.notification.alert(message, false, 'Able', 'Ok')
						} else {
							window.alert(message)
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




				}
			)
		}

		function activate(voucher) {
			$rootScope.voucher = voucher
			$localStorage.voucher = voucher
			vm.active = voucher
		}




	}



})();