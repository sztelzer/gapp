(function() {
	'use strict';
	angular.module('able').directive('elementQuest', questDirective).directive('validateCpf', validateCpfDirective)

	function questDirective() {
		var directive = {
			restrict: 'A',
			controller: questController,
			controllerAs: 'quest',
			bindToController: true
		}
		return directive
	}

	function questController($http, auth, $scope, $state, $location, $anchorScroll, $timeout, $element) {
		var vm = this;
		vm.payload = {};
		vm.user = {};
		vm.tags = [];
		vm.send = send;
		vm.answered = 0;
		vm.sending = false;
		vm.tags_length = 1;
		//load tags quest only when quest page is loaded.
		$http.get('quest_tags.json').success(function(data) {
			vm.tags = data;
			vm.tags_length = vm.tags.length
		});
		// Este watch verifica se todo o questionário foi respondido.
		// É chamado em cada resposta.
		$scope.$watch(function w(scope) {
			return (Object.keys(vm.payload).length)
		}, function c(n, o) {
			vm.answered = Object.keys(vm.payload).length
			vm.least_tags = (Object.keys(vm.payload).length < vm.tags_length) ? true : false;
		});

		function send() {
			vm.sending = true
			auth.signupQuest(vm.user.name, vm.user.document, vm.user.email, vm.user.password, JSON.stringify(vm.payload)).then(function(resolve) {
				$state.go('storePage')
				// vm.sending = false
			}, function(reject) {
				vm.sending = false
				if (reject.data && reject.data.errors && reject.data.errors[0].reference == "repeated_email") {
					if (navigator && navigator.notification) {
						navigator.notification.alert("Este e-mail já possui um perfil. Recupere sua senha ou use outro e-mail.", false, 'Able', 'Ok')
						return
					} else {
						window.alert("Este e-mail já possui um perfil. Recupere sua senha ou use outro e-mail.")
						return
					}
				} else {
					if (navigator && navigator.notification) {
						navigator.notification.alert("Não foi possível criar sua conta. Verifique a qualidade da sua conexão.", false, 'Able', 'Ok')
						return
					} else {
						window.alert("Não foi possível criar sua conta. Verifique a qualidade da sua conexão.")
						return
					}
				}
			});
		}
		// function signin(){
		// 	var signin = auth.signin(vm.user.email, vm.user.password);
		// 	signin.then(
		// 		function(resolve) {
		// 			console.log(resolve);
		// 			sendQuest();
		// 		},
		// 		function(reject) {
		// 			console.log(reject);
		// 		}
		// 	);
		// }
		// function sendQuest(){
		// 	var sendquest = sendQuestPromisse();
		// 	sendquest.then(
		// 		function(resolve) {
		// 			console.log(resolve);
		// 			$state.go('storePage')
		// 		},
		// 		function(reject) {
		// 			console.log(reject);
		// 		}
		// 	);
		// }
		// function sendQuestPromisse(){
		// 	return $q(function(resolve, reject) {
		// 		var req_config = {headers: {'Authorization': auth.token}}
		//
		// 		// for (var key in vm.payload) {
		// 		//     if (!vm.payload.hasOwnProperty(key)) continue;
		// 		// 	vm.payload[key] = parseInt(key)
		// 		// }
		//
		// 		var payload = {
		// 			kind: "start_quest",
		// 			responses: JSON.stringify(vm.payload),
		// 		}
		// 		$http.post(config.api + '/users/' + auth.id + '/quests', payload, req_config)
		// 			.then(
		// 			function successCallback(response) {
		// 				resolve();
		// 			},
		// 			function errorCallback(response) {
		// 				reject();
		// 			}
		// 		);
		// 	});
		// }
	} // end questController
	function validateCpfDirective() {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attr, ctrl) {
				function customValidator(ngModelValue) {
					if (testCpf(ngModelValue)) {
						ctrl.$setValidity('cpf', true)
					} else {
						ctrl.$setValidity('cpf', false)
					}
					return ngModelValue
				}
				ctrl.$parsers.push(customValidator)
			}
		};
	};
})(); //end strict
