module.exports = class Warning {
  constructor(client) {
    this.client = client;
  }

  async run(info) {
    this.client.logger.log(info, "warn");
  }
};
