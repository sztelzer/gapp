(function () {
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

		if (checkOffer() == true) {
			updateOfferStocks($localStorage.offer.path)
		} else {
			loadNewOffer()
		}



		function checkOffer() {
			// check if have some offer loaded.
			var storedOffer = $localStorage.offer;
			if (storedOffer == undefined || storedOffer == '' || storedOffer == {}) {
				return false;
			}

			// check if is too old
			var now = new Date();
			now = now.getTime();
			var exp = storedOffer.object.good_until;
			if (now > exp) {
				return false;
			}

			//check if actual location is valid for this node
			var linear_distance = geolib.getDistance(
				{latitude:$rootScope.latitude, longitude:$rootScope.longitude},
				{latitude:storedOffer.object.node_latitude, longitude:storedOffer.object.node_longitude})

			if(linear_distance > storedOffer.object.node_radius){
				storedOffer.object.status = 'not_attended'
				// return false;
			}

			var original_pace = storedOffer.object.node_estimated/storedOffer.object.node_linear;
			storedOffer.object.node_estimated = linear_distance * original_pace;
			storedOffer.object.status = 'attended'

			// check each stock?
			return true;
		}


		function loadNewOffer() {
			var payload = {
				company: config.company_path,
				node_function: config.node_function,
				latitude: $rootScope.latitude,
				longitude: $rootScope.longitude,
				list_size: config.offers_count
			}

			var req_config = {headers: {'Authorization': auth.token}}

			$http.post(config.api + '/users/' + auth.id + '/offers', payload, req_config).then(
				function successCallback(response) {
					$localStorage.offer = response.data;
					$rootScope.offer = response.data;
					$rootScope.offer.object.good_until_date = new Date().setTime($rootScope.offer.object.good_until)
					$rootScope.workingTime()
					$rootScope.updateDistance()
					$rootScope.stripeKey = response.data.object.stripe_key
					vm.loading = false
				},
				function errorCallback(response) {
					vm.loading = false
				}
			)
		} // end loadOffer()


		function updateOfferStocks(offerPath) {
			var req_config = {headers: {'Authorization': auth.token}}
			$http.get(config.api + offerPath, req_config).then(
				function successCallback(response) {
					$localStorage.offer = response.data;
					$rootScope.offer = response.data;
					$rootScope.offer.object.good_until_date = new Date().setTime($rootScope.offer.object.good_until)
					$rootScope.workingTime()
					$rootScope.updateDistance()
					vm.loading = false
				},
				function errorCallback(response) {
					vm.loading = false
				}
			)
		} // end updateOffer()






	} // end controller




})();
