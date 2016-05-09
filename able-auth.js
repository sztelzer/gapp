(function() {
	'use strict';

	angular
		.module('able')
		.factory('auth', auth)

	function auth($http, $state, config, $q, $localStorage, $window){
		var service = {
			id: $localStorage.id,
			token: $localStorage.token,
            user: {},
			email: '',
			password: '',
			logout: false,
			signupQuest: signupQuest,
			signin: signin,
			signout: signout,
            getUser: getUser,
            patchUser: patchUser
		}
		return service

		function signupQuest(name, document, email, password, quest){
			var payload = {'name':name, 'document':document, 'email':email,'new_password':password, 'quest':quest};
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

        function getUser(){
            var req_config = {headers: {'Authorization': service.token}};
            $http.get(config.api + '/users/' + service.id, req_config)
            .then(
                function successCallback(response) {
                    service.user = response.data.object;
                },
                function errorCallback(response) {
                    if(response.status == 401 || response.status == 404){
                        if(navigator && navigator.notification){
                            navigator.notification.alert('Você precisa se logar novamente.', false, 'Able', 'Ok')
                        } else {
                            window.alert('Você precisa se logar novamente.')
                        }
                        signout()
                        return
                    }

                    if(navigator && navigator.notification){
                        navigator.notification.alert('Verifique sua conexão.', getUser, 'Able', 'Tentar Novamente')
                        return
                    } else {
                        window.alert('Verifique sua conexão.')
                        getUser()
                        return
                    }

                }
            )
        }

        function patchUser(payload){
            return $q(function(resolve, reject) {
                var req_config = {headers: {'Authorization': service.token}};
                $http.patch(config.api + '/users/' + service.id, payload, req_config)
                .then(
                    function successCallback(response) {
                        service.user = response.data.object;
                        resolve(response)
                    },
                    function errorCallback(response) {
                        if(response.status == 401 || response.status == 404){
                            if(navigator && navigator.notification){
                                navigator.notification.alert('Você precisa se logar novamente.', false, 'Able', 'Ok')
                            } else {
                                window.alert('Você precisa se logar novamente.')
                            }
                            signout()
                            return
                        }
                        if(response.status == 403){
                            reject(response)
                        }
                        if(navigator && navigator.notification){
                            navigator.notification.alert('Verifique sua conexão.', getUser, 'Able', 'Tentar Novamente')
                            return
                        } else {
                            window.alert('Verifique sua conexão.')
                            getUser()
                            return
                        }
                    }
                )
            })


        }





	}

})();
