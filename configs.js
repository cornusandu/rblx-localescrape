// THIS FILE IS NOT USED

const fs = require('fs');
const { exit } = require('node:process');

const data = {

};

const f = fs.readFileSync('./configs/config.txt', {encoding: 'utf-8'});

let subsection_stack = [];
let i = 0;
for (const line of f.split("\n")) {
    i++;
    if (!line.trim()) {
        subsection_stack = [];
    }
    if (line.startsWith("[")) {
        if (line.endsWith("]")) {
            subsection_stack.push(line.slice(1, line.length - 1));
        } else {
            console.error(`Missing "]" terminator for header on line ${i}.`);
            throw new Error();
        }
    } else {
        if (!line.includes(':')) {
            console.error(`Invalid syntax on line ${i}. Correct syntax is "Key: Value"`);
            throw new Error();
        }
        const key = line.split(":")[0].trim();
        const t = line.split(":");
        const value = t.splice(1, t.length).join(':');
        
        let obj = data;
        for (const sub of subsection_stack) {
            if (!obj[sub])
                obj[sub] = {};
            obj = obj[sub];
        }
        obj[key] = value;
    }
}

function get_config(subsystem) {
    let obj = data;
    for (const sub of subsystem.split("::")) {
        if (!obj[sub])
            throw new Error(`Missing subsystem: ${subsystem} (failed at ::${sub})`);
        obj = obj[sub] ?? {};
    }

    return new Proxy(obj, {
        get(target, prop, receiver) {
            let obj = target;
            for (const k of prop.split(".")) {
                obj = obj[k] ?? {};
            }
            return obj;
        }
    });
}

module.exports = {get_config}
