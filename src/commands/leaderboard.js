module.exports = {
  name: "leaderboard",
  description: "Shows leaderboard guild based",
  aliases: [],
  creatorOnly: false,
  guildOnly: true,
  async execute(Client, message) {
    const rawLeaderboard = await Client.Levels.fetchLeaderboard(message.guild.id, 10); // We grab top 10 users with most xp in the current server.

    if (rawLeaderboard.length < 1) return reply("Nobody's in leaderboard yet.");

    const leaderboard = await Client.Levels.computeLeaderboard(Client, rawLeaderboard, true); // We process the leaderboard.

    const lb = leaderboard.map(
      e =>
        `${e.position}. ${e.username}#${e.discriminator}\nLevel: ${
          e.level
        }\nXP: ${e.xp.toLocaleString()}`
    ); // We map the outputs.

    message.channel.send(`**Leaderboard**:\n\n${lb.join("\n\n")}`);
  },
};
