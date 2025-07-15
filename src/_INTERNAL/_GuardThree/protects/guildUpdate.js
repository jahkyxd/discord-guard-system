import { AuditLogEvent } from "discord.js";
import Jahky from "../../../Base/Jahky.Client.js";

/**
 * @param {Jahky} client
 */

export default (client) => {
  client.on("guildUpdate", async (oldGuild, newGuild) => {
    const entry = (
      await newGuild.fetchAuditLogs({
        type: AuditLogEvent.GuildUpdate,
        limit: 5,
      })
    ).entries.first();

    if (
      !entry ||
      !entry.executor ||
      (await client.exec.databaseSafes(entry.executor.id))
    )
      return;

    if (newGuild.members.cache.get(entry.executor.id).bannable)
      newGuild.bans.create(entry.executor.id, {
        reason: "Jahky Guard Bots (Guild Guard)",
      });

 

    await newGuild.setName(oldGuild.name);
    if (oldGuild.banner) newGuild.setBanner(oldGuild.bannerURL());
    if (oldGuild.icon) newGuild.setIcon(oldGuild.iconURL());
    client.exec.CheckPermissionsForRole(newGuild);
    client.db.push("blacklist", entry.executor.id);
    client.exec.sendLog(
      "SUNUCU GÜNCELLEME",
      `**YETKİLİ:** ${entry.executor.tag.replace(/\`/g, "")} - \`${
        entry.executor.id
      }\` (${entry.executor.toString()})\n\nSunucunun yetkilerini kapatıp yetkiliyi sunucudan yasakladım!`,
      true,
      entry
    );
  });
};
