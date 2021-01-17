require("dotenv").config();

const Discord = require("discord.js");
const fs = require("fs");

const Levels = require("discord-xp");

const {
  CREATOR,
  DEFAULT_PREFIX,
  BOT_TOKEN,
  BOT_ID,
  BOT_SECRET,
  INVITE,
  MONGO_URI,
  PORT,
} = process.env;

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

    this.id = BOT_ID;
    this.secret = BOT_SECRET;

    this.commands = new Discord.Collection();
  }

  async loadCommands() {
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

  async loadEvents() {
    const evtFiles = await fs.readdirSync("./src/events");
    this.logger.log(`Loading a total of ${evtFiles.length} events.`, "log");
    evtFiles.forEach(file => {
      const eventName = file.split(".")[0];
      this.logger.log(`Loading Event: ${eventName}`);
      const event = new (require(`./events/${file}`))(this);
      this.on(eventName, (...args) => event.run(...args));
      delete require.cache[require.resolve(`./events/${file}`)];
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

  getGuild = id => this.DB.Guild.findOne({ guildID: id });
  makeGuild = data =>
    new this.DB.Guild({ guildID: data.id, icon: data.icon, name: data.name }).save();
  deleteGuild = id => this.DB.Guild.findOneAndDelete({ guildID: id });

  updateGuild = data => {
    this.DB.Guild.findOneAndUpdate({ guildID: data.id }, { icon: data.icon, name: data.name });
  };

  updatePrefix = (id, prefix) =>
    this.DB.Guild.findOneAndUpdate({ guildID: id }, { settings: { prefix } });

  blockInvites = (id, enable) =>
    this.DB.Guild.findOneAndUpdate({ GuildID: id }, { settings: { blockInvites: enable } });

  getGuilds = guilds => this.DB.Guild.find({ guildID: { $in: guilds } });
}

const init = async () => {
  const Client = new ShadowBot();

  Client.loadCommands();
  Client.loadEvents();

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
