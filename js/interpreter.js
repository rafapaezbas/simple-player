interpreter = {
	tokenCount : -1,
	tokenize : function (program) {
		var tokens = [];
		for (var i = 0; i < program.length; i++) {
			if (program.charAt(i) == ' ') {
				//Do nothing
			}
			else if (program.charAt(i) == '(' || program.charAt(i) == ')') {
				var token = program.charAt(i);
				tokens.push(token);
			}
			else if (program.charAt(i) == '"') {
				var start = i + 1;
				var tokenLength = 1;
				while(true){
					var current = program.charAt(i + tokenLength);
					if(current == '"'){
						var token = program.substring(start, start + tokenLength - 1);
						tokens.push(token);
						i += tokenLength;
						break;
					}else{
						tokenLength++;
					}
				}
			}else{
				var start = i;
				var tokenLength = 1;
				while(true){
					var current = program.charAt(i + tokenLength);
					if(current == '(' || current == ')' || current == ' '){
						var token = program.substring(start, start + tokenLength);
						if(!isNaN(parseFloat(token))){
							token = parseFloat(token);
						}
						tokens.push(token);
						i += tokenLength - 1;
						break;
					}else{
						tokenLength++;
					}
				}
			}
		}
		console.log(tokens);
		return tokens;
	},

	parse: function (tokens, parentNode) {
		while (true) {
			this.tokenCount++;
			if (this.tokenCount >= tokens.length) {
				break;
			}
			var token = tokens[this.tokenCount];
			if (token == '(') {
				parentNode.push([]);
				childNode = parentNode[parentNode.length - 1];
				this.parse(tokens, childNode);
			}
			else if (token == ')') {
				return;
			}
			else {
				parentNode.push(token);
			}

		}
		console.log(parentNode);
		return parentNode;
	},

	execute: async function (program, target) {
		program = program.replace('\n','');
		this.reset();
		var node = [];
		var parseTree = this.parse(this.tokenize(program), node);
		globalContext.scope = {...standard,...sqen}; //Init global context,concat the two libraries
		globalContext.parentContext = undefined;
		globalContext.target = target;
		result = await this.eval(parseTree,globalContext);
		console.log(result);
	},

	eval : async function (input, context){
		if(input instanceof Array){
			var newContext = {};
			//Initialization of new context
			newContext.get = globalContext.get;
			newContext.set = globalContext.set;
			newContext.scope = {...context.scope};
			newContext.parentContext = context;
		    	newContext.contextId = context.contextId + 1;	
			for (var i = 0; i < input.length; i++) {
				// Recursion, eval nested list
				if (input[i] instanceof Array) {
					result = await this.eval(input[i], newContext);
				}
				// Control flow, eval according to keyword and stop evaluating the list
				if (input[i] in keywords) {
					return await keywords[input[i]](input, context);
				}
			}
			//declared functions execution
			if(context.get(input[0]) instanceof Object && context.get(input[0])['fun'] != undefined){
				//Include params in context with their values
				context.get(input[0])['params'].map((p,i) => newContext.set(p,input[1][i]));
				return this.eval(context.get(input[0])['fun'],newContext);
			}
			//function execution (only library functions)
			if (context.get(input[0]) != undefined && !(input[0] instanceof Array)) { //See https://stackoverflow.com/questions/62501789/javascript-index-of-array-is-array?noredirect=1#comment110533209_62501789
				return await context.get(input[0])(input, context);
			}
		}
		// Variables substitution
		if (context.get(input) != undefined && !(context.get(input) instanceof Function)) { //check if input[i] is defined as variable
			return context.get(input);
		}
		return input;
	},

	reset: function () {
		this.tokenCount = -1;
	},

	//Unit tests
	record :[],
	cleanRecord : function(){
		this.record = [];
	}
}

keywords = {

	'if': async function (input, context) {
		if (await interpreter.eval(input[1], context)) {
			return await interpreter.eval(input[2], context);
		} else {
			return await interpreter.eval(input[3], context);
		}
	},

	'let': async function (input, context) {
		var value = await interpreter.eval(input[2], context);
		var name = input[1];
		context.set(name, value);
		return input;
	},

	'times': async function (input, context) {
		for (var i = 0; i < input[1]; i++) {
			await interpreter.eval(input[2], context);
		}
		return input;
	},

	'list': async function (input, context) {
		var list = [];
		for(var i = 1; i < input.length; i++){
			list.push(await interpreter.eval(input[i], context));
		}
		return list;
	},

	'nth': async function (input, context) {
		var list = await interpreter.eval(input[2], context);
		var index = await interpreter.eval(input[1], context);
		return await interpreter.eval(list[index], context);
	},

	'length': async function (input, context) {
		var list = await interpreter.eval(input[1], context);
		return await list.length;
	},

	'defun': async function(input,context){
		var functionName = input[1];
		var functionParams = input[2];
		var functionBody = input[3];
		context.set(input[1],{params : input[2],fun : input[3]});
		return input;
	},

	'include': async function(input,context){
		document.getElementById('include').click();
		//Disable ctrl key because when dialog opens key is not set to false on keyup
		ctrlKeyUp();
		return input;
	},

	'print': async function(input,context){
		var arg = await interpreter.eval(input[1], context);
		console.log(arg);
		return input;
	},

}

function sleep(seconds) {
	return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

globalContext = {
	scope : {},
	get: function(name){
		if(!name in this.scope){
			if(this.parentContext != undefined){
				return this.parentContext.get(name);
			}else{
				return undefined;
			}
		}else{
			return this.scope[name];
		}
	},
	set: function (name, value) {
		this.scope[name] = value;
		if (this.parentContext != undefined && name in this.parentContext.scope) {
			this.parentContext.set(name, value);
		}
	},
	contextId: 0,
}

function ctrlKeyUp() {
	keys[17] = false;
}

function test(record){
		interpreter.record.push(record);
}

