var connection = require('./db/dbconnection');
var mysqltrigger = require('./db/mysqlcontroller');
const configJS = require('../../config.json')
const commonlib = require('../common/common.js');


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
		}else{
			var resultObj = {'data': result, 'status': '000', 'message': 'success'};
            callback(resultObj)
		}
	});
}

exports.selectPTTypeMembers = function (req, callback) {
	var resultdata = JSON.stringify({});
	var strval = []
    var table = configJS.isDev ? "dev_pt_notify" : "pt_notify"
	var strsql = 'SELECT members,pt_type FROM '+table+'	 WHERE pt_type LIKE "%'+req+'%" LIMIT 1';
	mysqltrigger.selectAllQuery(
        connection.lizbot_connect, 
        strsql, 
        strval, 
        '[select.js -> selectPTTypeMembers()]', 
    function (result) {
		if (result == 'error') {
			var resultObj = {'data': resultdata, 'status': 'error', 'message': 'Server Error'};
            console.log(resultObj + " ->selectPTTypeMembers")
		}else{
			if (result.length > 0) {
				resultdata =  result[0];
			}
			var resultObj = {'data': resultdata, 'status': '000', 'message': 'success'};
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
            console.log(resultObj + " ->selectPTList")
		}else{
			if (result.length > 0) {
				resultdata =  result[0].pt_data;
			}
			var resultObj = {'data': resultdata, 'status': '000', 'message': 'success'};
            callback(resultObj)
		}
	});
}

exports.selectWeekly = function (req, callback) {
	var resultdata = JSON.stringify({});
	var strval = [req]
    var table = "weekly_lz_list"
	
    var newDate = new Date();
    const sMonth = commonlib.padValue(newDate.getMonth() + 1);
    const sDay = commonlib.padValue(newDate.getDate());
    const sYear = newDate.getFullYear();
	
	// dd/mm/yyyy
	const currentDate = sDay + "/" + sMonth + "/" + sYear 
	var strsql = "SELECT stgweekly, lzweekly, nestweekly FROM "+table+" WHERE date='"+currentDate+"'";
	mysqltrigger.selectAllQuery(
        connection.lizbot_connect, 
        strsql, 
        strval, 
        '[select.js -> selectWeekly()]', 
    function (result) {
		if (result == 'error') {
			var resultObj = {'data': resultdata, 'status': 'error', 'message': 'Server Error'};
		}else{
			var resultObj = {'data': result, 'status': '000', 'message': 'success'};
            callback(resultObj)
		}
	});
}

exports.selectLZDungeon = function (req, callback) {
	var resultdata = JSON.stringify({});
	var strval = []
    var table = "dungeon_list"

	var dgQuery = "dungeon LIKE '%"+req[0]+"%'" + " OR " + "dungeon LIKE '%"+req[1]+"%'" + " OR " + "dungeon LIKE '%"+req[2]+"%'";
	var strsql = "SELECT portalname, dungeon, dropmaterial FROM "+table+" WHERE "+dgQuery
	
	mysqltrigger.selectAllQuery(
        connection.lizbot_connect, 
        strsql, 
        strval, 
        '[select.js -> selectLZDungeon()]', 
    function (result) {
		if (result == 'error') {
			var resultObj = {'data': resultdata, 'status': 'error', 'message': 'Server Error'};
		}else{
			var resultObj = {'data': result, 'status': '000', 'message': 'success'};
            callback(resultObj)
		}
	});
}


exports.selectNest = function (req, callback) {
	var resultdata = JSON.stringify({});
	var strval = []
    var table = "nest_list"

	var dgQuery = ""
	if (req.length > 0) {
		dgQuery = "nestname LIKE '%"+req[0]+"%'" + " OR " + "nestname LIKE '%"+req[1]+"%'"
	} else {
		dgQuery = "nestname = "+req
	}
	var strsql = "SELECT nestname, portalname, dropmaterial FROM "+table+" WHERE "+dgQuery
	
	mysqltrigger.selectAllQuery(
        connection.lizbot_connect, 
        strsql, 
        strval, 
        '[select.js -> selectNest()]', 
    function (result) {
		if (result == 'error') {
			var resultObj = {'data': resultdata, 'status': 'error', 'message': 'Server Error'};
		}else{
			var resultObj = {'data': result, 'status': '000', 'message': 'success'};
            callback(resultObj)
		}
	});
}