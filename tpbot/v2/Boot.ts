import { Kernel } from "./Kernel";
import { Print } from "./common/Print";

import fs from 'fs'
import YAML from 'yaml'
import { Helper } from "./common/Path";
interface TpbotYaml {
    shellAccess: {
        tag: string,
        id: string,
        access: boolean
    }[],
    tokenMapping: {
        tag: string,
        shellBot?: boolean,
        modules?: {
            freestyle?: string[],
            tpbot?: string[]
        }
    }[],
}
export class Boot
{
/*******************************************************************72*/
private static _parsedYaml: TpbotYaml | null = null;
static getParsedYaml(): TpbotYaml
{
    if (this._parsedYaml === null) {
        const fullPath = Helper.root("tpbot", "tpbot.yaml");
        const file = fs.readFileSync(fullPath, 'utf8');
        this._parsedYaml = YAML.parse(file) as TpbotYaml;
    }
    return this._parsedYaml;
}
/*******************************************************************72*/
readonly print = new Print(Boot.name);

run()
{
    this.print.info("Run has called.");

    const kernel = new Kernel();

    const legacyEnabled = false; // @FIX @TODO 
    // check if we need to load legacy codebase
    if (legacyEnabled) {

        this.print.info("Legacy mode enabled  DCBOT_JSON");
        if (process.env.DCBOT_JSON !== undefined) {

            setTimeout(()=>require("./legacy/main.js"),0);
        }
        else {
            this.print.error(
                "Could not load legacy bots because DCBOT_JSON is undefined");
        }
    }
    this.print.info("Run ended");
}
/*******************************************************************72*/
}
