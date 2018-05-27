var app = angular.module('appRoutes', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/app/views/pages/home.html'
            })
            .when('/videos', {
                templateUrl: '/app/views/pages/videos.html'
            })
            .when('/music', {
                templateUrl: '/app/views/pages/music.html'
            })
            .when('/species', {
                templateUrl: '/app/views/pages/species.html'
            })
            .when('/vet', {
                templateUrl: '/app/views/pages/vet.html'
            })
            .when('/register', {
                templateUrl: '/app/views/pages/users/register.html',
                controller: 'regCtrl',
                controllerAs: 'register',
                authenticated: false
            })
            .when('/profile', {
                templateUrl: '/app/views/pages/users/profile.html',
                authenticated: true
            })
            .when('/activate/:token', {
                templateUrl: '/app/views/pages/users/activation/activate.html',
                controller: 'emailCtrl',
                controllerAs: 'email'
            })
            .when('/resend', {
                templateUrl: '/app/views/pages/users/activation/resend.html',
                controller: 'resendCtrl',
                controllerAs: 'resend'
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });

/* redirect unautenticated routes back home */
app.run(['Auth', '$rootScope', '$location', function (Auth, $rootScope, $location) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if ((next.$$route.authenticated != undefined) && (Auth.isLoggedIn() != next.$$route.authenticated)) {
            event.preventDefault();
            $location.path('/');
        }
    });
}]);

