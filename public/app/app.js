angular.module('catweb', ['appRoutes', 'userControllers', 'userServices', 'mainController', 'authServices', 'emailController'])

    //intercept every req with AuthInterceptors
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptors');
    })
    //make youtube videos in db trusted
    .config(function ($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist(['**']);
    });