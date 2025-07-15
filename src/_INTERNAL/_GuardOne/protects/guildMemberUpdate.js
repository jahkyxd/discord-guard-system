import { AuditLogEvent, PermissionsBitField } from "discord.js";
import Jahky from "../../../Base/Jahky.Client.js";

/**
 * @param {Jahky} client
 */

export default (client) => {
  client.on("guildMemberUpdate", async (oldMember, newMember) => {
    const entry = (
      await newMember.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberRoleUpdate,
        limit: 5,
      })
    ).entries.first();

    if (!entry || !entry.executor) return;
    if (await client.exec.databaseSafes(entry.executor.id)) return;
    client.exec.CheckPermissionsForRole(newMember.guild);
    client.db.push("blacklist", entry.executor.id);

    if (oldMember.roles.cache.size < newMember.roles.cache.size) {
      const addingRole = newMember.roles.cache.filter(
        (x) => newMember.roles.cache.has(x) && !oldMember.roles.cache.has(x)
      );

      addingRole.map((roles) =>
        newMember.roles.remove(roles.id).catch(() => {})
      );

      if (
        addingRole.map((roles) =>
          roles.permissions.has([
            PermissionsBitField.Flags.Administrator,
            PermissionsBitField.Flags.BanMembers,
            PermissionsBitField.Flags.KickMembers,
            PermissionsBitField.Flags.ManageChannels,
            PermissionsBitField.Flags.ManageGuild,
            PermissionsBitField.Flags.ManageRoles,
            PermissionsBitField.Flags.ManageWebhooks,
            PermissionsBitField.Flags.ChangeNickname,
            PermissionsBitField.Flags.CreateEvents,
            PermissionsBitField.Flags.ManageEvents,
            PermissionsBitField.Flags.ManageThreads,
          ])
        )
      ) {
        // ? yönetici rol verme
        client.exec.CheckPermissionsForRole(newMember.guild);
        if (newMember.guild.members.cache.get(entry.executor.id).bannable)
          newMember.guild.bans.create(entry.executor.id, {
            reason: "Jahky Guard Bots (ADMINISTRATOR Guard)",
          });
        client.db.push("blacklist", entry.executor.id);

        client.exec.sendLog(
          "İZİNSİZ YÖNETİCİ VERİLDİ",
          `**YETKİLİ:** ${entry.executor.tag.replace(/\`/g, "")} - \`${
            entry.executor.id
          }\` (${entry.executor.toString()})\n-------------------------\n**KULLANICI:** ${newMember.user.tag.replace(
            /\`/g,
            ""
          )} - \`${
            newMember.user.id
          }\` (${newMember.user.toString()})\n-------------------------\n**VERİLEN ROLLER:** ${addingRole
            .map((x) => x.toString())
            .join(
              "\n"
            )}\n\nVerilen roller içinde\n-\`YONETICI\`\n-\`BAN\`\n-\`KICK\`\n-\`KANALLARI YONET\`\n-\`SUNUCYU YONET\`\n-\`ROLLERI YONET\`\n-\`WEBHOOKLARI YONET\`\n-\`ETKINLIK OLUŞTUR\`\n-\`ETKINLIKLERI YONET\`\n-\`THREAD KANALLARINI YONET\`\n Yetkileri olduğu için sunucunun yetkilerini kapatıp yetkiliyi sunucudan yasakladım!`,
          true,
          entry
        );
      } else {
        // ? rol verme limit
        if (await client.exec.safe(entry.executor.id)) {
          if (await client.exec.databaseSafes(entry.executor.id)) return;
          const old = client.limit.get(`${entry.executor.id}_role`);
          client.limit.set(`${entry.executor.id}_role`, old ? old + 1 : 1);
          const limit = client.limit.get(`${entry.executor.id}_role`);
          if (limit === client.limits.addorremoverole) {
            client.exec.CheckPermissionsForRole(newMember.guild);
            client.exec.quarantina(entry.executor.id);
            client.exec.sendLog(
              "ROL LİMİT",
              `**YETKİLİ:** ${entry.executor.tag.replace(/\`/g, "")} - \`${
                entry.executor.id
              }\` (${entry.executor.toString()})\n-------------------------\n**KULLANICI:** ${newMember.user.tag.replace(
                /\`/g,
                ""
              )} - \`${
                newMember.user.id
              }\` (${newMember.user.toString()})\n-------------------------\n**VERİLEN ROLLER:** ${addingRole
                .map((x) => x.toString())
                .join(
                  "\n"
                )}\n\nSunucunun yetkilerini kapatıp yetkiliyi sunucudan yasakladım!`,
              false
            );
          }
        } else {
          // ? rol verme
          client.exec.CheckPermissionsForRole(newMember.guild);
          client.exec.quarantina(entry.executor.id);
          client.exec.sendLog(
            "ROL VERME",
            `**YETKİLİ:** ${entry.executor.tag.replace(/\`/g, "")} - \`${
              entry.executor.id
            }\` (${entry.executor.toString()})\n-------------------------\n**KULLANICI:** ${newMember.user.tag.replace(
              /\`/g,
              ""
            )} - \`${
              newMember.user.id
            }\` (${newMember.user.toString()})\n-------------------------\n**VERİLEN ROLLER:** ${addingRole
              .map((x) => x.toString())
              .join(
                "\n"
              )}\n\nSunucunun yetkilerini kapatıp yetkiliyi sunucudan yasakladım!`,
            false
          );
        }
      }
    } else {
      // ? rol alma limit
      if (await client.exec.safe(entry.executor.id)) {
        if (await client.exec.databaseSafes(entry.executor.id)) return;
        const old = client.limit.get(`${entry.executor.id}_role`);
        client.limit.set(`${entry.executor.id}_role`, old ? old + 1 : 1);
        const limit = client.limit.get(`${entry.executor.id}_role`);
        if (limit === client.limits.addorremoverole) {
          client.exec.CheckPermissionsForRole(newMember.guild);
          const removingRole = newMember.roles.cache.filter(
            (x) => !newMember.roles.cache.has(x) && oldMember.roles.cache.has(x)
          );
          removingRole.map((roles) =>
            newMember.roles.add(roles.id).catch(() => {})
          );
          client.exec.quarantina(entry.executor.id);
          client.exec.sendLog(
            "ROL LİMİT",
            `**YETKİLİ:** ${entry.executor.tag.replace(/\`/g, "")} - \`${
              entry.executor.id
            }\` (${entry.executor.toString()})\n-------------------------\n**KULLANICI:** ${newMember.user.tag.replace(
              /\`/g,
              ""
            )} - \`${
              newMember.user.id
            }\` (${newMember.user.toString()})\n-------------------------\n**ALINAN ROLLER:** ${removingRole
              .map((x) => x.toString())
              .join(
                "\n"
              )}\n\nSunucunun yetkilerini kapatıp yetkiliyi sunucudan yasakladım!`,
            false
          );
        }
      } else {
        // ? rol alma
        client.exec.CheckPermissionsForRole(newMember.guild);
        const removingRole = newMember.roles.cache.filter(
          (x) => !newMember.roles.cache.has(x) && oldMember.roles.cache.has(x)
        );
        removingRole.map((roles) =>
          newMember.roles.add(roles.id).catch(() => {})
        );
        client.exec.CheckPermissionsForRole(newMember.guild);
        client.exec.quarantina(entry.executor.id);
        client.exec.sendLog(
          "ROL ALMA",
          `**YETKİLİ:** ${entry.executor.tag.replace(/\`/g, "")} - \`${
            entry.executor.id
          }\` (${entry.executor.toString()})\n-------------------------\n**KULLANICI:** ${newMember.user.tag.replace(
            /\`/g,
            ""
          )} - \`${
            newMember.user.id
          }\` (${newMember.user.toString()})\n-------------------------\n**ALINAN ROLLER:** ${removingRole
            .map((x) => x.toString())
            .join(
              "\n"
            )}\n\nSunucunun yetkilerini kapatıp yetkiliyi sunucudan yasakladım!`,
          false,
          entry
        );
      }
    }
  });
};
