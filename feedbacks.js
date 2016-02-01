(function () {
	'use strict';

	angular
		.module('able')
		.factory('feedbacks', feedbacks)
		.directive('elementFeedbacks', feedbacksDirective)



	function feedbacks($http, $q, config, auth){
		var service = {
			list: "",
			len: 0,
			get: get
		}
		return service

		function get() {
			var req_config = {headers: {'Authorization': auth.token}};
			return $q(function(resolve, reject) {
				$http.get(config.api + '/users/' + auth.id + '/feedbacks', req_config)
					.then(
					function successCallback(response) {
						console.log(response.data);
						service.list = response.data.resources;
						service.len = response.data.count;
						resolve();
					},
					function errorCallback(response) {
						service.list = "";
						service.len = 0;
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
		vm.loading = true;
		vm.list = feedbacks.list;
		vm.len = 0;
		vm.touched = false;
		vm.sent = false;
		vm.get = get;
		vm.send = send;
		vm.clean = clean;
		vm.get();

		function get(){
			var get = feedbacks.get();
			get.then(
				function(resolve) {
					vm.list = feedbacks.list;
					vm.len = feedbacks.len;
					vm.loading = false;
				},
				function(reject) {
				}
			);
		}

		function send(){
			vm.touched = false;
			vm.list.slice().reverse().forEach(function(item, index, object) {
				if (item.object.float > 0) {
					vm.sent = true;
					item.done = true;
					put(item).then(
						function(resolve){
							item.done = true;
							vm.clean();
						},
						function(reject){
							item.done = false;
							vm.clean();
						}
					);
				} //end if
			}); //end foreach
		}

		function clean(){
			vm.len = vm.list.length
			vm.list.slice().reverse().forEach(function(item, index, object) {
				if (item.done == true) {
					vm.list.splice(object.length - 1 - index, 1);
					vm.len -= 1;
				}
			})
		}


		function put(feedback){
			var req_config = {headers: {'Authorization': auth.token}};
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




	}




})();
