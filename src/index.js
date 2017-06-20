
export default class State {

	constructor (process, current){
		 this.current = current;
		 this.steps = {};
		 this.process = JSON.parse(JSON.stringify(process));
	}

	run (args){
		var steps = this.steps;
		var current = this.current;
		var func = steps[current];
		func(this.next.bind(this), args);
	 }

   register (key, cb){
		 var steps = this.steps;
		 steps[key] = cb;
		 return this;
	 }

   next (newsate, args){
		 var process = this.process;
		 var current = this.current;
		 var steps = this.steps;
		 var nextstate = process[current][newsate];
		 if(typeof steps[nextstate] == 'function'){
			 this.current = nextstate;
			 this.run(args);
		 }
	 }
}
