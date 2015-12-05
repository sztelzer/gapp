(function() {
	'use strict';

	angular

	.module("able", [
		'ui.router',
		'ngTouch',
		'ngAnimate',
		'ngStorage',
		'ngMaterial',
		'ngAria',
		'ngMap',
	])

	.value('config', {
		api: 'https://api-dot-heartbend.appspot.com',
		company_path: '/companies/5629499534213120',
		node_function: 'productConsumerDispatch',
		offers_count: 6
	})

	.value('mock', {
		device_latitude: -23.562482,
		device_longitude: -46.691485,
		// device_latitude: -23.611450,
		// device_longitude: -46.692538,
		voucher:''
	})


	.config(function ($stateProvider, $urlRouterProvider, $localStorageProvider, $mdThemingProvider, $httpProvider, $mdGestureProvider) {
		$mdGestureProvider.skipClickHijack(); //corrects erratic ngTouch+mdButton in mobile
		$localStorageProvider.setKeyPrefix('able_');
		$httpProvider.useApplyAsync(true);
		$urlRouterProvider.otherwise("/");
		$stateProvider
			.state('startPage', {
				url: "/",
				templateUrl: "startPage.template.html",
				data: {
					requireLogin: false,
					accessLogged: false
				}
			})
			.state('signinPage', {
				url: "/signin",
				templateUrl: "signinPage.template.html",
				data: {
					requireLogin: false,
					accessLogged: false
				}
			})
			.state('storePage', {
				url: "/store",
				templateUrl: "storePage.template.html",
				data: {
					requireLogin: true,
					accessLogged: true
				}
			})
			.state('feedbacksPage', {
				url: "/feedbacks",
				templateUrl: "feedbacksPage.template.html",
				data: {
					requireLogin: true,
					accessLogged: true
				}
			})
			.state('ordersPage', {
				url: "/orders",
				templateUrl: "ordersPage.template.html",
				data: {
					requireLogin: true,
					accessLogged: true
				}
			})
			.state('confirmationPage', {
				url: "/confirmation",
				templateUrl: "confirmationPage.template.html",
				data: {
					requireLogin: true,
					accessLogged: true
				}
			});



			$mdThemingProvider.definePalette('blueAble', {
				'50': '2680D9',
				'100': '2680D9',
				'200': '2680D9',
				'300': '2680D9',
				'400': '2680D9',
				'500': '2680D9',
				'600': '2680D9',
				'700': '2680D9',
				'800': '2680D9',
				'900': '2680D9',
				'A100': '2680D9',
				'A200': '2680D9',
				'A400': '2680D9',
				'A700': '2680D9',
				'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
				'contrastDarkColors': undefined,
				'contrastLightColors': undefined    // could also specify this if default was 'dark'
			});
			$mdThemingProvider.theme('default').primaryPalette('blueAble')

			$mdThemingProvider.definePalette('darkSilverAble', {
				'50': '282F3D',
				'100': '282F3D',
				'200': '282F3D',
				'300': '282F3D',
				'400': '282F3D',
				'500': '282F3D',
				'600': '282F3D',
				'700': '282F3D',
				'800': '282F3D',
				'900': '282F3D',
				'A100': '282F3D',
				'A200': '282F3D',
				'A400': '282F3D',
				'A700': '282F3D',
				'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
				'contrastDarkColors': undefined,
				'contrastLightColors': undefined    // could also specify this if default was 'dark'
			});
			$mdThemingProvider.theme('default').warnPalette('darkSilverAble')

			$mdThemingProvider.definePalette('greenAble', {
				'50': '26BD49',
				'100': '26BD49',
				'200': '26BD49',
				'300': '26BD49',
				'400': '26BD49',
				'500': '26BD49',
				'600': '26BD49',
				'700': '26BD49',
				'800': '26BD49',
				'900': '26BD49',
				'A100': '26BD49',
				'A200': '26BD49',
				'A400': '26BD49',
				'A700': '26BD49',
				'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
				'contrastDarkColors': undefined,
				'contrastLightColors': undefined    // could also specify this if default was 'dark'
			});
			$mdThemingProvider.theme('default').accentPalette('greenAble')

			$mdThemingProvider.definePalette('ivoryAble', {
				'50': 'F4F2EF',
				'100': 'F4F2EF',
				'200': 'F4F2EF',
				'300': 'F4F2EF',
				'400': 'F4F2EF',
				'500': 'F4F2EF',
				'600': 'F4F2EF',
				'700': 'F4F2EF',
				'800': 'F4F2EF',
				'900': 'F4F2EF',
				'A100': 'F4F2EF',
				'A200': 'F4F2EF',
				'A400': 'F4F2EF',
				'A700': 'F4F2EF',
				'contrastDefaultColor': 'dark',    // whether, by default, text (contrast)
				'contrastDarkColors': undefined,
				'contrastLightColors': undefined    // could also specify this if default was 'dark'
			});
			$mdThemingProvider.theme('default').backgroundPalette('ivoryAble')


		// var customAccent = {'500': '#282F3D'};
		// var customWarn = {'500': '#26BD49'};
		// var customBackground = {'500': '#F4F2EF'};

	})

	.run(function ($rootScope, $state, app) {
		$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
			if (toState.data.requireLogin == true && app.auth.user.token == '') {
				event.preventDefault();
				$state.go('startPage');
			} else
			if (toState.data.accessLogged == false && app.auth.user.token != '') {
				event.preventDefault();
				$state.go('storePage');
			}
		})

	})



	.filter('secondsToTime', function() {
	    return function(seconds) {
	        var d = new Date(0,0,0,0,0,0,0);
	        d.setSeconds( Math.round(seconds) );
	        return d;
    	}
	})

	.filter('secondsToMinutes', function() {
	    return function(seconds) {
	        return Math.round(seconds/60);
    	}
	})




	.factory('app', app)
	.controller('appController', appController)

	function app(auth){
		var vm = this;
		vm.auth = auth;
		// vm.addressKnown = true;
		// vm.showFeedbacks = false;
		// vm.showOffers = true;
		return vm
	}

	function appController(app){
		return app
	}



})();
