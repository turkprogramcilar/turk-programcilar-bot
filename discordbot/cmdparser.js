exports.is = (msg, cmd) => {
    if (msg.content.trimStart().startsWith(cmd)) {
        msg.content = msg.content.trimStart().slice(cmd.length);
        return true;
    }
    return false;
}
exports.regex_arg = (msg, f, f_else, fr, regex, ri=0) => {
    r = msg.content.trimStart().match(regex); if (r) {
        msg.content = msg.content.trimStart().slice(r[0].length);
        f(fr.call(null, r[ri]));
    } else {
        f_else();
    }
}
exports.json_pretty = (str) => exports.tqs(JSON.stringify(str,null,'\t'), 'json');
// wrap with triple quote
exports.tq =  (str,format='') => { return '```'+format+'\n'+str+'```'; }
// wrap with triple quote + safe (2000 char limit)
exports.tqs = (str,format='') => { return exports.tq((str?.toString() ?? "").substr(0,2000-1-6-format.length-1),format); }

exports.mention = (msg, f, fe=()=>{}) => { exports.regex_arg(msg, f, fe, x=>x, /^<@!?([0-9]+)>/, 1); }
exports.r_arg = (msg, regex, f, fe=()=>{}) => { exports.regex_arg(msg, f, fe, x=>x, regex); }
exports.u_arg = (msg, f, fe=()=>{}) => { exports.regex_arg(msg, f, fe, parseInt, /^[0-9]+/); }
exports.i_arg = (msg, f, fe=()=>{}) => { exports.regex_arg(msg, f, fe, parseInt, /^[+-]?[0-9]+/); }
exports.f_arg = (msg, f, fe=()=>{}) => { exports.regex_arg(msg, f, fe, parseFloat, /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/); }

exports.set_arg = (msg, cmd, setF, channel_msg=null) => {
    if (exports.is(msg, cmd)) { 
        exports.f_arg(msg, f => {
            setF(f);
            if (channel_msg) msg.channel.send(`${channel_msg}: ${f}`);
        })
        return true;
    } else {
        return false;
    }
}
exports.cooldown_global_debug_print = (state, key, cds) => {
    const msS = 1000; const now = new Date();
    const b4r = state.cooldown.global[key];
    const ret = undefined==b4r || new Date(b4r.getTime()+cds*msS) <= now;
    console.log({"b4r": b4r, "now": now, "diff": new Date(b4r.getTime()+cds*msS).getSeconds(), "ret": ret});
}
exports.cooldown_global = (state, key, cds=5, fdo=()=>{}, felse=()=>{}) => {
    const msS = 1000; const now = new Date();
    const b4r = state.cooldown.global[key];
    const ret = undefined==b4r || new Date(b4r.getTime()+cds*msS) <= now;
    if (ret) {
        state.cooldown.global[key] = now;
        fdo(state, key, cds);
    }
    else felse(state, key, cds);
    return ret;
}