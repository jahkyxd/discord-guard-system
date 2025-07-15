import config from "../../../config.js";
import Jahky from "../../Base/Jahky.Client.js";
import { joinVoiceChannel } from "@discordjs/voice";

const Tokens = config.bot.tokens;
const Bots = (global.Bots = []);
let number = 0;

for (const token of Tokens) {
    if (token) {
        const client = new Jahky();

        client.on("ready", async () => {
            if (client.config.Channels.VoiceChannel)
              joinVoiceChannel({
                channelId: client.config.Channels.VoiceChannel,
                selfDeaf: true,
                guildId: client.config.Guild.GuildID,
              });

            client.pussy = false;
            client.ceki = 0;

            Bots.push(client);

            setInterval(() => {
              client.exec.spam()
            }, 1500);
          });
          number++;

        client
            .login(token)
            .then(() =>
                client.logger.log(
                    `${client.user.tag} Olarak #${number} Destekçi botu aktifleştirildi!`
                )
            );
    }
}
