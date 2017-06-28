/*
* @Author: Administrator
* @Date:   2017-06-24 13:52:46
* @Last Modified by:   Administrator
* @Last Modified time: 2017-06-27 10:06:03
*/

'use strict';
var conf = {
    serverHost : ''
};
var hogan = require('hogan.js');
var _mm  = {
	request : function(param){
		var _this = this;
        $.ajax({
            type        : param.method  || 'get',
            url         : param.url     || '',
            dataType    : param.type    || 'json',
            data        : param.data    || '',
            success     : function(res){
                // 请求成功
                if(0 === res.status){
                    typeof param.success === 'function' && param.success(res.data, res.msg);
                }
                // 没有登录状态，需要强制登录
                else if(10 === res.status){
                    _this.doLogin();
                }
                // 请求数据错误
                else if(1 === res.status){
                    typeof param.error === 'function' && param.error(res.msg);
                }
            },
            error       : function(err){
                typeof param.error === 'function' && param.error(err.statusText);
			}
		});
	},
    //获取服务器地址
    getServerUrl : function(path){
        return conf.serverHost + path;
    },
    getUrlParam  : function(name){
        var reg    = new RegExp('(^|&)'+ name +'=([^g]*)(&|$)');
        //search是什么
        var result = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    },
    renderHtml : function(htmlTemplate,data){
        var template = hogan.compile(htmlTemplate),
            result   = template.render(data);
        return result;

    },
    successTips : function(msg){
        alert(msg | '操作成功');
    },
    errorTips : function(msg){
        alert(msg | '哪里错误了？');
    },
    //字段的验证，支持非空、手机、邮箱的判断
    Validate : function(value,type){
        var value = $.trim(value);
        //非空验证
        if('require' === type){
            return !!value;
        }
        //手机号码验证
        if('phone' === type){
            return /^1\d{10}$/.test(value);
        }
        if('email' === type){
            return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
        }
    },
    goHome  : function(){
        window.location.href = "./index.html";
    },
	doLogin : function(){
        window.location.href = './user-login.html?redirect=' + encodeURIComponent(window.location.href);
    }
};
module.exports = _mm;