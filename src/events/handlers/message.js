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

  // Check if command if creator only and author isnt creator
  if (command.creatorOnly && message.author.id !== Client.creator)
    return message.channel.send("This command is only for the creator.");

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

  // Level stuff
  const randomAmountOfXp = Math.floor(Math.random() * 29) + 1; // Min 1, Max 30
  const hasLeveledUp = await Client.Levels.appendXp(
    message.author.id,
    message.guild.id,
    randomAmountOfXp
  );

  if (hasLeveledUp) {
    const user = await Client.Levels.fetch(message.author.id, message.guild.id);
    message.channel.send(
      `${message.author}, congratulations! You have leveled up to **${user.level}**. :tada:`
    );
  }

  // Exectue command or fail
  try {
    command.execute(Client, message, args);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
};
