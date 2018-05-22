angular.module('mainController', ['authServices'])

    .controller('mainCtrl', function (Auth, $timeout, $location, $rootScope,$scope,$http) {
        var app = this;

        app.loadme = false;
        
        $http.get('/api/vid').then(function (data) {
            $scope.videos = data.data.message;
        });

        $http.get('/api/audio').then(function (data) {
            $scope.music = data.data.message;
        });

        $http.get('/api/spec').then(function (data) {
            $scope.species = data.data.message;
        });
      

        $rootScope.$on('$routeChangeStart', function () {

            if (Auth.isLoggedIn()) {
                app.isLoggedIn = true;
                Auth.getUser().then(function (data) {
                    app.username = data.data.username;
                    app.loadme = true;
                });
            } else {
                app.username = null;
                app.isLoggedIn = false;
                app.loadme = true;
            }
        });



        this.logUser = function (logData) {
            app.loading = true;
            app.errorMsg = false;

            Auth.login(app.logData).then(function (data) {
                if (data.data.success) {
                    app.loading = false;
                    app.successMsg = 'Redirecting to home...';
                    $timeout(function () {
                        $location.path('/');
                        app.logData = null;
                        app.successMsg = null;
                    }, 2000);
                } else {
                    app.loading = false;
                    app.errorMsg = data.data.message;
                }
            });

        };

        this.logout = function () {
            Auth.logout();
            window.location.reload();
        };
        
    });