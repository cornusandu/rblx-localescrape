const fs = require("fs");
const path = require("path");

const urlfile = fs.readFileSync("urls.txt", 'utf-8');
const urls = urlfile.split('\n').filter((s) => !s.startsWith('#') && s);

(async () => {
    let i = 0;
    const total = urls.length;
    for (const url of urls) {
        const name = url.split('https://js.rbxcdn.com/')[1];
        console.log(`[${i+1}/${total}] Downloading ${name}`);
        let res;
        try {
            res = await fetch(url);
        } catch {console.error(`| Download ${i+1} failed.`); continue;};
        const text = await res.text();

        fs.mkdirSync('staging', { recursive: true });
        fs.writeFileSync(path.join('staging', name), text);
        i++;
    }
})();
