module.exports = {
	name: 'ping',
    description: 'It does what it says it does!',
	execute(message, args) {
		message.channel.send('Pong.');
    },
};