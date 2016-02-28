(function () {
	'use strict';

	angular
		.module('able')
		.directive('elementOrders', ordersDirective)

	function ordersDirective() {
		var directive = {
			restrict: 'A',
			controller: ordersController,
			controllerAs: 'orders',
			bindToController: true
		}
		return directive
	}

	function ordersController($scope, $http, $q, config, auth, $localStorage) {
		var vm = this;
		vm.list = $localStorage.orders
		get();

		function get(){
			vm.loading = true
			var req_config = {headers: {'Authorization': auth.token}};
			$http.get(config.api + '/users/' + auth.id + '/orders', req_config)
			.then(
			function successCallback(response) {
				for (var key in response.data.resources) {
					response.data.resources[key].object.place = JSON.parse(response.data.resources[key].object.place)
				}
				vm.list = response.data.resources;
				$localStorage.orders = response.data.resources;
				vm.loading = false
			},
			function errorCallback(response) {
				vm.loading = false
			})
		}


	} // end controller


})();
