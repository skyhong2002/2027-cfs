/*
 * CFS_TEST_URL=http://127.0.0.1:4321/2027-cfs node scripts/browser-smoke.cjs
 * PLAYWRIGHT_MODULE can point to an external package when Playwright is not installed locally.
 * Optional: CFS_SMOKE_OUTPUT, BROWSER_EXECUTABLE. No mailto link is opened and all POSTs are blocked.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
let chromium;
try {
	try {
		({ chromium } = require("playwright"));
	} catch (error) {
		if (!process.env.PLAYWRIGHT_MODULE) throw error;
		({ chromium } = require(process.env.PLAYWRIGHT_MODULE));
	}
} catch {
	console.error("Install Playwright separately or set PLAYWRIGHT_MODULE to its package directory.");
	process.exit(1);
}
const base = (process.env.CFS_TEST_URL || process.env.CFS_BASE_URL || "http://127.0.0.1:4321/2027-cfs").replace(/\/$/, "");
const output = process.env.CFS_SMOKE_OUTPUT || fs.mkdtempSync(path.join(os.tmpdir(), "cfs-smoke-"));
const storageKey = "cfs2027-proposal-v1";
const checks = [];
const failures = [];
const postAttempts = [];
const pageErrors = [];
const httpErrors = [];
fs.mkdirSync(output, { recursive: true });

async function check(name, action) {
	try {
		await action();
		checks.push(name);
		console.log(`PASS ${name}`);
	} catch (error) {
		failures.push({ name, error: error.message });
		throw error;
	}
}
async function waitForServer() {
	const deadline = Date.now() + 15_000;
	let detail = "No response";
	while (Date.now() < deadline) {
		try {
			const response = await fetch(`${base}/`, { method: "HEAD", signal: AbortSignal.timeout(Math.max(1, Math.min(2000, deadline - Date.now()))) });
			if (response.ok) return;
			detail = `HTTP ${response.status}`;
		} catch (error) {
			detail = error.message;
		}
		await new Promise(resolve => setTimeout(resolve, Math.max(0, Math.min(250, deadline - Date.now()))));
	}
	throw new Error(`Preview server was not ready within 15 seconds: ${base}/ (${detail})`);
}
async function assertPending(page) {
	assert.match(await page.locator("#proposal-total").innerText(), /待確認|Pending/);
	assert.doesNotMatch(await page.locator("#proposal-lines").innerText(), /NT\$\s*0(?:\D|$)/);
}
async function goto(page, route, lang) {
	const response = await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
	assert.equal(response.status(), 200);
	assert.equal(await page.locator("html").getAttribute("lang"), lang);
	assert.match(await page.title(), /SITCON 2027/);
}
async function noOverflow(page) {
	assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
}

(async () => {
	await waitForServer();
	const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
	try {
		for (const mobile of [false, true]) {
			const label = mobile ? "mobile" : "desktop";
			const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 }, reducedMotion: "reduce" });
			await context.route("**/*", route => {
				if (route.request().method() === "POST") {
					postAttempts.push(route.request().url());
					return route.abort();
				}
				return route.continue();
			});
			const page = await context.newPage();
			page.on("pageerror", error => pageErrors.push(error.message));
			page.on("response", response => {
				if (response.url().startsWith(base) && response.status() >= 400) httpErrors.push(`${response.status()} ${response.url()}`);
			});
			await check(`${label}: root title, empty state, no overflow`, async () => {
				await goto(page, "/", "zh-Hant");
				assert.equal(await page.locator("#proposal-total").innerText(), "—");
				assert.equal(await page.locator("#proposal-lines .empty-state").count(), 1);
				await noOverflow(page);
			});
			let selectedIntent;
			await check(`${label}: tier, item and dream selections`, async () => {
				selectedIntent = await page.locator('[data-tier-card="deep_cultivation"] .tier-purpose').innerText();
				assert.ok(selectedIntent.trim());
				await page.locator('[data-tier="deep_cultivation"]').click();
				await page.locator("[data-open-item]").first().click();
				await page.locator("dialog[open]").waitFor();
				await page.locator("dialog[open] [data-option]").first().click();
				await page.keyboard.press("Escape");
				await page.waitForFunction(() => !document.querySelector("dialog[open]"));
				await page.locator("#dream-select").focus();
				await page.keyboard.press("Enter");
				assert.equal(await page.locator("[data-proposal-line]").count(), 3);
				await assertPending(page);
			});
			await check(`${label}: reload restores only selected identifiers`, async () => {
				await page.reload({ waitUntil: "networkidle" });
				assert.equal(await page.locator("[data-proposal-line]").count(), 3);
				await assertPending(page);
			});
			await check(`${label}: draft includes all selections, stays unsent`, async () => {
				await page.locator('[name="organization"]').fill("Browser smoke test — do not send");
				await page.locator('[name="name"]').fill("CSR test");
				await page.locator('[name="email"]').fill("smoke@example.invalid");
				await page.locator('[name="message"]').fill("請說明學生資格與成果報告，這是測試，不寄出。");
				await page.locator('#inquiry-form button[type="submit"]').click();
				const draft = await page.locator("#inquiry-draft").inputValue();
				for (const title of await page.locator("[data-proposal-line] h3").allTextContents()) assert.ok(draft.includes(title), title);
				assert.match(draft, /SITCON 2027/);
				assert.ok(draft.includes(selectedIntent), "Plan C direction is included in the Chinese draft");
				assert.doesNotMatch(draft, /NT\$\s*0(?:\D|$)/);
				assert.match(await page.locator("#inquiry-status").innerText(), /尚未寄出/);
				assert.match(await page.locator("#open-email").getAttribute("href"), /^mailto:contact@sitcon\.org\?/);
				const stored = await page.evaluate(key => localStorage.getItem(key), storageKey);
				assert.doesNotMatch(stored, /smoke@example|Browser smoke|CSR test/);
			});
			await check(`${label}: print identity, navigation suppression and print action`, async () => {
				await page.evaluate(() => {
					window.__cfsPrintCount = 0;
					window.print = () => window.__cfsPrintCount++;
				});
				await page.locator("#print-proposal").click();
				assert.equal(await page.evaluate(() => window.__cfsPrintCount), 1);
				await page.emulateMedia({ media: "print" });
				assert.equal(await page.locator(".print-identity").isVisible(), true);
				const identity = await page.locator(".print-identity").innerText();
				assert.match(identity, /SITCON 2027/);
				assert.match(identity, /contact@sitcon\.org/);
				assert.match(identity, /https?:\/\//);
				assert.equal(await page.locator(".section-index").isVisible(), false);
				await page.pdf({ path: path.join(output, `${label}-proposal.pdf`), format: "A4" });
				await page.emulateMedia({ media: "screen" });
			});
			await check(`${label}: English route and selections`, async () => {
				await goto(page, "/en/", "en");
				assert.equal(await page.locator("[data-proposal-line]").count(), 3);
				assert.match(await page.locator("#proposal-lines").innerText(), /Student support program/);
				await noOverflow(page);
			});
			await check(`${label}: Plan C intent survives into the English draft`, async () => {
				const intent = await page.locator('[data-tier-card="deep_cultivation"] .tier-purpose').innerText();
				assert.ok(intent.trim());
				assert.ok((await page.locator("#proposal-lines").innerText()).includes(intent));
				await page.locator('[name="organization"]').fill("Browser smoke test — do not send");
				await page.locator('[name="name"]').fill("CSR test");
				await page.locator('[name="email"]').fill("smoke@example.invalid");
				await page.locator('#inquiry-form button[type="submit"]').click();
				assert.ok((await page.locator("#inquiry-draft").inputValue()).includes(intent));
				assert.match(await page.locator("#inquiry-status").innerText(), /not sent/);
			});
			let itemId;
			await check(`${label}: English dialog keyboard, back and forward`, async () => {
				const trigger = page.locator("[data-open-item]").first();
				itemId = await trigger.getAttribute("data-open-item");
				await trigger.focus();
				await page.keyboard.press("Enter");
				await page.locator("dialog[open]").waitFor();
				assert.ok(page.url().includes(`/en/item/${itemId}/`));
				for (let i = 0; i < 8; i++) {
					await page.keyboard.press("Tab");
					// Native Chromium dialogs may cycle through browser chrome (BODY), but never a background control.
					assert.ok(await page.evaluate(() => document.activeElement === document.body || !!document.activeElement.closest("dialog")));
				}
				await page.goBack();
				await page.waitForFunction(() => !document.querySelector("dialog[open]"));
				await page.goForward();
				await page.locator("dialog[open]").waitFor();
				await page.keyboard.press("Escape");
				await page.waitForFunction(() => !document.querySelector("dialog[open]"));
			});
			await check(`${label}: Chinese/English item and quotation direct routes`, async () => {
				for (const [prefix, lang] of [
					["", "zh-Hant"],
					["/en", "en"]
				]) {
					await goto(page, `${prefix}/item/${itemId}/`, lang);
					await page.locator("dialog[open]").waitFor();
					assert.match(await page.title(), /SITCON 2027/);
					await page.reload({ waitUntil: "networkidle" });
					assert.equal(await page.locator("dialog[open]").count(), 1);
					await goto(page, `${prefix}/quotation/`, lang);
					assert.equal(await page.locator("[data-proposal-line]").count(), 3);
					await assertPending(page);
					await noOverflow(page);
				}
			});
			await check(`${label}: corrupt storage recovers and clears warning`, async () => {
				await goto(page, "/", "zh-Hant");
				await page.evaluate(key => localStorage.setItem(key, "{broken"), storageKey);
				await page.reload({ waitUntil: "networkidle" });
				assert.equal(await page.locator("#proposal-lines .empty-state").count(), 1);
				await page.locator("#dream-select").click();
				assert.equal(await page.locator("#proposal-status").innerText(), "");
				await page.reload({ waitUntil: "networkidle" });
				assert.equal(await page.locator("#dream-select").getAttribute("aria-pressed"), "true");
				await page.locator(".remove-line").click();
				assert.equal(await page.locator("#proposal-total").innerText(), "—");
			});
			await check(`${label}: denied storage does not disable selection`, async () => {
				await page.evaluate(() => {
					Storage.prototype.setItem = () => {
						throw new DOMException("Test denied", "SecurityError");
					};
				});
				await page.locator("#dream-select").click();
				assert.equal(await page.locator("#dream-select").getAttribute("aria-pressed"), "true");
				assert.match(await page.locator("#proposal-status").innerText(), /無法儲存/);
			});
			await page.locator("#proposal").screenshot({ path: path.join(output, `${label}-proposal.png`) });
			await context.close();
		}
		await check("no POST attempts, runtime exceptions, or same-site HTTP errors", async () => {
			assert.deepEqual(postAttempts, []);
			assert.deepEqual(pageErrors, []);
			assert.deepEqual(httpErrors, []);
		});
	} finally {
		await browser.close();
		fs.writeFileSync(path.join(output, "results.json"), JSON.stringify({ base, checks, failures, postAttempts, pageErrors, httpErrors }, null, 2));
		console.log(`Artifacts: ${output}`);
	}
})().catch(error => {
	console.error(error);
	process.exitCode = 1;
});
