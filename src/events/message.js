const AntiSpam = require("discord-anti-spam");

const antiSpam = new AntiSpam({
  warnThreshold: 3,
  kickThreshold: 7,
  banThreshold: 7,
  maxInterval: 2000,
  warnMessage: "{@user}, Please stop spamming.",
  kickMessage: "**{user_tag}** has been kicked for spamming.",
  banMessage: "**{user_tag}** has been banned for spamming.",
  maxDuplicatesWarning: 7,
  maxDuplicatesKick: 10,
  maxDuplicatesBan: 12,
  exemptPermissions: ["ADMINISTRATOR"],
  ignoreBots: true,
  verbose: true,
  ignoredUsers: [],
});

module.exports = class Message {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    //always return bot so db doesnt get queried twice
    if (message.author.bot) return;

    // Anti spam
    antiSpam.message(message);

    // Get guild settings
    const guildSettings = await this.client.getGuild(message.guild.id);

    //This shouldn't happen as guild is made on guildCreate event -- but just incase
    const guild = !guildSettings ? await this.client.makeGuild(message.guild) : guildSettings;

    message.settings = guild.settings;

    // Check for discord invite
    if (
      this.client.regex.test(message.content) &&
      message.settings.blockInvites &&
      message.deletable
    ) {
      await message.delete();

      return message.say("No invites!");
    }

    // Set prefix
    const PREFIX = message.settings.prefix;

    // if msg doesnt start with prefix return
    if (!message.content.startsWith(PREFIX)) return;

    // Splice arguments and get first arg for command
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
      this.client.commands.get(commandName) ||
      this.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type === "dm") {
      return message.reply("I can't execute that command inside DMs!");
    }

    // Check if command if creator only and author isnt creator
    if (command.creatorOnly && message.author.id !== this.client.creator)
      return message.channel.send("This command is only for the creator.");

    if (!message.member.hasPermission(command.userPermissions))
      return message.channel.send("You don't have permissions to use this");

    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}!`;

      if (command.usage) {
        reply += `\nThe proper usage would be: \`${PREFIX}${command.name} ${command.usage}\``;
      }

      return message.channel.send(reply);
    }

    // Level stuff
    const randomAmountOfXp = Math.floor(Math.random() * 29) + 1; // Min 1, Max 30
    const hasLeveledUp = await this.client.Levels.appendXp(
      message.author.id,
      message.guild.id,
      randomAmountOfXp
    );

    if (hasLeveledUp) {
      const user = await this.client.Levels.fetch(message.author.id, message.guild.id);
      message.channel.send(
        `${message.author}, congratulations! You have leveled up to **${user.level}**. :tada:`
      );
    }

    // Exectue command or fail
    try {
      command.execute(this.client, message, args);
    } catch (error) {
      console.error(error);
      message.reply("there was an error trying to execute that command!");
    }
  }
};
