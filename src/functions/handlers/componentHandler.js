const { readdirSync } = require("fs");

module.exports = (client) => {

    client.handleComponents = async () => {

        const componentFolders = readdirSync(`./src/components`);
        for (const componentFolder of componentFolders) {

            const componentFiles = readdirSync(`./src/components/${componentFolder}`).filter(file => file.endsWith(`.js`));
            const { buttons, selectMenus, modals } = client;

            switch (componentFolder) {
                case "buttons": {

                    for (const componentFile of componentFiles) {

                        const button = require(`../../components/${componentFolder}/${componentFile}`);

                        buttons.set(button.data.name, button);

                    }

                }

                    break;

                case "selectMenus": {

                    for (const componentFile of componentFiles) {

                        const menu = require(`../../components/${componentFolder}/${componentFile}`);

                        selectMenus.set(menu.data.name, menu);

                    }

                }

                    break;

                case "modals": {

                    for (const componentFile of componentFiles) {

                        const modal = require(`../../components/${componentFolder}/${componentFile}`);

                        modals.set(modal.data.name, modal);

                    }

                }

                    break;
            }

        }

    };

};