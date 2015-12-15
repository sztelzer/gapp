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

	function feedbacksController(feedbacks){
		var vm = this;
		vm.list = feedbacks.list;
		var get = feedbacks.get();
		get.then(
			function(resolve) {
				vm.list = feedbacks.list
			},
			function(reject) {
			}
		);



	}




})();
