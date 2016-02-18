'use strict';
let fs = require("fs");
let monData;
try {
	monData = fs.readFileSync("data/OSSB-data.txt").toString().split("\n\n");
} catch (e) {
	console.error(e);
}

function getMonData(target) {
	let returnData = null;
	monData.forEach(function (data) {
		if (toId(data.split("\n")[0].split(" - ")[0] || " ") === target) {
			returnData = data.split("\n").map(function (line) {
				return Tools.escapeHTML(line);
			}).join("<br />");
		}
	});
	return returnData;
}

exports.commands = {
	ossb: 'ssb',
	ssb: function (target, room, user) {
		if (!this.canBroadcast()) return false;
		if (!target) return this.parse("/help ssb");
		let targetData = getMonData(toId(target));
		if (!targetData) return this.errorReply("The staffmon \"" + toId(target) + "\" could not be found.");
		return this.sendReplyBox(targetData);
	},
	ssbhelp: ["/ssb [staff member name] - displays the data for a staff member's staffmon."],
	ssbcredits: function (target, room, user) {
		if (!this.canBroadcast()) return false;
		this.sendReplyBox(
			"<center><b>Origin Super Staff Bros Credits:</b></center>" +
			"<b>%EmgProfessor Volco</b> - Concepts, Programming, Organization, Testing, Hosting a test server.<br />" +
			"<b>@AuraStormLucario</b> - Concepts, Programming, Organization, Testing.<br />" +
			"<b>~sparkychild</b> - Programming, Organization, Testing, Pokemon Descriptions.<br />" +
			"<b>+hayleysworld</b> - Pokemon Descriptions, Testing.<br />" +
			"<b>%&PaulCentury, %Selena, Piscean</b> - Testing.<br />" +
			"<b>Other Origin Staff</b> - Participation and support in helping to complete this project."
		);
	},
};