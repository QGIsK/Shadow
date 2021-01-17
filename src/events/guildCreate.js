module.exports = class GuildCreate {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {
    await this.client.makeGuild(guild);
  }
};
