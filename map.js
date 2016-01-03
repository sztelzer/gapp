(function () {
	'use strict';

	angular
		.module('able')
	//	.factory('map', mapService)
		.directive('elementMap', mapDirective)





	function mapDirective() {
		var directive = {
			restrict: 'A',
			templateUrl: 'map.template.html',
			controller: mapController,
			controllerAs: 'vm',
			bindToController: true
		}
		return directive
	}

	function mapController(mock, $scope){
		var vm = this;
		vm.center = 'initializing';
		vm.centering = centering;

		function initMap() {
			var centerInit = {lat: mock.device_latitude, lng: mock.device_longitude};
			vm.map = new google.maps.Map(document.getElementById('mapmap'), {
				zoom: 16,
				center: centerInit,
				disableDefaultUI: true
			});
			vm.map.addListener('dragend', function() {
		    	vm.centering(vm.map.getCenter());
			});
	  	}
		initMap();

		function centering(center){
			vm.center = center;
		}

		$scope.$watch(function w(scope){return( vm.center )},function c(n,o){
			// $scope.$digest();
		});





	}




})();
