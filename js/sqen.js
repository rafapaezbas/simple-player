sqen = {

	"load" : async function (input,context){
		var song = await interpreter.eval(input[1],context);
		var loadCommand = new LoadCommand(song);
		await loadCommand.execute();
		return input;
	},

	"play" : async function (input,context){
		var playCommand = new PlayCommand();
		await playCommand.execute();
		return input;
	},

	"pause" : async function (input, context){
		var pauseCommand = new PauseCommand();
		await pauseCommand.execute();
		return input;
	},

	"fade" : async function (input, context){
		var time = await interpreter.eval(input[1],context);
		var value = await interpreter.eval(input[2],context);
		var fadeCommand = new FadeCommand(time, value);
		fadeCommand.execute();
		return input;
	},

	"duration" : async function (input,context){
		var player = await interpreter.eval(input[1],context);
		var duration = player.duration;
		return duration;
	}

}
