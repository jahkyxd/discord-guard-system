import Jahky from "../../Base/Jahky.Client.js";
const client = (global.database = new Jahky());
import config from "../../../config.js";
import load from "../../Base/load.js";

client
  .login(config.bot.Database)
  .then(() =>
    client.logger.log(
      `${client.user.username} olarak "_Database" etkinleştirildi!`
    )
  )
  .catch(() =>
    client.logger.info(`Discord API bağlantısı gerçekleştiremedi!`, "_Database")
  );

new load(
  client,
  "./src/_INTERNAL/_Database/protects",
  "../_INTERNAL/_Database/protects"
).loadEvents();
