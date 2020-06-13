var globalSeconds = 0;

var keys = [];
window.addEventListener("keydown", function (e) {
	keys[e.keyCode] = true;
	if (keys[17] && keys[49]) { // Ctrl + 1
		exec(loadScript("a"),"a");
	}
	if (keys[17] && keys[50]) { // Ctrl + 2
		exec(loadScript("b"),"b");
	}
	if (keys[17] && keys[51]) { // Ctrl + 3
		exec(loadScript("a"),"a");
		exec(loadScript("b"),"b");
	}
});

window.addEventListener('keyup', function (e) {
	keys[e.keyCode] = false;
});

var loadScript = (target) => {
	var script = document.getElementById("script-" + target).value;
	//do checks
	var queue = [];
	script.split("\n").map(e => queue.push(e));
	return queue;
}

var exec = (queue,target) => {
	var wait = false;
	while(queue.length > 0 && !wait){
		var next = parse(queue.shift());
		switch(next['name']){
			case "load":
				load(next['arguments'].join(' '),target);
				break;
			case "play":
				play(target);
				addToPLaylist(target);
				break;
			case "pause":
				pause(target);
				break;
			case "fade":
				fade(next['arguments'][0],next['arguments'][1],target);
				break;
			case "wait":
				wait(next['arguments'][0],target);
				wait = true;
		}
	}
};

var fade = (time,targetValue,target) => {
	var current = document.getElementById("player-" + target).volume;
	var resolution = 100;
	var diff = targetValue - current;
	for(var i = 0; i < resolution; i++){
		var inc = diff / resolution;
		setTimeout(changeVolume(inc,target),(time/resolution) * i);
	}

}

var parse = (line) => {
	var tokens = line.split(' ');
	var instruction = [];
	instruction['name'] = tokens.shift();
	instruction['arguments'] = tokens;
	return instruction;
}

var load = (src, target) => {
	document.getElementById("player-" + target).src = "file://" + src;
	checkTrack(target);
	var fileName = src.substr(src.lastIndexOf("/") + 1);
	document.getElementById("title-" + target).innerHTML = "Title:" + fileName;
	document.getElementById("status-" + target).innerHTML = "Status: Loaded";
}

var play = (target) => {
	document.getElementById("player-" + target).play().then(() => {
		document.getElementById("status-" + target).innerHTML = "Status: Playing";
	}).catch(() => {
		document.getElementById("status-" + target).innerHTML = "Status: Unplayable";
	});
}

var pause = (target) => {
	document.getElementById("player-" + target).pause();
	document.getElementById("status-" + target).innerHTML = "Status: Paused";
}

var changeVolume = (ammount,target) => {
	return () => {
		document.getElementById("player-" + target).volume += ammount;
		document.getElementById("volume-" + target).innerHTML = "Volume: " + document.getElementById("player-" + target).volume.toFixed(2);
	}
}

var addToPLaylist = (target) => {
	var timestamp = calculateGlobalTime();
	var track = document.getElementById("player-" + target).src;
	var fileName = track.substr(track.lastIndexOf("/") + 1);
	document.getElementById("playlist").innerHTML += "<p>" + calculateTime(globalSeconds) + " - " + replaceSpecialChars(fileName) + "</p>";
}

var replaceSpecialChars = (text) => {
	var cleanText = text.replace(/%20/g," ");
	return cleanText;
}

var calculateGlobalTime = () => {
	if(globalSeconds == 0){
		startGlobalTime();
	}
	return calculateTime(globalSeconds);
}

var startGlobalTime = () => {
	setInterval(() =>  globalSeconds++,1000)
}

var calculateTime = (seconds) => {
	return new Date(seconds * 1000).toISOString().substr(11, 8)
}

var checkTrack = (target) => {
	document.getElementById("player-" + target).play().then(() => {
		document.getElementById("player-" + target).pause();
	}).catch(() => {
		document.getElementById("status-" + target).innerHTML = "Status: Error on load";
	});
};
