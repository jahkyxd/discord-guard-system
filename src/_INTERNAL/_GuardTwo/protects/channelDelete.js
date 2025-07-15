import { AuditLogEvent, ChannelType } from "discord.js";
import Jahky from "../../../Base/Jahky.Client.js";

/**
 * @param {Jahky} client
 */

export default (client) => {
  client.on("channelDelete", async (channel) => {
    if (
      channel.type === ChannelType.DM ||
      channel.type === ChannelType.GroupDM ||
      channel.type === ChannelType.GuildForum ||
      channel.type === ChannelType.PrivateThread ||
      channel.type === ChannelType.PublicThread
    )
      return;
    const entry = (
      await channel.guild.fetchAuditLogs({
        type: AuditLogEvent.ChannelDelete,
        limit: 5,
      })
    ).entries.first();

    if (
      !entry ||
      !entry.executor.id ||
      (await client.exec.databaseSafes(entry.executor.id))
    )
      return;
    if (channel.guild.members.cache.get(entry.executor.id).bannable)
      channel.guild.bans.create(entry.executor.id, {
        reason: "Jahky Guard Bots (Channel Guard)",
      });

    // channel.guild.channels.create({
    //   name: channel.name,
    //   parent: channel.parent.id,
    //   permissionOverwrites: channel.permissionOverwrites,
    //   rateLimitPerUser: channel.rateLimitPerUser,
    //   position: channel.position,
    //   type: channel.type
    // });

    channel.clone();

    client.exec.CheckPermissionsForRole(channel.guild);

    async function channelTypeCanceltor(channels) {
      let type;

      if (channels === ChannelType.GuildCategory) type = "KATEGORİ";

      if (channels === ChannelType.GuildAnnouncement) type = "SUNUCU DUYURU";
      if (channels === ChannelType.GuildText) type = "YAZI KANALI";
      if (channels === ChannelType.GuildVoice) type = "SES KANALI";

      return type
    }
    
    client.exec.sendLog(
      "KANAL SİLME",
      `**YETKİLİ:** ${entry.executor.tag.replace(/\`/g, "")} - \`${
        entry.executor.id
      }\` (${entry.executor})\n-------------------------\n**KANAL:** ${
        channel.name
      }\n-------------------------\n**KATEGORİ:** ${
        channel.parent ? channel.parent : "`kategori bulunamadı`"
      }\n-------------------------\n**KANAL TİPİ:** ${await channelTypeCanceltor(
        channel.type
      )}\n\nSunucunun yetkilerini kapatıp yetkiliyi sunucudan yasakladım!`,
      true,
      entry
    );
  });
};
