import { AuditLogEvent } from "discord.js";
import Jahky from "../../../Base/Jahky.Client.js";

/**
 * @param {Jahky} client
 */

export default (client) => {
  client.on("stickerDelete", async (sticker) => {
    const entry = (
      await sticker.guild.fetchAuditLogs({
        type: AuditLogEvent.StickerDelete,
      })
    ).entries.first();

    if (
      !entry ||
      !entry.executor.id ||
      (await client.exec.safe(entry.executor.id))
    )
      return;
    sticker.guild.stickers.create({
      name: sticker.name,
      tags: sticker.tags,
      description: sticker.description,
      file: sticker.url,
    });
    client.exec.quarantina(entry.executor.id);
    client.exec.sendLog(
      "STİCKER SİLME",
      `**YETKİLİ:** ${entry.executor.tag.replace(/\`/g, "")} - \`${
        entry.executor.id
      }\` (${entry.executor})\n-------------------------\n**STİCKER:** ${
        sticker.name
      }\n\nYetkiliyi karantinaya yolladım!`,
      false
    );
  });
};
