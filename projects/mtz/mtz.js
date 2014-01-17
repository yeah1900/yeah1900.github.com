//TODO: user can add one city to watch
//TODO: get timezone data(time offset) through API
//--TODO: consider daylight save
//[DONE]TODO: apply current time
//TODO: mouse interaction
//TODO: display time text for: each city, mouse hover time
//TODO: update current time

(function(){
	var LENGTH = 24*60,
		LEFT = 250,
		LINE_HEIGHT = 120;

	var daylightSavingStatus = 'on';

	var locationData = {'on': [
		{ city: '苏州', timezone: 8},
		{ city: '哥本哈根', timezone: 2 },
		{ city: '旧金山', timezone: -7}
	], 'off': [
		{ city: '苏州', timezone: 8},
		{ city: '哥本哈根', timezone: 1 },
		{ city: '旧金山', timezone: -8}
	]};

	var locations = locationData[daylightSavingStatus];

	var availStart = 7, availEnd = 23;



	var applyCurrent,
		timezone = new Date(1990, 6, 1).getTimezoneOffset() / 60 * -1, // Use standard timezone offset (avoid daylight saving issue)
		currentLocation = locations[0];

	for (var i = 0; i < locations.length; i++){
		if (locations[i].timezone == timezone){
			currentLocation = locations[i];
			applyCurrent = true;
			break;
		}
	}

	var canvas = document.getElementById('myCanvas'),
		ctx = canvas.getContext('2d');

	var util = {
		drawLine: function(xArr, yArr){
			if (!xArr || !yArr || xArr.length < 2 || yArr.length < 2 || xArr.length != yArr.length){
				return;
			}


			ctx.beginPath();
			ctx.lineWidth = 5;
			ctx.moveTo(xArr[0], yArr[0]);

			for (var i = 1; i < xArr.length; i++){
				ctx.lineTo(xArr[i], yArr[i]);
			}

			//TODO: make line thinner
			ctx.stroke();
			ctx.closePath();
		}
	}

	document.getElementById('dls').onclick = function(){
		daylightSavingStatus = daylightSavingStatus == 'on' ? 'off' : 'on';

		locations = locationData[daylightSavingStatus];

		this.innerHTML = daylightSavingStatus;

		//ctx.clearRect(0, 0, canvas.width, canvas.height);
		//drawAll();
	}

	function drawTimeline(location, x, y) {
		var timeDiff = location.timezone - currentLocation.timezone,
			date = new Date; 

		date.setHours(date.getHours() + timeDiff);

		ctx.fillText(location.city + '(GMT' 
								   + (location.timezone == 0 ? '' : 
								   		(location.timezone > 0 ? ('+' + location.timezone) : location.timezone ) 
								   	 ) + ')', x - LEFT, y - 20);
		ctx.fillText(formatNumber(date.getHours(), 2) + ':' + formatNumber(date.getMinutes(), 2) + ':' + formatNumber(date.getSeconds(), 2), x - LEFT, y + 20);

		drawPoints(timeDiff, x, y);
	}

	function formatNumber(number, digit){
		if (digit > 0) {
			var add = Math.pow(10, digit);

			if (number < add){
				var str = number + add + '';
				return str.substring(str.length - digit , str.length)
			}
		}

		return number + '';
	}

	function drawPoints(timeOffset, x, y){
		var offsetX = LENGTH / 24,
			offsetY = 10,
			lx, tx, localTime;

		for (var i = 0; i <= 24; i++) {
			lx = x + offsetX * i;
			
			//TODO: make line thinner
			util.drawLine([lx, lx], [y, y - offsetY]);

			localTime = (i + timeOffset + 24) % 24;

			if (i < 24){
				ctx.save();
				if (localTime < availEnd && localTime >= availStart) {
					ctx.strokeStyle="#0000FF";
				} else{
					ctx.strokeStyle="#AAAAAA";
				}
				util.drawLine([lx, lx + offsetX], [y, y]);
				ctx.restore();
			}
			
			tx = lx - 6;
			ty = y - 14;
			//TODO: let text center align
			ctx.fillText(localTime, tx, ty);
		}
	}

	function drawCurrentTime(){
		var currentTime = new Date;

		var x = LEFT + (currentTime.getHours() + currentTime.getMinutes() / 60) / 24 * LENGTH;
		var y = 0;

		ctx.save();
		ctx.strokeStyle = '#CCC';
		util.drawLine([x, x], [y, y + LINE_HEIGHT * (locationData.on.length + 1)])
		ctx.restore();

		ctx.fillText('当前时间', x - 40, LINE_HEIGHT * (locationData.on.length + 1) + 30);
	}

	function drawAll(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.font = '1.5em monaco'
		drawCurrentTime();
		for (var i = 1; i <= locations.length; i++){
			drawTimeline(locations[i - 1], LEFT, i * LINE_HEIGHT);
		}
	}

	document.getElementById('confirm').onclick = function(){
		var start = document.getElementsByName('start')[0].value || availStart,
			end = document.getElementsByName('end')[0].value || availEnd;

		availEnd = parseInt(end, 10);
		availStart = parseInt(start, 10);

		//ctx.clearRect(0, 0, canvas.width, canvas.height);
		//drawAll();
	}

	var selectbox = document.getElementById('timezones');
	for (var i = -12; i <= 12; i++){
		var option = document.createElement('option');
		option.text = 'GMT' + (i < 0 ? i : (i == 0 ? '' : '+' + i));
		option.value = i;
		selectbox.add(option);
	}

	document.getElementById('addTimezone').onclick = function(){
		var city = document.getElementById('city').value;
		var timezone = document.getElementById('timezones').value;
		var hasDST = document.getElementById('hasDST').checked;

		locationData['on'].push({
									city: city,
									timezone: parseInt(timezone, 10) + ( hasDST ? (daylightSavingStatus === 'on' ? 0: 1) : 0)
								});
		locationData['off'].push({city: city, timezone: parseInt(timezone,10) + (hasDST ? (daylightSavingStatus === 'on' ? -1: 0) : 0)});
	}

	drawAll();
	setInterval(function(){drawAll();}, 1000);
})();