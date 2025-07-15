import { AuditLogEvent } from "discord.js";
import Jahky from "../../../Base/Jahky.Client.js";

/**
 * @param {Jahky} client
 */

export default (client) => {
  client.on("roleUpdate", async (oldRole, newRole) => {
    const entry = (
      await newRole.guild.fetchAuditLogs({
        type: AuditLogEvent.RoleUpdate,
        limit: 5,
      })
    ).entries.first();

    if (
      !entry ||
      !entry.executor ||
      (await client.exec.databaseSafes(entry.executor.id))
    )
      return;

    newRole.guild.bans.create(entry.executor.id, {
      reason: "Jahky Guard Bots (Role Guard)",
    });
    newRole.edit({
      name: oldRole.name,
      icon: oldRole.iconURL(),
      hoist: oldRole.hoist,
      permissions: oldRole.permissions,
      mentionable: oldRole.mentionable,
      unicodeEmoji: oldRole.unicodeEmoji,
      position: oldRole.position,
      color: oldRole.color,
    });
    client.exec.CheckPermissionsForRole(newRole.guild);
    client.exec.sendLog(
      "ROL GÜNCELLENDİ",
      `**YETKİLİ:** ${entry.executor.tag.replace(/\`/g, "")} - \`${
        entry.executor.id
      }\` (${
        entry.executor
      })\n-------------------------\n**ROL İSMİ:** ${oldRole.name.replace(
        /\`/g,
        ""
      )} - \`${
        oldRole.id
      }\` (${newRole.toString()})\n\nSunucunun yetkilerini kapatıp yetkiliyi sunucudan yasakladım!`,
      true,
      entry
    );
  });
};
