var connection = require('./db/dbconnection');
var mysqltrigger = require('./db/mysqlcontroller');
const configJS = require('../../config.json')

exports.updatePTType = function (req, type, callback) {
	var resultdata = JSON.stringify({});
	var strval = [type]
    var table = configJS.isDev ? "dev_pt_notify" : "pt_notify"
	var strsql = "UPDATE "+table+" SET members="+req+" WHERE pt_type=?";
	mysqltrigger.updateQuery(
        connection.lizbot_connect, 
        strsql, 
        strval, 
        '[update.js -> updatePTType()]', 
    function (result) {
		if (result == 'error') {
			var resultObj = {'data': resultdata, 'status': 'error', 'message': 'Server Error'};
            console.log(resultObj + " ->updatePTType")
		}else{
			var resultObj = {'data': resultdata, 'status': '000', 'message': 'success'};
            callback(resultObj)
		}
	});
}

exports.updatePTList = function (req) {
	var resultdata = JSON.stringify({});
	var strval = [JSON.stringify(req)]
    var table = configJS.isDev ? "dev_pt_list" : "pt_list"
	var strsql = "UPDATE "+table+" SET pt_data=? WHERE id=1";
	mysqltrigger.updateQuery(
        connection.lizbot_connect, 
        strsql, 
        strval, 
        '[update.js -> updatePTList()]', 
    function (result) {
		if (result == 'error') {
			var resultObj = {'data': resultdata, 'status': 'error', 'message': 'Server Error'};
            console.log(resultObj + " ->updatePTList")
		}else{
			var resultObj = {'data': true, 'status': '000', 'message': 'success'};
            console.log(resultObj + " ->updatePTList")
		}
	});
}
