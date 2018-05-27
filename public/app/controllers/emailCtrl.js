angular.module('emailController', ['userServices'])

    .controller('emailCtrl', function ($routeParams, User, $timeout, $location) {
        app = this;
        User.activateAcc($routeParams.token).then(function (data) {
            app.successMsg = false;
            app.errorMsg = false;
            if (data.data.success) {
                app.successMsg = data.data.message + 'Redirecting..';
                $timeout(function () {
                    $location.path('/register');
                }, 3000);
            } else {
                app.errorMsg = data.data.message + 'Redirecting..';
                $timeout(function () {
                    $location.path('/register');
                }, 3000);
            }
        });
    })

    .controller('resendCtrl', function (User) {
        app = this;
        app.checkCredentials = function (logData) {
            User.checkCredentials(app.logData).then(function (data) {
                app.errorMsg = false;
                app.successMsg = false;
                User.checkCredentials(app.logData).then(function (data) {
                    if (data.data.success) {
                        User.resendLink(app.logData).then(function (data) {
                            if (data.data.success) {
                                app.successMsg = data.data.message;
                            }
                        });
                    } else {
                        app.errorMsg = data.data.message;
                    }
                });
            });
        };
    });