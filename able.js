(function() {
	'use strict';

	angular

		.module("able", [
		'ngMaterial',
		'ngMessages',
		'ngAnimate',
		'ngStorage',
		'ui.router',
		'ct.ui.router.extras',
		'ngAria',
		'angularPayments',
		'dcbImgFallback',
	])

	.value('config', {
		//heartbend
		// api: 'http://127.0.0.1:8081',
		// company_path: '/companies/5066549580791808',
		api: 'https://api-dot-heartbend.appspot.com',
		company_path: '/companies/5654313976201216',
		node_function: 'productConsumerDispatch',
		offers_count: 6,

		//helpshift
		helpshift_api_key: 'd39dcb147a53f4491218d67c09ad6103',
		helpshift_domain: 'able.helpshift.com',
		helpshift_app_id_ios: 'able_platform_20151202232813761-cc37683499f9965',
		helpshift_app_id_android: 'able_platform_20151216171356528-7e3568cf679c8cd',
		helpshift_app_id: ''
	})

	.config(function($compileProvider, $stateProvider, $urlRouterProvider, $mdThemingProvider, $httpProvider, $localStorageProvider, $animateProvider, $anchorScrollProvider) {
		$compileProvider.debugInfoEnabled(false);
		$anchorScrollProvider.disableAutoScrolling(true)
			// $animateProvider.classNameFilter( /\banimated\b|\bmd-sidenav-backdrop\b|\bmd-bottom\b|\bng-animate\b/ );
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
				deepStateRedirect: {
					default: "storePage.offerPage"
				},
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
					"offer": {
						templateUrl: "offerPage.template.html"
					}
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
					"map": {
						templateUrl: "mapPage.template.html"
					}
				},
				data: {
					title: "Localização",
					requireLogin: true,
					accessLogged: true
				}
			})
			.state('storePage.profilePage', {
				url: "/profile",
				templateUrl: "profilePage.template.html",
				data: {
					title: "Perfil",
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
			'contrastDefaultColor': 'light', // whether, by default, text (contrast)
			'contrastDarkColors': undefined,
			'contrastLightColors': undefined // could also specify this if default was 'dark'
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
			'contrastDefaultColor': 'light', // whether, by default, text (contrast)
			'contrastDarkColors': undefined,
			'contrastLightColors': undefined // could also specify this if default was 'dark'
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
			'contrastDefaultColor': 'light', // whether, by default, text (contrast)
			'contrastDarkColors': undefined,
			'contrastLightColors': undefined // could also specify this if default was 'dark'
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
			'contrastDefaultColor': 'dark', // whether, by default, text (contrast)
			'contrastDarkColors': undefined,
			'contrastLightColors': undefined // could also specify this if default was 'dark'
		});
		$mdThemingProvider.theme('default').backgroundPalette('ivoryAble')
	})

	.run(function($rootScope, $state, auth, $window, $interval, config, $mdDialog) {
		$rootScope.platform = Platform
		$rootScope.geocoder = new google.maps.Geocoder()
		$rootScope.autocomplete = new google.maps.places.AutocompleteService()
		$rootScope.distancer = new google.maps.DistanceMatrixService()

		$rootScope.$state = $state;
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
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

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
			if (toState.name == 'storePage.offerPage' && !$rootScope.located) {
				if (navigator.geolocation) {
					event.preventDefault();
					$rootScope.locating = true
					navigator.geolocation.getCurrentPosition(
						function(position) {
							var geocoder = $rootScope.geocoder
							$rootScope.geocoder.geocode({
								'location': {
									'lat': position.coords.latitude,
									'lng': position.coords.longitude
								}
							}, function(results, status) {
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

		$rootScope.updateDistance = function() {
			if ($rootScope.offer && $rootScope.offer.object) {
				var distance
				var estimated
				var distanceRequest = {
					destinations: [{
						'lat': $rootScope.latitude,
						'lng': $rootScope.longitude
					}],
					origins: [{
						'lat': $rootScope.offer.object.node_latitude,
						'lng': $rootScope.offer.object.node_longitude
					}],
					travelMode: google.maps.TravelMode.DRIVING
				}
				$rootScope.distancer.getDistanceMatrix(distanceRequest, function(response, status) {
					if (status !== google.maps.DistanceMatrixStatus.OK) {
						var linear = geolib.getDistance({
							latitude: $rootScope.latitude,
							longitude: $rootScope.longitude
						}, {
							latitude: $rootScope.offer.object.node_latitude,
							longitude: $rootScope.offer.object.node_longitude
						})
						distance = linear * 1.5
						estimated = +((distance * 0.33) + 1200).toFixed(2)
					} else {
						distance = +(response.rows[0].elements[0].distance.value).toFixed(2)
						estimated = +(+(response.rows[0].elements[0].duration.value) + 1200).toFixed(2)
					}
					if (!distance) {
						distance = 1
					}
					$rootScope.attended = distance < $rootScope.offer.object.node_max_distance ? true : false
					$rootScope.estimated = +(estimated).toFixed(2)
					$rootScope.distance = distance

					$rootScope.$digest()
				});
			}
		}
		$rootScope.updateFreight = function() {
			if ($rootScope.distance == 0) {
				$rootScope.updateDistance()
			} else {
				var distance = $rootScope.distance
				if (distance > 11000) {
					var contribution = $rootScope.products_value ? $rootScope.products_value * 0.20 : 0
					var full_freight = (distance / 1000 * 1.862) + 7.90
					var freight = full_freight - contribution
					if (freight <= 0) {
						freight = 0
					}
					$rootScope.freight = +(freight).toFixed(2)
				} else {
					var contribution = $rootScope.products_value ? $rootScope.products_value * 0.20 : 0
					var full_freight = 22.90
					var freight = full_freight - contribution
					if (freight <= 0) {
						freight = 0
					}
					$rootScope.freight = +(freight).toFixed(2)
				}

			}
		}


		$rootScope.workingTime = function() {
			if ($rootScope.offer) {
				var weekdays = ["Domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "Sábado"]
				var times = $rootScope.offer.object.node_resource.object.times
				var start
				var end
				var now = new Date()
				var today = now.getDay()
				var now_minutes = now.getHours() * 60 + now.getMinutes()
				var next_key
				var next_day
				for (var key in times) {
					if (times[key].day == today) {
						$rootScope.not_attending = now_minutes < times[key].start || now_minutes > times[key].end ? true : false
						now_minutes > times[key].start ? next_key = parseInt(key) + 1 : next_key = parseInt(key)
						next_key == 7 ? next_key = 0 : next_key = next_key
						start = times[next_key].start
						end = times[next_key].end
						next_key == key ? next_day = "Hoje" : next_day = "Amanhã"
							// $rootScope.not_attending = now_minutes < start || now_minutes > end ? true : false
						$rootScope.next_start = start
						$rootScope.next_end = end
						$rootScope.next_day = next_day
						$rootScope.next_weekday = weekdays[next_key]
						break
					}
				}
			}
		}


		$interval($rootScope.workingTime, 60 * 1000); //60 seconds * 1000 miliseconds


		if (Keyboard) {
			$rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
				Keyboard.close()
			})
		}

	})

	.filter('secondsToTime', function() {
		return function(seconds) {
			var d = new Date(0, 0, 0, 0, 0, 0, 0);
			d.setSeconds(Math.round(seconds))
			return d;
		}
	})

	.filter('minutesToTime', function() {
		return function(minutes) {
			var h = Math.floor(minutes / 60)
			var m = minutes - h * 60
			h < 10 ? h = "0" + h : h = h
			m < 10 ? m = "0" + m : m = m
			return h + ":" + m;
		}
	})

	.filter('secondsToMinutes', function() {
		return function(seconds) {
			return Math.round(seconds / 60);
		}
	})


	// .filter('search', function() {
	//     return element.name.match(/^Ma/) ? true : false;
	// }






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

	function appController(auth, $state, $rootScope, config, $http) {
		var vm = this
		vm.auth = auth
		vm.state = $state
		vm.badge = 0

		if (auth.id != "") {
			auth.getUser()
		}

		if (Keyboard && device.platform == 'iOS') {
			window.addEventListener('native.keyboardshow', keyboardWindowResize)
			window.addEventListener('native.keyboardhide', keyboardWindowResize)
			Keyboard.close()
		}

		function keyboardWindowResize(e) {
			var h = window.innerHeight
			$rootScope.height = h
			document.body.setAttribute("style", "height: " + h + "px !important")
		}

		if (PushNotification) {
			Push = PushNotification.init({
				android: {
					senderID: "828347553479",
					forceShow: true,
					sound: true,
					vibrate: true
				},
				ios: {
					alert: "true",
					badge: "true",
					sound: "true"
				}
			})

			Push.on('registration', function(data) {
				// console.log(data)
				HelpShift.registerDeviceToken(data.registrationId)
				auth.push = data.registrationId
				getNotifications()
			});
			Push.on('notification', function(data) {
				// console.log(data)
				HelpShift.handleRemoteNotification(data.additionalData)
			});
		}



		//init HelpShift
		if (HelpShift && device.platform) {
			device.platform == 'iOS' ? config.helpshift_app_id = config.helpshift_app_id_ios : config.helpshift_app_id = config.helpshift_app_id_android
			var setup = {
				"gotoConversationAfterContactUs": "YES",
				"hideNameAndEmail": "YES"
			}
			HelpShift.install(config.helpshift_api_key, config.helpshift_domain, config.helpshift_app_id)
			HelpShift.registerSessionDelegates(sessionStart, sessionEnd)
			HelpShift.registerConversationDelegates(newConversationStarted, userRepliedToConversation, userCompletedCustomerSatisfactionSurvey, didReceiveNotification, didReceiveInAppNotificationWithMessageCount, displayAttachmentFile)

			// vm.showConversation = HelpShift.showConversation
			vm.showFAQs = function() {
				if (vm.badge == 0) {
					HelpShift.showFAQs()
				} else {
					HelpShift.showConversation()
					setBadges(0)
				}
			}

			vm.showConversation = function() {
				HelpShift.showConversation()
				setBadges(0)
			}

			vm.showSingleFAQ = HelpShift.showSingleFAQ

			document.addEventListener("resume", getNotifications, false);
			// document.addEventListener("pause", getNotifications, false);
		}

		function getNotifications() {
			if (HelpShift) {
				HelpShift.getNotificationCount("YES", false);
			}
		}

		function setBadges(count) {
			count < 0 ? count = 0 : count = count
			Badge.set(count)
			vm.badge = count
		}

		function sessionStart() {
			setBadges(0)
		}

		function sessionEnd() {
			getNotifications()
			$rootScope.$digest()
		}

		function newConversationStarted(message) {}

		function userRepliedToConversation(message) {}

		function userCompletedCustomerSatisfactionSurvey(rating, message) {}

		function didReceiveNotification(message) {
			// console.log("didReceiveNotification")
			// console.log(message)
			if (device && device.platform == "Android") {
				setBadges(1)
			} else {
				setBadges(message)
			}
			$rootScope.$digest()
		}

		function didReceiveInAppNotificationWithMessageCount(message) {
			// console.log("didReceiveInAppNotificationWithMessageCount")
			// console.log(message)
			if (device && device.platform == "Android") {
				setBadges(1)
			} else {
				setBadges(message)
			}
			$rootScope.$digest()
		}

		function displayAttachmentFile(message) {}


	}




})();