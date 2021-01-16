module.exports = (Client) => {
  Client.on("message", (message) =>
    require("./handlers/message")(Client, message)
  );

  Client.on("disconnect", () =>
    Client.logger.log("Bot is disconnecting...", "warn")
  )
    .on("ready", () => {
      Client.logger.log("Bot is online", "log");
      require("./../dashboard/")(Client);
    })
    .on("reconnecting", () => Client.logger.log("Bot reconnecting...", "log"))
    .on("error", (e) => Client.logger.log(e, "error"))
    .on("warn", (info) => Client.logger.log(info, "warn"));
};
