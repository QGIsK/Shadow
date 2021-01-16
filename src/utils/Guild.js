module.exports = Client => {
  Client.getGuild = id => Client.DB.Guild.findOne({ guildId: id });
  Client.makeGuild = id => new Client.DB.Guild({ guildID: id });
};
