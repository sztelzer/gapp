(function () {
	'use strict';

	angular
		.module('able')
		.directive('plasticsElement', plasticsDirective)


	function plasticsDirective() {
		var directive = {
			restrict: 'A',
			controller: plasticsController,
			controllerAs: 'plastics',
			bindToController: true
		}
		return directive
	}

	function plasticsController($rootScope, $scope, $localStorage, $state, auth, $http, config, $q, $window) {
		var vm = this;
		vm.new = {}
		vm.plastics = []
		vm.save = save
		vm.activate = activate
		vm.remove = remove
		vm.sending = false
		vm.loading = true
        vm.saveDucument = saveDocument
        vm.sendingDocument = false

		if(typeof $localStorage.plastic == "undefined") {
			$localStorage.plastic = {}
		}
		vm.plastic = $localStorage.plastic
		$rootScope.plastic = $localStorage.plastic

		get()
		function get(){
			var req_config = {headers: {'Authorization': auth.token}};
			$http.get(config.api + '/users/' + auth.id + '/plastics', req_config)
			.then(
			function successCallback(response) {
				vm.plastics = response.data.resources;
				if(!vm.plastic.path && vm.plastics && vm.plastics[0]){
					activate(vm.plastics[0])
				}
				vm.loading = false
			},
			function errorCallback(response) {
				vm.plastics = []
				vm.loading = false

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
                    if(navigator && navigator.notification){
						navigator.notification.alert(response.data.errors[0].error, false, 'Able', 'Ok')
					} else {
						window.alert(response.data.errors[0].error)
					}
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
			if(Keyboard) {
				Keyboard.close()
			}
			vm.sending = true
			var a = angular.copy(vm.new.number)
			var b = angular.copy(vm.new.cvc)
			var c = angular.copy(vm.new.expiry)

			stripePlasticToken(a, b, c).then(
				function(resolvedToken){
					var payload = {
						self_key: new Date().getTime().toString(),
						mask: maskPlasticNumber(a),
						expiry: c,
						token: resolvedToken
					}

					var req_config = {headers: {'Authorization': auth.token}};
					$http.post(config.api + '/users/' + auth.id + '/plastics', payload, req_config)
						.then(
						function(response){
							vm.new = {}
							$scope.plasticForm.$setPristine()
							$scope.plasticForm.$setUntouched()
							activate(response.data)
							get()
							vm.sending = false
						},
						function(response){
							vm.sending = false
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
                                if(navigator && navigator.notification){
									navigator.notification.alert(response.data.errors[0].error, false, 'Able', 'Ok')
								} else {
									window.alert('Você precisa se logar novamente.')
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
					);
				},
				function(rejectedToken){
					vm.sending = false

                    if(navigator && navigator.notification){
                        navigator.notification.alert("Este cartão não foi aceito. Verifique os dados.", false, 'Able', 'Ok')
                    } else {
                        window.alert("Este cartão não foi aceito. Verifique os dados.")
                    }


				}
			)
		}

		function activate(plastic){
			$localStorage.plastic = plastic
			$rootScope.plastic = plastic
			vm.plastic = plastic
		}

		function remove(plastic){
			//call delete on plastic.path
			var req_config = {headers: {'Authorization': auth.token}};
			$http.delete(config.api + plastic.path, req_config)
			.then(
				function(response){
					if(plastic.path == vm.plastic.path){
						$localStorage.plastic = ''
						$rootScope.plastic = ''
						vm.plastic = ''
					}
					//remove this item from the list
					vm.plastics.slice().reverse().forEach(function(item, index, object) {
						if (item.path == plastic.path) {
							vm.plastics.splice(object.length - 1 - index, 1);
						}
					})


				},
				function(response){
                    if(navigator && navigator.notification){
                        navigator.notification.alert('Houve um erro ao remover este cartão. Tente novamente.', false, 'Able', 'Ok')
                        return
                    } else {
                        window.alert('Houve um erro ao remover este cartão. Tente novamente.')
                        return
                    }
				}
			)
		}



		function maskPlasticNumber(number){
			var a = number.substring(0, 4)
			var b = number.substring(12,16)
			var masked = b
			return masked
		}

		function stripePlasticToken(number, cvc, expiry) {
			var payload = {
				number: number,
				cvc: cvc,
				exp_month: expiry.substring(0, 2),
				exp_year: "20"+expiry.substring(expiry.length - 2, expiry.length),
			}

			return $q(function(resolve, reject) {
				Stripe.setPublishableKey($localStorage.stripe);
				Stripe.card.createToken(payload, function(status, response){
					if (status < 200 || status > 299) {
						reject(status)
					} else {
						resolve(response.id)
					}
				})
			})
		}

        function saveDocument(){
            if(Keyboard) {
                Keyboard.close()
            }
            vm.sendingDocument = true

            var payload = {
                document: angular.copy(vm.document)
            }

            auth.patchUser(payload).then(
                function(resolve) {
                    vm.sendingDocument = false
                },
                function(reject) {
                    vm.sendingDocument = false
                }
            );
        }


	}



})();
