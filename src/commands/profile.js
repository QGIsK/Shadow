module.exports = {
  name: "profile",
  description: "Get the avatar URL of the tagged user(s), or your own avatar.",
  aliases: ["icon", "pfp"],
  creatorOnly: false,
  execute(Client, message) {
    if (!message.mentions.users.size) {
      return message.channel.send(
        `Your avatar: <${message.author.displayAvatarURL({ dynamic: true })}>`
      );
    }

    const avatarList = message.mentions.users.map(
      user =>
        `${user.username}'s avatar: <${user.displayAvatarURL({
          dynamic: true,
        })}>`
    );

    message.channel.send(avatarList);
  },
};
