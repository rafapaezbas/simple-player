describe("Interpreter", function() {

	beforeEach(function() {
		interpreter.cleanRecord();
	});

	it("Should add 1 and 99",async function() {
		await interpreter.execute("(+ 1 99)");
		expect(interpreter.record[0]).toEqual("sum 100");
	});

	it("Should add 1 and 99 and 50",async function() {
		await interpreter.execute("(+ (+ 1 50) 99)");
		expect(interpreter.record[1]).toEqual("sum 51");
		expect(interpreter.record[2]).toEqual("sum 150");
	});

	it("Should add two operations",async function() {
		await interpreter.execute("(+ (+ 1 50) (+ 1 48))");
		expect(interpreter.record[2]).toEqual("sum 51");
		expect(interpreter.record[3]).toEqual("sum 49");
		expect(interpreter.record[4]).toEqual("sum 100");
	});

	it("Should declare variable and use value",async function() {
		await interpreter.execute("((let bar 2) (+ bar 48))");
		expect(interpreter.record[0]).toEqual("sum 50");
	});

	it("Should add two variables",async function() {
		await interpreter.execute("((let bar 2) (let foo 3) (+ bar foo))");
		expect(interpreter.record[0]).toEqual("sum 5");
	});

	it("Variable should be only local",async function() {
		await interpreter.execute("((let bar 2) (+ bar 1)) (+ bar 1)");
		expect(interpreter.record[0]).toEqual("sum 3");
		expect(interpreter.record[1]).toEqual("sum bar1");
	});

	it("Should increment variable value",async function() {
		await interpreter.execute("(let bar 2) (let bar (+ bar 1)) (+ bar 0)");
		expect(interpreter.record[1]).toEqual("sum 3");
	});

	it("Should increment variable value 3 times",async function() {
		await interpreter.execute("(let bar 0) (times 3 (let bar (+ bar 2))) (+ bar 6)");
		expect(interpreter.record[3]).toEqual("sum 12");
	});

	it("Should create list",async function() {
		await interpreter.execute("(let l (list 0 6 7 8)) (+ (nth 2 l) 5) ");
		expect(interpreter.record[0]).toEqual("sum 12");
	});

	it("Should execute if body",async function() {
		await interpreter.execute("(if (eq 0 0) (+ 1 1) (+ 2 2))");
		expect(interpreter.record[0]).toEqual("sum 2");
		expect(interpreter.record[1]).toEqual(undefined);
	});

	it("Should assign value",async function() {
		await interpreter.execute("(let bar 0) (if (eq 0 0) (let bar 1) (let bar 2)) (+ bar bar)");
		expect(interpreter.record[0]).toEqual("sum 2");
	});

	it("Should declare function and execute with one parameter",async function() {
		await interpreter.execute("(defun inc (val) (+ val 1)) (inc (5))");
		expect(interpreter.record[0]).toEqual("sum 6");
	});

	it("Should declare function and execute with two parameters",async function() {
		await interpreter.execute("(defun inc (val1 val2) (+ val1 val2)) (inc (5 8))");
		expect(interpreter.record[0]).toEqual("sum 13");
	});
});
