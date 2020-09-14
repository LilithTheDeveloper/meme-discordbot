const fetchMeme = require('./utilities/fetchMemeUtils');

module.exports = {
	name: 'meme',
	description: 'Gives a random meme!',
	style: `meme <Subreddit> <Top|Hot|New> <Week|Month|Year>\n' Nescessary '  < Optional >   `,
	execute(message, args) {
		//#TODO Add modifiers (Top, Hot, New or Week, Month, Year)
		//STYLE NOTES: args[1] is the subreddit args[2] is type mod and args[3] is time mod
		if(!args[1]) fetchMeme.randomMeme(message, args);
		if(args[1]) fetchMeme.specificMeme(message, args);
    },
};