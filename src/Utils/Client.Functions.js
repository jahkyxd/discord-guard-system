import { TextChannel, EmbedBuilder } from "discord.js";
import config from "../../config.js";

//! prototype functions \\

TextChannel.prototype.error = async function (message, text) {
    const owner = message.client.users.cache.get("618444525727383592");
    const embed = new EmbedBuilder()
        .setColor("Red")
        .setAuthor({
            name: message.member.displayName,
            iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }),
        })
        .setFooter({
            text: "Jahky. Guards Bot",
            iconURL: owner.avatarURL({ dynamic: true }),
        });
    this.send({
        embeds: [embed.setDescription(text)],
    }).then((x) => {
        if (x.deletable)
            setTimeout(() => {
                x.delete();
            }, 10000);
    });
};

Array.prototype.random = async function () {
    return this[Math.floor(Math.random() * this.length)];
};
