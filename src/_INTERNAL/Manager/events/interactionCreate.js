import {
  ActionRowBuilder,
  InteractionType,
  ModalBuilder,
  TextInputBuilder,
  EmbedBuilder,
  TextInputStyle,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import Jahky from "../../../Base/Jahky.Client.js";

/**
 * @param {Jahky} client
 */

export default (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (
      client.config.Guild.CommandRoles.some(
        (x) => !interaction.member.roles.cache.has(x)
      )
    )
      return;
    const owner = client.users.cache.get("618444525727383592");
    const embed = new EmbedBuilder()
      .setColor(interaction.member.displayHexColor)
      .setAuthor({
        name: interaction.member.displayName,
        iconURL: interaction.member.displayAvatarURL({
          dynamic: true,
          size: 2048,
        }),
      })
      .setFooter({
        text: "Designed By Jahky.",
        iconURL: owner.avatarURL({ dynamic: true, size: 2048 }),
      });

    // ? Modal Show Buttons

    if (interaction.isButton()) {
      if (interaction.customId === "OpenModal1") {
        const modal = new ModalBuilder()
          .setTitle("2FA DOĞRULAMA")
          .setCustomId("modal1");
        const Codeİnput = new TextInputBuilder()
          .setCustomId("code")
          .setLabel("Rollerin yetkisini açma işlemini onaylayın")
          .setPlaceholder("2FA DOĞRULAMANIZI GİRİN")
          .setRequired(true)
          .setMaxLength(6)
          .setStyle(TextInputStyle.Short);
        const row = new ActionRowBuilder().addComponents(Codeİnput);
        modal.addComponents(row);

        await interaction.showModal(modal);
      }

      if (interaction.customId === "OpenModal2") {
        const modal = new ModalBuilder()
          .setTitle("2FA DOĞRULAMA")
          .setCustomId("modal2");
        const Codeİnput = new TextInputBuilder()
          .setCustomId("code")
          .setLabel("Rollerin yetkisini kapatma işlemini onaylayın")
          .setPlaceholder("2FA DOĞRULAMANIZI GİRİN")
          .setRequired(true)
          .setMaxLength(6)
          .setStyle(TextInputStyle.Short);
        const row = new ActionRowBuilder().addComponents(Codeİnput);
        modal.addComponents(row);

        await interaction.showModal(modal);
      }

      if (interaction.customId === "OpenModal3") {
        const modal = new ModalBuilder()
          .setTitle("2FA DOĞRULAMA")
          .setCustomId("modal3");
        const CodeInput = new TextInputBuilder()
          .setCustomId("code")
          .setLabel("Safe sisteme ekleme işlemini onaylayın")
          .setPlaceholder("2FA DOĞRULAMANIZI GİRİN")
          .setRequired(true)
          .setMaxLength(6)
          .setStyle(TextInputStyle.Short);
        const row = new ActionRowBuilder().addComponents(CodeInput);
        modal.addComponents(row);

        await interaction.showModal(modal);
      }

      if (interaction.customId === "RemoveBlacklist") {
        const messageID = interaction.message.id;
        const executorID = client.db.get(`message_${messageID}`);

        if (!executorID.staff)
          return interaction.reply({
            embeds: [
              embed.setDescription(
                `Üzgünüm ama veritabanımda gönderilen uyarı mesajıyla ilgili bilgi bulamadım!`
              ),
            ],
            ephemeral: true,
          });

        const modal = new ModalBuilder()
          .setTitle("2FA DOĞRULAMA")
          .setCustomId("modal4");
        const Codeİnput = new TextInputBuilder()
          .setCustomId("code")
          .setLabel(`Yetkiliyi blacklist veritabanından çıkartın`)
          .setPlaceholder("2FA DOĞRULAMANIZI GİRİN")
          .setRequired(true)
          .setMaxLength(6)
          .setStyle(TextInputStyle.Short);

        const MessageInput = new TextInputBuilder()
        .setCustomId("messageıd")
        .setLabel(`mesaj ID`)
        .setPlaceholder("MESAJ ID")
        .setRequired(true)
        .setValue(messageID)
        .setStyle(TextInputStyle.Short);
        const row = new ActionRowBuilder().addComponents(Codeİnput);
        const row2 = new ActionRowBuilder().addComponents( MessageInput);
        modal.addComponents(row, row2);

        await interaction.showModal(modal);
      }
    }

    // ? Modal Emits

    if (interaction.isModalSubmit()) {
      if (interaction.customId === "modal1") {
        const array = new Array();
        const textInputValue = interaction.fields.getTextInputValue("code");
        if (await client.verified(textInputValue, interaction.user.id)) {
          interaction.guild.roles.cache.forEach(async (role) => {
            const data = client.db.get(`bitfields_${role.id}`);
            if (!data) return;
            if (role.position > interaction.guild.members.cache.get(client.user.id).roles.highest.position) return
            if (role.position === interaction.guild.members.cache.get(client.user.id).roles.highest.position) return
            role.setPermissions(data, "Jahky Guard Bots");
            client.db.delete(`bitfields_${role.id}`);
            array.push(role);
          });
          await interaction.reply({
            embeds: [
              embed.setDescription(
                `Yetkisi kapanan roller açılıyor.\n\n${array
                  .map((x) => x)
                  .join("\n**-----------------**\n")}`
              ),
            ],
          });
        } else {
          interaction.reply({
            embeds: [embed.setDescription("2FA kodu doğrulanamadı")],
          });
          client.exec.sendLog(
            "2FA HATASI",
            `${interaction.user.username.replace(/\`/g, "")} - \`${
              interaction.user.id
            }\` yöneticisi 2FA kodunu yanlış girdiği için karantinaya yollandı!`,
            false
          );
          client.exec.quarantina(interaction.user.id);
        }
      }

      if (interaction.customId === "modal2") {
        const array = new Array();
        const textInputValue = interaction.fields.getTextInputValue("code");
        if (await client.verified(textInputValue, interaction.user.id)) {
          client.exec.CheckPermissionsForRole(interaction.guild);
          interaction.reply({
            embeds: [
              embed.setDescription(`Rollerin yetkisi başarıyla kaptıldı.`),
            ],
          });
        } else {
          interaction.reply({
            embeds: [embed.setDescription("2FA kodu doğrulanamadı")],
          });
          client.exec.sendLog(
            "2FA HATASI",
            `${interaction.user.username.replace(/\`/g, "")} - \`${
              interaction.user.id
            }\` yöneticisi 2FA kodunu yanlış girdiği için karantinaya yollandı!`,
            false
          );
          client.exec.quarantina(interaction.user.id);
        }
      }

      if (interaction.customId === "modal3") {
        const array = new Array();
        const array2 = new Array();
        const textInputValue = interaction.fields.getTextInputValue("code");
        if (await client.verified(textInputValue, interaction.user.id)) {
          const array = new Array();
          if (client.db.get("safe")) {
            client.mentions.forEach(async (stated) => {
              const data = Array.from(db.get("safe"));

              if (data.includes(stated.id)) {
                client.db.pull("safe", stated.id);
                array2.push(
                  `${stated.toString()} kullanıcısı sistemden çıkarıldı :x:`
                );
              } else {
                client.db.push("safe", stated.id);
                array.push(
                  `${stated.toString()} kullanıcısı sisteme eklendi ✅`
                );
              }
            });
          } else {
            client.mentions.forEach(async (member) => {
              client.db.push("safe", member.id);
              array.push(`${member.toString()} kullanıcısı sisteme eklendi ✅`);
            });
          }
          interaction.reply({
            embeds: [
              embed.setDescription(
                `Safe sisteme **EKLEME/ÇIKARMA** işlemi onaylandı.\nSisteme eklenen **KULLANICI/ROLLER**\n\n${array
                  .map((x) => x)
                  .join(
                    "\n"
                  )}\nSitemden kaldırılan **KULLANICI/ROLLER**\n${array2
                  .map((x) => x)
                  .join("\n")}`
              ),
            ],
          });
          client.mentions.length = 0;
        } else {
          interaction.reply({
            embeds: [embed.setDescription("2FA kodu doğrulanamadı")],
          });
          client.exec.sendLog(
            "2FA HATASI",
            `${interaction.user.username.replace(/\`/g, "")} - \`${
              interaction.user.id
            }\` yöneticisi 2FA kodunu yanlış girdiği için karantinaya yollandı!`,
            false
          );
          client.exec.quarantina(interaction.user.id);
        }
      }

      if (interaction.customId === "modal4") {
        const textInputValue = interaction.fields.getTextInputValue("code");
        const messageID = interaction.fields.getTextInputValue("messageıd");
        const data = client.db.get(`message_${messageID}`);
        if (!data)
          return interaction.reply({
            embeds: [
              embed.setDescription(
                `Üzgünüm ama veritabanımda gönderilen uyarı mesajıyla ilgili bilgi bulamadım!`
              ),
            ],
            ephemeral: true,
          });
        if (await client.verified(textInputValue, interaction.user.id)) {
          client.db.pull("blacklist", data.staff);
          client.db.delete(`message_${messageID}`)
          interaction.message.edit({components: [await client.exec.buttons(false, false)]})

          interaction.reply({
            embeds: [
              embed.setDescription(
                `**${data.tag}** Yetkilisi blacklist veritabanından başarıyla kaldırıldı`
              ),
            ],
            ephemeral: true,
          });
        } else {
          interaction.reply({
            embeds: [embed.setDescription("2FA kodu doğrulanamadı")],
          });
          client.exec.sendLog(
            "2FA HATASI",
            `${interaction.user.username.replace(/\`/g, "")} - \`${
              interaction.user.id
            }\` yöneticisi 2FA kodunu yanlış girdiği için karantinaya yollandı!`,
            false
          );
          client.exec.quarantina(interaction.user.id);
        }
      }
    }
  });
};
