module.exports = Client => {
  //Guilds
  Client.getGuild = id => Client.DB.Guild.findOne({ guildID: id });
  Client.makeGuild = id => new Client.DB.Guild({ guildID: id }).save();
  Client.deleteGuild = id => Client.DB.Guild.findOneAndDelete({ guildID, id });

  // Settings
  Client.updatePrefix = (prefix, id) =>
    Client.DB.Guild.findOneAndUpdate({ guildID: id }, { settings: { prefix } });

  Client.blockInvites = id =>
    Client.DB.Guild.findOneAndUpdate({ GuildID: id }, { settings: { blockInvites: true } });
  Client.enableInvites = id =>
    Client.DB.Guild.findOneAndUpdate({ GuildID: id }, { settings: { blockInvites: false } });
};
