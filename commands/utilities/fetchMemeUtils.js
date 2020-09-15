const Discord = require("discord.js");
const fs = require("fs");
const snekfetch = require("snekfetch");

const subredditsJSON = "subreddits.json";
const subredditsPath = "./config/subreddits.json";

exports.randomMeme = async (message, args) => {
  var subredditsJSON = fs.readFileSync(subredditsPath);
  subredditsJSON = JSON.parse(subredditsJSON);
  var _subs = subredditsJSON.subreddits;

  const random = Math.floor(Math.random() * _subs.length);

  if (_subs.length > 0) {
    var sub = _subs[random].name;
    try {
      const { body } = await snekfetch
        .get(`https://www.reddit.com/r/${sub}.json?sort=top&t=week`)
        .query({ limit: 200 });
      var allowed = message.channel.nsfw ? body.data.children : body.data.children.filter((post) => !post.data.over_18);   
      if(_subs[random].tags.length > 0) {
          allowed = allowed.filter((post) => post.data.link_flair_text && _subs[random].tags.includes(post.data.link_flair_text.toLowerCase()));
      }
      if (!allowed.length)
        return message.channel.send(
          "It seems we are out of fresh memes!, Try again later."
        );
      const randomnumber = Math.floor(Math.random() * allowed.length);
      const embed = new Discord.MessageEmbed()
        .setColor(0x00a2e8)
        .setTitle(allowed[randomnumber].data.title)
        //.setDescription("posted by: " + allowed[randomnumber].data.author)
        .setImage(allowed[randomnumber].data.url)
        //.setDescription("**Other info**\nUpvotes: " + allowed[randomnumber].data.ups + " / Comments: " + allowed[randomnumber].data.num_comments)
        .setFooter(`Tags: ${_subs[random].tags.toString()} | memes provided by r/${sub}`);
      return message.channel.send(embed);
    } catch (err) {
      return console.log(err);
    }
  } else {
    console.log("There are no subreddits available at the moment.");
  }
};

exports.specificMeme = async (message, args) => {
  var sub = args[1] ? args[1] : "default";
  var typeMod = args[2] ? args[2] : "top";
  var timeMod = args[3] ? args[3] : "day";

  try {
    const { body } = await snekfetch
      .get(`https://www.reddit.com/r/${sub}.json?sort=${typeMod}&t=${timeMod}`)
      .query({ limit: 200 });
    const allowed = message.channel.nsfw
      ? body.data.children
      : body.data.children.filter((post) => !post.data.over_18);
    if (!allowed.length)
      return message.channel.send(
        "It seems we are out of fresh memes!, Try again later."
      );
    const randomnumber = Math.floor(Math.random() * allowed.length);
    const embed = new Discord.MessageEmbed()
      .setColor(0x00a2e8)
      .setTitle(allowed[randomnumber].data.title)
      //.setDescription("posted by: " + allowed[randomnumber].data.author)
      .setImage(allowed[randomnumber].data.url)
      //.addField("Other info:", "Up votes: " + allowed[randomnumber].data.ups + " / Comments: " + allowed[randomnumber].data.num_comments)
      .setFooter(`Memes provided by r/${sub}`);
    return message.channel.send(embed);
  } catch (err) {
    return console.log(err);
  }
};

exports.add = async (message, args) => {
  //Name of the subreddit
  var sub = args[1];

  //Is sub safe for work?
  var isSFW = args[2] === 'NSFW' ? false : true;

  //Tags that can be pulled from
  var tags = args[3] ? args[3].split(",") : [];

  //Read saved subreddits into memory
  var subredditsJSON = fs.readFileSync(subredditsPath);
  subredditsJSON = JSON.parse(subredditsJSON);
  var _subs = subredditsJSON.subreddits;

  try {
    const { body } = await snekfetch
      .get(`https://www.reddit.com/r/${sub}.json`)
      .query({ limit: 1 });
    var allowed = message.channel.nsfw
      ? body.data.children
      : body.data.children.filter((post) => !post.data.over_18);
    if (!allowed.length)
      return message.channel.send(
        `This subreddit doesn't exist or it does not contain any posts.`
      );
    else {
      var subreddit = {
        name: sub,
        isSFW: isSFW,
        tags: tags,
      };
      subredditsJSON.subreddits.push(subreddit);
      message.channel.send(`r/${sub} was successfully saved to file`);
      saveSubreddits(subredditsJSON);
    }
  } catch (err) {
    return console.log(err);
  }
};

exports.remove = async (message, args) => {
  var sub = args[1];

  var subredditsJSON = fs.readFileSync(subredditsPath);
  subredditsJSON = JSON.parse(subredditsJSON);
  var _subs = subredditsJSON.subreddits;

  const subIndex = findSubredditByName(sub);

  if(subIndex > -1){
      _subs.splice(subIndex, 1);
      saveSubreddits(subredditsJSON);
      return message.channel.send(`r/${sub} was successfully removed`);
  }
  return message.channel.send(`r/${sub} was not in the list of subreddits`);
};

function random(sub) {
    Math.floor(Math.random() * sub.length);
}

//Returns index of sub
function findSubredditByName(name) {
  var subredditsJSON = fs.readFileSync(subredditsPath);
  subredditsJSON = JSON.parse(subredditsJSON);
  var _subs = subredditsJSON.subreddits;

  for(var i = 0; i < _subs.length; i++){
      if(_subs[i].name == name){
          return i;
      }
  }
  return -1;
}

function saveSubreddits(fts) {
  fs.writeFileSync(subredditsPath, JSON.stringify(fts), null, 4);
  console.log("Succesfully saved to [" + subredditsJSON + "]!");
}
