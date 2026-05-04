const puppeteer = require('puppeteer');
const process = require('node:process');

const TargetUrlList = [
	"/home",
	"/users/profile",
	"/my/messages/#!/inbox",
	"/users/friends#!/friend-requests",
	"/my/avatar",
	"/users/inventory",
	"/trades",
	"/communities",
	"/upgrades/robux?ctx=navpopover",
	"/transactions",
	"/my/account#!/info",
	"/plus",
	"https://about.roblox.com/newsroom",
	"/giftcards-us"
]
.map(u => u.startsWith('https') ? u : "https://www.roblox.com" + u);

const urls = new Set();

(async () => {
	const browser = await puppeteer.launch({
		headless: false, // more reliable for login flows
		defaultViewport: null,
		userDataDir: './profile'
	});

	for (const url of TargetUrlList) {

		const page = await browser.newPage();

		await page.goto(url, {
			waitUntil: 'networkidle2',
		});

		await new Promise(r => setTimeout(r, 1000));

		const result = await page.evaluate(() => {
			const urls = [];

			for (const s of document.scripts) {
				if (s.src && s.src.includes("js.rbxcdn.com")) urls.push(s.src);
			}

			for (const r of performance.getEntriesByType("resource")) {
				if (
					(r.initiatorType === "script" || r.name.endsWith(".js")) &&
					r.name.includes("js.rbxcdn.com")
				) {
					urls.push(r.name);
				}
			}

			return [...new Set(urls)];
		});

		for (const r of result)
			urls.add(String(r).trim());

		await page.close();
	}

	await browser.close();

	let i = 0;
	for (const u of urls) {
		process.stdout.write(`${i+1}. `);
		console.log(u);
		i++;
	}

	const fs = require('fs');

	fs.rmSync("urls.txt", { force: true });

	fs.writeFileSync("urls.txt", "# Full list of Roblox JS file URLs from Roblox's CDN (to be updated regularly)\n\n");
	fs.appendFileSync("urls.txt", Array.from(urls).join("\n"));
})();
