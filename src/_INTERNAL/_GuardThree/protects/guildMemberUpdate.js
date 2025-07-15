import { AuditLogEvent } from "discord.js";
import Jahky from "../../../Base/Jahky.Client.js";

/**
 * @param {Jahky} client
 */

export default (client) => {
  client.on("guildMemberUpdate", async (oldMember, newMember) => {
    const entry = (
      await newMember.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberUpdate,
        limit: 5,
      })
    ).entries.first();

    if (
      !entry ||
      !entry.executor ||
      (await client.exec.safe(entry.executor.id))
    )
      return;

    if (oldMember.user.username !== newMember.user.username) {
      client.exec.quarantina(entry.executor.id);
      client.exec.sendLog(
        "İSİM DEĞİŞTİRME",
        `**YETKİLİ:** ${entry.executor.tag.replace(/\`/g, "")} - \`${
          entry.executor.id
        }\` (${entry.executor.toString()})\n-------------------------\n**KULLANICI:** ${oldMember.user.tag.replace(
          /\`/g,
          ""
        )} - \`${
          newMember.user.id
        }\` (${newMember.user.toString()})\n-------------------------\n**ESKİ İSİM:** ${
          oldMember.user.username
        }\n-------------------------\n**YENİ İSİM:** ${
          newMember.user.username
        }\n\nYetkiliyi karantinaya yolladım!!`,
        false
      );
      newMember.guild.members.cache
        .get(newMember.user.id)
        .setNickname(oldMember.user.username);
    }
  });
};
