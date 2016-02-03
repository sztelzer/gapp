(function() {
	'use strict';

	angular
		.module('able')
		.factory('auth', auth)

	function auth($http, $state, config, $q, $localStorage, $window){
		var service = {
			id: $localStorage.id,
			token: $localStorage.token,
			email: '',
			password: '',
			logout: false,
			signup: signup,
			signin: signin,
			signout: signout
		}
		return service

		function signup(name, email, password){
			var payload = {'name':name,'email':email,'new_password':password};
			return $q(function(resolve, reject) {
				$http.post(config.api + '/users', payload, {})
					.then(
					function successCallback(response) {
						service.id = response.data.object.user;
						$localStorage.id = response.data.object.user;
						service.token = response.data.object.token;
						$localStorage.token = response.data.object.token;
						resolve(response);
					},
					function errorCallback(response) {
						reject(response);
					}
				);
			});
		}


		function signin(email, password){
			var login = {'email':email, 'password':password};
			return $q(function(resolve, reject) {
				$http.post(config.api + '/tokens', login)
					.then(
					function successCallback(response) {
						service.id = response.data.object.user;
						$localStorage.id = response.data.object.user;
						service.token = response.data.object.token;
						$localStorage.token = response.data.object.token;
						resolve(response);
					},
					function errorCallback(response) {
						service.email = '';
						service.password = '';
						reject(response);
					});
			})
		}

		function signout(){
			service.token = ''
			service.id = ''
			window.localStorage.clear()
			$window.location.reload()
		}

	}

})();
