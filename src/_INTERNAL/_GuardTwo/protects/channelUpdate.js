import { AuditLogEvent, ChannelType } from "discord.js";
import Jahky from "../../../Base/Jahky.Client.js";

/**
 * @param {Jahky} client
 */

export default (client) => {
  client.on("channelUpdate", async (oldChannel, newChannel) => {
    if (
      newChannel.type === ChannelType.DM ||
      newChannel.type === ChannelType.GuildForum ||
      newChannel.type === ChannelType.GroupDM ||
      newChannel.type === ChannelType.PrivateThread ||
      newChannel.type === ChannelType.PublicThread
    )
      return console.log("a");

    const entry = (
      await newChannel.guild.fetchAuditLogs({
        type: AuditLogEvent.ChannelUpdate,
      })
    ).entries.first();

    if (
      !entry ||
      !entry.executor.id ||
      (await client.exec.safe(entry.executor.id))
    )
      return;
    client.exec.quarantina(entry.executor.id);
    newChannel.edit({
      name: oldChannel.name,
      defaultAutoArchiveDuration: oldChannel.defaultAutoArchiveDuration,
      rateLimitPerUser: oldChannel.rateLimitPerUser,
      rtcRegion: oldChannel.rtcRegion,
      userLimit: oldChannel.userLimit,
      permissionOverwrites: oldChannel.permissionOverwrites.cache,
      parent: oldChannel.parent,
      position: oldChannel.position,
      videoQualityMode: oldChannel.videoQualityMode,
      bitrate: oldChannel.bitrate,
      nsfw: oldChannel.nsfw,
    });
    client.exec.sendLog(
      "KANAL GÜNCELLEME",
      `**YETKİLİ:** ${entry.executor.tag.replace(/\`/g, "")} - \`${
        entry.executor.id
      }\` (${entry.executor})\n-------------------------\n**KANAL:** ${
        oldChannel.name
      } - (${oldChannel.toString()})\n-------------------------\n**KATEGORİ:** ${
        oldChannel.parent ? oldChannel.parent : "`kategori bulunamadı`"
      }\n\nYetkiliyi sunucudan yasakladım!`,
      false
    );
  });
};
