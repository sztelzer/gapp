(function () {
	'use strict';

	angular
		.module('able')
		.directive('mapElement', mapDirective)

	function mapDirective() {
		var directive = {
			restrict: 'A',
			controller: mapController,
			controllerAs: 'map',
			bindToController: true
		}
		return directive
	}

	function mapController(cart, $q, $rootScope, $scope, $timeout){
		var vm = this
		vm.complement = ''

		$scope.selectedItem
		$scope.searchText
		$scope.search = search
		$scope.place = place
		//vm.loading = true
		vm.setCartAddress = setCartAddress


		var autocomplete = new google.maps.places.AutocompleteService()
		var place = new google.maps.places.PlacesService(document.getElementById('map'))
		var geocoder = new google.maps.Geocoder()

		if(!$rootScope.map){
			$rootScope.map = plugin.google.maps.Map.getMap(document.getElementById("map"))
		}
		var map = $rootScope.map

		map.addEventListener(plugin.google.maps.event.MAP_READY, function(map){
			map = plugin.google.maps.Map.getMap({
				'backgroundColor': 'white',
				'controls': {
				  'myLocationButton': true,
				  'indoorPicker': true,
				  'zoom': true
				},
				'gestures': {
				  'scroll': true,
				  'tilt': false,
				  'rotate': false,
				  'zoom': true
				},
				'camera': {
				  'latLng': maps.LatLng($rootScope.latitude, $rootScope.longitude);,
				  'zoom': 16,
				}
			})
			$rootScope.locating = false
		})

		if($rootScope.located){
			getAddress($rootScope.latitude, $rootScope.longitude)
			$rootScope.locating = false
		} else {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					$rootScope.latitude = position.coords.latitude
					$rootScope.longitude = position.coords.longitude
					$rootScope.accuracy = position.coords.accuracy
					getAddress($rootScope.latitude, $rootScope.longitude)
					map.panTo({
						lat:$rootScope.latitude,
						lng:$rootScope.longitude,
					})
					$rootScope.located = true
					$rootScope.locating = false
				}, function() {
					$rootScope.located = false
					$rootScope.locating = false
				});
			}
		}

		function search(address) {
			if(address) {
				var deferred = $q.defer();
				getAutocomplete(address).then(
					function (predictions) {
						if(predictions){
							var results = [];
							for (var i = 0, prediction; prediction = predictions[i]; i++) {
								results.push(prediction);
							}
							google.maps.event.trigger(map, 'resize'); //necessary to wake up after first init
							deferred.resolve(results);
						}
					}
				);
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
				radius: 500,
			}
			autocomplete.getQueryPredictions(request, function (data) {
				deferred.resolve(data);
			});
			return deferred.promise;
		}

		function place(item){
			if (item) {
				var place_id = item.place_id
				var deferred = $q.defer();
				getPlace(place_id).then(
					function (infos) {
						$rootScope.latitude = infos.geometry.location.lat()
						$rootScope.longitude = infos.geometry.location.lng()
						$rootScope.accuracy = 0
						mapp.panTo(infos.geometry.location)
						vm.goodtogo = true
					}
				);
				return deferred.promise;
			}
		}

		function getPlace(place_id) {
			var deferred = $q.defer();
			place.getDetails({placeId:place_id}, function (data) {
				deferred.resolve(data);
			});
			return deferred.promise;
		}

		function getAddress(lat, lng) {
			geocoder.geocode({'location':{'lat':lat,'lng':lng}}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					console.log(results)
					$scope.selectedItem = {
						description: results[0].formatted_address,
						place_id: results[0].place_id
					}
					$scope.searchText = results[0].formatted_address
					$scope.$apply()
				} else {
					console.log(status)
				}
				$rootScope.addressed = true
			});
		}

		map.addListener('dragend', function() {
			getAddress(map.getCenter().lat(), map.getCenter().lng())
		});

		var center;
		google.maps.event.addDomListener(map, 'idle', function() {
			center = map.getCenter();
			google.maps.event.trigger(map, 'resize');
		});
		google.maps.event.addDomListener(window, 'resize', function() {
			map.setCenter(center);
		});

		function setCartAddress() {
			cart.gotlocation = true
			cart.data.place = $scope.selectedItem
			cart.data.complement = vm.complement
			map.gotoBack()
		}



	}



})();
