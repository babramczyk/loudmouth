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

    let lastMessages = {};
    let lastMsgWasLoudmouth = {};

    robot.brain.set('loudmouth', {
        lastMessages        : lastMessages,
        lastMsgWasLoudmouth : lastMsgWasLoudmouth
    });

    /* eslint-disable require-jsdoc */
    function getLastMessageByRoom(room) {
        return robot.brain.get('loudmouth').lastMessages[room];
    }

    function lastMessageWasLoudmouth(room) {
        return robot.brain.get('loudmouth').lastMsgWasLoudmouth[room];
    }
    /* eslint-enable require-jsdoc */

    /**
     * Replies in a chatroom with the last message sent in all caps
     * @param    {Object} res the Hubot chatroom object
     */
    function repeat(res) {
        let room       = res.message.room;
        // let user = res.message.user.name;
        let lastMessage = getLastMessageByRoom(room);

        if (!lastMessage) {
            return;
        }

        // robot.messageRoom(room, user + lastMessages[room]);
        res.reply(lastMessage.toUpperCase());
        lastMsgWasLoudmouth[room] = true;
    }

    prompts.forEach(function (phrase) {
        robot.hear(phrase, repeat);
    });

    // Store last message if it is text and wasn't a Loudmouth message
    robot.hear(/(.*)/, function (res) {
        let room = res.message.room;

        if (!lastMessageWasLoudmouth(room)) {
            lastMessages[room] = res.message.text;
        }
        lastMsgWasLoudmouth[room] = false;
    });
};
