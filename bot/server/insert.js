var connection = require('./db/dbconnection');
var mysqltrigger = require('./db/mysqlcontroller');
const configJS = require('../../config.json')

exports.insertPTList = function (req) {
	var resultdata = JSON.stringify({});
	var strval = ["NOW()",req]
    var table = configJS.isDev ? "dev_pt_list" : "pt_list"
	var strsql = "INSERT INTO "+table+"(pt_name, pt_data) VALUES (?,?)";
	mysqltrigger.insertQuery(
        connection.lizbot_connect, 
        strsql, 
        strval, 
        '[insert.js -> insertPTList()]', 
    function (result) {
		if (result == 'error') {
			var resultObj = {'data': resultdata, 'status': 'error', 'message': 'Server Error'};
            console.log(resultObj)
		}else{
			var resultObj = {'data': true, 'status': '000', 'message': 'success'};
			console.log(resultObj)
		}
	});
}