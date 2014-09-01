'use strict';

angular.module('integrationApp',['ngRoute'])
  
 .controller('ArticleCtrl', function ($scope, $famous) {
   	console.log($scope.articles);
   	
})

.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/article/:articleId', {
    	templateUrl: 'article.html',
    	controller: 'ArticleCtrl'
	});
});
