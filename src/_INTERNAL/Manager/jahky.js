import config from "../../../config.js";
import Jahky from "../../Base/Jahky.Client.js";
const client = (global.manager = new Jahky());
import load from "../../Base/load.js";
import { readdirSync } from "fs";

client
  .login(config.bot.Manager)
  .then(() =>
    client.logger.log(
      `${client.user.username} olarak "_Manager" Etkinleştirildi!`
    )
  )
  .catch((err) =>
    client.logger.info("Discord API Bağlantısı Gerçekleştiremedi!" + err, " _Manager")
  );

new load(
  client,
  "./src/_INTERNAL/Manager/events/",
  "../_INTERNAL/Manager/events"
).loadEvents();

readdirSync("./src/_INTERNAL/Manager/commands", { encoding: "utf8" })
  .filter((file) => file.endsWith(".js"))
  .forEach(async (file) => {
    const prop = await import(`./commands/${file}`).then(
      (modules) => modules.default
    );
    if (!prop.name || !prop.execute) return;
    client.commands.set(prop.name, prop);
    client.logger.log(`[COMMANDS] ${prop.name} loaded!`);
  });
