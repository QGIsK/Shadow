module.exports = {
  name: "setlevel",
  description: "set a users level",
  aliases: [],
  creatorOnly: false,
  guildOnly: true,
  userPermissions: ["ADMINISTRATOR"],
  execute(Client, message, args) {
    const target = message.mentions.users.first() || message.author; // Grab the target.

    // Check for arguments if second argument exists they're updating other users level if not update their own
    const level = args[1] ?? args[0];

    Client.Levels.appendLevel(target, message.guild.id, level).catch(e => console.log(e));

    return message.reply("Level has been set to level " + level);
  },
};
