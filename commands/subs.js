const fetchMeme = require('./utilities/fetchMemeUtils');

const subredditsPath = './config/subreddits.json';

const fs = require('fs');


module.exports = {
	name: 'subs',
    description: 'Shows all the available meme subs',
	execute(message, args) {
		var subredditsJSON = fs.readFileSync(subredditsPath);
        subredditsJSON = JSON.parse(subredditsJSON);
        subs = subredditsJSON.subreddits;
        if(subs.length > 0) {
            var answ = `**Available Subreddits:**\n`;
            for(var i = 0; i < subs.length; i++){
                answ += ` - ${subs[i].name} | NSFW: ${subs[i].isSFW ? 'No' : 'Yes'} | Tags: `;
                for(var j = 0; j < subs[i].tags.length; j++){
                    answ += `${subs[i].tags[j]} `;
                }
                answ += `\n`;
            }
        message.channel.send(answ);
        }
        else{
            message.channel.send("There are currently no subreddits available.\nConsider adding some with !add");
        }
    },
};