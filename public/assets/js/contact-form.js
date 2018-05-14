var app = angular.module('ContactForm',[]);

app.controller("cfController",function($scope){
	$scope.submitForm = function(isValid) {
		this.formInput = {
        name: $("input[name='name']").val(),
        email: $("input[name='email']").val(),
        message: $("textarea[name='message']").val()
   };
		if (isValid) {
			console.log('Message sent successfully');
			console.log(this.formInput);
		} else {
			console.log('Failed to send message')
		}
	};
});