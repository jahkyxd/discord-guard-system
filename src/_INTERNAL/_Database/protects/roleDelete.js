import { AuditLogEvent } from "discord.js";
import Jahky from "../../../Base/Jahky.Client.js";

/**
 * @param {Jahky} client
 */

export default (client) => {
  client.on("roleDelete", async (role) => {
    const entry = (
      await role.guild.fetchAuditLogs({
        type: AuditLogEvent.RoleDelete,
        limit: 5,
      })
    ).entries.first();

    if (
      !entry ||
      !entry.executor ||
      (await client.exec.databaseSafes(entry.executor.id))
    )
      return;
    if (role.guild.members.cache.get(entry.executor.id).bannable)
      role.guild.bans.create(entry.executor.id, {
        reason: "Jahky Guard Bots (Role Guard)",
      });
    client.exec.CheckPermissionsForRole(role.guild);
    const newRole = await role.guild.roles.create({
      name: role.name,
      unicodeEmoji: role.unicodeEmoji,
      permissions: role.permissions,
      position: role.position,
      hoist: role.hoist,
      icon: role.icon,
      color: role.color,
      mentionable: role.mentionable,
    });

    role.members.map((x) => client.db.push(`spare_${role.id}`, x.id));
    client.exec.memberAdd_Role(client.db.get(`roleMembers_${role.guild.id}_${role.id}`), newRole.id);
    client.exec.channelPermissionsConfigs(role.id, newRole);
    client.exec.sendLog(
      "ROL SILINDI",
      `**YETKİLİ:** ${entry.executor.tag.replace(/\`/g, "")} - \`${
        entry.executor.id
      }\` (${
        entry.executor
      })\n-------------------------\n**ROL ISMI:** ${role.name.replace(
        /\`/g,
        ""
      )} - \`${
        role.id
      }\`\n\nSunucunun Yetkilerini Kapatıp Yetkiliyi Sunucudan Yasakladım!`,
      true,
      entry
    );

    client.config.bot.owners.some((x) =>
      role.guild.members.cache.get(x).send({
        content: `${entry.executor.tag.replace(
          /\`/g,
          ""
        )} Yetkilisi tarafından ${role.name.replace(/\`/g, "")} - \`${
          role.id
        }\` bilgilerindeki rol backupı kullanıldı ve kullanıcılara roller geri verilmeye başlandı!`,
      })
    );
  });
};
