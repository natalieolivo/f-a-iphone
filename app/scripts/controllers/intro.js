'use strict';

angular.module('integrationApp')
  .controller('IntroCtrl', function ($scope, $famous) {
   	
   	var EventHandler = $famous['famous/core/EventHandler'];
   	var Transitionable = $famous['famous/transitions/Transitionable'];   	
   	var startX;
   	var startY;
   	var distanceX = 0;
   	var distanceY = 0;
   	var threshold;
   	var shiftDownValue = 50;
   	var elapsedTime = 0;
   	var startTime;
   	var allowedTime = 500;
   	var restraint = 200;
   	var direction;
   	var openArticle, colorArticle, goToArticle;
   	var state = "closed";

   	$scope.list = [{content: "The Prisoner Isis Wants For An American"}, {content: "angular"}, {content: "rocks!"}, {content: "it"}, {content: "does"}, {content:"yup"}];
   	$scope.listCount = $scope.list.length;   	
   	$scope.articles = [];
   	$scope.articlePageTrans = 0;

	$scope.eventHandler = new EventHandler();	
	$scope.dashOpacity = {
		value: 0
	};
	$scope.page2Opacity = {   			
   		value: 0
	}	
	$scope.dashboardTrans = new Transitionable([0, -540, 0]);		
	
	$scope.barTap = function(bar){
		console.log("clicked bar"+bar);
		if(state === "open") {
			$scope.dashboardTrans.set([0,-540,0]);
			state = "closed";
		} else {
			$scope.dashboardTrans.set([0,0,0]);
			state = "open";
		}
		
	};

	$scope.$watch('listCount', function(count) {		
		console.log("list count", count);	
		var arr = [];
		
		for(var i = 0; i < count; i++) {
						console.log("transitionY", (100 * i)+shiftDownValue);	
			var trans = new Transitionable([0, (100 * i)+shiftDownValue, 0]);
			var skiptrans = new Transitionable([320, (100 * i)+shiftDownValue, 0]);		 	
			
			arr.push({trans: trans, skiptrans: skiptrans, index: i, articleId: i });
		}

		$scope.articles = arr;
		console.log("articles", $scope.articles);

		// set Article Page Template View to be the height of all articles
		$scope.articlePageTrans = new Transitionable([0, (100 * $scope.articles.length)+shiftDownValue, 0]);		
	});	
	
	$scope.touchStart = function(article, $event) {
		//console.log("touchstart", $event);
		var touchObj = $event.changedTouches[0];

		threshold = 10;

   		startX = $event.changedTouches[0].pageX;
   		startY = $event.changedTouches[0].pageY;

		startTime = new Date().getTime();
		$scope.page3Opacity = { value: 1 }
		$scope.articlePageTrans.set([0, (100 * article.index)+shiftDownValue, 0]);

		console.log("touchstart");    		

	};

	$scope.touchMove = function(article, $event) {
		// have I swiped? In what direction? (right = positive delta, left = negative delta) How far?
		var touchObj = $event.changedTouches[0];

		distanceX = touchObj.pageX - startX,
		distanceY = touchObj.pageX - startY;   			

   		elapsedTime = new Date().getTime() - startTime;
   		

   		//console.log("time to swipe", elapsedTime); 
   		   		
   		if (elapsedTime <= allowedTime){
   			$scope.page3Opacity = { value: 0 }
	   		if (Math.abs(distanceX) >= threshold && Math.abs(distanceY) <= restraint){ // 2nd condition for horizontal swipe met
	    		direction = (distanceX < 0)? 'left' : 'right'; // if dist traveled is negative, it indicates left swipe
	    		console.log("direction set", direction);	    		
	   		}
   		}

   		console.log("end touch", article, "you have just swiped", direction);    		
   		   		
   		// swiping distance is determined by changed touch X delta value
   		console.log("swiping distance X", distanceX, "swipingDistance Y", distanceY);

   		//console.log("touchmove fired", direction);
   		if(320-Math.floor(distanceX) > 320) {
	   		if(direction === "right") {   			
   				article.skiptrans.set([320-Math.floor(distanceX), (100 * article.index)+shiftDownValue, 0], {duration: 0});   			
	   		} else if (direction === "left") {   			   			
	   			// how much to transition depends on how far the swipe was
	   			//console.log("the amount to move", 320-Math.abs(Math.floor(distanceX)));
	   			article.skiptrans.set([320-Math.abs(Math.floor(distanceX)), (100 * article.index)+shiftDownValue, 0], {duration: 0})	   			
	   		} 
   		}
   	}

   	$scope.touchEnd = function(article, $event) {
   		var touchObj = $event.changedTouches[0];		

   		if(Math.abs(distanceX) >= 200) {
   			article.skiptrans.set([0, (100 * article.index)+shiftDownValue, 0], {duration: 0, curve: 'easeInOut'});			   		
   		} else {
   			article.skiptrans.set([320, (100 * article.index)+shiftDownValue, 0], {duration: 0, curve: 'easeInOut'});
   		}

   		distanceX = touchObj.pageX - startX,
		distanceY = touchObj.pageX - startY;

   		console.log(distanceX);
   		if(Math.abs(distanceX) === 0) {   			
   			openArticle(article.articleId);
   		}   		

   	};

   	_.debounce($scope.touchMove, 50, true);	
	
	$scope.gridLayoutOptions = {
		dimensions: [1,3]
	};

	setTimeout(function(){
		$scope.dashOpacity = {
			value: 1
		}
		$scope.page1Opacity = {   			
   			value: 0
		}
		$scope.page2Opacity = {   			
   			value: 1
		}
		$scope.page3Opacity = {   			
   			value: 0
		}
		//$scope.eventHandler.emit('slide');
	}, 2500);
	
	$scope.seqOptions = {
  		direction: 0, // vertical = 1 (default), horizontal = 0
	};

	$scope.seq = [{bgColor: "blue"}, {bgColor: "red"}];

	openArticle = function(id) {
		console.log("OPEN ARTICLE");
		colorArticle();		

		setTimeout(goToArticle, 600, id);
	};

	colorArticle = function() {
		console.log("just colored article");
	};

	goToArticle = function(articleId) {		
		//window.location = "http://localhost/f-a-iphone/app/#/article/1";
		
		$scope.articlePageTrans.set([0, 50, 0],{duration: 10, curve: 'easeInOut'});
		$scope.page2Opacity = { value: 0 };
		
	}; 	
 	
});
