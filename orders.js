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

	function ordersController(auth, config, $http, $localStorage) {
		var vm = this;
		vm.getAllOrders = getAllOrders();
		vm.list = $localStorage.orders

		function getAllOrders(){
			var req_config = {headers: {'Authorization': auth.user.token}};
			$http.get(config.api + '/users/' + auth.user.id + '/orders', req_config)
				.then(
				function successCallback(response) {
					console.log(response.data);
					vm.list = response.data.resources;
					$localStorage.orders = vm.list
				},
				function errorCallback(response) {
					console.log(response.data);
				});
		}

		//getAllOrders();

	} // end controller




})();
