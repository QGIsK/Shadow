const timestamps = require("mongoose-timestamp");
const mongoose = require("mongoose");

const { DEFAULT_PREFIX } = process.env;

const GuildSettingsSchema = mongoose.Schema({
  guildID: { type: String, required: true },
  settings: {
    prefix: {
      type: String,
      default: DEFAULT_PREFIX,
    },
    thankBoosters: {
      type: Boolean,
      default: false,
    },
    welcomeMessage: {
      channel: {
        type: String,
      },
      enabled: {
        type: Boolean,
        default: false,
      },
    },
    bockInvites: {
      type: Boolean,
      default: false,
    },
  },
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});

GuildSettingsSchema.pre("save", function (next) {
  if (this.isModified("icon"))
    this.icon = `https://cdn.discordapp.com/icons/${this.guildID}/${this.icon}`;

  next();
});

GuildSettingsSchema.plugin(timestamps);

const Guild = mongoose.model("Guild", GuildSettingsSchema);

module.exports = Guild;
