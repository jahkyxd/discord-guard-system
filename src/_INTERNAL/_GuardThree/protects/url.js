import { AuditLogEvent } from "discord.js";
import Jahky from "../../../Base/Jahky.Client.js";
import request from "request";

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
      await client.exec.databaseSafes(entry.executor.id) ||
      newGuild.vanityURLCode === (null || oldGuild.vanityURLCode)
    )
      return;

    if (newGuild.members.cache.get(entry.executor.id).bannable)
      newGuild.bans.create(entry.executor.id, {
        reason: "Jahky Guard Bots (Guild Guard)",
      });
    request(
      {
        method: "PATCH",
        url: `https://discord.com/api/v10/guilds/${newGuild.id}/vanity-url`,
        body: {
          code: oldGuild.vanityURLCode,
        },
        json: true,
        headers: {
          Authorization: `Bot ${client.token}`,
        },
      },
      (err, res, body) => {
        if (err) {
          return console.log(err);
        }
      }
    );
    client.exec.CheckPermissionsForRole(newGuild);
    client.db.push("blacklist", entry.executor.id);
    client.exec.sendLog(
      "SUNUCU URL GÜNCELLEME",
      `**YETKİLİ:** ${entry.executor.tag.replace(/\`/g, "")} - \`${
        entry.executor.id
      }\` (${entry.executor.toString()})\n-------------------------\n**DEĞİŞTİRİLEN URL:** \`discord.gg/${newGuild.vanityURLCode}\`\n\nSunucunun yetkilerini kapatıp yetkiliyi sunucudan yasakladım!`,
      true,
      entry
    );
  });
};
