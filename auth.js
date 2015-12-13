(function() {
	'use strict';

	angular
		.module('able')
		.factory('auth', auth)

	function auth($http, $state, $localStorage, config){
		var service = {
			login: {'email':'', 'password':''},
			user: $localStorage.$default({
				'id':'',
				'token':'',
			}),
			signin: signin,
			signout: signout
		}
		return service


		function signin(){
			console.log(service.login)
			$http.post(config.api + '/tokens', service.login)
				.then(
				function successCallback(response) {
					console.log(response.data)
					service.user.id = response.data.object.user
					service.user.token = response.data.object.token
					service.login = {}
					$state.go('storePage')
				},
				function errorCallback(response) {
					console.log(response.data)
					service.user = {}
					service.login = {}
					$state.go('signinPage')
				});
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
