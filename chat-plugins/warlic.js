'use strict';
let warlicWords = {
    'friend': 'comrade',
    'bro': 'good Sire',
    'bruh': 'Sir',
    'dude': 'my most distinguished Sire',
    'dudette': 'Madam',
    'girl': 'Madam',
    'woman': 'Madam',
    'pussy': 'Madam',
    'nigga': 'mate',
    'hello': 'My distinguished salutations',
    'hi': 'salutations',
    'hola': 'salutations',
    'fuck': 'sod',
    'fucked': 'sodded',
    'fuck you': 'please proceed to have sexual intercourse with thyself',
    'shit': 'intellectual matter',
    'cunt': 'Madam',
    'nigger': 'distinguished gentleman',
    'faggot': 'bundle of sticks',
    'fgt': 'bundle of sticks',
    'fag': 'cigarette',
    'nerd': 'genius',
    'driver': 'esteemed staff member',
    'moderator': 'esteemed staff member',
    'leader': 'mighty leader',
    'admin': 'mighty overlord',
    'creaturephil': 'the almighty coder',
    'austin': 'egoistic troll',
    'ill': 'I shall',
    'penis': 'genetalia',
    'vagina': 'genetalia',
    'hey': 'may I have a moment',
    'stevo': 'jesus',
    'dumbass': 'buffoon',
    'you': 'thou',
    'your': 'thine',
    'dick': 'whippersnapper',
    'cry': 'turn on the waterworks',
    'idiot': 'bampot',
    'dumb': 'barmy',
    'fucking': 'bloody',
    'happy': 'gay',
    'butthurt': 'chagrined',
    'thanks': 'my eternal gratitude',
    'thank you': 'a thousand thanks',
    'sorry': 'my most sincere apologies',
    'sry': 'my deepest regrets for any grief I may have caused',
    'ty': 'I am grateful for thine gracious act of kindness',
    'u': 'thou',
    'why': 'for what reason'
    };
let keyWords = Object.keys(warlicWords);

let parseWarlic = function (message) {
    let words = message.split(' ');
    let wid;
    return words.map(function (word) {
        wid = toId(word);
        if (Users.get(wid)) return 'good Sir or Madam ' + Users.get(wid).name;
        if (keyWords.indexOf(wid) > -1) {
           return warlicWords[wid];
        } else {
             return word;
        }
    }).join(' ');
};
global.parseWarlic = parseWarlic;

exports.commands = {
    togglewarlic: function (target, room, user) {
		if (!this.can('hotpatch')) return this.errorReply("Access denied.");
		room.WarlicMode = !room.WarlicMode;
		this.sendReply("Warlic Mode is set to " + room.WarlicMode + " in this room.");
		if (room.WarlicMode) {
			this.add("|raw|<div class=\"broadcast-red\" style=\"border-radius: 5px;\"><b>Warlic Mode is now on!</b></div>");
		} else {
			this.add("|raw|<div class=\"broadcast-blue\" style=\"border-radius: 5px;\"><b>Warlic Mode is now off!</b></div>");
		}
	},
}
