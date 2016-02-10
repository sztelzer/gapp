(function () {
	'use strict';

	angular
		.module('able')
		.factory('cart', cartService)
		.directive('elementCart', cartDirective)
		.directive('elementCartCheckout', cartCheckoutDirective)

	function cartService(auth, config, $http, $q, $state, $localStorage, $rootScope) {
		var service = {
			estimated_time: 3600,
			items_selected: [],
			freight_full: 22.90,
			freight_discount: 0,
			freight_total: 0,
			product_total: 0,
			value_total: 0,
			quantity_total: 0,
			offer: {},

			putOne: putOne,
			takeOne: takeOne,
			send: send,
			empty: empty,
			checking: false,
			last: {},
			reset: false
		}
		return service

		function empty(){
			service = {
				estimated_time: 3600,
				items_selected: [],
				freight_full: 22.90,
				freight_discount: 0,
				freight_total: 0,
				product_total: 0,
				value_total: 0,
				quantity_total: 0,
				checking: false,
				offer: {},
				sending: false
			}
		}

		function send(){
			service.sending = true
			var payload = {}
			payload.items_selected = []
			Object.keys(service.items_selected).forEach(function(key) {
				if(service.items_selected[key] > 0){
					payload.items_selected.push({
						promoted: key,
						quantity: service.items_selected[key]
					})
				}
			});

			payload.total_freight = +(service.freight_total).toFixed(2);
			payload.total_items = +(service.product_total).toFixed(2);
			payload.total_quantity = service.quantity_total;
			payload.total_value = +(service.value_total).toFixed(2);
			payload.plastic = $rootScope.plastic.path
			payload.place = JSON.stringify($rootScope.place)
			payload.offer = service.offer

			var req_config = {headers: {'Authorization': auth.token}};

			//return a promissssssse
			return $q(function(resolve, reject) {
				$http.post(config.api + '/users/' + auth.id + '/orders', payload, req_config).then(
					function successCallback(response) {
						service.last = response.data;
						service.sending = false
						$state.go('confirmationPage');
						service.empty();
						resolve();
					},
					function errorCallback(response) {
						service.sending = false
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

	function cartController($scope, cart, offer, $rootScope, config, auth, $http, $localStorage) {
		var vm = this;
		vm.send = cart.send;
		vm.empty = cart.empty;
		vm.estimated_time = cart.estimated_time;
		vm.checking = false;

		vm.sending = cart.sending
		$scope.$watch(function w(scope){return( cart.sending )},function c(n,o){
			vm.sending = cart.sending
		});

		vm.place = $rootScope.place
		vm.complement = $rootScope.complement
		$scope.$watch(function w(scope){return( $rootScope.place )},function c(n,o){
			vm.place = $rootScope.place
			vm.complement = $rootScope.complement
		});

		vm.plastic = $rootScope.plastic
		$scope.$watch(function w(scope){return( $rootScope.plastic )},function c(n,o){
			vm.plastic = $rootScope.plastic
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


		if(!$rootScope.plastic){
			var req_config = {headers: {'Authorization': auth.token}};
			$http.get(config.api + '/users/' + auth.id + '/plastics', req_config)
				.then(
					function successCallback(response) {
						var plastics = response.data.resources;
						if(plastics && plastics[0]){
							$localStorage.plastic = plastics[0]
							$rootScope.plastic = plastics[0]
							vm.plastic = plastics[0]
						}
					},
					function errorCallback(response){}
				)
		}

	}





})();
