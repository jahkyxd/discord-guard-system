import config from "../../../../config.js";
import Jahky from "../../../Base/Jahky.Client.js";
import { AuditLogEvent } from "discord.js";

/**
 * @param {Jahky} client
 */

export default (client) => {
  client.on("guildBanRemove", async (ban) => {
    const entry = (
      await ban.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberBanRemove,
        limit: 5,
      })
    ).entries.first();

    if (client.db.get(`blacklist`).includes(ban.user.id)) {
      if (
        !entry ||
        !entry.executor ||
        client.exec.databaseSafes(entry.executor.id)
      )
        return ban.guild.bans.create(ban.user.id, { reason: ban.reason ? ban.reason : "Jahky Guard Bots" });
  
      ban.guild.bans.create(ban.user.id, { reason: ban.reason ? ban.reason : "Jahky Guard Bots" });
      ban.guild.bans.create(entry.executor.id, { reason: "Jahky Guard Bots" });
      client.db.push("blacklist", entry.executor.id)
      client.exec.CheckPermissionsForRole(ban.guild);
      client.exec.sendLog(
        "BLACKLIST BAN"
        `**YETKILI:** ${entry.executor.tag.replace(/\`/g, "")} - \`${
        entry.executor.id
      }\` (${entry.executor.toString()})\n-------------------------\n**KULLANICI:** ${ban.user.tag.replace(
          /\`/g,
          ""
        )} - \`${
          newMember.user.id
        }\` (${newMember.user.toString()})\n\nSunucunun yetkilerini kapatıp yetkiliyi sunucudan yasakladım!`,
      true,
      entry
      );
    }

  });
};
