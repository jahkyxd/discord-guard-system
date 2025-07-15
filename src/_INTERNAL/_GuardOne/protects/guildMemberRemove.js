import { AuditLogEvent } from "discord.js";
import Jahky from "../../../Base/Jahky.Client.js";

/**
 * @param {Jahky} client
 */

export default (client) => {
  client.on("guildMemberRemove", async (member) => {
    const entry = (
      await member.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberKick,
        limit: 5,
      })
    ).entries.first();
    if (!entry || !entry.executor) return;
    if (await client.exec.safe(entry.executor.id)) {
      if (await client.exec.databaseSafes(entry.executor.id)) return;
      const old = client.limit.get(`${entry.executor.id}_kick`);
      client.limit.set(`${entry.executor.id}_kick`, old ? old + 1 : 1);
      const limit = client.limit.get(`${entry.executor.id}_kick`);
      if (limit === client.limits.kick) {
        if (ban.guild.members.cache.get(entry.executor.id).bannable)
          member.guild.bans.create(entry.executor.id, {
            reason: "Jahky Guard Bots (Kick Limit)",
          });
        client.exec.CheckPermissionsForRole(member.guild);
        client.db.push("blacklist", entry.executor.id);
        client.limit.delete(`${entry.executor.id}_kick`);
        client.exec.sendLog(
          "SAĞ TIK KİCK LİMİT",
          `**YETKİLİ:** ${entry.executor.tag.replace(/\`/g, "")} - \`${
            entry.executor.id
          }\` (${
            entry.executor
          })\n-------------------------\n**KULLANICI:** ${member.user.tag.replace(
            /\`/g,
            ""
          )} - \`${member.user.id}\` (${
            member.user
          })\n-------------------------\n**BELİRTTİĞİ SEBEP:** ${
            entry.reason ? entry.reason : "`Geçerli Sebep Bulunamadı`"
          }\n\nSunucunun yetkilerini kapatıp yetkiliyi sunucudan yasakladım!`,
          true,
          entry
        );
      }
    } else {
      if (ban.guild.members.cache.get(entry.executor.id).bannable)
        member.guild.bans.create(entry.executor.id, {
          reason: "Jahky Guard Bots (Kick)",
        });
      client.exec.CheckPermissionsForRole(member.guild);
      client.db.push("blacklist", entry.executor.id);
      client.exec.sendLog(
        "SAĞ TIK KİCK LİMİT",
        `**YETKİLİ:** ${entry.executor.tag.replace(/\`/g, "")} - \`${
          entry.executor.id
        }\` (${
          entry.executor
        })\n-------------------------\n**KULLANICI:** ${member.user.tag.replace(
          /\`/g,
          ""
        )} - \`${member.user.id}\` (${
          member.user
        })\n-------------------------\n**BELİRTTİĞİ SEBEP:** ${
          entry.reason ? entry.reason : "`Geçerli sebeb bulunamadı`"
        }\n\nSunucunun yetkilerini kapatıp yetkiliyi sunucudan yasakladım!`,
        true,
        entry
      );
    }
  });
};
