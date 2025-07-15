import Jahky from "../../Base/Jahky.Client.js";
const client = (global.guardone = new Jahky());
import config from "../../../config.js";
import load from "../../Base/load.js";

client
  .login(config.bot.GuardOne)
  .then(() =>
    client.logger.log(
      `${client.user.username} olarak "_GuardOne" etkinleştirildi!`
    )
  )
  .catch(() =>
    client.logger.info(`Discord API bağlantısı gerçekleştiremedi!`, "_GuardOne")
  );

new load(
  client,
  "./src/_INTERNAL/_GuardOne/protects",
  "../_INTERNAL/_GuardOne/protects"
).loadEvents();
