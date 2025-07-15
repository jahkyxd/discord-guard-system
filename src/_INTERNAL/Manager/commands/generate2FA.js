import config from "../../../../config.js";
import Jahky from "../../../Base/Jahky.Client.js";
import { Message, TextChannel, User, Guild, EmbedBuilder } from "discord.js";
import moment from "moment";
moment.locale("tr");

export default {
  name: "2fa",
  owner: true,

  /**
   * @param {Jahky} client
   * @param {Message} message
   * @param {Array<String>} args
   * @param {EmbedBuilder} embed
   * @param {TextChannel} channel
   * @param {User} author
   * @param {Guild} guild
   */

  async execute(client, message, args, embed, channel, author, guild) {
    if (!args[0]) return channel.send({ content: "Üye Belirt!" });
    if (!guild.members.cache.get(args[0])) return;
    guild.members.cache.get(args[0]).createDM();
    guild.members.cache
      .get(args[0])
      .send({ embeds: [embed.setDescription(await client.qrcode(args[0]))] });
  },
};
