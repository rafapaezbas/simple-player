standard = {

	"+" : async function(input,context){
		var result =  await interpreter.eval(input[1],context) + await interpreter.eval(input[2],context);
		test("sum " + result);
		return result;
	},

	"-" : async function(input,context){
		var result =  await interpreter.eval(input[1],context) - await interpreter.eval(input[2],context);
		test("subs " + result);
		return result;
	},

	"*" : async function(input,context){
		var result =  await interpreter.eval(input[1],context) * await interpreter.eval(input[2],context);
		test("mult " + result);
		return result;
	},

	"/" : async function(input,context){
		var result =  await interpreter.eval(input[1],context) / await interpreter.eval(input[2],context);
		test("div " + result);
		return result;
	},

	"eq" : async function(input,context){
		var result =  await interpreter.eval(input[1],context) == await interpreter.eval(input[2],context);
		return result;
	},
	
	"random": async function(input, context){
		var result =  Math.floor(Math.random() * await interpreter.eval(input[1],context));
		return result;
	}

}
