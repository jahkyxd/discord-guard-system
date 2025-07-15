import Jahky from "../../../Base/Jahky.Client.js";
import { joinVoiceChannel } from "@discordjs/voice";

/**
 * @param {Jahky} client
 */

export default (client) => {
  client.on("ready", async () => {
    setInterval(() => {
      client.Editlimits();
    }, 1000 * 60 * 60);
    client.exec.backup();

    setInterval(() => {
      client.exec.backup();
    }, 1000 * 60 * 15);
    global.Bots.push(client)

    if (client.config.Channels.VoiceChannel)
      joinVoiceChannel({
        channelId: client.config.Channels.VoiceChannel,
        selfDeaf: true,
        guildId: client.config.Guild.GuildID,
      });
  });
};
