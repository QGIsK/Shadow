module.exports = class GuildCreate {
  constructor(client) {
    this.client = client;
  }

  async run(_, guild) {
    await this.client.updateGuild(guild);
  }
};
