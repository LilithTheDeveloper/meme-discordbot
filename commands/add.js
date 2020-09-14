const fetchMeme = require('./utilities/fetchMemeUtils');


module.exports = {
	name: 'add',
	description: 'Adds a subreddit',
	style: `!add 'Subreddit' <NSFW | SFW> <Tags>\nMultiple tags are seperated like this Tag1,Tag2,etc\n' Nescessary ' < Optional >   `,
	execute(message, args) {
		fetchMeme.add(message, args);
    },
};