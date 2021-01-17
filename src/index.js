require("dotenv").config();

const Discord = require("discord.js");
const fs = require("fs");

const Levels = require("discord-xp");

const { CREATOR, DEFAULT_PREFIX, BOT_TOKEN, INVITE, MONGO_URI, PORT } = process.env;

const commandGroups = [
  {
    group: "util",
    name: "Utilities",
    description: "Utility commands",
  },
  {
    group: "levels",
    name: "Levels",
    description: "Level commands",
  },
  {
    group: "settings",
    name: "Bot Settings",
    description: "Change bot settings",
  },
];

Levels.setURL(MONGO_URI);

class ShadowBot extends Discord.Client {
  constructor(options) {
    super(options);

    this.DB = require("./db");
    this.logger = require("./utils/Logger");

    this.creator = CREATOR;
    this.defaultPrefix = DEFAULT_PREFIX;
    this.inviteLink = INVITE;
    this.Levels = Levels;
    this.regex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|club)|discordapp\.com\/invite|discord\.com\/invite)\/.+[a-z]/gi;
    this.port = PORT;

    this.cooldowns = new Discord.Collection();
    this.commands = new Discord.Collection();
  }

  loadCommands() {
    commandGroups.map(x => {
      const commands = fs
        .readdirSync(`./src/commands/${x.group}`)
        .filter(file => file.endsWith(".js"));

      commands.map(h => {
        const command = require(`./commands/${x.group}/${h}`);
        this.commands.set(command.name, command);
      });
    });
  }

  async awaitReply(msg, question, limit = 60000) {
    const filter = m => m.author.id === msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, {
        max: 1,
        time: limit,
        errors: ["time"],
      });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  }
}
const init = async () => {
  const Client = new ShadowBot();

  Client.loadCommands();

  require("./utils/Guild")(Client);
  require("./events")(Client);

  Client.login(BOT_TOKEN);
};

init();

String.prototype.toProperCase = function () {
  return this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

process.on("unhandledRejection", err => {
  console.error(err);
});
