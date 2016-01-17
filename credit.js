(function () {
	'use strict';

	angular
		.module('able')
		.factory('credit', creditService)
		.directive('creditElement', creditDirective)



	function creditService($localStorage) {
		if (typeof $localStorage.credits == 'undefined'){
			$localStorage.credits = {}
		}

		var service = {
			active: $localStorage.active,
			new: {
				mask: {
					created: '',
					number: '',
					expiry: '',
					token: '',
					active: '',
					encrypted: '',
				},
			},
			list: $localStorage.credits,
		}
		return service

	}

	function creditDirective() {
		var directive = {
			restrict: 'A',
			controller: creditController,
			controllerAs: 'credit',
			bindToController: true
		}
		return directive
	}

	function creditController(credit, $scope, $localStorage) {
		var vm = this;
		vm.number;
		vm.expiry;
		vm.cvc;
		vm.new = newCard
		vm.setActive = setActive
		vm.remove = remove

		vm.list = credit.list
		vm.count = Object.size(vm.list)
		vm.count < 3 ? vm.free = true : vm.free = false
		vm.active = credit.active

		function newCard(){
			var a = angular.copy(vm.number)
			var b = angular.copy(vm.cvc)
			var c = angular.copy(vm.holder)
			var d = angular.copy(vm.expiry)
			credit.new.mask.encrypted = encryptForAdyen(a, b, c, d)

			var now = new Date();
			credit.new.mask.created = now.getTime()
			credit.new.mask.number = maskCard(a)
			credit.new.mask.expiry = d
			credit.new.mask.token = ''
			credit.list[credit.new.mask.created] = angular.copy(credit.new.mask)
			vm.list = credit.list
			vm.count = Object.size(vm.list)
			vm.count < 3 ? vm.free = true : vm.free = false
			$localStorage.credits = credit.list

			setActive(credit.new.mask.created)

			vm.number = null
			vm.expiry = null
			vm.cvc = null

			$scope.creditForm.$setPristine()
			$scope.creditForm.$setUntouched()

			console.log($scope.creditForm)
			// if (credit.goback != '') {
			// 	$state.go(credit.goback);
			// }
		}

		function setActive(card){
			credit.active = card
			vm.active = card
			$localStorage.active = card
		}

		function remove(card){
			delete credit.list[card]
			if (credit.active == card){
				credit.active = ''
				$localStorage.active = ''
			}
			vm.list = credit.list
			vm.count = Object.size(vm.list)
			vm.count < 3 ? vm.free = true : vm.free = false
			$localStorage.credits = credit.list
		}


		function maskCard(number){
			var a = number.substring(0, 4)
			var b = number.substring(12,16)
			var masked = b
			return masked
		}

		function encryptForAdyen(number, cvc, holder, expiry) {
			var key = "10001|9578C5B8E583231EEA1483E817AEC5C364CB8F2419C0957DE04E8FC40FF944B922D67F1E5168F9DD3116B31EF934ABC2DE852919B269246C1C92F1DE6CF7CA88E4569860460043E1B239E83393A8925C93BF0E20AD585ACB4280CB46D4585AA478636EC8A695E1228E58C54B0FDB0B7B3F87C5BD43F5B29AE00CCE44B96CC99F8711C0EBFABB925A9A898D0B54212E855DA22C1368E5F14C60C44D6141CBF04136B502897097DA0525142E406EE2C9666979D347924E82F34F92E255DE8978AB38E712B5133E79A8D4CD8AFB86E578A73BDF520F4CFD45AE9A0FAB6C722DAB05A1F064C10DD89FF0A90DCBCFD441469D13DEFCA96FFAC696C1BC84CAFC0E048F"
			var options = {}
			var cse = adyen.encrypt.createEncryption(key, options)

			var data = {
				number: number,
				cvc: cvc,
				holderName: holder,
				expiryMonth: expiry.substring(0, 2),
				expiryYear: "20"+expiry.substring(expiry.length - 2, expiry.length),
				generationtime: new Date().toISOString()
			}

			console.log(data)
			console.log(cse.encrypt(data))
			return cse.encrypt(data)
		}
	}


})();
