module.exports = {
  name: "prefix",
  description: "Set prefix",
  aliases: [],
  creatorOnly: false,
  guildOnly: true,
  userPermissions: ["ADMINISTRATOR"],
  async execute(Client, message, args) {
    await Client.updatePrefix(message.guild.id, args[0][0]);

    message.reply("Changed prefix to " + args[0][0]);
  },
};
