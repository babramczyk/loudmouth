// Description
//   A hubot script that helps those who are hard of hearing.
//
// Commands:
//   what, repeat that, etc. - Repeats the second to last message in all caps
//
// Author:
//   babramczyk[@<bjabramczyk@gmail.com>]

module.exports = function (robot) {
    const interrogatives = [
        /w+h+a+t+/,
        /w+a+t+/,
        /w+u+t+/,
        /wot/,
        /h+u+h+/,
        /w+h+a+/,
        /wha+t+ now/,
        /repeat that+/,
        /come again/
    ];
    const prompts = [
        /wha+t+ do+ (yo+u+|u+) mean+/i,
        /w+h+a+t+ did (you+|u+) (just )?sa+y+/i,
        /i+ ca+n'?t+ h+e+a+r+( (you+|u+))?/i,
        /i'?m hard of hearing/i
    ];

    let lastMsg;
    let lastMsgWasLoudmouth = false;

    /**
     * Replies in a chatroom with the last message sent in all caps
     * @param    {Object} res the Hubot chatroom object
     */
    function repeat(res) {
        if (!lastMsg) return;

        res.reply(lastMsg);
        lastMsgWasLoudmouth = true;
    }

    interrogatives.forEach(function (phrase) {
        let regex = new RegExp(phrase + /[.!?\s]*$/, 'i');
        robot.hear(regex, repeat);
    });

    prompts.forEach(function (phrase) {
        robot.hear(phrase, repeat);
    });

    // Store last message if it is text and wasn't a Loudmouth message
    robot.hear(/(.*)/, function (res) {
        if (!lastMsgWasLoudmouth) {
            lastMsg = res.match[1].toUpperCase();
        }
        lastMsgWasLoudmouth = false;
    });
};
