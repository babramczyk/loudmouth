// Description
//   A hubot script that helps those who are hard of hearing.
//
// Author:
//   babramczyk[@<bjabramczyk@gmail.com>]

module.exports = function (robot) {
    const prompts = [
        /w+h+a+t*[.!?\s]*$/i,
        /w+a+t+[.!?\s]*$/i,
        /w+u+t+[.!?\s]*$/i,
        /wot[.!?\s]*$/i,
        /h+u+h+[.!?\s]*$/i,
        /w+h+a+t+ n+o+w+[.!?\s]*$/i,
        /repeat+ that+[.!?\s]*$/i,
        /come+ again+[.!?\s]*$/i,
        /wha+t+ do+ (yo+u+|u+) mean+/i,
        /w+h+a+t+ did+ (you+|u+) (just )?sa+y+/i,
        /i+ ca+n'?t+ h+e+a+r+( (you+|u+))?/i,
        /i'?m hard of hearing/i
    ];

    if (!robot.brain.get('loudmouth')) {
        robot.brain.set('loudmouth', {});
    }

    function setLastMessageByRoom(room, message) {
        let loudmouth = robot.brain.get('loudmouth');

        // add the room if it does not exist in memory
        if (!loudmouth[room]) {
            loudmouth[room] = {
                lastMsgWasLoudmouth : false
            };
        }

        loudmouth[room].text = message;
        robot.brain.set('loudmouth', loudmouth);
    }

    function getLastMessageByRoom(room) {
        let loudmouth = robot.brain.get('loudmouth');
        if (!loudmouth[room] || !loudmouth[room].text) {
            return '';
        }
        return loudmouth[room].text;
    }

    function setLastMessageWasLoudmouth(room, value) {
        let loudmouth = robot.brain.get('loudmouth');
        if (!loudmouth[room]) {
            throw new Error('Tried to set lastMessage bool' +
                'without the room being defined in memory');
        }
        loudmouth[room].lastMsgWasLoudmouth = value;
        robot.brain.set('loudmouth', loudmouth);
    }

    function getLastMessageWasLoudmouth(room) {
        let loudmouth = robot.brain.get('loudmouth');
        if (!loudmouth[room]) {
            return false;
        }
        return loudmouth[room].lastMsgWasLoudmouth;
    }

    /**
     * Replies in a chatroom with the last message sent in all caps
     * @param    {Object} res the Hubot chatroom object
     */
    function repeat(res) {
        let room       = res.message.room;
        // let user = res.message.user.name;
        let lastMessage = getLastMessageByRoom(room);

        if (typeof lastMessage !== 'string' || !lastMessage.length) {
            return;
        }

        // robot.messageRoom(room, user + lastMessages[room]);
        res.reply(lastMessage.toUpperCase());
        setLastMessageWasLoudmouth(room, true);
    }

    prompts.forEach(function (phrase) {
        robot.hear(phrase, repeat);
    });

    // Store last message if it is text and wasn't a Loudmouth message
    robot.hear(/(.*)/, function (res) {
        let room = res.message.room;

        if (!getLastMessageWasLoudmouth(room)) {
            setLastMessageByRoom(room, res.message.text)
        }
        setLastMessageWasLoudmouth(room, false);
    });
};
