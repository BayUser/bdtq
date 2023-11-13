mconst { Client, Collection, Options } = require("discord.js");
const glob = require("glob");
const pGlob = require('util').promisify(glob);
const mongoose = require('mongoose');

const { success, logErr } = require('./Functions');

class oAuth extends Client {
    constructor() {
        super({
            intents: 33283,
            allowedMentions: { repliedUser: false },
            partials: ["CHANNEL"],
            makeCache: Options.cacheWithLimits({
                PresenceManager: 0,
                UserManager: 0,
                GuildEmojiManager: 0,
            }),
        });

        this.config = require('../../config');
        ['commands', 'allUsers', 'joins', 'refresh'].forEach(x => this[x] = new Collection());
        this.color = require('./Colors');
        this.emoji = require('./Emojis');
    }

    async loadDatabase() {
        try {
            await mongoose.connect(this.config.mongo, {
                autoIndex: true,
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                family: 4
            });

            success("Database loaded");
        } catch (err) {
            logErr(`Database error : ${err}`);
        }
    }

    async loadEvents() {
        (await pGlob(`${process.cwd()}/src/Events/*/*.js`)).map(async eventFile => {
            const event = require(eventFile);

            if (!event.name) throw new Error('Nom event manquant');

            if (event.once) {
                this.once(event.name, (...args) => event.execute(this, ...args));
            } else {
                this.on(event.name, (...args) => event.execute(this, ...args));
            }
        });
    }

    async loadCommands() {
        (await pGlob(`${process.cwd()}/src/Commands/*/*.js`)).map(async cmdFile => {
            const command = require(cmdFile);
            delete require.cache[command];
            if (!command.name) throw new Error('Nom z');
            this.commands.set(command.name, command);
        });
    }

    login() {
        if (!process.env.TOKEN) {
            throw new Error("Aucun token spécifié...");
        }

        super.login(process.env.token);
    }

    async start() {
        await this.loadDatabase();
        this.loadCommands();
        this.loadEvents();
        this.login();
    }
}

process.on('exit', (code) => { console.log(`Processus arrêté avec le code ${code}`); });
process.on('uncaughException', (err, origin) => { console.log(err, origin); });
process.on('unhandledRejection', (reason, promise) => { console.log(reason, promise); });
process.on('warning', (...args) => { console.log(...args); });

module.exports = oAuth;
