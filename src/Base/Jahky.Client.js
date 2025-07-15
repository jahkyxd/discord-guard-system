import {
  Client,
  GatewayIntentBits,
  Collection,
  ActivityType,
  AttachmentBuilder,
  WebhookClient,
} from "discord.js";
import logger from "./logger.js";
import config from "../../config.js";
import db from "ceki.db";
import Exec from "../Utils/Exec.js";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import("../Utils/Client.Functions.js");

class Jahky extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
      presence: {
        activities: [
          {
            name: "Jahky. ❤️ " + config.Guild.GuildName,
            type: ActivityType.Listening,
          },
        ],
        status: "idle",
      },
    });
    this.config = global.config = config;
    global.system = this;
    this.logger = logger;
    this.db = global.db = db;
    this.exec = new Exec(this);
    this.limits = {
      ban: 3,
      kick: 3,
      emojis: 3,
      addorremoverole: 3,
    };
    this.limit = new Collection();
    this.commands = new Collection();
    this.mentions = new Array();
  }

  async FindClient(count) {
    return global.Bots.slice(0, count);
  }

  async Editlimits() {
    Object.keys(this.limit)
      .filter((x) => this.limit[x] !== 0)
      .forEach((x) => delete this.limit[x]);
  }

  async qrcode(userID) {
    const secret = speakeasy.generateSecret({ length: 10 });
    this.db.set(`code_${userID}`, secret.base32);
    return secret.base32;
  }

  async verified(code, userID) {
    let secret = this.db.get(`code_${userID}`);
    const verified = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token: code,
      window: 1,
    });

    return verified;
  }

  async wait(ms = Number) {
    new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default Jahky;
