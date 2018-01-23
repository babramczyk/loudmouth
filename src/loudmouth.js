// Description
//   A hubot script that helps those who are hard of hearing.
//
// Author:
//   babramczyk[@<bjabramczyk@gmail.com>]

const REDIS_KEY = 'loudmouth';

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

    /**
     * Get loudmouth data saved in the brain
     * @returns {Object} Loudmouth data stored in the brain
     */
    function getLoudmouth() {
        if (!robot.brain.get(REDIS_KEY)) {
            return {};
        }
        return robot.brain.get(REDIS_KEY);
    }

    /**
     * Update loudmouth data stored in the brain
     * @param {Object} loudmouthInfo - loudmouth data to store in the brain
     */
    function setLoudmouth(loudmouthInfo) {
        if (!loudmouthInfo) {
            return;
        }
        robot.brain.set(REDIS_KEY, loudmouthInfo);
    }

    /**
     * Sets the last message sent in a given room
     * @param {string} room    the room to set the last message
     * @param {string} message the last message sent in the room
     */
    function setLastMessageByRoom(room, message) {
        let loudmouth = getLoudmouth();

        // add the room if it does not exist in memory
        if (!loudmouth[room]) {
            loudmouth[room] = {
                lastMsgWasLoudmouth : false
            };
        }

        loudmouth[room].text = message;
        setLoudmouth(loudmouth);
    }

    /**
     * Gets the last message sent in a given room
     * @param  {string} room the room to see the last message of
     * @return {string}      the last message sent in that room
     */
    function getLastMessageByRoom(room) {
        let loudmouth = getLoudmouth();
        if (!loudmouth[room] || !loudmouth[room].text) {
            return '';
        }
        return loudmouth[room].text;
    }

    /**
     * Sets a true/false value for a chat room to say if the last message sent
     * in it was sent by Loudmouth.
     * @param {string} room  the room to check for
     * @param {bool} value if the last message sent in the room was Loudmouth
     */
    function setLastMessageWasLoudmouth(room, value) {
        let loudmouth = getLoudmouth();
        if (!loudmouth[room]) {
            throw new Error('Tried to set lastMessage bool' +
                'without the room being defined in memory');
        }
        loudmouth[room].lastMsgWasLoudmouth = value;
        setLoudmouth(loudmouth);
    }

    /**
     * Sees if the last message sent in a room was by Loudmouth
     * @param  {string} room the room to check for
     * @return {bool}      if the last message sent in the room was Loudmouth
     */
    function getLastMessageWasLoudmouth(room) {
        let loudmouth = getLoudmouth();
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
            setLastMessageByRoom(room, res.message.text);
        }
        setLastMessageWasLoudmouth(room, false);
    });
};
