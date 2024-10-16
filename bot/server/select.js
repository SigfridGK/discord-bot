var connection = require('./db/dbconnection');
var mysqltrigger = require('./db/mysqlcontroller');
const configJS = require('../../config.json')


exports.selectPTType = function (req, callback) {
	var resultdata = JSON.stringify({});
	var strval = [req]
    var table = configJS.isDev ? "dev_pt_notify" : "pt_notify"
	var strsql = "SELECT pt_type, members, emoji_icon FROM "+table+" WHERE pt_type=?";
    if (req == "*") {
	    strsql = "SELECT pt_type, members, emoji_icon FROM "+table;
    }
	mysqltrigger.selectAllQuery(
        connection.lizbot_connect, 
        strsql, 
        strval, 
        '[select.js -> selectPTType()]', 
    function (result) {
		if (result == 'error') {
			var resultObj = {'data': resultdata, 'status': 'error', 'message': 'Server Error'};
            console.log(resultObj)
		}else{
			var resultObj = {'data': result, 'status': '000', 'message': 'success'};
            callback(resultObj)
		}
	});
}

exports.selectPTTypeMembers = function (req, callback) {
	var resultdata = JSON.stringify({});
	var strval = [req]
    var table = configJS.isDev ? "dev_pt_notify" : "pt_notify"
	var strsql = "SELECT members FROM "+table+" WHERE pt_type=?";
	mysqltrigger.selectAllQuery(
        connection.lizbot_connect, 
        strsql, 
        strval, 
        '[select.js -> selectPTTypeMembers()]', 
    function (result) {
		if (result == 'error') {
			var resultObj = {'data': resultdata, 'status': 'error', 'message': 'Server Error'};
            console.log(resultObj)
		}else{
			var resultObj = {'data': result[0].members, 'status': '000', 'message': 'success'};
            callback(resultObj)
		}
	});
}

exports.selectPTList = function (callback) {
	var resultdata = JSON.stringify({});
	var strval = []
    var table = configJS.isDev ? "dev_pt_list" : "pt_list"
	var strsql = "SELECT pt_data FROM "+table+" WHERE id=1";
	mysqltrigger.selectAllQuery(
        connection.lizbot_connect, 
        strsql, 
        strval, 
        '[select.js -> selectPTList()]', 
    function (result) {
		if (result == 'error') {
			var resultObj = {'data': resultdata, 'status': 'error', 'message': 'Server Error'};
            console.log(resultObj)
		}else{
			var resultObj = {'data': result[0].pt_data, 'status': '000', 'message': 'success'};
            callback(resultObj)
		}
	});
}
