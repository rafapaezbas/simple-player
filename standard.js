standard = {

	"+" : async function(input,context){
		var result =  await interpreter.eval(input[1],context) + await interpreter.eval(input[2],context);
		test("sum " + result);
		return result;
	},

	"eq" : async function(input,context){
		var result =  await interpreter.eval(input[1],context) == await interpreter.eval(input[2],context);
		return result;
	},

	"print" : async function(input,context){
		state.console = await interpreter.eval(input[1],context);
		state.notify();
		return input;
	},

	
}
