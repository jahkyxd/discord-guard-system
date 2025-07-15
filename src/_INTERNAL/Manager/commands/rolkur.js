import {
  Guild,
  Message,
  EmbedBuilder,
  TextChannel,
  User,
  codeBlock,
  AttachmentBuilder,
} from "discord.js";
import Jahky from "../../../Base/Jahky.Client.js";
import util from "util";

export default {
  name: "rolkur",

  /**
   *
   * @param {Jahky} client
   * @param {Message} message
   * @param {Array<String>} args
   * @param {EmbedBuilder} embed
   * @param {TextChannel} channel
   * @param {User} author
   * @param {Guild} guild
   */

  async execute(client, message, args, embed, channel, author, guild) {
    if (!args[0]) return channel.send({ content: "rol belirt!" });
    const rolData = client.db.get(`roles_${guild.id}_${args[0]}`);
    let rolMemberData = client.db.get(`roleMembers_${guild.id}_${args[0]}`);
    if (!rolData)
      return channel.error(
        message,
        "Veritabanımda rol ile ilgili veri bulamadım!"
      );
    if (!rolMemberData) rolMemberData = client.db.get(`spare_${args[0]}`);

    if (!rolMemberData) {
      channel.send({
        embeds: [
          embed.setDescription(
            `**${rolData.name}** Adlı rol kurulumu başlatıldı! Veritabanımda rol kullanıcı verisi bulunmadığı için dağıtım yapılmıyor.`
          ),
        ],
      });
      guild.roles
        .create({
          ...rolData,
        })
        .then((x) => {
          channel.send({
            embeds: [
              embed.setDescription(
                `${x.toString()} Rolü oluşturuldu! **KANAL - ROL** Ayarlamaları yapılıyor ...`
              ),
            ],
          });
          client.exec.channelPermissionsConfigs(args[0], x.id).then(() =>
            channel.send({
              embeds: [
                embed.setDescription(
                  `${x.toString()} Rolünün **KANAL - ROL** ayarlamaları tamamlandı!`
                ),
              ],
            })
          );
        });
      return;
    } else {
      channel.send({
        embeds: [
          embed.setDescription(
            `**${rolData.name}** Adlı rol kurulumu başlatıldı! Veritabanımda **${rolMemberData.length}** kullanıcı verisi buldum dağıtım başlatılıyor.`
          ),
        ],
      });
      guild.roles.create({ ...rolData }).then((x) => {
        channel.send({
          embeds: [
            embed.setDescription(
              `${x.toString()} Rolünü oluşturuldu! **KANAL - ROL** Ayarlamaları yapılıyor ...`
            ),
          ],
        });
        client.exec.channelPermissionsConfigs(args[0], x.id).then(() =>
          channel.send({
            embeds: [
              embed.setDescription(
                `${x.toString()} Rolünün **KANAL - ROL** ayarlamaları tamamlandı!`
              ),
            ],
          })
        );
        client.exec.memberAdd_Role(rolMemberData, x.id);
      });
    }
  },
};
