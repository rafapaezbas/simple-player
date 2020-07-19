checker =  {
	errorCheck : function (program) {
		var result;
		var last = program.length - 1;
		if(program[0] != '(' || program[last] != ')'){
			result = createResult(true, createError(0, "Program expected to start with '(' and finish with ')'"));
		}else{
			var i = 0;
			var stack = 0;
			while (i <= last){
				if(program[i] == '('){
					stack++;
				}
				if(program[i] == ')'){
					stack--;
				}
				result = checkStack(i,stack,last);
				if(result.failed){
					break;
				}
				i++;
			}
		}
		return result;
	}

};


var checkStack = (pos, stack, programLength) => {
	if(stack == -1 || (pos == programLength && stack != 0)){
		return createResult(true, createError(pos,"Unexpected char at " + pos));
	} else {
		return createResult(false, undefined);
	}
}

var createResult = (failed, error) => {
	return { failed : failed, error : error };
}

var createError = (pos, message) => {
	return { pos : pos, message : message };
};
