(function() {
	'use strict';

	angular

	.module("able", [
		'ngMessages',
		'ngAnimate',
		'ngStorage',
		'ui.router',
		'ct.ui.router.extras',
		'ngAria',
		'ngMaterial',
		'angularPayments',
		'dcbImgFallback'
	])

	.value('config', {
		api: 'http://127.0.0.1:8081',
		company_path: '/companies/5629499534213120',
		// api: 'https://api-dot-heartbend.appspot.com',
		// company_path: '/companies/5654313976201216',
		node_function: 'productConsumerDispatch',
		offers_count: 6,
		stripe_key: 'pk_test_85MXK5Zb67wdbX1yUZ7QcG8K'
	})

	// .value('mock', {
	// })

	.config(function ($compileProvider, $stateProvider, $urlRouterProvider, $mdThemingProvider, $httpProvider, $localStorageProvider, $animateProvider) {
		$compileProvider.debugInfoEnabled(false);
		$animateProvider.classNameFilter( /\banimated\b|\bmd-sidenav-backdrop\b|\bmd-bottom\b/ );
		$localStorageProvider.setKeyPrefix('able_');
		// $mdGestureProvider.skipClickHijack(); //corrects erratic ngTouch+mdButton in mobile
		$httpProvider.useApplyAsync(false);
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
			.state('storePage.plasticsPage', {
				url: "/plastics",
				templateUrl: "plasticsPage.template.html",
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

			$mdThemingProvider.definePalette('redAble', {
				'50': 'FF6666',
				'100': 'FF6666',
				'200': 'FF6666',
				'300': 'FF6666',
				'400': 'FF6666',
				'500': 'FF6666',
				'600': 'FF6666',
				'700': 'FF6666',
				'800': 'FF6666',
				'900': 'FF6666',
				'A100': 'FF6666',
				'A200': 'FF6666',
				'A400': 'FF6666',
				'A700': 'FF6666',
				'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
				'contrastDarkColors': undefined,
				'contrastLightColors': undefined    // could also specify this if default was 'dark'
			});
			$mdThemingProvider.theme('default').warnPalette('redAble')

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
	})

	.run(function ($rootScope, $state, auth, $window, $interval) {
		$rootScope.platform = Platform
		$rootScope.geocoder = new google.maps.Geocoder()
		$rootScope.$state = $state;
		$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
			// $rootScope.workingTime()
			if (toState.data.requireLogin && !auth.token) {
				event.preventDefault();
				$state.go('startPage');
			} else
			if (!toState.data.accessLogged && auth.token) {
				event.preventDefault();
				$state.go('storePage.offerPage');
			}
		})

		$interval($rootScope.workingTime, 60 * 1000); //60 seconds * 1000 miliseconds



		$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
			if(toState.name == 'storePage.offerPage' && !$rootScope.located ){
				if (navigator.geolocation) {
					event.preventDefault();
					$rootScope.locating = true
		 			navigator.geolocation.getCurrentPosition(
						function(position) {
							var geocoder = $rootScope.geocoder
							$rootScope.geocoder.geocode({'location':{'lat':position.coords.latitude,'lng':position.coords.longitude}}, function(results, status) {
								if (status == google.maps.GeocoderStatus.OK) {
									$rootScope.place = {
										description: results[0].formatted_address,
										place_id: results[0].place_id
									}
								}
							});

							$rootScope.latitude = position.coords.latitude
							$rootScope.longitude = position.coords.longitude
							$rootScope.accuracy = position.coords.accuracy

							$rootScope.addressed = true
							$rootScope.located = true
							$rootScope.locating = false
							$state.go('storePage.offerPage');
						},
						function() {
							event.preventDefault();
							$rootScope.located = false
							$rootScope.locating = false
							$state.go('storePage.mapPage');
						}
					);
				} else {
					event.preventDefault();
					$rootScope.located = false
					$rootScope.locating = false
					$state.go('storePage.mapPage');
				}
			}
		})

		$rootScope.updateDistance = function(){
			if($rootScope.offer && $rootScope.offer.object){
				var linear = geolib.getDistance({latitude:$rootScope.latitude, longitude:$rootScope.longitude},{latitude:$rootScope.offer.object.node_latitude, longitude:$rootScope.offer.object.node_longitude})
				$rootScope.attended = linear < $rootScope.offer.object.node_radius ? true : false
				var distance = linear * 1.5
				// console.log(distance)
				$rootScope.estimated = +((distance * 0.33) + 1200).toFixed(2)
				var over = distance-10000 > 0 ? (distance-10000)/1000 : 0
				$rootScope.freight = +((over)*1.80 + 22.90).toFixed(2)
			}
		}

		$rootScope.workingTime = function(){
			var times = $rootScope.offer.object.node_resource.object.times
//			console.log($rootScope.offer.object.node_resource.object.times)
			var start
			var end
			var now = new Date()
			var today = now.getDay()
			for (var key in times) {
				if(times[key].day == today){
					start = times[key].start
					end = times[key].end
				}
			}
			var nowMinutes = now.getHours()*60 + now.getMinutes()
			$rootScope.not_attending = nowMinutes < start || nowMinutes > end ? true : false
		}

		if(Keyboard){
			$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
				Keyboard.close()
			})
		}



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

	function appController(auth, $state, $rootScope){
		var vm = this;
		vm.auth = auth;
		vm.state = $state;

		if(Keyboard && device.platform == 'iOS'){
			window.addEventListener('native.keyboardshow', keyboardShowHandler);
			window.addEventListener('native.keyboardhide', keyboardHideHandler);
			Keyboard.close();
		}

		function keyboardShowHandler(e){
			var full = document.getElementsByTagName('body')[0].clientHeight
			$rootScope.height = full - e.keyboardHeight
			document.getElementById('app').setAttribute("style","height:"+$rootScope.height+"px !important");
		}

		function keyboardHideHandler(e){
			$rootScope.height = document.getElementsByTagName('body')[0].clientHeight
			document.getElementById('app').setAttribute("style","height:"+$rootScope.height+"px !important");
		}



	}




})();
