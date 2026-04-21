const fs = require("fs");
const path = require("path");

function countFiles(dir) {
    let count = 0;

    for (const file of fs.readdirSync(dir)) {
        const full = path.join(dir, file);
        const stat = fs.statSync(full);

        if (stat.isDirectory()) {
            count += countFiles(full);
        } else {
            count++;
        }
    }

  return count;
}

console.log(countFiles("./Locales"));
