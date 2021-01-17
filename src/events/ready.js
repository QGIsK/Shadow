
module.exports = class Ready {
  constructor(client) {
    this.client = client;
  }

  async run() {
    this.client.logger.log("Bot is online", "log");

    require("../dashboard")(this.client);
  }
};
