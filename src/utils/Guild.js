module.exports = (Client) => {
  Client.getGuild = (id) => {
    return Client.DB.Guild.findOne({ guildId: id });
  };
};
