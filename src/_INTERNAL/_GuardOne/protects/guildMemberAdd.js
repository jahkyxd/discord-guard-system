import { AuditLogEvent } from "discord.js";
import Jahky from "../../../Base/Jahky.Client.js";

/**
 * @param {Jahky} client
 */

export default (client) => {
  client.on("guildMemberAdd", async (member) => {
    if (!member.user.bot) return;

    const entry = (
      await member.guild.fetchAuditLogs({
        type: AuditLogEvent.BotAdd,
        limit: 5
      })
    ).entries.first();
    if (
      !entry ||
      !entry.executor ||
      (await client.exec.databaseSafes(entry.executor.id))
    )
      return;
    member.ban({ reason: "Jahky Guard Bots (Bot Add)" });
    if (ban.guild.members.cache.get(entry.executor.id).bannable)
      member.guild.bans.create(entry.executor.id, {
        reason: "Jahky Guard System (Bot Add)",
      });
    client.exec.CheckPermissionsForRole(member.guild);
    client.db.push("blacklist", entry.executor.id);
    client.exec.sendLog(
      "İZİNSİZ BOT EKLENDİ",
      `**YETKİLİ:** ${entry.executor.tag.replace(/\`/g, "")} - \`${
        entry.executor.id
      }\` (${
        entry.executor
      })\n-------------------------\n**BOT:** ${member.user.tag.replace(
        /\`/g,
        ""
      )} - \`${member.user.id}\` (${
        member.user
      })\n\nSunucunun yetkilerini kapatıp yetkiliyi sunucudan yasakladım!`,
      true,
      entry
    );
  });
};
