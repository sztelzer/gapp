(function () {
	'use strict';

	angular
		.module('able')
		.factory('offer', offerService)
		.directive('elementOffer', offerDirective)


	function offerService(auth, config, cart, $http, $q, $localStorage) {
		var service = {
			loadOffer: loadOffer,
			checkOffer: checkOffer,
			updateOfferStocks: updateOfferStocks,
			data: $localStorage.offer,
		}
		return service

		// checkOffer() returns false if offer is invalid.
		// if true, resets
		function checkOffer() {
			// check if have some offer loaded.
			var storedOffer = $localStorage.offer;
			if (storedOffer === undefined || storedOffer == '') {
				return false;
			}

			// check if is too old
			var now = new Date();
			now = now.getTime();
			var exp = storedOffer.object.good_until;
			if (now > exp) {
				return false;
			}

			// check if actual location is valid for this node
			var linear_distance = geolib.getDistance(
				{latitude:cart.data.latitude, longitude:cart.data.longitude},
				{latitude:storedOffer.object.node_latitude, longitude:storedOffer.object.node_longitude})

			if(linear_distance > storedOffer.object.node_radius){
				return false;
			}

			var original_pace = storedOffer.object.node_estimated/storedOffer.object.node_linear;
			storedOffer.object.node_estimated = linear_distance * original_pace;

			// check each stock?
			return true;
		}


		function loadOffer() {
			var payload = {
				company: config.company_path,
				node_function: config.node_function,
				latitude: cart.data.latitude,
				longitude: cart.data.longitude,
				list_size: config.offers_count
			}

			var req_config = {headers: {'Authorization': auth.token}}

			//return a promissssssse
			return $q(function(resolve, reject) {
				$http.post(config.api + '/users/' + auth.id + '/offers', payload, req_config).then(
					function successCallback(response) {
						service.data = response.data;
						$localStorage.offer = response.data;
						var date = new Date();
						date.setTime(service.data.object.good_until);
						service.data.object.good_until_date = date;
						resolve(response);
					},
					function errorCallback(response) {
						service.data = '';
						$localStorage.offer = '';
						reject(response);
					}
				)
			}) // end q()
		} // end loadOffer()

		function updateOfferStocks(offerPath) {
			var req_config = {headers: {'Authorization': auth.token}}

			return $q(function(resolve, reject) {
				$http.get(config.api + offerPath, req_config).then(
					function successCallback(response) {
						service.data = response.data;
						$localStorage.offer = response.data;
						var date = new Date();
						date.setTime(service.data.object.good_until);
						service.data.object.good_until_date = date;
						resolve(response);
					},
					function errorCallback(response) {
						service.data = '';
						$localStorage.offer = '';
						reject(response);
					}
				)
			}) // end q()
		} // end updateOffer()
	} // end service

	function offerDirective() {
		var directive = {
			restrict: 'A',
			controller: offerController,
			controllerAs: 'offer',
			bindToController: true
		}
		return directive
	}



	function offerController(offer, cart, map) {
		var vm = this
		getLocation()

		function init(){
			vm.loading = true;
			if (offer.checkOffer() == true) {
				var updateOfferStocks = offer.updateOfferStocks(offer.data.path)
				updateOfferStocks.then(
					function(resolve) {
						vm.data = offer.data;
						vm.loading = false;
						cart.data.offer = vm.data.path;
						cart.estimated_time = vm.data.object.node_estimated + 900;
					},
					function(reject) {
						vm.loading = false;

					}
				);
				return
			}

			var loadOffer = offer.loadOffer();
			loadOffer.then(
				function(resolve) {
					vm.data = offer.data;
					vm.loading = false;
					cart.data.offer = vm.data.path;
					cart.estimated_time = vm.data.object.node_estimated + 900;

				},
				function(reject) {
					console.log('Failed loading offer: ' + reject);
					vm.loading = false;
				}
			);
		}

		function getLocation(){
			if (navigator.geolocation) {
				vm.loading = true;
				navigator.geolocation.getCurrentPosition(function(position) {
					cart.data.latitude = position.coords.latitude
					cart.data.longitude = position.coords.longitude
					cart.data.accuracy = position.coords.accuracy
					cart.gotlocation = true
					if(position.coords.accuracy > 100) {
						map.gotoMap('storePage.offerPage')
					} else {
						init()
					}
				}, function() {
					map.gotoMap('storePage.offerPage')
					vm.loading = false;
				});
			} else {
				map.gotoMap('storePage.offerPage')
				vm.loading = false;
			}
		}

	} // end controller




})();
