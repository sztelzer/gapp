(function () {
	'use strict';

	angular
	.module('able')
	.directive('cartElement', cartDirective)
	.controller('promotedController', promotedController)



	function promotedController($scope, $rootScope){
		$scope.promoted.putOne = putOne
		$scope.promoted.takeOne = takeOne
		$scope.promoted.quantity = 0

		function putOne(){
			if($scope.promoted.quantity < $scope.promoted.object.max){
				$scope.promoted.quantity += 1
				console.log($scope.promoted.quantity)
				$rootScope.updateCart()
			}
		}

		function takeOne(){
			if($scope.promoted.quantity > 0){
				$scope.promoted.quantity -= 1
				console.log($scope.promoted.quantity)
				$rootScope.updateCart()
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




	function cartController($scope, $rootScope, config, auth, $http, $localStorage) {
		var vm = this;
		// vm.send = send;
		// vm.empty = empty;

		vm.quantity
		vm.freight
		vm.estimated_time
		vm.total

		//pass over offers, checking what we have selected
		function updateCart(){
			var promoteds = $rootScope.offer.object.promoteds
			var quantity = 0
			var products = 0

			for (var key in promoteds) {
				quantity += promoteds[key].quantity
				products += promoteds[key].object.price * promoteds[key].quantity
			}

			var freight = $rootScope.freight - (products * 0.10)
			if(freight < 0){freight = 0}
			var total = products + freight

			vm.quantity = quantity
			vm.freight = freight
			vm.total = total
			vm.estimated = $rootScope.estimated
		}

		$rootScope.updateCart = updateCart






		$scope.$watch(function w(scope){return( $rootScope.place )},function c(n,o){
			vm.place = $rootScope.place
			vm.complement = $rootScope.complement
		});

		$scope.$watch(function w(scope){return( $rootScope.plastic )},function c(n,o){
			vm.plastic = $rootScope.plastic
		});

		// if there is no active plastic, load all and pick the first.
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



// function takeOne(promoted){
// 	console.log(promoted)
// 	if(service.items_selected[promoted.path] || service.items_selected[promoted.path] > 0){
// 		service.items_selected[promoted.path] -= 1;
// 		service.quantity_total -= 1;
// 		service.product_total = +(service.product_total - promoted.object.price).toFixed(2);
// 	}
// 	service.freight_discount = +(service.product_total*0.15).toFixed(2);
// 	var f = +(service.freight_full - service.freight_discount).toFixed(2);
// 	service.freight_total = (f > 0 ? f : 0);
// 	service.value_total = +(service.freight_total + service.product_total).toFixed(2);
// 	if(service.quantity_total == 0){
// 		service.freight_total = 0;
// 		service.value_total = 0;
// 	}
// }


// function putOne(promoted){
// 	if(!service.items_selected[promoted.path] && promoted.object.wet > 0  ){
// 		service.items_selected[promoted.path] = 0;
// 	}
// 		if(promoted.object.wet > service.items_selected[promoted.path]) {
// 			service.items_selected[promoted.path] += 1;
// 			service.quantity_total += 1;
// 			service.product_total = +(service.product_total + promoted.object.price).toFixed(2);
// 	}
// 	service.freight_discount = +(service.product_total*0.15).toFixed(2);
// 	var f = +(service.freight_full - service.freight_discount).toFixed(2);
// 	service.freight_total = (f > 0 ? f : 0);
// 	service.value_total = +(service.freight_total + service.product_total).toFixed(2);
// }


// function send(){
// 	service.sending = true
// 	var payload = {}
// 	payload.items_selected = []
// 	Object.keys(service.items_selected).forEach(function(key) {
// 		if(service.items_selected[key] > 0){
// 			payload.items_selected.push({
// 				promoted: key,
// 				quantity: service.items_selected[key]
// 			})
// 		}
// 	});
//
// 	payload.total_freight = +(service.freight_total).toFixed(2);
// 	payload.total_items = +(service.product_total).toFixed(2);
// 	payload.total_quantity = service.quantity_total;
// 	payload.total_value = +(service.value_total).toFixed(2);
// 	payload.plastic = $rootScope.plastic.path
// 	payload.place = JSON.stringify($rootScope.place)
// 	payload.offer = service.offer
//
// 	var req_config = {headers: {'Authorization': auth.token}};
//
// 	//return a promissssssse
// 	return $q(function(resolve, reject) {
// 		$http.post(config.api + '/users/' + auth.id + '/orders', payload, req_config).then(
// 			function successCallback(response) {
// 				service.last = response.data;
// 				service.sending = false
// 				$state.go('confirmationPage');
// 				resolve();
// 			},
// 			function errorCallback(response) {
// 				service.sending = false
// 				reject();
// 			}
// 		)
// 	}) // end q()
// } // end sendCart
