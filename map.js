(function () {
	// 'use strict';

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

	function mapController($q, $state, $rootScope, $scope){
		var vm = this
		$scope.selectedItem
		$scope.searchText
		$scope.search = search
		$scope.place = place
		vm.setCartAddress = setCartAddress

		if(!$rootScope.addressed){
			vm.searching = true
		}

		var autocomplete = new google.maps.places.AutocompleteService()
		var placer = new google.maps.places.PlacesService(document.getElementById('mapping'))
		var geocoder = new google.maps.Geocoder()

		var map
		function createMap(){
			if(!$rootScope.map){
				map = new google.maps.Map(document.getElementById('mapping'), {
					zoom: 18,
					center: {lat: $rootScope.latitude, lng: $rootScope.longitude},
					disableDefaultUI: true,
					zoomControl: true
				})

				map.addListener('dragend', function() {
					getAddress(map.getCenter().lat(), map.getCenter().lng())
				});


				google.maps.event.addDomListener(map, 'idle', function() {
					$rootScope.center = map.getCenter();
					google.maps.event.trigger(map, 'resize');
				});
				google.maps.event.addDomListener(window, 'resize', function() {
					map.panTo($rootScope.center);
				});
				$rootScope.map = map
			}
		}

		if($rootScope.located){
			createMap()
			getAddress($rootScope.latitude, $rootScope.longitude)

			map.panTo({
				lat:$rootScope.latitude,
				lng:$rootScope.longitude,
			})
			google.maps.event.trigger(map, 'resize'); //necessary to wake up after first init

		} else {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					$rootScope.latitude = position.coords.latitude
					$rootScope.longitude = position.coords.longitude
					$rootScope.accuracy = position.coords.accuracy
					createMap()
					getAddress($rootScope.latitude, $rootScope.longitude)
					map.panTo({
						lat:$rootScope.latitude,
						lng:$rootScope.longitude,
					})
					google.maps.event.trigger(map, 'resize'); //necessary to wake up after first init
					$rootScope.located = true
					$rootScope.locating = false
				}, function() {
					// handleLocationError(true, infoWindow, map.getCenter());
				});
			}
		}

		function search(address) {
			vm.searching = true
			if(address) {
				var deferred = $q.defer();
				getAutocomplete(address).then(
					function (predictions) {
						if(predictions){
							var results = [];
							for (var i = 0, prediction; prediction = predictions[i]; i++) {
								results.push(prediction);
							}
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
				vm.searching = false
				var place_id = item.place_id
				$rootScope.place = item
				$rootScope.addressed = true
				$rootScope.located = true
				$rootScope.locating = false
				var deferred = $q.defer();
				getPlace(place_id).then(
					function (infos) {
						$rootScope.place.address_components = infos.address_components
						$rootScope.latitude = infos.geometry.location.lat()
						$rootScope.longitude = infos.geometry.location.lng()
						$rootScope.accuracy = 0
						map.panTo(infos.geometry.location)
						$rootScope.addressed = true
					}
				);
				return deferred.promise;
			}
		}

		function getPlace(place_id) {
			var deferred = $q.defer();
			placer.getDetails({placeId:place_id}, function (data) {
				deferred.resolve(data);
			});
			return deferred.promise;
		}

		function getAddress(lat, lng) {
			geocoder.geocode({'location':{'lat':lat,'lng':lng}}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					$scope.selectedItem = {
						description: results[0].formatted_address,
						place_id: results[0].place_id
					}
					$rootScope.place = $scope.selectedItem
					$scope.searchText = results[0].formatted_address
					$scope.$apply()
				} else {
					console.log(status)
				}
			});
		}


		function setCartAddress() {
			$rootScope.updateDistance()
			$rootScope.updateCart()
			$state.go('storePage.offerPage')
		}


	}



})();
