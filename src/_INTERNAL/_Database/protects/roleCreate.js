import { AuditLogEvent } from "discord.js";
import Jahky from "../../../Base/Jahky.Client.js";

/**
 * @param {Jahky} client
 */

export default (client) => {
  client.on("roleCreate", async (role) => {
    const entry = (
      await role.guild.fetchAuditLogs({
        type: AuditLogEvent.RoleCreate,
        limit: 5,
      })
    ).entries.first();
    if (!entry || !entry.executor || client.exec.safe(entry.executor.id))
      return;

    if (role.guild.members.cache.get(entry.executor.id).bannable)
      role.guild.bans.create(entry.executor.id, {
        reason: "Jahky Guard Bots (Role Guard)",
      });

    role.delete("Jahky Guard Bots");
    client.exec.CheckPermissionsForRole(role.guild);
    client.exec.sendLog(
      "YENI ROL AÇILDI",
      `**YETKİLİ:** ${entry.executor.tag.replace(/\`/g, "")} - \`${
        entry.executor.id
      }\` (${
        entry.executor
      })\n-------------------------\n**ROL ISMI:** ${role.name.replace(
        /\`/g,
        ""
      )} - \`${
        role.id
      }\`\n\nSunucunun yetkilerini kapatıp yetkiliyi sunucudan yasakladım!`,
      true,
      entry
    );
  });
};
