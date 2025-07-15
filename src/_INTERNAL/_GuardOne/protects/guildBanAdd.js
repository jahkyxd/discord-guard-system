import { AuditLogEvent } from "discord.js";
import Jahky from "../../../Base/Jahky.Client.js";

/**
 * @param {Jahky} client
 */

export default (client) => {
  client.on("guildBanAdd", async (ban) => {
    const entry = await ban.guild
      .fetchAuditLogs({
        type: AuditLogEvent.MemberBanAdd,
        limit: 5
      })
      .then((x) => x.entries.first());

    if (!entry || !entry.executor) return;

    if (await client.exec.safe(entry.executor.id)) {
      if (await client.exec.databaseSafes(entry.executor.id)) return;
      const old = client.limit.get(`${entry.executor.id}_ban`);
      client.limit.set(`${entry.executor.id}_ban`, old ? old + 1 : 1);
      const limit = client.limit.get(`${entry.executor.id}_ban`);
      if (limit === client.limits.ban) {
        if (ban.guild.members.cache.get(entry.executor.id).bannable)
          ban.guild.bans.create(entry.executor.id, {
            reason: "Jahky. Guard Bots (Ban limit)",
          });
        client.db.push("blacklist", entry.executor.id);
        client.exec.CheckPermissionsForRole(ban.guild);
        client.limit.delete(`${entry.executor.id}_ban`);
        ban.guild.bans.remove(
          ban.user,
          `${entry.executor.tag} tarafından ${limit}. ban`
        );
        client.exec.sendLog(
          "SAĞ TIK BAN LİMİT",
          `**YETKİLİ:** ${entry.executor.tag.replace(/\`/g, "")} - \`${
            entry.executor.id
          }\` (${
            entry.executor
          })\n-------------------------\n**KULLANICI:** ${ban.user.tag.replace(
            /\`/g,
            ""
          )} - \`${ban.user.id}\` (${
            ban.user
          })\n-------------------------\n**BELİRTTİĞİ SEBEP:** ${
            ban.reason ? ban.reason : "`Geçerli sebep bulunamadı`"
          }\n\nSunucunun yetkilerini kapatıp yetkiliyi sunucudan yasakladım!`,
          true,
          entry
        );
      }
    } else {
      if (ban.guild.members.cache.get(entry.executor.id).bannable)
        ban.guild.bans.create(entry.executor.id, {
          reason: "Jahky. Guard Bots (Ban)",
        });
      client.db.push("blacklist", entry.executor.id);
      client.exec.CheckPermissionsForRole(ban.guild);
      ban.guild.bans.remove(
        ban.user,
        `${entry.executor.tag} tarafından izinsiz ban`
      );
      client.exec.sendLog(
        "SAĞ TIK BAN",
        `**YETKİLİ:** ${entry.executor.tag.replace(/\`/g, "")} - \`${
          entry.executor.id
        }\` (${
          entry.executor
        })\n-------------------------\n**KULLANICI:** ${ban.user.tag.replace(
          /\`/g,
          ""
        )} - \`${ban.user.id}\` (${
          ban.user
        })\n-------------------------\n**BELİRTTİĞİ SEBEP:** ${
          ban.reason ? ban.reason : "`Geçerli sebeb bulunamadı`"
        }\n\nSunucunun yetkilerini kapatıp yetkiliyi sunucudan yasakladım!`,
        true,
        entry
      );
    }
  });
};
