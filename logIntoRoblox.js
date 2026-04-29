const puppeteer = require('puppeteer');
const { get_config } = require('./configs');

(async () => {
	const browser = await puppeteer.launch({
		headless: false, // more reliable for login flows
		defaultViewport: null,
		userDataDir: './profile'
	});

	const page = await browser.newPage();

	await page.goto('https://www.roblox.com/home', {
		waitUntil: 'networkidle2',
	});

	console.log(typeof token, token.length);
	console.log(token.includes(';'));

	//await page.setCookie({
	//	name: '.ROBLOSECURITY',
	//	value: String(token),
	//	url: 'https://www.roblox.com',
	//	path: '/',
	//	httpOnly: true,
	//	secure: true
	//});

	//const cookies = await page.cookies();
	//console.log(cookies);

	// Optional verification
	const loggedIn = await page.evaluate(() => {
		return !!document.querySelector('a[href*="/users/"]');
	});

	console.log('Logged in:', loggedIn);

	// Wait 5 seconds (your original requirement)
	await new Promise(r => setTimeout(r, 1115000));

	await browser.close();
})();
