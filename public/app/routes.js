angular.module('appRoutes',['ngRoute'])
.config(function($routeProvider, $locationProvider){
    $routeProvider
    .when('/', {
        templateUrl:'/app/views/pages/home.html'
    })
    .when('/videos', {
        templateUrl:'/app/views/pages/videos.html'
    })
    .when('/music', {
        templateUrl:'/app/views/pages/music.html'
    })
    .when('/species', {
        templateUrl:'/app/views/pages/species.html'
    })
    .when('/vet', {
        templateUrl:'/app/views/pages/vet.html'
    })
    .when('/register', {
        templateUrl:'/app/views/pages/users/register.html',
        controller: 'regCtrl',
        controllerAs: 'register'
    })
    .when('/profile', {
        templateUrl:'/app/views/pages/users/profile.html',
     
    })
    .otherwise({
        redirectTo:'/'
    });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });


});

