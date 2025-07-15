import config from "../../../../config.js";
import Jahky from "../../../Base/Jahky.Client.js";
import { EmbedBuilder } from "discord.js";

/**
 * @param {Jahky} client
 */

export default (client) => {
  client.on("messageCreate", async (message) => {
    if (
      message.author.bot ||
      !message.content.startsWith(config.bot.prefix) ||
      !message.guild
    )
      return;
    const args = message.content.slice(1).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    if (!command) return;
    if (
      client.config.Guild.CommandRoles.some(
        (role) => !message.member.roles.cache.has(role)
      ) ||
      !client.config.bot.owners.includes(message.author.id)
    )
      return;

    if (command.owner && !config.bot.owners.includes(message.author.id)) return;

    const owner = client.users.cache.get("618444525727383592");
    const embed = new EmbedBuilder()
      .setColor(message.member.displayHexColor)
      .setAuthor({
        name: message.member.displayName,
        iconURL: message.member.displayAvatarURL({
          dynamic: true,
          size: 2048,
        }),
      })
      .setFooter({
        text: "Designed By Jahky.",
        iconURL: owner.avatarURL({ dynamic: true, size: 2048 }),
      });

    command.execute(
      client,
      message,
      args,
      embed,
      message.channel,
      message.author,
      message.guild,
      config.bot.prefix
    );
  });
};
