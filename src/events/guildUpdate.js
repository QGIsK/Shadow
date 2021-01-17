module.exports = class GuildCreate {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {
    await this.client.updateGuild({ data: { id: guild.id, icon: guild.icon, name: guild.name } });
  }
};
