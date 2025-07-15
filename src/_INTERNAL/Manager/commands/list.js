import config from "../../../../config.js";
import Jahky from "../../../Base/Jahky.Client.js";
import { Message, TextChannel, User, Guild, EmbedBuilder } from "discord.js";
import moment from "moment";
moment.locale("tr");

export default {
  name: "list",

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
    const list = (await guild.fetchAuditLogs()).entries.filter(
      (x) => x.executor.bot === false
    );

    embed.setDescription(
      `Aşşağıda sunucumuzun son 10 etkinliği bulunmaktadır\n\n${list
        .first(10)
        .map(
          (log) =>
            `**YETKİLİ**: ${log.executor.toString()}\n**GEREKÇE**: ${
              log.reason ? log.reason : "Bulunamadı"
            }\n**HEDEF**: ${
              log.target.name ? log.target.name : "Bulunamadı"
            }\n**İŞLEM**: ${log.actionType
              .replace("Delete", "Silme")
              .replace("Create", "Oluşturma")
              .replace(
                "Update",
                "Güncelleme"
              )}\n**HEDEF TİPİ**: ${log.targetType
              .replace("Channel", "Kanal")
              .replace("Invite", "Davet")
              .replace("Role", "Rol")
              .replace("User", "Kullanıcı")
              .replace("Guild", "Sunucu")}\n**TARİH**: ${moment(
              log.createdTimestamp
            ).format("LLL")}`
        )
        .join("\n**---------------------------**\n")}`
    );

    channel.send({ embeds: [embed] });
  },
};
