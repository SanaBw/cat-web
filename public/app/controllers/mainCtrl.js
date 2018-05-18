angular.module('mainController', ['authServices'])

.controller('mainCtrl', function(Auth, $timeout, $location){
    var app = this;

    this.logUser = function(logData){
        app.loading = true;
        app.errorMsg = false;

        Auth.login(app.logData).then(function(data){
            if (data.data.success){
                app.loading=false;
                app.successMsg = 'Redirecting to home...';
                $timeout(function(){
                   $location.path('/');
                },2000);                    
            } else{
                app.loading = false;            
                app.errorMsg = data.data.message;
            }
        });
        
    };
});