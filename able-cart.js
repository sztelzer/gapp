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
				$rootScope.updateCart()
			}
		}

		function takeOne(){
			if($scope.promoted.quantity > 0){
				$scope.promoted.quantity -= 1
				$rootScope.updateCart()
			}
		}
	}

	function cartDirective() {
		var directive = {
			restrict: 'A',
			controller: cartController,
			controllerAs: 'cart',
			bindToController: true
		}
		return directive
	}

	function cartController($scope, $rootScope, config, auth, $http, $localStorage, $mdToast, $state) {
		var vm = this;
		vm.send = send;
		//vm.empty = empty;

		vm.quantity
		vm.freight
		vm.products
		vm.estimated_time
		vm.total

		//pass over offers, checking what we have selected
		function updateCart(){
			if($rootScope.offer && $rootScope.offer.object){
				var promoteds = $rootScope.offer.object.promoteds
				var quantity = 0
				var products = 0

				for (var key in promoteds) {
					quantity += promoteds[key].quantity
					products += promoteds[key].object.price * promoteds[key].quantity
				}

				var freight = +($rootScope.freight - (products * 0.15))
				if(freight < 0){freight = 0}
				var total = products + freight

				vm.quantity = +(quantity).toFixed(2)
				vm.freight = +(freight).toFixed(2)
				vm.products = +(products).toFixed(2)
				vm.total = +(total).toFixed(2)
				vm.estimated = $rootScope.estimated
			}
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
					function errorCallback(response){
						if(response.status == 401){
							auth.signout()
							return
						}
					}
				)
		}


		function send(){
			vm.sending = true
			var payload = {}
			payload.items_selected = []

			var promoteds = $rootScope.offer.object.promoteds
			for (var key in promoteds) {
				if(promoteds[key].quantity > 0){
					payload.items_selected.push({
						promoted: promoteds[key].path,
						quantity: promoteds[key].quantity,
					})
				}
			}

			payload.latitude = $rootScope.latitude
			payload.longitude = $rootScope.longitude
			payload.total_freight = vm.freight
			payload.total_items = vm.products
			payload.total_quantity = vm.quantity
			payload.total_value = vm.total
			payload.plastic = $rootScope.plastic.path
			payload.place = JSON.stringify($rootScope.place)
			payload.offer = $rootScope.offer.path

			var req_config = {headers: {'Authorization': auth.token}};

			$http.post(config.api + '/users/' + auth.id + '/orders', payload, req_config).then(
				function successCallback(response) {
					empty()
					$rootScope.last = response.data;
					$rootScope.updateOfferStocks($rootScope.offer.path)
					vm.sending = false
					$state.go('storePage.confirmationPage');
				},
				function errorCallback(response) {
					console.log(response)
					vm.sending = false
					if(response.status == 401){
						if(navigator && navigator.notification){
							navigator.notification.alert('Você precisa se logar novamente.', false, 'Able', 'Ok')
						} else {
							window.alert('Você precisa se logar novamente.')
						}
						auth.signout()
						return
					}

					if(response.status == 403){

						switch (response.data.errors[0].reference) {
							case 'offer':
								$rootScope.offer = {}
								$localStorage.offer = {}
								if(navigator && navigator.notification){
									navigator.notification.alert(response.data.errors[0].error, refreshPage, 'Able', 'Ok')
								} else {
									window.alert(response.data.errors[0].error)
									refreshPage()
								}
								break
							case 'quantity':
								toast(response.data.errors[0].error)
								$rootScope.updateOfferStocks($rootScope.offer.path)
								break
							default:
								toast(response.data.errors[0].error)
								return
						}




						return
					}

					if(navigator && navigator.notification){
						navigator.notification.alert('Verifique sua conexão.', false, 'Able', 'Ok')
					} else {
						window.alert('Verifique sua conexão.')
					}
				}
			)

		} // end sendCart

		function empty(){
			var promoteds = $rootScope.offer.object.promoteds
			for (var key in promoteds) {
				promoteds[key].quantity = 0
			}
			updateCart()
		}


		// function errors(error){
		// 	switch (error.reference) {
		// 		case 'payment':
		// 			return "O pagamento não foi aceito."
		// 			break
		// 		case 'time':
		// 			return "Oops, não entregamos neste horário."
		// 			break
		// 		case 'distance':
		// 			return "Oops, não entregamos neste local."
		// 			break
		// 		case 'quantity':
		// 			return "Houve um erro inesperado. Reinicie o aplicativo."
		// 			break
		// 		default:
		// 			return "Houve um erro inesperado. Reinicie o aplicativo."
		// 	}
		// }

		function toast(msg){$mdToast.show($mdToast.simple().textContent(msg).hideDelay(3000))};

	}//end controller

})();
