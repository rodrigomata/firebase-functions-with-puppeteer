const functions = require('firebase-functions');
const puppeteer = require('puppeteer');

async function getBrowserPage() {
    // Launch headless Chrome. Turn off sandbox so Chrome can run under root.
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    return browser.newPage();
}

const runtimeOpts = { timeoutSeconds: 60, memory: '2GB' };
  
exports.capture = functions.runWith(runtimeOpts).https.onRequest(async ({ query: { url }}, res) => {

        if (!url) {
            return res.status(400).send('Please provide a URL. Example: ?url=https://example.com');
        }

        try {
            const page = await getBrowserPage();
            await page.goto(url, { waitUntil: 'networkidle2' });
            const buffer = await page.screenshot({ fullPage: true });
            // await browser.close();
            return res.type('image/png').send(buffer);
        } catch (e) {
            return res.status(500).send(e.toString());
        }
    });
