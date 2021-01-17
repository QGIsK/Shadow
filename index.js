module.exports = Client => {
  Client.on("message", message => require("./src/events/message")(Client, message));

  Client.on("disconnect", () => Client.logger.log("Bot is disconnecting...", "warn"))
    .on("ready", () => {
      Client.logger.log("Bot is online", "log");
      require("./src/dashboard")(Client);
    })
    .on("reconnecting", () => Client.logger.log("Bot reconnecting...", "log"))
    .on("error", e => {
      Client.logger.log(e, "error");
      process.exit(1);
    })
    .on("warn", info => Client.logger.log(info, "warn"));

  Client.on("guildCreate", guild => Client.DB.getGuild(guild.id));
  Client.on("guildDelete", guild => Client.DB.deleteGuild(guild.id));
};
