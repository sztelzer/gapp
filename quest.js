(function () {
	'use strict';

	angular
		.module('able')
		.directive('elementQuest', questDirective)
		.directive('validateCpf', validateCpfDirective)

	function questDirective() {
		var directive = {
			restrict: 'A',
			controller: questController,
			controllerAs: 'quest',
			bindToController: true
		}
		return directive
	}

	function questController($http, auth, config, $q, $scope, $state, $mdToast) {
		var vm = this;
		vm.payload = {};
		vm.user = {};
		vm.tags = [];
		vm.send = send;
		vm.least_tags = true;
		vm.sending = false;


		//load tags quest only when quest page is loaded.
		$http.get('quest_tags.json').success(function (data){
			vm.tags = data;
		});

		$scope.$watch(function w(scope){return( Object.keys(vm.payload).length )},function c(n,o){
			vm.least_tags = (Object.keys(vm.payload).length < vm.tags.length) ? true : false;
			// console.log(vm.payload);
		});




		function send(){
			vm.sending = true
			if (Object.keys(vm.payload).length < vm.tags.length){
				toast("Responda todos os items.")
				return
			}

			//both are valid, let's go
			var signup = auth.signup(vm.user.name, vm.user.document, vm.user.email, vm.user.password);
			signup.then(
				function(resolve) {
					signin();
				},
				function(reject) {
					vm.sending = false
					if(reject.data.errors[0].reference == "repeated_email"){
						toast("Este e-mail já possui um perfil. Use outro ou recupere sua senha.")
					} else {
						toast("Houve um erro inesperado ao criar seu perfil. Por favor tente novamente, nós vamos verificar o que houve.")
					}
				}
			);

		}

		function signin(){
			var signin = auth.signin(vm.user.email, vm.user.password);
			signin.then(
				function(resolve) {
					console.log(resolve);
					sendQuest();
				},
				function(reject) {
					console.log(reject);
				}
			);
		}

		function sendQuest(){
			var sendquest = sendQuestPromisse();
			sendquest.then(
				function(resolve) {
					console.log(resolve);
					$state.go('storePage')
				},
				function(reject) {
					console.log(reject);
				}
			);
		}

		function sendQuestPromisse(){
			return $q(function(resolve, reject) {
				var req_config = {headers: {'Authorization': auth.token}}

				// for (var key in vm.payload) {
				//     if (!vm.payload.hasOwnProperty(key)) continue;
				// 	vm.payload[key] = parseInt(key)
				// }

				var payload = {
					kind: "start_quest",
					responses: JSON.stringify(vm.payload),
				}
				$http.post(config.api + '/users/' + auth.id + '/quests', payload, req_config)
					.then(
					function successCallback(response) {
						resolve();
					},
					function errorCallback(response) {
						reject();
					}
				);
			});
		}

		function toast(msg) {
		    $mdToast.show(
		    	$mdToast.simple()
			    .textContent(msg)
			    .hideDelay(5000)
			);
		};





	} // end questController








	function validateCpfDirective() {
	    return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attr, ctrl) {
				function customValidator(ngModelValue) {
					if (testCpf(ngModelValue)){
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
