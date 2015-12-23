(function() {
	'use strict';

	angular
		.module('able')
		.factory('auth', auth)

	function auth($http, $state, $localStorage, config, $q){
		var service = {
			login: {'email':'', 'password':''},
			user: $localStorage.$default({'id':'','token':''}),
			signup: signup,
			signin: signin,
			signout: signout
		}
		return service

		function signup(payload){
			return $q(function(resolve, reject) {
				$http.post(config.api + '/users', payload, {})
					.then(
					function successCallback(response) {
						service.login.email = payload.email;
						service.login.password = payload.new_password;
						resolve();
					},
					function errorCallback(response) {
						console.log(response.data.errors);
						reject();
					}
				);
			});
		}


		function signin(){
			return $q(function(resolve, reject) {
				$http.post(config.api + '/tokens', service.login)
					.then(
					function successCallback(response) {
						service.user.id = response.data.object.user
						service.user.token = response.data.object.token
						service.login = {}
						resolve();
						// $state.go('storePage')
					},
					function errorCallback(response) {
						service.user = {}
						service.login = {}
						reject();
						// $state.go('signinPage')
					});
			})
		}

		function signout(){
			$localStorage.id = "";
			$localStorage.token = "";
			$localStorage.offer = "";
			$localStorage.last_confirmation = "";
			$localStorage.orders = "";
			window.location.href = "index.html";
			// $state.go('startPage')
		}

	}

})();
