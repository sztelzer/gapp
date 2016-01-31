(function() {
	'use strict';

	angular

	.module("able", [
		'ngAnimate',
		'ngStorage',
		'ui.router',
		'ct.ui.router.extras',
		'ngAria',
		'ngMaterial',
		'angularPayments'
	])

	.value('config', {
		// api: 'http://127.0.0.1:8081',
		// company_path: '/companies/5629499534213120',
		api: 'https://api-dot-heartbend.appspot.com',
		company_path: '/companies/5654313976201216',
		node_function: 'productConsumerDispatch',
		offers_count: 6
	})

	// .value('mock', {
	// })

	.config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider, $httpProvider, $localStorageProvider) {
		$localStorageProvider.setKeyPrefix('able_');
		// $mdGestureProvider.skipClickHijack(); //corrects erratic ngTouch+mdButton in mobile
		$httpProvider.useApplyAsync(true);
		$urlRouterProvider.otherwise("/");
		$stateProvider
			.state('startPage', {
				url: "/",
				templateUrl: "startPage.template.html",
				data: {
					title: "Início",
					requireLogin: false,
					accessLogged: false
				}
			})


			.state('questPage', {
				url: "/quest",
				templateUrl: "questPage.template.html",
				data: {
					title: "Criar Perfil",
					requireLogin: false,
					accessLogged: false
				}
			})

			.state('signinPage', {
				url: "/signin",
				templateUrl: "signinPage.template.html",
				data: {
					title: "Entrar",
					requireLogin: false,
					accessLogged: false
				}
			})
			.state('storePage', {
				url: "/store",
				templateUrl: "storePage.template.html",
				deepStateRedirect: { default: "storePage.offerPage" },
				data: {
					title: "Loja",
					requireLogin: true,
					accessLogged: true
				}
			})
			.state('storePage.offerPage', {
				url: "/offer",
				sticky: true,
				views: {
					"offer": { templateUrl: "offerPage.template.html" }
				},
				data: {
					title: "Indicações",
					requireLogin: true,
					accessLogged: true
				}
			})
			.state('storePage.mapPage', {
				url: "/map",
				sticky: true,
				views: {
					"map": { templateUrl: "mapPage.template.html" }
				},
				data: {
					title: "Localização",
					requireLogin: true,
					accessLogged: true
				}
			})
			.state('storePage.creditPage', {
				url: "/credit",
				sticky: true,
				views: {
					"credit": { templateUrl: "creditPage.template.html" }
				},
				data: {
					title: "Cartões",
					requireLogin: true,
					accessLogged: true
				}
			})
			.state('storePage.ordersPage', {
				url: "/orders",
				templateUrl: "ordersPage.template.html",
				data: {
					title: "Pedidos",
					requireLogin: true,
					accessLogged: true
				}
			})
			.state('storePage.confirmationPage', {
				url: "/confirmation",
				templateUrl: "confirmationPage.template.html",
				data: {
					title: "Último Pedido",
					requireLogin: true,
					accessLogged: true
				}
			})
			.state('storePage.feedbacksPage', {
				url: "/feedbacks",
				templateUrl: "feedbacksPage.template.html",
				data: {
					title: "Avaliações",
					requireLogin: true,
					accessLogged: true
				}
			});



			$mdThemingProvider.definePalette('blueAble', {
				'50': '0080FF',
				'100': '0080FF',
				'200': '0080FF',
				'300': '0080FF',
				'400': '0080FF',
				'500': '0080FF',
				'600': '0080FF',
				'700': '0080FF',
				'800': '0080FF',
				'900': '0080FF',
				'A100': '0080FF',
				'A200': '0080FF',
				'A400': '0080FF',
				'A700': '0080FF',
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

	.run(function ($rootScope, $state, auth) {
		$rootScope.$state = $state;
		$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
			if (toState.data.requireLogin == true && auth.token === '') {
				event.preventDefault();
				$state.go('startPage');
			} else
			if (toState.data.accessLogged == false && auth.token !== '') {
				event.preventDefault();
				$state.go('storePage.offerPage');
			}
		})

    	FastClick.attach(document.body);
		Keyboard.shrinkView(true);
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


	.directive('appElement', appDirective)

	function appDirective() {
		var directive = {
			restrict: 'A',
			controller: appController,
			controllerAs: 'app',
			bindToController: true
		}
		return directive
	}

	function appController(auth, $state){
		var vm = this;
		vm.auth = auth;
		vm.state = $state;
	}




})();
