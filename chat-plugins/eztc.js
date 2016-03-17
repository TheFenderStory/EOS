'use strict';
/********************
 * EZTC
 * This file handles the automatic trainer card system. Trainer cards are stored in some json. Code by jd.
********************/
const fs = require('fs');
const serialize = require('node-serialize');
let trainerCards = {};

function loadTrainerCards() {
	try {
		trainerCards = serialize.unserialize(fs.readFileSync('config/trainercards.json', 'utf8'));
		Object.assign(CommandParser.commands, trainerCards);
	} catch (e) {}
}
setTimeout(function () {loadTrainerCards();}, 1000);

function saveTrainerCards() {
	fs.writeFileSync('config/trainercards.json', serialize.serialize(trainerCards));
	Object.assign(CommandParser.commands, trainerCards);
}

exports.commands = {
	eztc: 'trainercard',
	trainercards: 'trainercard',
	tc: 'trainercard',
	trainercard: function (target, room, user) {
		if (!target) target = 'help';
		let parts = target.split(',');
		for (let u in parts) parts[u] = parts[u].trim();
		let commandName;

		switch (parts[0]) {
		case 'add':
			if (!this.can('declare')) return false;
			if (!parts[2]) return this.errorReply("Usage: /trainercard add, [command name], [html]");
			commandName = toId(parts[1]);
			if (CommandParser.commands[commandName]) return this.errorReply("/trainercards - The command \"" + commandName + "\" already exists.");
			let html = parts.splice(2, parts.length).join(',');
			/* jshint ignore:start */
			trainerCards[commandName] = new Function('target', 'room', 'user', "if (!room.disableTrainerCards) if (!this.canBroadcast()) return; this.sendReplyBox('" + html.replace(/([^a-z0-9])/g, match => {
				return "\\" + match;
			}) + "');");
			/* jshint ignore:end */
			saveTrainerCards();
			this.sendReply("The trainer card \"" + commandName + "\" has been added.");
			this.logModCommand(user.name + " added the trainer card " + commandName);
			break;

		case 'rem':
		case 'del':
		case 'delete':
		case 'remove':
			if (!this.can('declare')) return false;
			if (!parts[1]) return this.errorReply("Usage: /trainercard remove, [command name]");
			commandName = toId(parts[1]);
			if (!commandName) return this.errorReply("The command name must consist of alphanumeric characters only.");
			if (!trainerCards[commandName]) return this.errorReply("/trainercards - The command \"" + commandName + "\" does not exist, or was added manually.");
			delete CommandParser.commands[commandName];
			delete trainerCards[commandName];
			saveTrainerCards();
			this.sendReply("The trainer card \"" + commandName + "\" has been removed.");
			this.logModCommand(user.name + " removed the trainer card " + commandName);
			break;

		case 'list':
			if (!this.can('declare')) return false;
			let output = "<b>There's a total of " + Object.keys(trainerCards).length + " trainer cards added with this command:</b><br />";
			for (let tc in trainerCards) {
				output += tc + "<br />";
			}
			this.sendReplyBox(output);
			break;

		case 'off':
			if (!this.can('roommod', null, room)) return false;
			if (room.disableTrainerCards) return this.errorReply("Broadcasting trainer cards is already disabled in this room.");
			room.disableTrainerCards = true;
			if (!room.battle && !room.isPersonal) {
				room.chatRoomData.disableTrainerCards = true;
				Rooms.global.writeChatRoomData();
			}
			this.privateModCommand("(" + user.name + " has disabled broadcasting trainer cards in this room.)");
			break;

		case 'on':
			if (!this.can('roommod', null, room)) return false;
			if (!room.disableTrainerCards) return this.errorReply("Broadcasing trainer cards is already enabled in this room.");
			delete room.disableTrainerCards;
			if (!room.battle && !room.isPersonal) {
				delete room.chatRoomData.disableTrainerCards;
				Rooms.global.writeChatRoomData();
			}
			this.privateModCommand("(" + user.name + " has enabled broadcasting trainer cards in this room.)");
			break;

		case 'reload':
			if (!this.can('hotpatch')) {
				return false;
			} else {
				Rooms.get('staff').add(Tools.escapeHTML(user.name) + " has reloaded all trainer cards.");
				loadTrainerCards();
				return this.sendReply("Trainer cards have been reloaded.");
			}
			break;

		case 'view':
			if (!this.can('declare')) return false;
			commandName = toId(parts[1]);
			if (!commandName) return this.errorReply("/trainercard view, [command name] - Views html of trainer card")
			let htmlOutput = false;
			for (let tc in trainerCards) {
				if (tc === commandName) htmlOutput = trainerCards[commandName].toString().split('\n')[2].toString().split('if (!room.disableTrainerCards) if (!this.canBroadcast()) return; this.sendReplyBox(\'').toString().split('\');')[0].toString().slice(1);
			}
			if (htmlOutput === false) return this.errorReply("/trainercards - The command \"" + commandName + "\" does not exist, or was added manually.");
			return this.sendReply(htmlOutput);
			break;

		default:
		case 'info':
		case 'help':
			if (!this.canBroadcast()) return;
			this.sendReplyBox(
				"EZ-TC Commands:<br />" +
				"/trainercard add, [command name], [html] - Adds a trainer card.<br />" +
				"/trainercard remove, [command name] - Removes a trainer card.<br />" +
				"/trainercard list - Shows a list of all trainer cards added with this command.<br />" +
				"/trainercard off - Disables broadcasting trainer cards in the current room.<br />" +
				"/trainercard on - Enables broadcasting trainer cards in the current room.<br />" +
				"/trainercard view, [command name] - Views the current code for a TC<br />" +
				"/trainercard help - Shows this help command.<br />" +
				"<a href=\"https://gist.github.com/jd4564/399934fce2e9a5ae29ad\">EZ-TC Plugin by jd</a>"
			);
		}
	},
};
