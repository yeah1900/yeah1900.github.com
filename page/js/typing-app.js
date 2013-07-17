//DONE: determine char_upper based on font-size and width.
//DONE: when EOL, switch line
//DONE: speed realtime
//DONE: ESC to stop
//TODO: starting page, adv. statistics page
//TODO: pagination

var myapp = angular.module('myApp', []);

myapp.directive('onKeydown', function($parse) {
    return function(scope, elm, attrs) {
        //Evaluate the variable that was passed
        //In this case we're just passing a variable that points
        //to a function we'll call each keyup
        var keydownFn = $parse(attrs.onKeydown);
        elm.bind('keydown', function(evt) {
            keydownFn(scope, {$evt: evt});
        });
    };
}).directive('onKeyup', function($parse) {
    return function(scope, elm, attrs) {
        //Evaluate the variable that was passed
        //In this case we're just passing a variable that points
        //to a function we'll call each keyup
        var keyupFn = $parse(attrs.onKeyup);
        elm.bind('keyup', function(evt) {
            keyupFn(scope, {$evt: evt});
        });
    };
});

function typingCtrl($scope){

	function getMaxCharForLine(width){
		var div = document.createElement('div'),
			max;

		width = parseInt(width, 10);
		div.className = 'measurement';
		div.style.visibility = 'hidden';
		document.body.appendChild(div);
		div.innerHTML = 'a';

		max = parseInt(width / div.clientWidth, 10);
		document.body.removeChild(div);

		return max;
	}


	function formatNumber(num, len){
		var str = num + '', strlen = str.length;
		
		for ( var i = 0; i < len - strlen; i++){
			str = '0' + str;
		}
		
		return str;
	}
		
	var tickerId = null,
		startTicker = function(){
			tickerId = setInterval(function(){
					var elapsed = $scope.statistics.timeElapsed = $scope.statistics.timeElapsed + 1,
						hours = parseInt(elapsed / 3600, 10),
						minutes = parseInt((elapsed - hours * 3600) / 60, 10),
						seconds = parseInt(elapsed - hours * 3600 - minutes * 60, 10);
					$scope.statistics.timeElapsedStr = formatNumber(hours, 2) + ':' + formatNumber(minutes, 2) + ':' + formatNumber(seconds, 2);
					$scope.statistics.speed = $scope.statistics.typed / $scope.statistics.timeElapsed * 60;
					$scope.$apply();
				}, 1000);
		},
		stopTicker = function(){
			if (tickerId != null){
				clearInterval(tickerId);
				tickerId = null;
			}
		},
		initApp = function(){
			$scope.statistics = {
				timeElapsedStr: '00:00:00',
				timeElapsed: 0,
				typed: 0,
				correct: 0,
				correctPct: 0,
				speed: 0
			};
			
			var data = $scope.articles = [
					{"text": "Washington (CNN) President Barack Obama called on Sunday for calm reflection following the acquittal of George Zimmerman in the shooting death of Trayvon Martin.The president, in a written statement, acknowledged an emotionally charged climate but concluded that we are a nation of laws, and a jury has spoken.Obama called Martins death a tragedy for America.I know this case has elicited strong passions. And in the wake of the verdict, I know those passions may be running even higher, he said.I now ask every American to respect the call for calm reflection from two parents who lost their young son. And as we do, we should ask ourselves if were doing all we can to widen the circle of compassion and understanding in our own communities. Obama, race and the Zimmerman caseWe should ask ourselves if were doing all we can to stem the tide of gun violence that claims too many lives across this country on a daily basis, Obama said. Rallying for Martin in Sanford Verdict sparks social media avalanche Perry: Our justice system is color blindAnalysis: The race factor in George Zimmermans trialA Florida jury on Saturday night found Zimmerman, a neighborhood watch volunteer, not guilty of second-degree murder and manslaughter in a shooting that grew from a confrontation as Martin, 17, walked home from a convenience store in February 2012.The verdict closed a case in state criminal court that gained national attention and sparked public outcry, much of which focused on race. Reaction generated some protests nationally, including outside the White House.Zimmerman is the son of a Peruvian mother and a white American father and identifies as Hispanic. Martin was African-American.Obama said in closing his statement that Americans asking ourselves, as individuals and as a society, how we can prevent future tragedies like this is one way to honor Trayvon Martin.Groups disappointed with the jurys decision have asked the Obama administration to pursue a civil rights prosecution against Zimmerman, 29.The NAACP has called on the Justice Department to file related charges and has asked the public to sign a petition to support their cause.When you look at (Zimmermans) comments, when you look at his comments about young black men in that neighborhood, about how they felt specially targeted by him, there is reason to be concerned that race was a factor in why he targeted young Trayvon, NAACP president and CEO Benjamin Jealous said Sunday on CNNs State of the Union.What was the reaction around the countryObama did not cover that issue in his comments. But the Justice Department said in a statement on Sunday that a federal civil rights investigation continues and it will look at evidence and testimony from the just-concluded state trial as part of the probe.Experienced federal prosecutors will determine whether the evidence reveals a prosecutable violation of any of the limited federal criminal civil rights statutes within our jurisdiction, and whether federal prosecution is appropriate, the statement said.The government would need to establish that a hate crime was committed in order to bring charges, a legal threshold Holder has said previously would be challenging to meet.For a federal hate crime we have to prove the highest standard in the law, Holder said in April 2012. Something that was reckless, that was negligent does not meet that standard. We have to show that there was specific intent to do the crime with requisite state of mind.A petition asking for civil rights prosecution of Zimmerman on the White House We The People site - a page that lets citizens submit petitions to the White House - was started Sunday. So far, it has more than 4,000 signatures, a number far short of the 100,000 necessary to get a response from the White House.Zimmerman fears for life, could face new chargesObamas first comments on the Zimmerman trial came in March 2012, when the president said the fatal shooting of an unarmed African-American teen required national soul searching.The president also personalized the shooting in those remarks. He told reporters he thought about his own children when he thought about Martin.I think every parent in America should be able to understand why it is absolutely imperative that we investigate every aspect of this and that everybody pulls together federal, state and local to figure out exactly how this tragedy happened, Obama said at that time.Obama said the case struck home with him when asked about any racial components of the case.If I had a son, hed look like Trayvon, the president said then.Republicans at the time criticized Obama for personalizing the shooting and on Sunday, Rep. Steve King alleged the president and his administration had turned the case into a political issue rather than a legal matter.The evidence didnt support prosecution and the Justice Department engaged in this. The president engaged in this and turned it into a political issue that should have been handled exclusively with law and order, King, an outspoken Republican from Iowa, said on Fox News Sunday.Since Obamas first comments, the White House has kept its distance from the case."}
				],  
				text = $scope.text = data[0].text;
				len = text.length,
				lines = $scope.lines = [],
				i = 0, 
				CHAR_UPPER = getMaxCharForLine($('.container').css('width'));

			while (i < len){
				lines.push({text: text.substr(i, Math.min(len-i, CHAR_UPPER)), input: '', correct: 0});
				i += CHAR_UPPER;
			}
			
			startTicker();
			$scope.$apply();
			$('.target input')[0].focus();
		}

	
	$(document).ready(function(){
		//$.getJSON('articles.json', function(data){
			initApp();
		//});
	});

	$scope.validate = function(idx){
		var line = this.lines[idx],
			text = line.text,
			input = line.input,
			html = '', i = 0, match, token = '', correctCount = 0;

		while ( true ){
			if (text.charAt(i) != input.charAt(i)){
				if (match === true){
					html += '<span class="valid">' + token + '</span>';
					token = '';
				}
				match = false;
			}else {
				if (match === false){
					html += '<span class="invalid">' + token + '</span>';
					token = '';
				}
				match = true;
				
				correctCount++;
			}

			if (i < input.length){
				token += text.charAt(i);
				i++;
			}else {
				if (token){
					html += '<span class="' + (match ? 'valid':'invalid') + '">' + token + '</span>';
				}
				break;
			}
		}

		line.html = html;
		line.correct = correctCount;

		if (text.length == input.length){
			var inputs = $('.line .target input');
			inputs[Math.min(idx + 1, inputs.length)].focus();
		}
		
		this.statistics.typed = this.statistics.correct = 0;
		for (var i = 0; i < lines.length; i++){
			this.statistics.typed += lines[i].input.length;
			this.statistics.correct += lines[i].correct;
		}
		
		this.statistics.correctPct = (this.statistics.correct / this.statistics.typed * 100);
	}

	$scope.pause = function(){
		stopTicker();
		$('#myModal').modal({keyboard: false});
	};
	
	$scope.resume = function(){
		startTicker();
		$('.target input')[focusIdxBeforePause].focus();
	}
	
	var focusIdxBeforePause = 0;
	$scope.handleKeydown = function(event, idx){
		var event = event || window.event;
			allowed = false;
		switch (event.keyCode){
			case 8:	//backspace
			case 187:
			case 188:
			case 189:
			case 190:
			case 32: allowed = true;break;//space
			case 27: this.pause(); focusIdxBeforePause = idx; break;
			default:
				if (event.keyCode >= 65 && event.keyCode <= 90){
					allowed = true;
				}else if (event.keyCode >= 48 && event.keyCode <= 57){
					allowed = true;
				}
		}
		if (!allowed){
			event.preventDefault();
			event.returnValue = false;
		}
		return allowed;
	};

	$scope.handleKeyup = function(evt, idx){
		var line = this.lines[idx],
			text = line.text,
			input = line.input,
			inputs = $('.line .target input');

		if (text.length == input.length){
			inputs[Math.min(idx + 1, inputs.length)].focus();
		}else if (input.length == 0 && evt.keyCode == 8){
			if (idx > 0){
				inputs[idx - 1].focus();
			}
		}
	}
	
	modalSelected = 0;
	$scope.modalKeydown = function(evt){
		function execute(opt){
			$('#myModal').modal('hide');
			
			switch(opt){
				case 0: $scope.resume();break;
				case 1: initApp();break;
				//case 2: goback();break;
			}
		}
		
		var options = $('#myModal .option'), len = options.length;
		
		options.removeClass('selected');
		
		switch(evt.which){
			//down
			case 40: modalSelected = (modalSelected + len + 1) % len; break;
			//up
			case 38: modalSelected = (modalSelected + len - 1) % len; break;
			//enter
			case 13: execute(modalSelected); modalSelected = 0; break;
			//ESC
			case 27: execute(0); break;
		}
		
		options.eq(modalSelected).addClass('selected');
		
		evt.preventDefault();
		evt.returnValue = false;
		
		return false;
	}
	$scope.bodyKeyup = function(evt){
		console.log(evt);
	}
}