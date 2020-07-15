var globalSeconds = 0;
var include = "";

var keys = [];
window.addEventListener("keydown", function (e) {
	keys[e.keyCode] = true;
	if (keys[17] && keys[49]) { // Ctrl + 1
		interpreter.execute(loadScript("a"),"a");
	}
	if (keys[17] && keys[50]) { // Ctrl + 2
		interpreter.execute(loadScript("b"),"b");
	}
	if (keys[17] && keys[51]) { // Ctrl + 3
		interpreter.execute(loadScript("a"),"a");
		interpreter.execute(loadScript("b"),"b");
	}
});

window.addEventListener('keyup', function (e) {
	keys[e.keyCode] = false;
});

document.getElementById('include').addEventListener('change', function() {
	var fr=new FileReader();
	fr.onload=function(){
		include = fr.result;
	}
	fr.readAsText(this.files[0]);
})

var loadScript = (target) => {
	return include + document.getElementById("script-" + target).value;
}


