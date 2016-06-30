(function() {
	'use strict';

	angular
		.module('able')
		.directive('offerElement', offerDirective)

	function offerDirective() {
		var directive = {
			restrict: 'A',
			controller: offerController,
			controllerAs: 'offer',
			bindToController: true
		}
		return directive
	}

	function offerController($rootScope, $localStorage, config, auth, $http) {
		var vm = this
		vm.loading = true;

		vm.quantity = 6;
		vm.toggleQuantity = toggleQuantity

		function toggleQuantity() {
			if (vm.quantity == 6) {
				vm.quantity = 99
			} else {
				vm.quantity = 6
			}
		}

		runOffer()

		function runOffer() {
			if (checkOffer() == true) {
				updateOfferStocks($localStorage.offer.path)
			} else {
				loadNewOffer()
			}
		}
		document.addEventListener("resume", runOffer, false);


		function checkOffer() {
			// check if have some offer loaded.
			if (typeof $localStorage.offer == "undefined") {
				return false
			}

			var storedOffer = $localStorage.offer;

			// check if is too old
			var now = new Date();
			now = now.getTime();
			var exp = storedOffer.object.good_until;
			if (now > exp) {
				return false;
			}

			//check if actual location is valid for this node
			var linear_distance = geolib.getDistance({
				latitude: $rootScope.latitude,
				longitude: $rootScope.longitude
			}, {
				latitude: storedOffer.object.node_latitude,
				longitude: storedOffer.object.node_longitude
			})

			if (linear_distance > storedOffer.object.node_radius) {
				storedOffer.object.status = 'not_attended'
					// return false;
			}

			var original_pace = storedOffer.object.node_estimated / storedOffer.object.node_linear;
			storedOffer.object.node_estimated = linear_distance * original_pace;
			storedOffer.object.status = 'attended'

			// check each stock?
			return true;
		}


		function loadNewOffer() {
			vm.loading = true;

			var payload = {
				company: config.company_path,
				node_function: config.node_function,
				latitude: $rootScope.latitude,
				longitude: $rootScope.longitude,
				list_size: config.offers_count
			}

			var req_config = {
				headers: {
					'Authorization': auth.token
				}
			}

			$http.post(config.api + '/users/' + auth.id + '/offers', payload, req_config).then(
				function successCallback(response) {
					$localStorage.offer = response.data;
					$rootScope.offer = response.data;
					$rootScope.offer.object.good_until_date = new Date().setTime($rootScope.offer.object.good_until)
					$rootScope.workingTime()
					$rootScope.updateDistance()
					$localStorage.stripe = response.data.object.stripe_key
					vm.loading = false
				},
				function errorCallback(response) {
					vm.loading = false
					console.log(response)
					if (response.status >= 400) {
						if (navigator && navigator.notification) {
							navigator.notification.alert('Você precisa se logar novamente.', false, 'Able', 'Ok')
						} else {
							window.alert('Você precisa se logar novamente.')
						}
						auth.signout()
						return
					}

					if (navigator && navigator.notification) {
						navigator.notification.alert('Verifique sua conexão.', false, 'Able', 'Ok')
						return
					} else {
						window.alert('Verifique sua conexão.')
						return
					}
				}
			)
		} // end loadOffer()
		$rootScope.loadNewOffer = loadNewOffer


		function updateOfferStocks(offerPath) {
			vm.loading = true;
			var req_config = {
				headers: {
					'Authorization': auth.token
				}
			}
			$http.get(config.api + offerPath, req_config).then(
				function successCallback(response) {
					if (!$rootScope.offer) {
						$rootScope.offer = $localStorage.offer
					}
					// pass over each promoted, updating stock. If quantity is greater, lower it.
					var newPromos = response.data.object.promoteds
					var oldPromos = $rootScope.offer.object.promoteds
					for (var oldKey in oldPromos) {
						var hit = false
						for (var newKey in newPromos) {
							if (oldPromos[oldKey].path == newPromos[newKey].path) {
								hit = true
								oldPromos[oldKey].object.max = newPromos[newKey].object.max
								oldPromos[oldKey].object.wet = newPromos[newKey].object.wet
								oldPromos[oldKey].object.dry = newPromos[newKey].object.dry
								if (oldPromos[oldKey].quantity > oldPromos[oldKey].object.max) {
									oldPromos[oldKey].quantity = oldPromos[oldKey].object.max
								}
							}
						}
						if (hit == false) {
							oldPromos[oldKey].object.max = 0
							oldPromos[oldKey].object.wet = 0
							oldPromos[oldKey].object.dry = 0
							oldPromos[oldKey].quantity = 0
						}
					}
					$rootScope.offer.object.promoteds = oldPromos
					$localStorage.stripe = response.data.object.stripe_key

					$rootScope.offer.object.good_until_date = new Date().setTime($rootScope.offer.object.good_until)
					$rootScope.workingTime()
					$rootScope.updateDistance()
						// $rootScope.updateCart()
					$localStorage.offer = $rootScope.offer
					vm.loading = false
				},
				function errorCallback(response) {
					vm.loading = false
					if (response.status == 401) {
						if (navigator && navigator.notification) {
							navigator.notification.alert('Você precisa se logar novamente.', false, 'Able', 'Ok')
						} else {
							window.alert('Você precisa se logar novamente.')
						}
						auth.signout()
						return
					}

					if (response.status == 403) {
						//if error is offer doesn't exists anymore, request a new offer.
						if (response && response.data && response.data.errors && response.data.errors[0].reference == "loading_object") {
							loadNewOffer()
							return
						}
						//else, load from localstorage
						$rootScope.offer = $localStorage.offer
						return
					}

					if (response.status == 404) {
						loadNewOffer()
						return
					}

					if (navigator && navigator.notification) {
						navigator.notification.alert('Verifique sua conexão.', updateOfferStocks(offerPath), 'Able', 'Ok')
					} else {
						window.alert('Verifique sua conexão.')
						updateOfferStocks(offerPath)
					}
				}
			)
		} // end updateOffer()
		$rootScope.updateOfferStocks = updateOfferStocks


	} // end controller






})();