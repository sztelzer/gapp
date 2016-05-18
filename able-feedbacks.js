(function () {
	'use strict';

	angular
		.module('able')
		.directive('elementFeedbacks', feedbacksDirective)


	function feedbacksDirective() {
		var directive = {
			restrict: 'A',
			controller: feedbacksController,
			controllerAs: 'feedbacks',
			bindToController: true
		}
		return directive
	}

	function feedbacksController(auth, $http, config, $q){
		var vm = this
		vm.loading = true
		vm.touched = false
		vm.allsent = false
		vm.list = []
		vm.send = send
		vm.clean = clean

		function get(){
			vm.loading = true
			var req_config = {headers: {'Authorization': auth.token}}
			$http.get(config.api + '/users/' + auth.id + '/feedbacks', req_config)
				.then(
				function successCallback(response) {
					vm.list = response.data.resources
					vm.loading = false
				},
				function errorCallback(response) {
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
						toast(response.data.errors[0].error)
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
				}
			); //end then
		}
		get()

		function send(){
			vm.touched = false;
			vm.list.slice().reverse().forEach(function(item, index, object) {
				if (item.object.touched == true) {
					vm.sent = true;
					item.done = true;
					item.sending = true;
					put(item).then(
						function(resolve){
							item.done = true;
							item.sending = true;
							vm.clean();
						},
						function(reject){
							item.done = false;
							item.sending = false;
							vm.touched = true;
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
								toast(response.data.errors[0].error)
								return
							}

							if(navigator && navigator.notification){
								navigator.notification.alert('Verifique sua conexão.', false, 'Able', 'Ok')
							} else {
								window.alert('Verifique sua conexão.')
							}
						}
					);
				} //end if
			}); //end foreach
		}

		function clean(){
			vm.list.slice().reverse().forEach(function(item, index, object) {
				if (item.done == true) {
					vm.list.splice(object.length - 1 - index, 1);
				}
			})
		}


		function put(feedback){
			var req_config = {headers: {'Authorization': auth.token}};
			var path = feedback.path;
			var payload = {float: feedback.object.float, open: "false"};

			return $q(function(resolve, reject) {
				$http.patch(config.api + path, payload, req_config)
					.then(
					function successCallback(response) {
						resolve(response.data);
					},
					function errorCallback(response) {
						reject();
					});
			});
		}




	}




})();
