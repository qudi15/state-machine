'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 
 * 利用状态机解决复杂流程
 * 
 * 目的在于将步骤与每一步具体逻辑分层
 * 
 */

/**
 * 定义响应函数 响应函数处理具体逻辑并将结果用next函数传出 我直接从项目中把代码取出来 代码比较简单看意图就好
 * 注意next函数的使用就好
 */
var State = function () {
	function State(process, current) {
		_classCallCheck(this, State);

		this.steps = {};

		this.current = current;
		this.steps = {};
		this.process = JSON.parse(JSON.stringify(process));
	}

	_createClass(State, [{
		key: 'run',
		value: function run(args) {
			var steps = this.steps;
			var current = this.current;
			var func = steps[current];
			func(this.next.bind(this), args);
		}
	}, {
		key: 'register',
		value: function register(key, cb) {
			var steps = this.steps;
			steps[key] = cb;
			return this;
		}
	}, {
		key: 'next',
		value: function next(newsate, args) {
			var process = this.process;
			var current = this.current;
			var steps = this.steps;
			var nextstate = process[current][newsate];
			if (typeof steps[nextstate] == 'function') {
				this.current = nextstate;
				this.run(args);
			}
		}
	}]);

	return State;
}();

exports.default = State;