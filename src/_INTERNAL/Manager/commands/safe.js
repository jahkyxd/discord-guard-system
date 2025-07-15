import Jahky from "../../../Base/Jahky.Client.js";
import {
  Message,
  TextChannel,
  User,
  Guild,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";
import moment from "moment";
moment.locale("tr");

export default {
  name: "safe",

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

  async execute(client, message, args, embed, channel, author, guild, prefix) {
    if (!client.db.get(`code_${author.id}`))
      return channel.error(
        message,
        "Bu komutu kullanabilmek için öncelikle 2FA doğrulamayı onaylamanız lazım!"
      );

    client.mentions.length = 0;

    if (message.mentions.members)
      message.mentions.members.map((x) => client.mentions.push(x));
    if (message.mentions.roles)
      message.mentions.roles.map((x) => client.mentions.push(x));

    if (client.mentions.length === 0 && args[0] !== "list")
      return channel.error(
        message,
        `Lütfen sisteme eklenilecek olan kişileri etiketleyin\n\nörn: ${prefix}safe [@Jahky./ID]`
      );

    if (client.mentions.length === 0 && args[0] === "list") {
      const memberArray = new Array();
      const roleArray = new Array();
      client.db.get("safe").map((x) => {
        if (guild.members.cache.get(x)) memberArray.push(x);
        if (guild.roles.cache.get(x)) roleArray.push(x);
      });

      return channel.send({
        embeds: [
          embed.setDescription(
            `Safe sistemde bulunan **KULLANICILAR**\n\n${memberArray
              .map((x) => guild.members.cache.get(x).toString())
              .join(
                "\n"
              )}\n**------------------------------------**\nSafe sistemde bulunan **ROLLER**\n\n${roleArray
              .map((x) => guild.roles.cache.get(x).toString())
              .join("\n")}`
          ),
        ],
      });
    }

    const AddingSafes = new Array();
    const RemovingSafes = new Array();

    client.mentions.map((x) => {
      if (client.db.get("safe")) {
        if (client.db.get("safe").includes(x.id)) RemovingSafes.push(x);
        else AddingSafes.push(x);
      } else {
        AddingSafes.push(x);
      }
    });

    const messages = await channel.send({
      embeds: [
        embed.setDescription(
          `**Safe sisteme eklenilecek kullanıcı/roler:**\n${AddingSafes.map(
            (x) => x.toString()
          ).join(
            ","
          )}\n**Sistemden kaldırılacak kullanıcı/roller:**\n${RemovingSafes.map(
            (x) => x.toString()
          ).join(
            ","
          )}\n\nİşlemi onaylamak için **${prefix}evet** iptal için **${prefix}hayır** komutlarını kullanınız!`
        ),
      ],
    });

    const filter = (msg) =>
      msg.author.id === author.id &&
      ["evet", "hayır"].some((ceki) =>
        msg.content.toLowerCase().includes(ceki)
      );

    const collector = await channel.awaitMessages({
      filter,
      time: 30000,
      max: 1,
    });

    if (!collector) {
      messages.edit({
        embeds: [
          embed.setDescription(
            "Belirtilen sürede işlem belirtmediğiniz için sisteme ekleme/çıkarma iptal edildi!"
          ),
        ],
      });
    }

    const content = collector.first().content.toLowerCase();

    if (content.includes("evet")) {
      const button = new ButtonBuilder()
        .setCustomId("OpenModal3")
        .setLabel("2FA Doğrulama")
        .setStyle(ButtonStyle.Primary);

      channel.send({
        embeds: [
          embed.setDescription(
            "Safe sisteme **EKLEME/ÇIKARMA** yapmak için 2FA kodunu girin!"
          ),
        ],
        components: [new ActionRowBuilder().addComponents(button)],
      });
    }

    if (content.includes("hayır")) {
      messages.edit({
        embeds: [embed.setDescription("İşleminiz iptal edilmiştir :x:")],
      });
    }
  },
};
