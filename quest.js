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

	function questController($http, auth, config, $q, $scope) {
		var vm = this;
		vm.userPayload = {'name':'','email':'','new_password':''};
		vm.questPayload = {};
		vm.send = send;

		//load tags quest only when quest page is loaded.
		$http.get('quest_tags.json').success(function (data){
			vm.tags = data;
		});

		function send(){
			console.log($scope.questForm.email)
			// //check if form is valid
			// if(!$scope.questForm.$valid){
			// 	console.log($scope.questForm.$valid)
			// 	return;
			// }
			return

			//both are valid, let's go
			var signup = auth.signup(vm.userPayload);
			signup.then(
				function(resolve) {
					console.log(resolve);
					signin();
				},
				function(reject) {
					console.log(reject);
				}
			);

		}

		function signin(){
			var signin = auth.signin();
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
				var req_config = {headers: {'Authorization': auth.user.token}}
				$http.post(config.api + '/users/' + auth.user.id + '/quests', vm.questPayload, req_config)
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


	} // end questController





})(); //end strict
