module.exports = class Reconnecting {
  constructor(client) {
    this.client = client;
  }

  async run() {
    this.client.logger.log("Bot reconnecting...", "log");
  }
};
