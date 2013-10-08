//TODO: user can add one city to watch
//TODO: get timezone data(time offset) through API
//--TODO: consider daylight save
//[DONE]TODO: apply current time
//TODO: mouse interaction
//TODO: display time text for: each city, mouse hover time
//TODO: update current time

(function(){
	var LENGTH = 1440,
		LEFT = 200,
		LINE_HEIGHT = 120;


	var locations = [
		{ city: 'Suzhou', timezone: 8},
		{ city: 'Copenhagen', timezone: 2 },
		{ city: 'San Francisco', timezone: -7}
	];

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

			ctx.moveTo(xArr[0], yArr[0]);

			for (var i = 1; i < xArr.length; i++){
				ctx.lineTo(xArr[i], yArr[i]);
			}

			//TODO: make line thinner
			ctx.stroke();
			ctx.closePath();
		}
	}

	function drawTimeline(location, x, y) {
		var timeDiff = location.timezone - currentLocation.timezone,
			date = new Date; 

		date.setHours(date.getHours() + timeDiff);

		ctx.fillText(location.city, x - 200, y - 20);
		ctx.fillText(date.toLocaleTimeString(), x - 200, y + 20);

		drawPoints(timeDiff, x, y);
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
				if (localTime <= availEnd && localTime >= availStart) {
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
		util.drawLine([x, x], [y, y + LINE_HEIGHT * 4])
		ctx.restore();

		ctx.fillText('now', x - 10, LINE_HEIGHT * 4 + 20);
	}

	ctx.font = '1.2em monaco'
	drawCurrentTime();
	for (var i = 1; i <= locations.length; i++){
		drawTimeline(locations[i - 1], LEFT, i * LINE_HEIGHT);
	}
})();