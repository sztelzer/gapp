(function () {
	// 'use strict';

	angular
		.module('able')
		.factory('credit', creditService)
		.directive('creditElement', creditDirective)



	function creditService($localStorage, $state) {
		if (typeof $localStorage.credits == 'undefined'){
			$localStorage.credits = {}
		}
		if (typeof $localStorage.active == 'undefined'){
			$localStorage.active = {}
		}

		var service = {
			saveNewCardOnCredits: saveNewCardOnCredits,
			discardNewCard: discardNewCard,
			gotoCredits: gotoCredits,
			gotoBack: gotoBack,
			back: "",
			active: angular.copy($localStorage.active),
			credits: angular.copy($localStorage.credits),
			new: {
				self_key: '',
				mask: '',
				expiry: '',
				encrypted: '',
				token: '',
			}
		}
		return service

		function saveNewCardOnCredits(key){
			delete service.new.encrypted;
			delete service.new.token;
			service.new.self_key = key;

			service.credits[service.new.self_key] = angular.copy(service.new)
			service.active = service.credits[service.new.self_key]

			$localStorage.credits = service.credits
			$localStorage.active = service.active

			service.discardNewCard();
		}

		function discardNewCard(){
			service.new = {
				self_key: '',
				mask: '',
				expiry: '',
				encrypted: '',
				token:'',
			}
		}

		function gotoCredits(back){
			service.back = back;
			$state.go('storePage.creditPage')
		}

		function gotoBack(){
			if (service.back != "") {
				$state.go(service.back);
				service.back = "";
				console.log(service)
			}
		}

	} //end service

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
		vm.saveNewCard = saveNewCard
		vm.removeNewCard = removeNewCard
		vm.setActive = setActive
		vm.remove = remove

		vm.credits = credit.credits
		vm.active = credit.active
		vm.new = credit.new

		vm.self_key = 0
		vm.count = Object.size(vm.credits)

		// used mainly on reloads
		// as it starts, credit.new must be null.
		// if credits don't have credits[active], unset active
		if (!credit.credits.hasOwnProperty(credit.active.self_key)) {
			credit.active = {}
			$localStorage.active = {}
			vm.active = {}
		}



		function saveNewCard(){
			var a = angular.copy(vm.number)
			var b = angular.copy(vm.cvc)
			var c = angular.copy(vm.holder)
			var d = angular.copy(vm.expiry)

			encryptForAdyen(a, b, c, d)
			tokenForStripe(a, b, c, d)

			var now = new Date();
			credit.new.self_key = now.getTime().toString()
			credit.new.mask = maskCard(a)
			credit.new.expiry = d

			setActive(credit.new.self_key, credit.new.mask, credit.new.expiry)

			vm.number = null
			vm.expiry = null
			vm.cvc = null
			vm.self_key = 1

			$scope.creditForm.$setPristine()
			$scope.creditForm.$setUntouched()
		}

		function setActive(self_key, mask, expiry){
			credit.active = {
				self_key: self_key,
				mask: mask,
				expiry: expiry,
			}
			vm.active = credit.active
			$localStorage.active = credit.active
			if (credit.back != ""){
				credit.gotoBack();
			}
		}

		function remove(card){
			delete credit.credits[card]
			if (credit.active == card){
				credit.active = ''
				$localStorage.active = ''
			}
			vm.credits = credit.credits
			vm.count = Object.size(vm.credits)
			$localStorage.credits = credit.credits
		}

		function removeNewCard(){
			if (credit.active.self_key = credit.new.self_key) {
				credit.active = {self_key:"", mask:"", expiry:""}
				$localStorage.active = ''
			}

			credit.new = {
				self_key: '',
				number: '',
				expiry: '',
				token: '',
				active: '',
				encrypted: '',
			}
			vm.new = credit.new
			vm.self_key = 0
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
			credit.new.encrypted = cse.encrypt(data)
		}

		function tokenForStripe(number, cvc, holder, expiry) {
			var data = {
				number: number,
				cvc: cvc,
				exp_month: expiry.substring(0, 2),
				exp_year: "20"+expiry.substring(expiry.length - 2, expiry.length),
			}
			Stripe.card.createToken(data, stripeResponseHandler)
		}

		function stripeResponseHandler(status, response) {
			console.log(response)
			console.log(status)

			if (status != 200) {
				console.log("what?")
			} else {
				credit.new.token = response.id;
				console.log(credit.new)
			}
		}





	}


})();
