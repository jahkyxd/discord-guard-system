import fs from "fs";
import Jahky from "./Jahky.Client.js";

class load {
    constructor(client, patch, FilePatch) {
        this.client = client;
        this.patch = patch;
        this.FilePatch = FilePatch;
    }

    async loadEvents() {
        fs.readdirSync(this.patch, { encoding: "utf-8" })
            .filter((file) => file.endsWith(".js"))
            .forEach(async (file) => {
                const event = await import(`${this.FilePatch}/${file}`).then(
                    (modules) => modules.default
                );

                event(this.client);
            });
            // import("../_INTERNAL/_GuardThree/protects")
    }
}

export default load;
