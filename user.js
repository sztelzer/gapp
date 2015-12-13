(function() {
	'use strict';

	angular
		.module('able')
		.factory('user', user)

	function user($http, $localStorage, config){
		var service = {
			data: $localStorage.$default({
				path: "",
				object: {
					"email": "",
					"document": "",
					"name": "",
					"surname": "",
					"country": "",
					"phone": ""
				},
			}),
			post: post,
			get: get,
			put: put,
		}
		return service


		function post(){
			$http.post(config.api + '/users', service.data)
			.then(
			function successCallback(response) {
				service.data = response.data
			},
			function errorCallback(response) {
				console.log(response.data.errors)
			});

		}

		function get(){

		}

		function put(){

		}





		// function signin(){
		// 	console.log(service.login)
		// 	$http.post(config.api + '/tokens', service.login)
		// 		.then(
		// 		function successCallback(response) {
		// 			console.log(response.data)
		// 			service.user.id = response.data.object.user
		// 			service.user.token = response.data.object.token
		// 			service.login = {}
		// 			$state.go('storePage')
		// 		},
		// 		function errorCallback(response) {
		// 			console.log(response.data)
		// 			service.user = {}
		// 			service.login = {}
		// 			$state.go('signinPage')
		// 		});
		// }
		//
		// function signout(){
		// 	service.user.id = ''
		// 	service.user.token = ''
		// 	window.location.href = "index.html"
		// }

	}
	
})();
