(function () {
	'use strict';

	angular
		.module('able')
		.directive('elementQuest', questDirective)


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

		//load tags quest only when quest page is loaded.
		$http.get('quest_tags.json').success(function (data){
			vm.tags = data;
		});

		$scope.$watch(function w(scope){return( Object.keys(vm.payload).length )},function c(n,o){
			vm.least_tags = (Object.keys(vm.payload).length < vm.tags.length) ? true : false;
			console.log(vm.payload);
		});




		function send(){
			if (Object.keys(vm.payload).length < vm.tags.length){
				toast("Responda todos os items.")
				return
			}

			//both are valid, let's go
			var signup = auth.signup(vm.user.name, vm.user.email, vm.user.password);
			signup.then(
				function(resolve) {
					console.log(resolve);
					signin();
				},
				function(reject) {
					console.log(reject);
					toast(reject.data.errors[0].reference)
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
			    .hideDelay(3000)
			);
		};




	} // end questController





})(); //end strict
