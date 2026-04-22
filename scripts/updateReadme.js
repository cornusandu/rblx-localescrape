const fs = require('fs');
const path = require('path');
const { execFileSync, exec } = require('child_process');

const now = new Date();

const root = path.join(__dirname, '..');

const Assets = {
    templates: {
        readme: fs.readFileSync(path.join(root, 'template.readme.md'), {encoding:'utf8'})
    },
    variables: {
        stats: {
            nofiles: execFileSync('node', [path.join(root, 'count.js')], {encoding: 'utf8'}).replace('\n', '')
        },
        meta: {
            lastedited: {
                date: {
                    mmddyyyy: `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear()}`
                },
                time: {
                    f12h: now.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: 'UTC'
                    })
                }
            }
        }
    }
}

fs.rmSync(path.join(root, 'README.md'), {force: true});

let newReadme = Assets.templates.readme;
newReadme = newReadme.replaceAll("{{stats.nofiles}}", Assets.variables.stats.nofiles);
newReadme = newReadme.replaceAll("{{meta.lastedited.date.mmddyyyy}}", Assets.variables.meta.lastedited.date.mmddyyyy);
newReadme = newReadme.replaceAll("{{meta.lastedited.time.f12h}}", Assets.variables.meta.lastedited.time.f12h);

fs.writeFileSync(path.join(root, 'README.md'), newReadme);
