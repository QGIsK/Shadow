const Discord = require("discord.js");

module.exports = async (Client, message) => {
  //always return bot so db doesnt get queried twice
  if (message.author.bot) return;

  // Get guild settings
  const guildSettings = await Client.getGuild(message.guild.id);

  //This shouldn't happen as guild is made on guildCreate event -- but just incase
  if (!guildSettings) Client.makeGuild(message.guild.id);

  // Set prefix
  const PREFIX = guildSettings ? guildSettings.settings.prefix : Client.defaultPrefix;

  // if msg doesnt start with prefix return
  if (!message.content.startsWith(PREFIX)) return;

  // Splice arguments and get first arg for command
  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    Client.commands.get(commandName) ||
    Client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (command.guildOnly && message.channel.type === "dm") {
    return message.reply("I can't execute that command inside DMs!");
  }

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${PREFIX}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  // Check if user has cooldown
  if (!Client.cooldowns.has(command.name)) {
    Client.cooldowns.set(command.name, new Discord.Collection());
  }

  // Add cooldown command based
  const now = Date.now();
  const timestamps = Client.cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${
          command.name
        }\` command.`
      );
    }
  }

  // Set cooldown
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  // Exectue command or fail
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
};
