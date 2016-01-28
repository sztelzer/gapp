(function () {
	'use strict';

	angular
		.module('able')
		.factory('map', mapService)
		.directive('mapElement', mapDirective)

	function mapService($state){
		var service = {
			gotoMap: gotoMap,
			gotoBack: gotoBack,
			back: "storePage.offerPage",
			place: {},
			complement: ''
		}

		function gotoMap(back){
			service.back = back;
			$state.go('storePage.mapPage')
		}

		function gotoBack(){
			if (service.back != "") {
				$state.go(service.back);
				service.back = "";
			}
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

	function mapController(map, mock, $q, $scope, $timeout){
		var vm = this

		vm.search = search
		vm.place = place
		var autocomplete = new google.maps.places.AutocompleteService()
		var geocoder = new google.maps.Geocoder()


		var place = new google.maps.places.PlacesService(document.getElementById('mapping'))
		var map = new google.maps.Map(document.getElementById('mapping'), {
			zoom: 16,
			center: {lat: mock.device_latitude, lng: mock.device_longitude},
			disableDefaultUI: true
		})


		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				mock.device_latitude = position.coords.latitude
				mock.device_longitude = position.coords.longitude
				map.panTo({
					lat:mock.device_latitude,
					lng:mock.device_longitude,
				})
				getAddress(map.getCenter().lat(), map.getCenter().lng())
			}, function() {
				// handleLocationError(true, infoWindow, map.getCenter());
			});
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
			var loc = new google.maps.LatLng(mock.device_latitude, mock.device_longitude)
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
						console.log(infos)
						console.log(JSON.stringify(infos.address_components))
						map.panTo(infos.geometry.location)
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

		map.addListener('dragend', function() {
			getAddress(map.getCenter().lat(), map.getCenter().lng())
		});

		function getAddress(lat, lng) {
			geocoder.geocode({'location':{'lat':lat,'lng':lng}}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					console.log(results)
					vm.selectedItem = {
						description: results[0].formatted_address,
						place_id: results[0].place_id
					}
					vm.searchText = results[0].formatted_address
					$scope.$apply()
				} else {
					console.log(status)
				}
			});
		}


		var center;
		google.maps.event.addDomListener(map, 'idle', function() {
			center = map.getCenter();
		});
		google.maps.event.addDomListener(window, 'resize', function() {
			map.setCenter(center);
		});



	}





})();
// function mapController(mock, $scope){
// 	var vm = this;
// 	vm.center = 'initializing';
// 	vm.centering = centering;
// 	function initMap() {
// 		var centerInit = {lat: mock.device_latitude, lng: mock.device_longitude};
// 		vm.map = new google.maps.Map(document.getElementById('mapmap'), {
// 			zoom: 16,
// 			center: centerInit,
// 			disableDefaultUI: true
// 		});
// 		vm.map.addListener('dragend', function() {
// 	    	vm.centering(vm.map.getCenter());
// 		});
//   	}
// 	initMap();
// 	function centering(center){
// 		vm.center = center;
// 	}
// 	$scope.$watch(function w(scope){return( vm.center )},function c(n,o){
// 		// $scope.$digest();
// 	});
// }
