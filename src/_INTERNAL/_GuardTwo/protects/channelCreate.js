import { AuditLogEvent, ChannelType } from "discord.js";
import Jahky from "../../../Base/Jahky.Client.js";

/**
 * @param {Jahky} client
 */

export default (client) => {
  client.on("channelCreate", async (channel) => {
    if (
      channel.type === ChannelType.DM ||
      channel.type === ChannelType.GroupDM ||
      channel.type === ChannelType.GuildForum ||
      channel.type === ChannelType.PrivateThread ||
      channel.type === ChannelType.PublicThread ||
      channel.type === ChannelType.PrivateThread
    )
      return;
    const entry = await channel.guild
      .fetchAuditLogs({
        type: AuditLogEvent.ChannelCreate,
        limit: 5,
      })
      .then((x) => x.entries.first());

    if (
      !entry ||
      !entry.executor ||
      (await client.exec.safe(entry.executor.id))
    )
      return;
    client.exec.quarantina(entry.executor.id);
    channel.delete("Jahky Channel Guard");


    async function channelTypeCanceltor(channels) {
      let type;

      if (channels === ChannelType.GuildCategory) type = "KATEGORİ";

      if (channels === ChannelType.GuildAnnouncement) type = "SUNUCU DUYURU";
      if (channels === ChannelType.GuildText) type = "YAZI KANALI";
      if (channels === ChannelType.GuildVoice) type = "SES KANALI";

      return type;
    }

    client.exec.sendLog(
      "KANAL OLUŞTURMA",
      `**YETKİLİ:** ${entry.executor.tag.replace(/\`/g, "")} - \`${
        entry.executor.id
      }\` (${entry.executor})\n-------------------------\n**KANAL:** ${
        channel.name
      }\n-------------------------\n**KATEGORİ:** ${
        channel.parent ? channel.parent : "`kategori bulunamadı`"
      }\n-------------------------\n**KANAL TİPİ:** ${await channelTypeCanceltor(
        channel.type
      )}\n\nYetkiliyi karantinaya yolladım!`,
      false
    );
  });
};
