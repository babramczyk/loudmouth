# Loudmouth

A Hubot script that helps those who are hard of hearing. Specifically, when a user says something along the likes of "what?" or "come again?", Loudmouth repeats the message they were replying to in all caps.

See [`src/loudmouth.js`](src/loudmouth.js) for full documentation.

## Installation

In hubot project repo, run:

`npm install hubot--loudmouth --save`

Then add **hubot--loudmouth** to your `external-scripts.json`:

```json
["hubot--loudmouth"]
```

## Sample Interaction

```
user1>> Incoherent is sentence this be sense making, correct?
user2>> ...what did you just say?
hubot>> user2: INCOHERENT IS SENTENCE THIS BE SENSE MAKING, CORRECT?
```
