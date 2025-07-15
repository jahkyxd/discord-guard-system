import Jahky from "../../Base/Jahky.Client.js";
const client = (global.guardthree = new Jahky());
import load from "../../Base/load.js";
import config from "../../../config.js";

client
  .login(config.bot.GuardThree)
  .then(() =>
    client.logger.log(
      `${client.user.username} olarak "_GuardThree" etkinleştirildi!`
    )
  )
  .catch(() =>
    client.logger.info(`Discord API bağlantısı gerçekleştiremedi!`, "_GuardThree")
  );

new load(
  client,
  "./src/_INTERNAL/_GuardThree/protects",
  "../_INTERNAL/_GuardThree/protects"
).loadEvents();
