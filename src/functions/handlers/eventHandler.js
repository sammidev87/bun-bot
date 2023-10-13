const fs = require("fs");
const { connection } = require("mongoose");

module.exports = (client) => {
    client.handleEvents = async () => {
        const eventFolders = fs.readdirSync(`./src/events`);

        for (const eventFolder of eventFolders) {
            const eventFiles = fs.readdirSync(`./src/events/${eventFolder}`).filter(file => file.endsWith(`.js`));

            switch (eventFolder) {
                case "client":
                    for (const eventFile of eventFiles) {
                        const event = require(`../../events/${eventFolder}/${eventFile}`);
                        if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
                        else client.on(event.name, (...args) => event.execute(...args, client));
                    }

                    console.log(`✅ Events have been loaded successfully!`);
                    break;

                case "mongo":
                    for (const eventFile of eventFiles) {
                        const event = require(`../../events/${eventFolder}/${eventFile}`);
                        if (event.once) connection.once(event.name, (...args) => event.execute(...args, client));
                        else connection.on(event.name, (...args) => event.execute(...args, client));
                    }
                    break;

                default:
                    break;
            }
        }
    };
};