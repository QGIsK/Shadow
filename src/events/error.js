module.exports = class Error {
  constructor(client) {
    this.client = client;
  }

  async run(e) {
    this.client.logger.log(e, "error");
    process.exit(1);
  }
};
