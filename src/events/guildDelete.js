module.exports = class GuildDelete {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {
    await this.client.deleteGuild(guild.id);
  }
};
