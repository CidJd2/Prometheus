var fs = require('fs');
var jsdom = require('jsdom');
const Discord = require('discord.js');
const client = new Discord.Client();

var channel = client.channels.get("885923764657881110");

var command = "!mvp";

var endMessage = "";

client.on('ready', () => {
  console.log('I am ready!');
});

var obj = JSON.parse(fs.readFileSync('./items.json', 'utf8'));
var mon = JSON.parse(fs.readFileSync('./monsters.json', 'utf8'));

function topmam(hours) {
	var time = '';
	if(hours>11) {
		if(hours > 12) {
			time = hours-12;
		} else {
			time = hours;
		}
		return time+'am';
	} else {
		return hours+'am';
	}
}

function turntotime(text) {
	n = text.length;
	var temp_text = text;
	var temp_array = [];
	temp_text = temp_text.replace('pm','');
	temp_text = temp_text.replace('am','');
	if(temp_text.indexOf(':') > -1) {
		temp_array = temp_text.split(':');
		return temp_array[0];
	}
	if(temp_text.indexOf('h') > -1) {
		temp_array = temp_text.split('h');
		return temp_array[0];
	}
	return temp_text;
}

function removeh(hours) {
	temp_time = [];
	if(hours.indexOf('h') > -1) {
		temp_time = hours.split('h');
		return temp_time[0];
	}
	if(hours.indexOf('hours') > -1) {
		temp_time = hours.split('hours');
		return temp_time[0];
	}
	if(hours.indexOf('hour') > -1) {
		temp_time = hours.split('hour');
		return temp_time[0];
	}
	return hours;
}

function changetime(diff,current) {
	diff_loc = parseInt(diff);
	res = current.slice(0);
	hours = diff_loc+parseInt(res[3]);
	if(hours>23 || hours<0) {
		hours = ((hours%24)+24)%24;
	}
	res[3] = topmam(hours);
	return res;
}

function searchID(element, table) {
	for(i=0; i < table.length; i++) {
		if(table[i].name.toLowerCase() === element.toLowerCase()) {
			return table[i].value;
		}
	}
	return "";
}

function loopMessage(message, cont, first, second, type, list) {
	var originalMes = cont;
	var mes = originalMes;
	var dbHTML;
	if(mes.indexOf('<@') == -1 && mes.indexOf('<:') == -1 && mes.indexOf('<#') == -1) {
		while(mes.includes(first) && mes.includes(second)) {
			var i = mes.indexOf(first);
			var j = mes.indexOf(second);
			var res = "";
			var dbType;
			var resURL = "";
			var resDisplay = "";

			//the condition requires at least one character 
			if(i<j-1) {
				//check later if there's another '<'
				var item = mes.substring(i+1, j);

				if(item.length > 1) {
					res = searchID(item, list);
				}

				switch(type) {
					case 1:
						dbType = "item";
						break;
					case 2:
						dbType = "monster";
						break;
					default:
						dbType = "item";
				}
				
				if(res.length > 0) {
					resURL = "http://db.irowiki.org/restart/" + dbType + "-info/" + res + "/";
					resDisplay += resURL + "\n";
					jsdom.env(
						resURL,
						["http://code.jquery.com/jquery.js"],
						function (err, window) {
							if(type == 1) {
								var selected = window.$('.bgLtTable:eq(1) tbody tr td:eq(1)').text();
								resDisplay += "**```\t";
								resDisplay += window.$('table.bgMdTitle tbody tr td:eq(1)').text();
								resDisplay += "```**";
								resDisplay += "```";
								resDisplay += window.$('table.bgLtTable:eq(0) tbody tr td').text();
								resDisplay += "```";
								resDisplay += "Type :\t\t";
								resDisplay += window.$('table.bgLtTable:eq(1) tbody tr td:eq(1)').text();
								resDisplay += "\nSubtype :  ";
								resDisplay += window.$('table.bgLtTable:eq(1) tbody tr:eq(1) td:eq(1)').text();
								resDisplay += "\nWeight :\t";
								resDisplay += window.$('table.bgLtTable:eq(1) tbody tr:eq(2) td:eq(1)').text();
								message.reply(resDisplay);
							} else if(type == 2) {
								resDisplay += "**```\t";
								resDisplay += window.$('table.bgMdTitle tbody tr td').text();
								resDisplay += "```**";
								resDisplay += "```";
								resDisplay += "Size : ";
								resDisplay += window.$('table.bgLtTable:eq(1) tbody tr td:eq(0)').text();
								resDisplay += " | ";
								resDisplay += "Race : ";
								resDisplay += window.$('table.bgLtTable:eq(1) tbody tr td:eq(1)').text();
								resDisplay += " | ";
								resDisplay += "Element : ";
								resDisplay += window.$('table.bgLtTable:eq(1) tbody tr td:eq(2)').text();
								resDisplay += "```";
								message.reply(resDisplay);
							}
						}
					);
				}
				else if(item.length < 30 && item.length > 1) {
					resURL = "http://db.irowiki.org/restart/search/?quick=" + item.replace(" ","%20").replace(" ","%20").replace(" ","%20").replace(" ","%20") + "&type=" + type;
					resDisplay += resURL + "\n";
					message.reply(resDisplay);
				}
			}
			if(j+1 >= mes.length) {
				mes = "";
			} else {
				mes = mes.substring(j+1);
			}
		}
	}
}

