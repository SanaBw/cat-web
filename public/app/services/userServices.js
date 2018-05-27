angular.module('userServices', [])

    .factory('User', function ($http) {
        var userFactory = {};

        userFactory.create = function (regData) {
            return $http.post('/api/users', regData);
        };

        userFactory.activateAcc = function (token) {
            return $http.put('/api/activate/' + token);
        };

        userFactory.checkCredentials = function (logData) {
            return $http.post('/api/resend', logData)
        };

        userFactory.resendLink = function (username) {
            return $http.put('/api/resend', username)
        };

        return userFactory;
    });