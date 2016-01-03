(function () {
	'use strict';

	angular
		.module('able')
		.directive('elementOrders', ordersDirective)
		.factory('orders', orders)

	function orders($http, $q, config, auth, $localStorage){
		var service = {
			list: $localStorage.orders,
			last: '',
			get: get,
			last: last
		}
		return service

		function get(){
			var req_config = {headers: {'Authorization': auth.token}};
			$http.get(config.api + '/users/' + auth.id + '/orders', req_config)
			.then(
			function successCallback(response) {
				service.list = response.data.resources;
				$localStorage.orders = response.data.resources;
			},
			function errorCallback(response) {
			})
		}


		function last(){

		}


	}


	function ordersDirective() {
		var directive = {
			restrict: 'A',
			controller: ordersController,
			controllerAs: 'orders',
			bindToController: true
		}
		return directive
	}

	function ordersController($scope, orders) {
		var vm = this;
		orders.get();

		// $scope.$watch(function w(scope){return( orders.list )},function c(n,o){
		// 	vm.list = orders.list;
		// });
	} // end controller


})();