client.on('message', message => {
	if(message.content.toLowerCase().startsWith(command)) {
		var cmdArray = message.content.toLowerCase().split(" ");
		if(cmdArray.length >= 3) {
			var timer = cmdArray[1];
			let restOfMessage = cmdArray[2];
			for(var i = 3; i < cmdArray.length; i++) {
				restOfMessage += " " + cmdArray[i];
			}
			message.channel.send("!countdown " + timer + "mins");
		}
	}
	/*if(message.content.toLowerCase().startsWith(command)) {
		var getURL = "https://cidsupplies.000webhostapp.com/?gr=0";
		var addURL = "https://cidsupplies.000webhostapp.com/?gr=1";
		var updURL = "https://cidsupplies.000webhostapp.com/?gr=2";

		var resDisplay = "";

		var allItems = {
			emptybottle: 0, 
			fabric: 1,
			immortal: 2, 
			alcohol: 3, 
			stem: 4, 
			spore: 5, 
			zenorc: 6, 
			mermaid: 7, 
			grenade: 8, 
			acid: 9, 
			coat: 10, 
			slims: 11, 
			starsand: 12
		};

		var cmdArray = message.content.toLowerCase().split(" ");
		switch(cmdArray[1]) {
			case "hi":
				resDisplay += "\n``` Hi! type !pro commands and you'll see what I can do for you\n```";
				message.reply(resDisplay);
				break;
			case "commands":
				resDisplay += "\n``` Get Monster info from the wiki db\n";
				resDisplay += "!pro mob monster-name\n";
				resDisplay += "```";
				resDisplay += "\n``` Get Item info from the wiki db\n";
				resDisplay += "!pro item item-name\n";
				resDisplay += "```";
				message.reply(resDisplay);
				break;
			case "stock":
				jsdom.env(
					getURL,
					["http://code.jquery.com/jquery.js"],
					function (err, window) {
						var eb = window.$('div#bombs span:eq(0)').text() + "\n";
						var fa = window.$('div#bombs span:eq(1)').text() + "\n";
						var ih = window.$('div#bombs span:eq(2)').text() + "\n";
						var al = window.$('div#bombs span:eq(3)').text() + "\n";
						var st = window.$('div#bombs span:eq(4)').text() + "\n";
						var ps = window.$('div#bombs span:eq(5)').text() + "\n";
						var zf = window.$('div#coats span:eq(1)').text() + "\n";
						var hm = window.$('div#coats span:eq(2)').text() + "\n";
						var bg = window.$('div#supplies span:eq(0)').text() + "\n";
						var ab = window.$('div#supplies span:eq(1)').text() + "\n";
						var gc = window.$('div#supplies span:eq(2)').text() + "\n";
						var slim = window.$('div#supplies span:eq(3)').text() + "\n";
						var wss = window.$('div#wss span:eq(0)').text() + "\n";

						var allItemsDisplay = {
							emptybottle: eb, 
							fabric: fa,
							immortal: ih, 
							alcohol: al, 
							stem: st, 
							spore: ps, 
							zenorc: zf, 
							mermaid: hm, 
							grenade: bg, 
							acid: ab, 
							coat: gc, 
							slims: slim, 
							starsand: wss
						};

						if(cmdArray.length == 2){
							resDisplay += "\n``` Bombs: \n";
							resDisplay += eb+fa+ih+al+st+ps;
							resDisplay += "```";
							resDisplay += "\n``` Coats: \n";
							resDisplay += eb+zf+hm+al;
							resDisplay += "```";
							resDisplay += "\n``` Witch Starsand: \n";
							resDisplay += wss;
							resDisplay += "```";
							resDisplay += "\n``` Supplies: \n";
							resDisplay += bg+ab+gc+slim;
							resDisplay += "```";
							message.reply(resDisplay);
						} else {
							resDisplay += "\n```";
							resDisplay += allItemsDisplay[cmdArray[2]];
							resDisplay += "```";
							message.reply(resDisplay);
						}
					}
				);
				break;
			case "add":
				if(cmdArray.length == 4) {
					addURL += "&i=" + allItems[cmdArray[2]] + "&q=" + cmdArray[3];
					jsdom.env(
						addURL,
						["http://code.jquery.com/jquery.js"],
						function (err, window) {
							resDisplay += "\n```";
							resDisplay += window.$('div#res').text() + "\n";
							resDisplay += "\n```";
							message.reply(resDisplay);
						}
					);
				} else {
					resDisplay += "\n```";
					resDisplay += "command input not recognized please use '!pro commands' to see available options";
					resDisplay += "\n```";
					message.reply(resDisplay);
				}
				break;
			case "reset":
				if(cmdArray.length == 4) {
					updURL += "&i=" + allItems[cmdArray[2]] + "&q=" + cmdArray[3];
					jsdom.env(
						updURL,
						["http://code.jquery.com/jquery.js"],
						function (err, window) {
							resDisplay += "\n```";
							resDisplay += window.$('div#res').text() + "\n";
							resDisplay += "\n```";
							message.reply(resDisplay);
						}
					);
				} else {
					resDisplay += "\n```";
					resDisplay += "command input not recognized please use '!pro commands' to see available options";
					resDisplay += "\n```";
					message.reply(resDisplay);
				}
				break;
			case "mob":
				if(cmdArray.length >= 3) {
					var mob = '['+ cmdArray[2];
					if(cmdArray.length == 3) {
						mob += ']';
					}
					else{
						for(i=3; i<cmdArray.length; i++) {
							mob += ' ' + cmdArray[i];
						}
						mob += ']';
					}
					loopMessage(message, mob, '[', ']', 2, mon);
				}
				break;
			case "item":
				if(cmdArray.length >= 3) {
					var ite = '<'+ cmdArray[2];
					if(cmdArray.length == 3) {
						ite += '>';
					}
					else{
						for(i=3; i<cmdArray.length; i++) {
							ite += ' ' + cmdArray[i];
						}
						ite += '>';
					}
					loopMessage(message, ite, '<', '>', 1, obj);
				}
				break;
			default:
				resDisplay += "\n```";
				resDisplay += "command input not recognized please use '!pro commands' to see available options";
				resDisplay += "\n```";
				message.reply(resDisplay);
		}
	}
	if(message.content.toLowerCase().includes('cenara please')) {
		message.reply('https://discordemoji.com/assets/emoji/PepeKMS.png');
	}
	if(message.content.toLowerCase().includes('protime')) {

		var person = "";
		var client = message.member.displayName.toLowerCase();
		var diff = null;

		people_array = ["pulock","cid","someone"];
		diff_array = [3,-4,10];

		date = new Date(),
		datevalues = [
   			date.getFullYear(),
   			date.getMonth()+1,
   			date.getDate(),
   			date.getHours(),
		];

		if(people_array.indexOf(client) > -1) {
			customedate = [
				0,
				0,
				changetime(diff_array[people_array.indexOf(client)],datevalues),
			];
		}
		
		message_array = message.content.toLowerCase().split(" ");

		if(message_array.length > 3) {
			switch(message_array[1]) {
				case 'time':
					person = message_array[3].toLowerCase();
					if(people_array.indexOf(person) > -1) {
						diff = diff_array[people_array.indexOf(person)];
						res_array = changetime(diff,datevalues);
						message.reply(topmam(parseInt(res_array[3])));
					}
					break;
				case 'my':
					person = message_array[4].toLowerCase();
					if(people_array.indexOf(person) > -1) {
						diff = people_array.indexOf(person)-people_array.indexOf(client);
						res_array = changetime(diff,customedate);
						message.reply(topmam(parseInt(res_array[3])));
					}
					break;
				case 'in':
					person = message_array[4].toLowerCase();
					if(people_array.indexOf(person) > -1) {
						diff = diff_array[people_array.indexOf(person)];
						delayed_time = changetime(removeh(message_array[2]),changetime(diff,datevalues));
						message.reply(topmam(parseInt(delayed_time[3])));
					}
					break;
				default:
					message.reply("an error occured");
			}
		}

		console.log(message.member.displayName);
	}*/
});

client.login(process.env.BOT_TOKEN);
