(function () {
	'use strict';

	angular
		.module('able')
		.directive('profileElement', profileDirective)


	function profileDirective() {
		var directive = {
			restrict: 'A',
			controller: profileController,
			controllerAs: 'profile',
			bindToController: true
		}
		return directive
	}

	function profileController($scope, auth, $http, config, $mdToast) {
		var vm = this

        vm.save = save
        vm.sending = false
        vm.resetPass = reset

        auth.getUser()

        $scope.$watch(function w(scope){return( auth.user )},function c(n,o){
            vm.user = auth.user
		});

        // $scope.$watch(function w(scope){return( vm.user )},function c(n,o){
        //     auth.user === vm.user ? vm.synced = true : vm.synced = false;
        //     console.log(vm.synced)
		// });

        function save(){
            vm.sending = true
            if(Keyboard) {
                Keyboard.close()
            }
            var payload = {
                name: vm.user.name,
                document: vm.user.document,
                phone: vm.user.phone
            }


            auth.patchUser(payload).then(
                function(resolve) {
                    vm.sending = false
                    $scope.profileForm.$setPristine()
                },
                function(reject) {
                    vm.sending = false
                    console.log('error sending')
                }
            );
        }

        function toast(msg){$mdToast.show(
			$mdToast.simple()
			.textContent(msg)
			.hideDelay(10000)
			.action('Ok')
			.theme('default')
		)};


        function reset(){
			var payload = {'email':auth.user.email};
			$http.patch(config.api + '/tokens', payload)
				.then(
				function successCallback(response) {
					toast("Enviamos um e-mail com instruções de recuperação da senha para "+auth.user.email)
				},
				function errorCallback(response) {
					if(response.status == -1){
						toast("Verifique sua conexão.")
						return
					}
					if(response.data && response.data.errors && response.data.errors[0]){
						toast(response.data.errors[0].error)
						return
					}
					toast("That's a no-no :(")
				});
		}




	}



})();
