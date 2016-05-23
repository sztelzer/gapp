(function () {
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

	function vouchersController($localStorage, $scope, auth, $http, config, $q, $mdToast) {
		var vm = this
        vm.loading = false
        vm.vouchers = []
        vm.get = get
        vm.save = save

        get()
		function get(){
			var req_config = {headers: {'Authorization': auth.token}}
			$http.get(config.api + '/users/' + auth.id + '/vouchers', req_config)
			.then(
			function successCallback(response) {
                console.log(response)

                for (var key in response.data.resources) {
                    vm.vouchers.push(response.data.resources[key])
                }
                console.log(vm.vouchers)

                $localStorage.vouchers = response.data.resources
				vm.loading = false
			},
			function errorCallback(response) {
                console.log(response)
				vm.vouchers = $localStorage.vouchers
				vm.loading = false

				if(response.status == 401 || response.status == 403 || response.status == 404){
					if(navigator && navigator.notification){
						navigator.notification.alert('Você precisa se logar novamente.', false, 'Able', 'Ok')
					} else {
						window.alert('Você precisa se logar novamente.')
					}
					auth.signout()
					return
				}

				if(navigator && navigator.notification){
					navigator.notification.alert('Verifique sua conexão.', get, 'Able', 'Ok')
					return
				} else {
					window.alert('Verifique sua conexão.')
					get()
					return
				}

			})
		}

		function save(){
            vm.sending = true
            var payload = {
                code: vm.code
            }
            var req_config = {headers: {'Authorization': auth.token}}
            $http.post(config.api + '/users/' + auth.id + '/vouchers', payload, req_config).then(
                function successCallback(response) {
                    console.log(response)
                    vm.vouchers.push(response.data)
                    $localStorage.vouchers = vm.vouchers
                    vm.code = ''
                    $scope.voucherForm.$setPristine()
                    $scope.voucherForm.$setUntouched()
                    vm.sending = false
                },
                function errorCallback(response) {
                    vm.sending = false
                    console.log(response)
                    vm.code = ''
                    $scope.voucherForm.$setPristine()
                    $scope.voucherForm.$setUntouched()

                    if(response.status == 401){
                        if(navigator && navigator.notification){
                            navigator.notification.alert('Você precisa se logar novamente.', false, 'Able', 'Ok')
                        } else {
                            window.alert('Você precisa se logar novamente.')
                        }
                        auth.signout()
                        return
                    }

                    if(response.status == 403){
                        var message
                        switch (response.data.errors[0].reference) {
                            case "voucher_used":
                                message = "Você já usou este cupom."
                                break
                            case "voucher_not_found":
                                message = "Este cupom não é válido."
                                break
                            case "voucher_expired":
                                message = "Este cupom expirou."
                        }

                        if(navigator && navigator.notification){
                            navigator.notification.alert(message, false, 'Able', 'Ok')
                        } else {
                            window.alert(message)
                        }

                        return
                    }

                    if(navigator && navigator.notification){
                        navigator.notification.alert('Verifique sua conexão.', false, 'Able', 'Ok')
                        return
                    } else {
                        window.alert('Verifique sua conexão.')
                        return
                    }




                }
            )
		}



		function toast(msg){$mdToast.show(
			$mdToast.simple()
			.textContent(msg)
			.hideDelay(30000)
			.action('Ok')
			.theme('default')
		)};
	}



})();
