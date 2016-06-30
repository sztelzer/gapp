(function() {
	// 'use strict';
	angular.module('able').directive('mapElement', mapDirective)

	function mapDirective() {
		var directive = {
			restrict: 'A',
			controller: mapController,
			controllerAs: 'map',
			bindToController: true
		}
		return directive
	}

	function mapController($q, $state, $rootScope, $scope) {
		var vm = this
		$scope.selectedItem
		$scope.searchText
		$scope.search = search
		$scope.place = place
		vm.setCartAddress = setCartAddress
		vm.loading = true
		var placer = new google.maps.places.PlacesService(document.getElementById('mapping2'))
		var autocomplete = $rootScope.autocomplete
		var geocoder = $rootScope.geocoder
		var map
		if ($rootScope.located) {
			setMap()
			getAddress($rootScope.latitude, $rootScope.longitude)
		} else {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					$rootScope.latitude = position.coords.latitude
					$rootScope.longitude = position.coords.longitude
					$rootScope.accuracy = position.coords.accuracy
					getAddress($rootScope.latitude, $rootScope.longitude)
					$rootScope.located = true
					$rootScope.locating = false
					setMap()
				}, function() {
					vm.loading = false
				});
			} else {
				vm.loading = false
			}
		}

		function setMap() {
			map = new google.maps.Map(document.getElementById('mapping'), {
				center: {
					'lat': $rootScope.latitude,
					'lng': $rootScope.longitude
				},
				zoom: 18,
				disableDefaultUI: true,
				zoomControl: true
			})
			setListeners()
		}

		function setListeners() {
			map.addListener('dragend', function() {
				getAddress(map.getCenter().lat(), map.getCenter().lng())
				$rootScope.latitude = map.getCenter().lat()
				$rootScope.longitude = map.getCenter().lng()
			});
			map.addListener('drag', function() {
				$rootScope.latitude = map.getCenter().lat()
				$rootScope.longitude = map.getCenter().lng()
			});
			map.addListener('idle', function() {
				map.setCenter({
					'lat': $rootScope.latitude,
					'lng': $rootScope.longitude
				});
				google.maps.event.trigger(map, "resize");
			});
			map.addListener('resize', function() {
				map.setCenter({
					'lat': $rootScope.latitude,
					'lng': $rootScope.longitude
				});
			});
			$scope.$watch(function w(scope) {
				return ($rootScope.height)
			}, function c(n, o) {
				google.maps.event.trigger(map, "resize");
			});
			vm.loading = false
		}

		function search(address) {
			vm.searching = true
			if (address) {
				var deferred = $q.defer();
				getAutocomplete(address).then(function(predictions) {
					if (predictions) {
						var results = [];
						for (var i = 0, prediction; prediction = predictions[i]; i++) {
							results.push(prediction);
						}
						deferred.resolve(results);
					}
				});
				return deferred.promise;
			}
			return
		}

		function getAutocomplete(address) {
			var deferred = $q.defer();
			var loc = new google.maps.LatLng($rootScope.latitude, $rootScope.longitude)
			var request = {
				input: address,
				location: loc,
				radius: 500
			}
			autocomplete.getQueryPredictions(request, function(data) {
				deferred.resolve(data);
			});
			return deferred.promise;
		}

		function place(item) {
			if (item) {
				vm.searching = false
				var place_id = item.place_id
				$rootScope.place = item
				$rootScope.addressed = true
				$rootScope.located = true
				$rootScope.locating = false
				var deferred = $q.defer();
				getPlace(place_id).then(function(infos) {
					$rootScope.place.address_components = infos.address_components
					$rootScope.latitude = infos.geometry.location.lat()
					$rootScope.longitude = infos.geometry.location.lng()
					$rootScope.accuracy = 0
					map.panTo(infos.geometry.location)
					$rootScope.addressed = true
				});
				return deferred.promise;
			}
		}

		function getPlace(place_id) {
			var deferred = $q.defer();
			placer.getDetails({
				placeId: place_id
			}, function(data) {
				deferred.resolve(data);
			});
			return deferred.promise;
		}

		function getAddress(lat, lng) {
			geocoder.geocode({
				'location': {
					'lat': lat,
					'lng': lng
				}
			}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					$scope.selectedItem = {
						description: results[0].formatted_address,
						place_id: results[0].place_id
					}
					$rootScope.place = $scope.selectedItem
					$scope.searchText = results[0].formatted_address
					$scope.$apply()
				} else {}
			});
		}

		function setCartAddress() {
			$rootScope.place_verified = true
			$rootScope.updateDistance()
				// $rootScope.updateCart()
			$state.go('storePage.offerPage')
		}
	}
})();
