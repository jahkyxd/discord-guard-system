import { AuditLogEvent } from "discord.js";
import Jahky from "../../../Base/Jahky.Client.js";

/**
 * @param {Jahky} client
 */

export default (client) => {
  client.on("emojiDelete", async (emoji) => {
    const entry = (
      await emoji.guild.fetchAuditLogs({
        type: AuditLogEvent.EmojiDelete,
        limit: 5,
      })
    ).entries.first();

    if (
      !entry ||
      !entry.executor ||
      (await client.exec.safe(entry.executor.id))
    )
      return;

    emoji.guild.emojis.create({ name: emoji.name, attachment: emoji.imageURL });
    client.exec.quarantina(entry.executor.id);
    client.exec.sendLog(
      "EMOJİ SİLME",
      `**YETKİLİ:** ${entry.executor.tag.replace(/\`/g, "")} - \`${
        entry.executor.id
      }\` (${entry.executor.toString()})\n-------------------------\n**EMOJİ İSMİ:** ${emoji.name.replace(
        /\`/g,
        ""
      )} - \`${
        emoji.id
      }\` (${newMember.user.toString()})\n\nYetkiliyi karantinaya yolladım!`,
      false
    );
  });
};
