module.exports = Client => {
  Client.getGuild = id => Client.DB.Guild.findOne({ guildId: id });
};
