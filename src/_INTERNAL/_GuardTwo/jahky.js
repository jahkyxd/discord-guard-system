import Jahky from "../../Base/Jahky.Client.js";
const client = (global.guardtwo = new Jahky());
import load from "../../Base/load.js";
import config from "../../../config.js";

client
  .login(config.bot.GuardTwo)
  .then(() =>
    client.logger.log(
      `${client.user.username} olarak "_GuardTwo" etkinleştirildi!`
    )
  )
  .catch((err) =>
    client.logger.info(`Discord API bağlantısı gerçekleştiremedi! ${err}`, "_GuardTwo")
  );

new load(
  client,
  "./src/_INTERNAL/_GuardTwo/protects",
  "../_INTERNAL/_GuardTwo/protects"
).loadEvents();
