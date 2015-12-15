(function () {
	'use strict';

	angular
		.module('able')
		.factory('feedbacks', feedbacks)
		.directive('elementFeedbacks', feedbacksDirective)



	function feedbacks($http, $q, $localStorage, config, auth){
		var service = {
			list: "",
			get: get
		}
		return service

		function get() {
			var req_config = {headers: {'Authorization': auth.user.token}};
			return $q(function(resolve, reject) {
				$http.get(config.api + '/users/' + auth.user.id + '/feedbacks', req_config)
					.then(
					function successCallback(response) {
						console.log(response.data);
						service.list = response.data.resources;
						//$localStorage.feedbacks = response.data.resources;
						resolve();
					},
					function errorCallback(response) {
						service.list = "";
						reject(response.data.errors);
					}
				); //end then
			}) //end q
		} //end get

	}



	function feedbacksDirective() {
		var directive = {
			restrict: 'A',
			controller: feedbacksController,
			controllerAs: 'feedbacks',
			bindToController: true
		}
		return directive
	}

	function feedbacksController(feedbacks, auth, $http, config, $q){
		var vm = this;
		vm.list = feedbacks.list;
		vm.toSend = 0;
		vm.allSent = false;
		vm.listSize = 0;

		var get = feedbacks.get();
		get.then(
			function(resolve) {
				vm.list = feedbacks.list;
				vm.listSize = vm.list.length;
			},
			function(reject) {
			}
		);

		function put(feedback){
			var req_config = {headers: {'Authorization': auth.user.token}};
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

		vm.send = send;
		function send(){
			Object.keys(vm.list).forEach(function(key){
				var feedback = vm.list[key];
				if (feedback.object.float != 0) {
					vm.toSend -= 1;
					delete vm.list[key];
					if (vm.toSend == 0){
						vm.allSent = true;
					}
					put(feedback).then(
						function(resolve){
							vm.list[key].object = resolve.object;
						},
						function(reject){
							vm.list[key].object.open = "false";
						}
					);
				} //end if
			});
		}



	}




})();
