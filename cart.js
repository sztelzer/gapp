(function () {
	'use strict';

	angular
		.module('able')
		.factory('cart', cartService)
		.directive('elementCart', cartDirective)


	function cartService(auth, offer, config, mock, confirmation, $http, $localStorage, $q, $state) {
		var service = {
			data: {
				latitude: mock.device_latitude,
				longitude: mock.device_longitude,
				address: mock.device_address,
				offer: '',
				voucher: mock.voucher,
				total_freight: 0,
				total_value: 0,
				total_quantity: 0,
				items_selected: []
			},
			estimated_time: 0,
			items_selected: [],
			freight_full: 22.80,
			freight_discount: 0,
			freight_total: 0,
			product_total: 0,
			value_total: 0,
			quantity_total: 0,

			putOne: putOne,
			takeOne: takeOne,
			init: init,
			endCart: endCart,
			sendCart: sendCart,
			checking: false,
			// showConfirmation: showConfirmation,
		}
		return service

		function init(){
			service.data.offer = offer.data.path;
			service.estimated_time = offer.data.object.node_estimated + 900;
		}

		function endCart(){
			//put the items array on the data payload
			Object.keys(service.items_selected).forEach(function(key) {
				service.data.items_selected.push({
					promoted: key,
					quantity: service.items_selected[key]
				})
			});

			service.data.total_freight = service.freight_total;
			service.data.total_quantity = service.quantity_total;
			service.data.total_value = service.value_total;

			service.checking = true;
			// service.showConfirmation();
			console.log(service.data)
		}

		function sendCart(){
			var payload = service.data;
			var req_config = {headers: {'Authorization': auth.user.token}};

			//return a promissssssse
			return $q(function(resolve, reject) {
				$http.post(config.api + '/users/' + auth.user.id + '/orders', payload, req_config).then(
					function successCallback(response) {
						// service.data = response.data;
						console.log(response.data);
						resolve();
						confirmation.data = response.data;
						$state.go('confirmationPage');

					},
					function errorCallback(response) {
						console.log(response.data);
						reject();
					}
				)
			}) // end q()
		} // end sendCart

		function putOne(promoted){
			if(!service.items_selected[promoted.path] && promoted.object.wet > 0  ){
				service.items_selected[promoted.path] = 0;
			}
 			if(promoted.object.wet > service.items_selected[promoted.path]) {
					service.items_selected[promoted.path] += 1;
					service.quantity_total += 1;
					service.product_total += +(promoted.object.price).toFixed(2);
					service.freight_discount += +(promoted.object.price*0.2).toFixed(2);
			}
			var f = +(service.freight_full - service.freight_discount).toFixed(2);
			service.freight_total = (f > 0 ? f : 0);
			service.value_total = +(service.freight_total + service.product_total).toFixed(2);
		}


		function takeOne(promoted){
			if(service.items_selected[promoted.path] || service.items_selected[promoted.path] > 0){
				service.items_selected[promoted.path] -= 1;
				service.quantity_total -= 1;
				service.product_total -= +(promoted.object.price).toFixed(2);
				service.freight_discount -= +(promoted.object.price*0.2).toFixed(2);
			}
			var f = +(service.freight_full - service.freight_discount).toFixed(2);
			service.freight_total = (f > 0 ? f : 0);
			service.value_total = +(service.freight_total + service.product_total).toFixed(2);
			if(service.quantity_total == 0){
				service.freight_total = 0;
				service.value_total = 0;
			}
		}


		// function showConfirmation() {
		//     $mdDialog.show(
		//       $mdDialog.alert()
		//         .parent(angular.element(document.querySelector('#bodyDialog')))
		//         .clickOutsideToClose(true)
		//         .title('Done!')
		//         //.textContent('You can specify some description text in here.')
		//         .ariaLabel('Alert Dialog Demo')
		//         // .ok('Restart everything')
		//         // .targetEvent()
		//     );
		//   };





	}

	function cartDirective() {
		var directive = {
			restrict: 'A',
			templateUrl: 'cart.template.html',
			controller: cartController,
			controllerAs: 'cart',
			bindToController: true
		}
		return directive
	}

	function cartController($scope, cart, offer) {
		var vm = this;
		vm.endCart = cart.endCart;
		vm.sendCart = cart.sendCart;
		vm.estimated_time = cart.estimated_time;
		$scope.$watch(function w(scope){return( cart.estimated_time )},function c(n,o){
			vm.estimated_time = cart.estimated_time;
		});


		$scope.$watch(function w(scope){return( cart.quantity_total )},function c(n,o){
			vm.value_total = cart.value_total;
			vm.freight_total = cart.freight_total;
			vm.quantity_total = cart.quantity_total;
		});
		vm.checking = false;
		$scope.$watch(function w(scope){return( cart.checking )},function c(n,o){
			vm.checking = cart.checking;
		});


	}

})();
