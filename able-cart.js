(function() {
	'use strict';
	angular.module('able')
	.directive('cartElement', cartDirective)
	.controller('promotedController', promotedController)

	function promotedController($scope, $rootScope) {
		$scope.promoted.putOne = putOne
		$scope.promoted.takeOne = takeOne
		$scope.promoted.quantity = 0

		function putOne() {
			if ($scope.promoted.quantity < $scope.promoted.object.max) {
				$scope.promoted.quantity += 1
				$rootScope.updateCart()
			}
		}

		function takeOne() {
			if ($scope.promoted.quantity > 0) {
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

	function cartController($scope, $rootScope, config, auth, $http, $localStorage, $state) {
		var vm = this;
		vm.send = send;
		vm.quantity
		vm.freight
		vm.products
		vm.estimated_time
		vm.total
		vm.discount
		vm.voucher

		function updateCart() {
			if ($rootScope.offer && $rootScope.offer.object) {
				var promoteds = $rootScope.offer.object.promoteds
				var quantity = 0
				var products = 0
				for (var key in promoteds) {
					quantity += promoteds[key].quantity
					products += promoteds[key].object.price * promoteds[key].quantity
				}
				$rootScope.products_value = products
				$rootScope.updateFreight()
				var freight = $rootScope.freight
				var total = products + freight
					//apply selected voucher
				var initial_total = total
				if ($rootScope.voucher && $rootScope.voucher.object) {
					var voucher = $rootScope.voucher
					if (!voucher.object.burns.burnt) {
						if (voucher.object.value_available > 0) {
							total -= voucher.object.value_available
						} else if (voucher.object.rate > 0) {
							products -= products * voucher.object.rate
							total = products + freight
						}
						if (total < 0) {
							total = 0
						}
						if (initial_total != total) {
							vm.voucher = voucher.path
						}
					}
				}
				vm.quantity = +(quantity).toFixed(2)
				vm.freight = +(freight).toFixed(2)
				vm.products = +(products).toFixed(2)
				vm.total = +(total).toFixed(2)
				vm.discount = +(initial_total - total).toFixed(2)
				vm.estimated = $rootScope.estimated
			}
		}
		$rootScope.updateCart = updateCart
		$scope.$watch(function w(scope) {
			return ($rootScope.place)
		}, function c(n, o) {
			vm.place = $rootScope.place
			vm.complement = $rootScope.complement
		});
		$scope.$watch(function w(scope) {
			return ($rootScope.estimated)
		}, function c(n, o) {
			updateCart()
		});
		$scope.$watch(function w(scope) {
			return ($rootScope.voucher)
		}, function c(n, o) {
			updateCart()
		});
		$scope.$watch(function w(scope) {
			return ($rootScope.plastic)
		}, function c(n, o) {
			vm.plastic = $rootScope.plastic
		});
		// if there is no active plastic, load all and pick the first.
		if (!$rootScope.plastic) {
			var req_config = {
				headers: {
					'Authorization': auth.token
				}
			};
			$http.get(config.api + '/users/' + auth.id + '/plastics', req_config).then(function successCallback(response) {
				var plastics = response.data.resources;
				if (plastics && plastics[0]) {
					$localStorage.plastic = plastics[0]
					$rootScope.plastic = plastics[0]
					vm.plastic = plastics[0]
				}
			}, function errorCallback(response) {
				if (response.status == 401) {
					auth.signout()
					return
				}
			})
		}
		//if vouchers are not loaded, get all.
		function getVouchers(force) {
			if (!$rootScope.vouchers || force) {
				var req_config = {
					headers: {
						'Authorization': auth.token
					}
				}
				$http.get(config.api + '/users/' + auth.id + '/vouchers', req_config).then(function successCallback(response) {
					$rootScope.vouchers = response.data.resources
					$rootScope.voucher = $localStorage.voucher
				}, function errorCallback(response) {
					if (response.status == 401) {
						auth.signout()
						return
					}
				})
			}
		}

		function send() {
			vm.sending = true
			var payload = {}
			payload.items_selected = []
			var promoteds = $rootScope.offer.object.promoteds
			for (var key in promoteds) {
				if (promoteds[key].quantity > 0) {
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
			payload.voucher = vm.voucher
			var req_config = {
				headers: {
					'Authorization': auth.token
				}
			};
			$http.post(config.api + '/users/' + auth.id + '/orders', payload, req_config).then(function successCallback(response) {
				console.log(response)
				empty()
				delete $rootScope.voucher
				vm.voucher = ''
				$rootScope.voucher = ''
				$rootScope.last = response.data;
				$rootScope.updateOfferStocks($rootScope.offer.path)
				vm.sending = false
				$state.go('storePage.confirmationPage');
			}, function errorCallback(response) {
				console.log(response)
				vm.sending = false
				if (response.status == 401 || response.status == 404) {
					if (navigator && navigator.notification) {
						navigator.notification.alert('Você precisa se logar novamente.', false, 'Able', 'Ok')
					} else {
						window.alert('Você precisa se logar novamente.')
					}
					auth.signout()
					return
				}
				if (response.status == 403) {
					switch (response.data.errors[0].reference) {
						case 'offer':
							delete $rootScope.offer
							delete $localStorage.offer
							if (navigator && navigator.notification) {
								navigator.notification.alert(response.data.errors[0].error, refreshPage, 'Able', 'Ok')
							} else {
								window.alert(response.data.errors[0].error)
								refreshPage()
							}
							break
						case 'quantity':
							if (navigator && navigator.notification) {
								navigator.notification.alert(response.data.errors[0].error, null, 'Able', 'Ok')
							} else {
								window.alert(response.data.errors[0].error)
							}
							$rootScope.updateOfferStocks($rootScope.offer.path)
							break
						default:
							if (navigator && navigator.notification) {
								navigator.notification.alert(response.data.errors[0].error, null, 'Able', 'Ok')
							} else {
								window.alert(response.data.errors[0].error)
							}
							return
					}
					return
				}
				if (navigator && navigator.notification) {
					navigator.notification.alert('Verifique sua conexão.', false, 'Able', 'Ok')
				} else {
					window.alert('Verifique sua conexão.')
				}
			})
		} // end sendCart
		function empty() {
			var promoteds = $rootScope.offer.object.promoteds
			for (var key in promoteds) {
				promoteds[key].quantity = 0
			}
			updateCart()
		}



	} //end controller
})();
