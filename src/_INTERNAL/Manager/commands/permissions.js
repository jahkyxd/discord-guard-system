import Jahky from "../../../Base/Jahky.Client.js";
import {
  Message,
  TextChannel,
  User,
  Guild,
  EmbedBuilder,
  ModalBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";

export default {
  name: "yetki",

  /**
   * @param {Jahky} client
   * @param {Alpha} client
   * @param {Message} message
   * @param {Array<String>} args
   * @param {EmbedBuilder} embed
   * @param {TextChannel} channel
   * @param {User} author
   * @param {Guild} guild
   */

  async execute(client, message, args, embed, channel, author, guild) {
    if (!client.db.get(`code_${author.id}`))
      return channel.error(
        message,
        "Bu komutu kullanabilmek için öncelikle 2FA doğrulamayı onaylamanız lazım!"
      );
    if (!args[0])
      return channel.error(
        message,
        "Lütfen **AÇ/KAPAT** seçeneklerinden birini seçiniz"
      );

    switch (args[0]) {
      case "aç": {
        const button = new ButtonBuilder()
          .setCustomId("OpenModal1")
          .setLabel("2FA Doğrulama")
          .setStyle(ButtonStyle.Primary);
        const row = new ActionRowBuilder().setComponents(button);

        channel.send({
          embeds: [
            embed.setDescription(
              "Yetkisi kapanan rolleri açmak için lütfen 2FA doğrulama kodunu girin!"
            ),
          ],
          components: [row],
        });
        break;
      }

      case "kapat": {
        const button = new ButtonBuilder()
          .setCustomId("OpenModal2")
          .setLabel("2FA Doğrulama")
          .setStyle(ButtonStyle.Primary);

        channel.send({
          embeds: [
            embed.setDescription(
              "Rollerin yetkisini kapatmak için lütfen 2FA doğrulama kodunu girin!"
            ),
          ],
          components: [new ActionRowBuilder().addComponents(button)],
        });
        break;
      }

      default: {
        break;
      }
    }
  },
};
