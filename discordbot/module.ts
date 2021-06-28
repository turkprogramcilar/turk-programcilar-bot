// package imports
import { Message, Client, User, PartialUser, MessageReaction } from "discord.js";
// local imports
const db    = require("../../discordbot/mongodb");
const tools = require("../../discordbot/tools");

/**
 * 
    if (fetch_start) return await parser.send_uwarn(msg,
        "Modul halen yukleniyor... Lutfen bir sure sonra tekrar deneyin.");
 */

export class dcmodule {

    private module_name : string = "nvidia";
    private async sync_module() { await tools.sync_module(this.module_name, ()=>this.state.cache.module[this.module_name], 1) };
    private fetch_start : Date | undefined;
    private state: any;

    constructor(private cache_module_db : boolean = false) { }

    public async on_event(evt: string, args: any) {

        switch(evt) {
            case 'message': const msg : Message = args.msg;
                await this.on_message(msg);
            break;
            case 'messageReactionAdd':
                const reaction : MessageReaction = args.reaction;
                const user : User | PartialUser = args.user;
                await this.on_reaction(reaction, user);
            break;
        }
    }
    public async init(refState: any) {
        this.state = refState;
        const client : Client = this.state.client;
        if (!this.cache_module_db) return;
        this.fetch_start = new Date();
        try {
            const json = (await db.get_module_state(this.module_name));
            this.state.cache.module[this.module_name] = JSON.parse(json);
        } catch {
            this.state.cache.module[this.module_name] = {};
        } finally {
            this.fetch_start = undefined;
        }
        await this.after_init();
    }

    public async after_init(){}
    public async on_message(msg : Message){}
    public async on_reaction(reaction : MessageReaction, user : User | PartialUser){}
}


// boilerplate code:
/* 

import { Message, MessageReaction, PartialUser, User } from "discord.js";
import { dcmodule } from "../module";


class coderstatus extends dcmodule {
    
    
    public async after_init(){}
    public async on_message(msg : Message){

        if (msg.content == "ping") await msg.channel.send("pong");
    }
    public async on_reaction(reaction : MessageReaction, user : User | PartialUser){}
}

const self = new coderstatus();
export async function on_event(evt: string, args: any) { return self.on_event(evt, args); }
export async function init(refState: any) { return self.init(refState); }

*/