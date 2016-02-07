(function () {
	'use strict';

	angular
		.module('able')
		.directive('plasticsElement', plasticsDirective)


	function plasticsDirective() {
		var directive = {
			restrict: 'A',
			controller: plasticsController,
			controllerAs: 'plastics',
			bindToController: true
		}
		return directive
	}

	function plasticsController($rootScope, $scope, $localStorage, auth, $http, config, $q, cart) {
		var vm = this;
		vm.new = {}
		vm.plastics = []

		vm.save = save
		vm.activate = activate
		vm.remove = remove

		if(typeof $localStorage.plastic == "undefined") {
			$localStorage.plastic = {}
		}
		vm.plastic = $localStorage.plastic
		cart.plastic = $localStorage.plastic

		get()
		function get(){
			var req_config = {headers: {'Authorization': auth.token}};
			$http.get(config.api + '/users/' + auth.id + '/plastics', req_config)
			.then(
			function successCallback(response) {
				vm.plastics = response.data.resources;
				if(!vm.plastic.path && vm.plastics && vm.plastics[0]){
					activate(vm.plastics[0])
				}
			},
			function errorCallback(response) {
				vm.plastics = []
			})
		}

		function save(){
			var a = angular.copy(vm.new.number)
			var b = angular.copy(vm.new.cvc)
			var c = angular.copy(vm.new.expiry)

			stripePlasticToken(a, b, c).then(
				function(resolvedToken){
					var payload = {
						self_key: new Date().getTime().toString(),
						mask: maskPlasticNumber(a),
						expiry: c,
						token: resolvedToken
					}

					var req_config = {headers: {'Authorization': auth.token}};
					$http.post(config.api + '/users/' + auth.id + '/plastics', payload, req_config)
						.then(
						function(response){
							vm.new = {}
							$scope.plasticForm.$setPristine()
							$scope.plasticForm.$setUntouched()
							// console.log(response)
							activate(response.data)
							get()
						},
						function(response){
							console.log(response)
						}
					);
				},
				function(rejectedToken){
					console.log(rejectedToken)
				}
			)
		}

		function activate(plastic){
			$localStorage.plastic = plastic
			$rootScope.plastic = plastic
			vm.plastic = plastic
		}

		function remove(plastic){
			//call delete on plastic.path
			var req_config = {headers: {'Authorization': auth.token}};
			$http.delete(config.api + plastic.path, req_config)
			.then(
				function(response){
					console.log(response)
					if(plastic == vm.plastic){
						$localStorage.plastic = ''
						vm.plastic = ''
					}
					get()
				},
				function(response){
					console.log(response)
					window.alert("Could not delete this card: "+response)
				}
			)



		}






		function maskPlasticNumber(number){
			var a = number.substring(0, 4)
			var b = number.substring(12,16)
			var masked = b
			return masked
		}

		function stripePlasticToken(number, cvc, expiry) {
			var payload = {
				number: number,
				cvc: cvc,
				exp_month: expiry.substring(0, 2),
				exp_year: "20"+expiry.substring(expiry.length - 2, expiry.length),
			}

			return $q(function(resolve, reject) {
				Stripe.card.createToken(payload, function(status, response){
					if (status < 200 || status > 299) {
						reject(status)
					} else {
						resolve(response.id)
					}
				})
			})
		}



	}


})();

// function encryptForAdyen(number, cvc, holder, expiry) {
// 	var key = "10001|9578C5B8E583231EEA1483E817AEC5C364CB8F2419C0957DE04E8FC40FF944B922D67F1E5168F9DD3116B31EF934ABC2DE852919B269246C1C92F1DE6CF7CA88E4569860460043E1B239E83393A8925C93BF0E20AD585ACB4280CB46D4585AA478636EC8A695E1228E58C54B0FDB0B7B3F87C5BD43F5B29AE00CCE44B96CC99F8711C0EBFABB925A9A898D0B54212E855DA22C1368E5F14C60C44D6141CBF04136B502897097DA0525142E406EE2C9666979D347924E82F34F92E255DE8978AB38E712B5133E79A8D4CD8AFB86E578A73BDF520F4CFD45AE9A0FAB6C722DAB05A1F064C10DD89FF0A90DCBCFD441469D13DEFCA96FFAC696C1BC84CAFC0E048F"
// 	var options = {}
// 	var cse = adyen.encrypt.createEncryption(key, options)
//
// 	var data = {
// 		number: number,
// 		cvc: cvc,
// 		holderName: holder,
// 		expiryMonth: expiry.substring(0, 2),
// 		expiryYear: "20"+expiry.substring(expiry.length - 2, expiry.length),
// 		generationtime: new Date().toISOString()
// 	}
// 	console.log(data)
// 	console.log(cse.encrypt(data))
// 	credit.new.encrypted = cse.encrypt(data)
// }
