(function () {
	'use strict';

	angular
		.module('able')
	//	.factory('map', mapService)
		.directive('elementFeedbacks', feedbacksDirective)



	// function mapService(config, mock, $http, $localStorage, $q) {
	// 	var service = {
	//
	// 	}
	// 	return service
	// }


	function feedbacksDirective() {
		var directive = {
			restrict: 'A',
			templateUrl: 'feedbacks.template.html',
			controller: feedbacksController,
			controllerAs: 'vm',
			bindToController: true
		}
		return directive
	}

	function feedbacksController(){
		var vm = this;

	}




})();
