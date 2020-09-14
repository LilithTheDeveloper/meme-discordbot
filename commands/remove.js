const fetchMeme = require('./utilities/fetchMemeUtils');


module.exports = {
	name: 'remove',
    description: 'Removes a subreddit',
	execute(message, args) {
		fetchMeme.remove(message, args);
    },
};