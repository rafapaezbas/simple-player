function PlayCommand(){
	this.execute = async function(){
		await play(globalContext.target);
		addToPLaylist(globalContext.target);
	}
}

function PauseCommand(target){
	this.execute = async function(){
		await pause(globalContext.target);
	}
}


function LoadCommand(src){
	this.src = src;
	this.execute = async function(){
		await load(src,globalContext.target);
	}
}

function FadeCommand(time, targetValue){
	this.execute = async function(){
		var targetPlayer = globalContext.target;
		var currentValue = document.getElementById("player-" + targetPlayer).volume;
		fade(time, currentValue, targetValue, changeVolume, targetPlayer);
	}
}

function FadePitchCommand(time, targetValue){
	this.execute = async function(){
		var targetPlayer = globalContext.target;
		var currentValue = document.getElementById("player-" + targetPlayer).playbackRate;
		fade(time, currentValue, targetValue, changePitch, targetPlayer);
	}
}


var fade = (time, currentValue,targetValue, callback, targetPlayer) => {
	var resolution = 100;
	var diff = targetValue - currentValue;
	for(var i = 0; i < resolution; i++){
		var inc = diff / resolution;
		setTimeout(callback(inc,targetPlayer),(time/resolution) * i);
	}

}

var load = async (src, target) => {
	var fileName = src.substr(src.lastIndexOf("/") + 1);
	document.getElementById("player-" + target).src = "file://" + src;
	document.getElementById("title-" + target).innerHTML = "Title:" + fileName;
	document.getElementById("status-" + target).innerHTML = "Status: Loaded";
	await play(target).catch((e) => updateInfoOnError(target));
	pause(target);
}

var play = (target) => {
	return document.getElementById("player-" + target).play();
}

var pause = (target) => {
	return document.getElementById("player-" + target).pause();
}

var wait = (millis,target,queue) => {
	setTimeout(() => exec(queue,target),millis);
}

var changeVolume = (ammount,target) => {
	return () => {
		document.getElementById("player-" + target).volume += ammount;
		document.getElementById("volume-" + target).innerHTML = "Volume: " + document.getElementById("player-" + target).volume.toFixed(2);
	}
}

var changePitch = (ammount,target) => {
	return () => {
		document.getElementById("player-" + target).playbackRate += ammount;
		document.getElementById("pitch-" + target).innerHTML = "Pitch: " + document.getElementById("player-" + target).playbackRate.toFixed(2);
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

var updateInfoOnError = (target) => {
	document.getElementById("status-" + target).innerHTML = "Status: Error on load";
}
