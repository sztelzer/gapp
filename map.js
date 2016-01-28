(function () {
	// 'use strict';

	angular
		.module('able')
		.factory('map', mapService)
		.directive('mapElement', mapDirective)

	function mapService($state){
		var service = {
			gotoMap: gotoMap,
			gotoBack: gotoBack,
			back: "storePage.offerPage",
		}

		function gotoMap(back){
			service.back = back;
			$state.go('storePage.mapPage')
		}

		function gotoBack(){
			$state.go(service.back);
		}

		return service
	}

	function mapDirective() {
		var directive = {
			restrict: 'A',
			controller: mapController,
			controllerAs: 'map',
			bindToController: true
		}
		return directive
	}

	function mapController(map, cart, $q, $scope, $timeout){
		var vm = this
		$scope.selectedItem
		vm.complement = ''
		$scope.searchText
		$scope.search = search
		$scope.place = place
		vm.loading = true
		vm.setCartAddress = setCartAddress

		var autocomplete = new google.maps.places.AutocompleteService()
		var place = new google.maps.places.PlacesService(document.getElementById('mapping'))
		var geocoder = new google.maps.Geocoder()


		$timeout(function() {
			console.log('waiting')
		}, 500);

		var mapping = new google.maps.Map(document.getElementById('mapping'), {
			zoom: 16,
			center: {lat: cart.data.latitude, lng: cart.data.longitude},
			disableDefaultUI: true
		})

		if(cart.gotlocation){
			getAddress(cart.data.latitude, cart.data.longitude)
			vm.loading = false
		} else {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					cart.data.latitude = position.coords.latitude
					cart.data.longitude = position.coords.longitude
					cart.data.accuracy = position.coords.accuracy
					cart.gotolocation = true
					getAddress(cart.data.latitude, cart.data.longitude)
					mapping.panTo({
						lat:cart.data.latitude,
						lng:cart.data.longitude,
					})
					google.maps.event.trigger(mapping, 'resize'); //necessary to wake up after first init
					vm.loading = false
				}, function() {
					// handleLocationError(true, infoWindow, mapping.getCenter());
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
			var loc = new google.maps.LatLng(cart.data.latitude, cart.data.longitude)
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
				console.log(item)
				var place_id = item.place_id
				var deferred = $q.defer();
				getPlace(place_id).then(
					function (infos) {
						// console.log(infos)
						// console.log(JSON.stringify(infos.address_components))
						cart.data.latitude = infos.geometry.location.lat()
						cart.data.longitude = infos.geometry.location.lng()
						cart.data.accuracy = 0
						mapping.panTo(infos.geometry.location)
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
			});
		}

		mapping.addListener('dragend', function() {
			getAddress(mapping.getCenter().lat(), mapping.getCenter().lng())
		});

		var center;
		google.maps.event.addDomListener(mapping, 'idle', function() {
			center = mapping.getCenter();
		});
		google.maps.event.addDomListener(window, 'resize', function() {
			mapping.setCenter(center);
		});

		function setCartAddress() {
			cart.gotlocation = true
			cart.data.place = $scope.selectedItem
			cart.data.complement = vm.complement
			map.gotoBack()
		}

		google.maps.event.trigger(mapping, 'resize'); //necessary to wake up after first init


	}



})();
