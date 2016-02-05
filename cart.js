(function () {
	'use strict';

	angular
		.module('able')
		.factory('cart', cartService)
		.directive('elementCart', cartDirective)
		.directive('elementCartCheckout', cartCheckoutDirective)

	function cartService(auth, config, $http, $q, $state, orders, $localStorage, map) {
		var service = {
			data: {
				latitude: -23.543464, //galeria do rock
				longitude: -46.6391852,
				accuracy: 10,
				place: {},
				plastic: '',
				complement: '',
				name: '',
				offer: '',
				voucher: '',
				total_freight: 0,
				total_items: 0,
				total_value: 0,
				total_quantity: 0,
				items_selected: [],
			},
			gotlocation: false,
			plastic: $localStorage.active,

			estimated_time: 3600,
			items_selected: [],
			freight_full: 22.90,
			freight_discount: 0,
			freight_total: 0,
			product_total: 0,
			value_total: 0,
			quantity_total: 0,

			putOne: putOne,
			takeOne: takeOne,
			send: send,
			empty: empty,
			checking: false
		}
		return service

		function empty(){
		}


		function send(){
			//put the items array on the data payload
			service.data.items_selected = []
			Object.keys(service.items_selected).forEach(function(key) {
				if(service.items_selected[key] > 0){
					service.data.items_selected.push({
						promoted: key,
						quantity: service.items_selected[key]
					})
				}
			});

			service.data.total_freight = +(service.freight_total).toFixed(2);
			service.data.total_items = +(service.product_total).toFixed(2);
			service.data.total_quantity = service.quantity_total;
			service.data.total_value = +(service.value_total).toFixed(2);

			service.data.plastic = service.plastic.path
			service.data.place = JSON.stringify(service.data.place)

			var payload = service.data;
			var req_config = {headers: {'Authorization': auth.token}};

			//return a promissssssse
			return $q(function(resolve, reject) {
				$http.post(config.api + '/users/' + auth.id + '/orders', payload, req_config).then(
					function successCallback(response) {
						if(response.data.object.payments != null) {
							credit.saveNewCardOnCredits(response.data.object.payments[0].object.plastic.path);
							orders.last = response.data.path;
							$state.go('confirmationPage');
						} else {
							credit.active = {}
							window.alert('error saving credit card, try another one')
						}
						service.empty();
						resolve();
					},
					function errorCallback(response) {
						// credit.saveNewCardOnCredits(response.data.object.payments[0].object.plastic.path);
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
					service.product_total = +(service.product_total + promoted.object.price).toFixed(2);
 					//service.freight_discount += +(promoted.object.price*0.15).toFixed(2);
			}
			service.freight_discount = +(service.product_total*0.15).toFixed(2);
			var f = +(service.freight_full - service.freight_discount).toFixed(2);
			service.freight_total = (f > 0 ? f : 0);
			service.value_total = +(service.freight_total + service.product_total).toFixed(2);
		}


		function takeOne(promoted){
			if(service.items_selected[promoted.path] || service.items_selected[promoted.path] > 0){
				service.items_selected[promoted.path] -= 1;
				service.quantity_total -= 1;
				service.product_total = +(service.product_total - promoted.object.price).toFixed(2);
				//service.freight_discount -= +(promoted.object.price*0.15).toFixed(2);
			}
			service.freight_discount = +(service.product_total*0.15).toFixed(2);
			var f = +(service.freight_full - service.freight_discount).toFixed(2);
			service.freight_total = (f > 0 ? f : 0);
			service.value_total = +(service.freight_total + service.product_total).toFixed(2);
			if(service.quantity_total == 0){
				service.freight_total = 0;
				service.value_total = 0;
			}
		}
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

	function cartCheckoutDirective() {
		var directive = {
			restrict: 'A',
			templateUrl: 'cartCheckout.template.html',
			controller: cartController,
			controllerAs: 'cart',
			bindToController: true
		}
		return directive
	}

	function cartController($scope, cart, offer, map) {
		var vm = this;
		vm.send = cart.send;
		vm.empty = cart.empty;
		vm.estimated_time = cart.estimated_time;

		vm.checking = false;

		vm.place = cart.data.place
		vm.complement = cart.data.complement
		$scope.$watch(function w(scope){return( cart.data )},function c(n,o){
			vm.place = cart.data.place
			vm.complement = cart.data.complement
		});

		vm.plastic = cart.plastic
		$scope.$watch(function w(scope){return( cart.plastic )},function c(n,o){
			vm.plastic = cart.plastic
		});



		$scope.$watch(function w(scope){return( cart.estimated_time )},function c(n,o){
			vm.estimated_time = cart.estimated_time;
		});

		$scope.$watch(function w(scope){return( cart.quantity_total )},function c(n,o){
			vm.value_total = cart.value_total;
			vm.freight_total = cart.freight_total;
			vm.quantity_total = cart.quantity_total;
		});

		$scope.$watch(function w(scope){return( cart.checking )},function c(n,o){
			vm.checking = cart.checking;
		});
	}





})();
