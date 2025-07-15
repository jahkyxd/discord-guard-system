const config = {
  bot: {
    tokens: [""], //Axularius Sistemi için olan tokenler (Spammer, Rol Dağıtıcı Sistem)
    owners: ["618444525727383592"], // Owner ID
    GuardOne: "", //Guard 1 Token
    GuardTwo: "", //Guard 2 Token
    GuardThree: "", //Guard 3 Token
    Database: "", //Database Token
    Manager: "", //Manager Token
    BOTS: [
      // Sunucunuzda Kullandığınız bütün botların IDsini girin .safe üzerinden yapmayın
      "",
    ],
    prefix: ".",
  },

  Guild: {
    GuildName: "",
    GuildID: "",
    CommandRoles: [], // Commander Role (Komutları Kullanabilecek Rol)
    QuarintinaRole: "", // Jail rolID
    CloseAllperms: [], // Eylem Gerçekleştikten Sonra Yetkisi Kapanmayacak Roller
    url: "", // URL spammer için url
  },

  Channels: {
    logChannel: "", // log kanal ID
    databases: {// rolde ki kullanıcılara rol dağıtılırken log attığı için gerekli
      token: "",
      id: "",
    },

    VoiceChannel: "",
  },
};

export default config;
