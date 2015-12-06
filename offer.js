(function () {
	'use strict';

	angular
		.module('able')
		.factory('offer', offerService)
		.directive('elementOffer', offerDirective)


	function offerService(auth, config, mock, $http, $localStorage, $q) {
		var service = {
			loadOffer: loadOffer,
			checkOffer: checkOffer,
			updateOfferStocks: updateOfferStocks,
			data: $localStorage.offer
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
			var exp = storedOffer.object.good_until
			if (now > exp) {
				return false;
			}

			// check if actual location is valid for this node
			var linear_distance = geolib.getDistance(
				{latitude:mock.device_latitude, longitude:mock.device_longitude},
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
				latitude: mock.device_latitude,
				longitude: mock.device_longitude,
				list_size: config.offers_count
			}

			var req_config = {headers: {'Authorization': auth.user.token}}

			//return a promissssssse
			return $q(function(resolve, reject) {
				$http.post(config.api + '/users/' + auth.user.id + '/offers', payload, req_config).then(
					function successCallback(response) {
						service.data = response.data;

						// var date = new Date();
						// date.setTime(service.data.object.now_go);
						// service.data.object.created_at = date;

						var date = new Date();
						date.setTime(service.data.object.good_until);
						service.data.object.good_until_date = date;

						$localStorage.offer = service.data;
						resolve();
						console.log(service.data)
					},
					function errorCallback(response) {
						service.data = '';
						$localStorage.offer = '';
						reject(response.data.errors);
					}
				)
			}) // end q()
		} // end loadOffer()

		function updateOfferStocks(offerPath) {
			var req_config = {headers: {'Authorization': auth.user.token}}

			return $q(function(resolve, reject) {
				$http.get(config.api + offerPath, req_config).then(
					function successCallback(response) {
						service.data = response.data;
						var date = new Date();
						date.setTime(service.data.object.good_until);
						service.data.object.good_until_date = date;

						$localStorage.offer = service.data;
						resolve();
						// console.log(service.data)
					},
					function errorCallback(response) {
						service.data = '';
						$localStorage.offer = '';
						reject(response.data.errors);
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

	function offerController(offer, $localStorage, cart) {
		var vm = this;
		vm.init = init;
		init();


		function init(){
			vm.loading = true;
			if (offer.checkOffer() == true) {

				var updateOfferStocks = offer.updateOfferStocks($localStorage.offer.path)
				updateOfferStocks.then(
					function(resolve) {
						vm.data = offer.data;
						vm.loading = false;
						cart.init();
						console.log(vm.data)
					},
					function(reject) {
						console.log('Failed updating offer: ' + reject);
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
					cart.init();
					console.log(vm.data)
				},
				function(reject) {
					console.log('Failed loading offer: ' + reject);
					vm.loading = false;
				}
			);
		}
	} // end controller




})();
