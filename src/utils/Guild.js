module.exports = Client => {
  Client.getGuild = id => Client.DB.Guild.findOne({ guildID: id });
  Client.makeGuild = id => new Client.DB.Guild({ guildID: id }).save();
  Client.deleteGuild = id => Client.DB.Guild.findOneAndDelete({ guildID, id });
  Client.updatePrefix = (prefix, id) =>
    Client.DB.Guild.findOneAndUpdate({ guildID: id }, { settings: { prefix } });
};
