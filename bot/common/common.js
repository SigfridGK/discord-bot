//***************
// IMPORTS
//***************
const fs = require('node:fs');
const { console } = require('node:inspector');
const path = require('node:path');


//***********************
// MAIN FUNCTIONS
//***********************
exports.formatDate = function (dateVal) {
    var newDate = new Date(dateVal);
    var sMonth = padValue(newDate.getMonth() + 1);
    var sDay = padValue(newDate.getDate());
    var sYear = newDate.getFullYear();
    var sHour = newDate.getHours();
    var sMinute = padValue(newDate.getMinutes());
    var sAMPM = "AM";

    var iHourCheck = parseInt(sHour);

    if (iHourCheck > 12) {
        sAMPM = "PM";
        sHour = iHourCheck - 12;
    }
    else if (iHourCheck === 0) {
        sHour = "12";
    }

    sHour = padValue(sHour);

    return sMonth + "/" + sDay + "/" + sYear + " " + sHour + ":" + sMinute + " " + sAMPM;
}

function padValue(value) {
    return (value < 10) ? "0" + value : value;
}

exports.padValue = function(value) {
    return (value < 10) ? "0" + value : value;
}

exports.writeErrorLogV2 = function(filename, functionname, errormessage) {
    //generate error log filename
    var newDate = new Date();
    var efdir = "logs/";

    var sHour = newDate.getHours();
    var sAMPM = "AM";
    var iHourCheck = parseInt(sHour);

    if (iHourCheck > 12) {
        sAMPM = "PM";
        sHour = iHourCheck - 12;
    }
    else if(iHourCheck == 12){
        sAMPM = "PM";
    }
    else if (iHourCheck === 0) {
        sHour = "12";
    }
    var efname =padValue(newDate.getMonth() + 1).toString() + 
                padValue(newDate.getDate()).toString() + 
                newDate.getFullYear().toString() +
                "-"+ sHour +""+sAMPM+ ".txt";
 
    //for identification on param: errormessage
    var stringConstructor = "test".constructor;
    var arrayConstructor = [].constructor;
    var objectConstructor = {}.constructor;
 
    //error log object
    var logobj = {
        date: exports.formatDate(newDate),
        file: filename,
        data: errormessage.querydata.toString(),
        function: functionname
    };
 
    if(errormessage.request.constructor === objectConstructor || errormessage.request.constructor === arrayConstructor){
        //logobj.error_desc = JSON.stringify(errormessage,null,2);
        logobj.error_desc = errormessage.request;
    }else{
        logobj.error_desc = errormessage.request.toString();
    }
 
    fs.appendFileSync(efdir + efname, "\n" + JSON.stringify(logobj, null, 2));
};


exports.randomNumber = function (length) {
    return Math.floor(100000 + Math.random() * 900000).toString().substring(0, length);
};

exports.randomAlphNumber = function (length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
};
exports.dateCode = function () {
    var d = new Date();
    var caldate = parseInt(d.getFullYear()) - 2016;
    caldate = (caldate * 12) + parseInt(d.getMonth()) + 1;
    caldate = (caldate * 32) + parseInt(d.getDate());
    caldate = "0" + caldate;
    return caldate;
};

exports.getXMLTagValue = function (xstring, nametag) {
    var startpoint, endpoint, strlength;
    var result;

    //getting the starting point
    startpoint = parseInt(xstring.indexOf('<' + nametag + '>'));

    //getting the endpoint
    endpoint = parseInt(xstring.indexOf('</' + nametag + '>'));

    if (startpoint == -1 || endpoint == -1) {
        //return empty
        result = "NONE";
    } else {
        var starttaglen = nametag.length + 2;

        //calculating the number of strings to be extracted
        strlength = endpoint - (startpoint + starttaglen);
        //returning the extracted data
        result = xstring.substr((startpoint + starttaglen), strlength);
    }

    return result;

};

exports.getCurYear = function () {
    var date = new Date();
    var year = date.getFullYear();
    return year;
}

exports.getCurMonth = function () {
    var date = new Date();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    return month;
}

exports.generateRandomNumber = function(length) {
    var randomnumbertxn = Math.floor(100000 + Math.random() * 900000)
    randomnumbertxn = randomnumbertxn.toString().substring(0, length);
    return randomnumbertxn;
}

exports.checkIsPVEChannel = async function(channelID, client)  {
    client.channels.fetch(channelID).then(async channel => {
        console.log(channel)
        return channel.name
    });
}

exports.checkIsNewsChannel = function(channelID, client) {
    client.channels.fetch(channelID).then(async channel => {
        return channel.name == "news" 
    });
}

exports.commonInteractionReply = async function(interaction) {
    if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ 
            content: 'There was an error while executing this command!', 
            ephemeral: true 
        });

    } else {
        await interaction.reply({ 
            content: 'There was an error while executing this command!', 
            ephemeral: true 
        });
    }
}

exports.commonInitCommandsPath = function(client){
    const foldersPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(foldersPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}