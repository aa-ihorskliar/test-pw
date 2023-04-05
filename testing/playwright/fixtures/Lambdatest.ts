/**
 * Add the file in your test suite to run tests on LambdaTest.
 * Import `test` object from this file in the tests.
 */
import * as base from "@playwright/test";
import { chromium } from "@playwright/test";
import path from "path";

// LambdaTest capabilities
const capabilities = {
	browserName: "Chrome", // Browsers allowed: `Chrome`, `MicrosoftEdge`, `pw-chromium`, `pw-firefox` and `pw-webkit`
	browserVersion: "latest",
	"LT:Options": {
		platform: "Windows 10",
		build: "Playwright Build",
		name: "Playwright Test",
		user: process.env.LT_USERNAME,
		accessKey: process.env.LT_ACCESS_KEY,
		network: true,
		video: true,
		console: true,
		tunnel: false, // Add tunnel configuration if testing locally hosted webpage
		tunnelName: "", // Optional
		geoLocation: '', // country code can be fetched from https://www.lambdatest.com/capabilities-generator/
	},
};

// Patching the capabilities dynamically according to the project name.
/**
 * @param configName project name
 * @param testName testcase title
 */
const modifyCapabilities = (configName: string, testName: string): void => {
	const config = configName.split("@lambdatest")[0];
	const [browserName, browserVersion, platform] = config.split(":");
	capabilities.browserName = browserName
		? browserName
		: capabilities.browserName;
	capabilities.browserVersion = browserVersion
		? browserVersion
		: capabilities.browserVersion;
	capabilities["LT:Options"]["platform"] = platform
		? platform
		: capabilities["LT:Options"]["platform"];
	capabilities["LT:Options"]["name"] = testName;
};

const test = base.test.extend({
	/**
	 * @param args Playwright args
	 * @param args.page Playwright Page object
	 * @param use Playwright use function
	 * @param testInfo Playwright test info
	 */
	page: async ({ page }, use, testInfo) => {
		// Configure LambdaTest platform for cross-browser testing
		const fileName = testInfo.file.split(path.sep).pop();
		if (testInfo.project.name.match(/lambdatest/)) {
			modifyCapabilities(
				testInfo.project.name,
				`${testInfo.title} - ${fileName}`
			);

			const browser = await chromium.connect({
				wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
					JSON.stringify(capabilities)
				)}`,
			});

			const ltPage = await browser.newPage(testInfo.project.use);
			await use(ltPage);

			const testStatus = {
				action: "setTestStatus",
				arguments: {
					status: testInfo.status,
					remark: testInfo.error?.stack || testInfo.error?.message,
				},
			};

			await ltPage.evaluate(() => undefined, `lambdatest_action: ${JSON.stringify(testStatus)}`);
			await ltPage.close();
			await browser.close();
		} else {
			// Run tests in local in case of local config provided
			await use(page);
		}
	},
});

export default test;
