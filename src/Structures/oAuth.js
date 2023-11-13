const { Client, Collection, Options } = require("discord.js");
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

            if (!event.name) throw new Error('Event name missing');

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
            if (!command.name) throw new Error('Command name missing');
            this.commands.set(command.name, command);
        });
    }

    async login() {
        try {
            if (!process.env.token) {
                throw new Error("No token specified...");
            }

            await super.login(process.env.token);
        } catch (error) {
            console.error(`Login error: ${error.message}`);
        }
    }

    async start() {
        try {
            console.log('Loading database...');
            await this.loadDatabase();

            console.log('Loading commands...');
            this.loadCommands();

            console.log('Loading events...');
            this.loadEvents();

            console.log('Logging in...');
            await this.login();

            console.log('Bot started successfully.');
        } catch (error) {
            console.error(`Error starting the bot: ${error.message}`);
        }
    }
}

process.on('exit', (code) => { console.log(`Process exited with code ${code}`); });
process.on('uncaughtException', (err, origin) => { console.log(err, origin); });
process.on('unhandledRejection', (reason, promise) => { console.log(reason, promise); });
process.on('warning', (...args) => { console.log(...args); });

module.exports = oAuth;
