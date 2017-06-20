var should = require("should");
var State = require('./lib').default;

function checkSessionIdExists(next){
    return next(sessionStorage.checkExists('sessionId') ? 'true' : 'false');
}

function getUserInfo(next){
    var token = sessionStorage.get('sessionId');
    return proxy.getUserInfo(token).then(function(res){
        return next(res.code === 20000 ? 'true' : 'error', res.user || {});
    }, function(res){
        var status = res.response.status;
        sessionStorage.remove('sessionId');
        return next(status && status === 403 ? '403' : 'error');
    });
}

function getToken(next){
    return proxy.getToken().then(function(res){
        var token = res.token;
        if(!token){
            return next('error');
        }
        sessionStorage.add('sessionId', token);
        next('true');
    }, function(res){
        var status = res.response.status;
        return next(status && status === 403 ? '403' : 'error');
    });
}

function getLayout(next, user){
    return proxy.getUserLayout(user.serialNumber).then(function(res) {
    var app = widget.getCacheWidget('app');
    var resources = res.resources;
    if(resources != null) {
        stateIns.getAction('userAction')(user);
        stateIns.getAction('layoutAction')(resources);
    } else {
        app.changeToErrorPage();
    }
    }.bind(this), function(err) {
        var app = widget.getCacheWidget('app');
        app.changeToErrorPage();
    });
}

function redirect(){
    return proxy.sso();
}

function error(){
    var app = widget.getCacheWidget('app');
    app.changeToErrorPage();
}

function State(process, current){
    this.current = current;
    this.steps = {};
    this.process = JSON.parse(JSON.stringify(process));
}

/**
 * 定义流程 状态切换 只关注当前的步骤与下一步映射
 */
var process = {
    'checkSessionIdExists': {
        'true': 'getUserInfo',
        'false': 'getToken'
    },
    'getUserInfo': {
        'true': 'getLayout',
        '403': 'getToken',
        'error': 'error'
    },
    'getToken': {
        'true': 'getUserInfo',
        '403': 'redirect',
        'error': 'error'
    },
    'getLayout': {},
    'redirect': {}
};

/**
 * 实例化
 */
var loginState = new State(process, 'checkSessionIdExists');

/**
 * 注册响应函数
 */
loginState
.register('checkSessionIdExists', checkSessionIdExists)
.register('getToken', getToken)
.register('getUserInfo', getUserInfo)
.register('getLayout', getLayout)
.register('redirect', redirect)
.register('error', error);

/**
 * 启动
 */
// loginState.run();


describe("constructor", function() {
    
    it("loginState should be an instance of State", function() {
        loginState.should.be.an.instanceof(State);
    });

    it("loginState should have property current", function(){
        loginState.should.have.property("current");
    });
    it("loginState property current should be a string", function(){
        should(loginState.current).be.a.String();
    });

    it("loginState should have property steps", function(){
        loginState.should.have.property("steps");
    });
    it("loginState property steps should be a object", function(){
        should(loginState.steps).be.a.Object();
    });    

    it("loginState should have property process", function(){
        loginState.should.have.property("process");
    });
    it("loginState should have property process", function(){
        should(loginState.process).be.a.Object();
    });
});