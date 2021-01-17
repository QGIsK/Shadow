module.exports = class GuildCreate {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {
    await this.client.makeGuild({ guildID: guild.id, icon: guild.icon, name: guild.name });
  }
};
