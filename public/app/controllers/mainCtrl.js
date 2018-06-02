angular.module('mainController', ['authServices', 'favServices'])

    .controller('mainCtrl', function (Auth, Fav, $timeout, $location, $rootScope, $scope, $http) {
        var app = this;
        var user;
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
        $http.get('/api/favorites').then(function (data) {       
            $scope.favorites = data.data.message;
        });

        $rootScope.$on('$routeChangeStart', function () {
            if (Auth.isLoggedIn()) {
                app.isLoggedIn = true;
                Auth.getUser().then(function (data) {
                    app.username = data.data.username;
                    user = data.data.username;
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
            app.expired = false;
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
                    if (data.data.expired) {
                        app.expired = true;
                        app.loading = false;
                        app.errorMsg = data.data.message;
                    } else {
                        app.loading = false;
                        app.errorMsg = data.data.message;
                    }
                }
            });
        };

        this.logout = function () {
            Auth.logout();
            window.location.reload();
        };

        this.favData = {};
        this.saveFav = function (songSource){
            Auth.getUser().then(function (data) {
                app.favData.username = data.data.username;               
                app.favData.source = songSource;                             
                Fav.create(app.favData).then(function(data){
                    if (data.data.success){
                        console.log(data.data.message);
                    } else {
                        console.log(data.data.message);
                    }
                });         
            });
        };

        this.removeFav = function(fav){                                   
                Fav.remove(fav).then(function(data){                   
                    if (data.data.success){
                        console.log(data.data.message);
                        location.reload(); 
                    } else {
                        console.log(data.data.message);
                    }                        
            }); 
        };

    });