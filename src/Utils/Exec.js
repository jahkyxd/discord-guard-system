import Jahky from "../Base/Jahky.Client.js";
import {
  WebhookClient,
  Role,
  Guild,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js";
import config from "../../config.js";

class Exec {
  /**
   *
   * @param {Jahky} client
   */

  constructor(client) {
    this.client = client;
  }

  async backup() {
    let rolesize;
    this.client.guilds.cache
      .get(config.Guild.GuildID)
      .roles.cache.forEach(async (role) => {
        const roleChannelOverwrites = new Array();
        if (role.name === "@everyone") return;
        this.client.db.set(`roles_${role.guild.id}_${role.id}`, {
          name: role.name,
          color: role.hexColor,
          unicodeEmoji: role.unicodeEmoji,
          position: role.rawPosition,
          mentionable: role.mentionable,
          permissions: role.permissions,
          hoist: role.hoist,
        });

        this.client.db.set(
          `roleMembers_${role.guild.id}_${role.id}`,
          role.members.map((x) => x.id)
        );

        role.guild.channels.cache
          .filter((channel) => channel.permissionOverwrites.cache.has(role.id))
          .forEach((channel) => {
            let channelPerm = channel.permissionOverwrites.cache.get(role.id);
            let push = {
              id: channel.id,
              allow: channelPerm.allow.toArray(),
              deny: channelPerm.deny.toArray(),
            };
            roleChannelOverwrites.push(push);
          });

        this.client.db.set(`channelPerm_${role.id}`, roleChannelOverwrites);

        const i = role.guild.roles.cache.filter(
          (rls) => rls.name !== "@everyone"
        ).size;
        rolesize = i;
      });

    this.client.logger.log(
      `${rolesize} rolün yedeği başarılı bir şekilde alındı!`
    );
  }

  /**
   *
   * @param {Array} memberArray
   * @param {RoleID} roleID
   */

  async memberAdd_Role(memberArray, roleID) {
    if (memberArray.length === 0) return;
    const newRole = this.client.guilds.cache
      .get(this.client.config.Guild.GuildID)
      .roles.cache.get(roleID);
    let availableBots = global.Bots.filter((e) => !e.pussy);
    if (availableBots.length <= 0)
      availableBots = global.Bots.sort((x, y) => y.ceki - x.ceki).slice(
        0,
        Math.round(memberArray.length / global.Bots.length)
      );
    let perAnyBotMembers = Math.floor(
      memberArray.length / availableBots.length
    );
    if (perAnyBotMembers < 1) perAnyBotMembers = 1;
    for (let index = 0; index < availableBots.length; index++) {
      const bot = availableBots[index];
      if (!newRole) {
        console.log(
          `Olayından sonra ${bot.user.username} - rol tekrar silindi, döngü kırılıyor.`
        );
        break;
      }
      this.proccesBot(bot, true, perAnyBotMembers);
      let ids = memberArray.slice(
        index * perAnyBotMembers,
        (index + 1) * perAnyBotMembers
      );
      if (ids.length <= 0) {
        this.proccesBot(bot, false, -perAnyBotMembers);
        break;
      }
      let guild = newRole.guild;
      ids.every(async (id, index) => {
        bot.wait(index * 1000);
        const member = guild.members.cache.get(id);
        if (!member)
          return client.logger.error(`${id} kullanıcısı bulunamadı!`);
        member.roles
          .add(newRole)
          .then((x) =>
            new WebhookClient({
              id: this.client.config.Channels.databases.id,
              token: this.client.config.Channels.databases.token,
            }).send({
              content: `${member.user.username} - ${member.user.id} kullanıcısına ${newRole.name} - ${newRole.id} rolü verildi (${bot.user.username} - ${bot.user.id})`,
            })
          )
          .catch((err) =>
            new WebhookClient({
              id: this.client.config.Channels.databases.id,
              token: this.client.config.Channels.databases.token,
            }).send({
              content: `${member.user.username} - ${member.user.id} kullanıcısına ${newRole.name} - ${newRole.id} rolü verilemedi (${bot.user.username} - ${bot.user.id})`,
            })
          );
      });
      this.proccesBot(bot, false, -perAnyBotMembers);
    }
  }

  /**
   *
   * @param {Role.id} id
   * @param {Role} newRole
   */

  async channelPermissionsConfigs(id, newRole) {
    setTimeout(() => {
      let channelPerm = this.client.db.get(`channelPerm_${id}`);
      if (channelPerm)
        channelPerm.forEach((perm, index) => {
          let channel = this.client.guilds.cache
            .get(this.client.config.Guild.GuildID)
            .channels.cache.get(perm.id);
          if (!channel) return;
          setTimeout(() => {
            let newChannelPerm = {};
            perm.allow.forEach((p) => {
              newChannelPerm[p] = true;
            });
            perm.deny.forEach((p) => {
              newChannelPerm[p] = false;
            });
            channel.permissionOverwrites
              .create(newRole, newChannelPerm)
              .catch(console.error);
          }, index * 5000);
        });
    }, 5000);
  }

  async safe(executorID) {
    const member = this.client.guilds.cache
      .get(this.client.config.Guild.GuildID)
      .members.cache.get(executorID);
    if (
      Array.from(this.client.db.get("safe")).includes(executorID) ||
      Array.from(this.client.db.get("safe")).some((roleID) =>
        member.roles.cache.has(roleID)
      )
    )
      return true;
    else return false;
  }

  /**
   *
   * @param {Guild} guild
   */

  async CheckPermissionsForRole(guild) {
    guild.roles.cache
      .filter(
        (role) =>
          (role.managed &&
            role.position <
              guild.members.cache.get(this.client.user.id).roles.highest
                .position) ||
          (role.position !==
            guild.members.cache.get(this.client.user.id).roles.highest
              .position &&
            role.permissions.has("ManageGuild")) ||
          role.permissions.has("BanMembers") ||
          role.permissions.has("ManageRoles") ||
          role.permissions.has("ManageWebhooks") ||
          role.permissions.has("ManageNicknames") ||
          role.permissions.has("ManageChannels") ||
          role.permissions.has("KickMembers") ||
          role.permissions.has("Administrator")
      )
      .forEach(async (r) => {
        if (config.Guild.CloseAllperms.some((x) => r.id === x)) return;
        this.client.db.set(`bitfields_${r.id}`, r.permissions);
        await r
          .setPermissions(0n)
          .catch((err) => this.client.logger.error(`${err} permissions error`));
      });
  }

  async proccesBot(bot, pussy, job, equal = false) {
    bot.pussy = pussy;
    if (equal) bot.ceki = job;
    else bot.ceki += job;
    let index = global.Bots.findIndex((e) => e.user.id == bot.user.id);
    global.Bots[index] = bot;
  }

  async spam() {
    this.Spam = async function () {
      let guild = client.guilds.cache.get(config.Global.GuildID);
      if (!guild.vanityURLCode) return;
      if (guild.vanityURLCode !== config.Guild.url) {
        request({
          method: "PATCH",
          url: `https://discord.com/api/guilds/${config.Global.GuildID}/vanity-url`,
          headers: {
            Authorization: `Bot ${client.token}`,
          },
          json: {
            code: `${config.Guild.url}`,
          },
        });
      }
    };
  }

  /**
   * @param {userID} id
   */

  async databaseSafes(id) {
    if (
      config.bot.owners.includes(id) ||
      id === this.client.guilds.cache.get(config.Guild.GuildID).ownerId ||
      config.bot.BOTS.includes(id)
    ) {
      return true;
    } else return false;
  }

  /**
   *
   * @param {Boolean} removeBlacklist
   * @param {Boolean} RoleauthorityOpen
   * @returns
   */

  async buttons(removeBlacklist = false, RoleauthorityOpen = false) {
    const row = new ActionRowBuilder();
    if (removeBlacklist) {
      const removeBlacklistButton = new ButtonBuilder()
        .setCustomId("RemoveBlacklist")
        .setLabel("YETKİLİYİ KARA LİSTEDEN ÇIKAR")
        .setStyle(ButtonStyle.Primary);
      row.addComponents(removeBlacklistButton);
    } else {
      const removeBlacklistButton = new ButtonBuilder()
        .setCustomId("RemoveBlacklist")
        .setLabel("YETKİLİYİ KARALİSTEDEN ÇIKAR")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true);
      row.addComponents(removeBlacklistButton);
    }

    if (RoleauthorityOpen) {
      const RoleauthorityOpenButton = new ButtonBuilder()
        .setCustomId("OpenModal1")
        .setLabel("YETKİSİ KAPANAN ROLLERİ AÇ")
        .setStyle(ButtonStyle.Secondary);
      row.addComponents(RoleauthorityOpenButton);
    } else {
      const RoleauthorityOpenButton = new ButtonBuilder()
        .setCustomId("OpenModal1")
        .setLabel("YETKİSİ KAPANAN ROLLERİ AÇ")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true);
      row.addComponents(RoleauthorityOpenButton);
    }

    return row;
  }

  /**
   *
   * @param {String} content
   * @param {Boolean} buttons
   */

  async sendLog(title, content, buttons = false, entry) {
    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTimestamp()
      .setFooter({ text: "Made With Jahky. ❤️" })
      .setAuthor({ name: title });

    const messages = await global.manager.guilds.cache
      .get(this.client.config.Guild.GuildID)
      .channels.cache.get(this.client.config.Channels.logChannel)
      .send({
        content: "@everyone",
        embeds: [embed.setDescription(content)],
        components: [await this.buttons(buttons, buttons)],
      });

    if (buttons) {
      this.client.db.set(`message_${messages.id}`, {
        staff: entry.executor.id,
        tag: entry.executor.tag.replace(/\`/, ""),
      });
    }
  }

  /**
   *
   * @param {executorID} memberID
   */

  async quarantina(memberID) {
    const member = this.client.guilds.cache
      .get(this.client.config.Guild.GuildID)
      .members.cache.get(memberID);
    if (member.bannable) {
      member.roles.set([this.client.config.Guild.QuarintinaRole]);
    }
  }
}

export default Exec;
