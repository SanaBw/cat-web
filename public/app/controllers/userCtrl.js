angular.module('userControllers',['userServices'])

.controller('regCtrl', function($http, $location, $timeout, User){

    var app = this;   

       this.regUser = function(regData){
           app.loading = true;
           app.errorMsg = false;

           User.create(app.regData).then(function(data){
                if (data.data.success){
                    app.loading=false;
                    app.successMsg ='Successifully registered';
                    $timeout(function(){
                        $location.path('/register');
                        app.regData=null;
                        app.successMsg=null;
                    },2000);                    
                } else{
                    app.loading = false;
                    app.errorMsg = data.data.message;
                }
           });
    };
});

