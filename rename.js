const fs = require("fs");
const path = require("path");
const vm = require("vm");
const prettier = require("prettier");

const dir = "./staging";

let nofiles = 0;

fs.readdirSync(dir).forEach(file => {
    nofiles++;
});

console.log(`Looping through ${nofiles} files.\n\n`)

let i = -1;
const files = fs.readdirSync(dir);
(async () => {
    for (const file of files) {
        i++;
        const fullPath = path.join(dir, file);
        if (fullPath.endsWith(".js")) {
            process.stdout.write(`[${i+1}/${nofiles}] staging/${file}`);

            const code = fs.readFileSync(fullPath, "utf8");

            const formatted = await prettier.format(code, {
                parser: "babel",
                tabWidth: 4,
                objectWrap: 'collapse',
                printWidth: 160
            });

            const sandbox = {window: {
                Roblox: {
                    "core-scripts": {
                        intl: {}
                    },
                    BundleDetector: {
                        bundleDetected: () => {}
                    }
                }
            }};
            sandbox.Roblox = sandbox.window.Roblox;

            vm.createContext(sandbox);

            vm.runInContext(code, sandbox);

            if (!sandbox.window.Roblox.LangDynamic || Object.keys(sandbox.window.Roblox.LangDynamic).length === 0) {
                process.stdout.write(" -> skipped\n");
                continue;
            }

            const parts = Object.keys(sandbox.window.Roblox.LangDynamic)[0].split(".")

            const newdir = parts.slice(0, -1).join('/');
            const newpath = parts[parts.length - 1] + ".js";
            const newlocation = path.join("Locales", newdir, newpath);

            process.stdout.write(` -> Locales/${newdir}/${newpath}\n`)
            fs.mkdirSync(path.join("Locales", newdir), { recursive: true });
            fs.copyFileSync(fullPath, newlocation);
            fs.writeFileSync(newlocation, formatted);
        }
    }
})();
