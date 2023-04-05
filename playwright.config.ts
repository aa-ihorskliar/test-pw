import { devices, defineConfig } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config = defineConfig({
	testDir: './testing/playwright',
	/* Maximum time one test can run for. */
	timeout: 60 * 1000,
	expect: {
		/**
		 * Maximum time expect() should wait for the condition to be met.
		 * For example in `await expect(locator).toHaveText();`
		 */
		timeout: 5000,
	},
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 3 : 0,
	workers: 3,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: [['html', { outputFolder: './testing/playwright/playwright-report/' }]],
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		// headless: false,

		testIdAttribute: 'data-ta',
		/* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
		actionTimeout: 0,
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: process.env.AA_UI_HOST ? process.env.AA_UI_HOST : 'https://app.1291563236.stagingagencyanalytics.com/', // 'http://localhost:22080',

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry',
	},

	/* Configure projects for major browsers */
	projects: [
		// -- LambdaTest Config --
		// name in the format: browserName:browserVersion:platform@lambdatest
		// Browsers allowed: `Chrome`, `MicrosoftEdge`, `pw-chromium`, `pw-firefox` and `pw-webkit`
		// Use additional configuration options provided by Playwright if required: https://playwright.dev/docs/api/class-testconfig

		// SETUP
		// {
		// 	name: 'pw-chromium:latest:MacOS Ventura@lambdatest',
		// 	testDir: './testing/playwright/tests/setup',
		// 	retries: 0,
		// },
		{
			name: "pw-chromium:latest:MacOS Ventura@lambdatest",
			testDir: './testing/playwright/tests/regression',
		},
		{
			name: "pw-firefox:latest:MacOS Ventura@lambdatest",
			testDir: './testing/playwright/tests/regression',
		},
		{
			name: "pw-webkit:latest:MacOS Ventura@lambdatest",
			testDir: './testing/playwright/tests/regression',
		},
		// {
		// 	name: 'setup',
		// 	testDir: './testing/playwright/tests/setup',
		// 	retries: 0,
		// },
		//
		// {
		// 	name: 'chromium',
		// 	testDir: './testing/playwright/tests/regression',
		// 	use: {
		// 		...devices['Desktop Chrome'],
		// 		launchOptions: {
		// 			args: [
		// 				'--no-sandbox',
		// 				'--disable-setuid-sandbox',
		// 				'--disable-dev-shm-usage',
		// 				'--disable-accelerated-2d-canvas',
		// 				'--no-first-run',
		// 				'--no-zygote',
		// 				'--disable-gpu',
		// 			],
		// 		},
		// 	},
		// },
		//
		// {
		// 	name: 'firefox',
		// 	testDir: './testing/playwright/tests/regression',
		// 	use: {
		// 		...devices['Desktop Firefox'],
		// 	},
		// },
		//
		// {
		// 	name: 'webkit',
		// 	testDir: './testing/playwright/tests/regression',
		// 	use: {
		// 		...devices['Desktop Safari'],
		// 	},
		// },
		//
		// {
		// 	name: 'smoke:prod-build',
		// 	testDir: './testing/playwright/tests/smoke-prod-build',
		// 	use: {
		// 		...devices['Desktop Chrome'],
		// 		launchOptions: {
		// 			args: [
		// 				'--no-sandbox',
		// 				'--disable-setuid-sandbox',
		// 				'--disable-dev-shm-usage',
		// 				'--disable-accelerated-2d-canvas',
		// 				'--no-first-run',
		// 				'--no-zygote',
		// 				'--disable-gpu',
		// 			],
		// 		},
		// 	},
		// },



		/* Test against mobile viewports. */
		// {
		//   name: 'Mobile Chrome',
		//   use: {
		//     ...devices['Pixel 5'],
		//   },
		// },
		// {
		//   name: 'Mobile Safari',
		//   use: {
		//     ...devices['iPhone 12'],
		//   },
		// },

		/* Test against branded browsers. */
		// {
		//   name: 'Microsoft Edge',
		//   use: {
		//     channel: 'msedge',
		//   },
		// },
		// {
		//   name: 'Google Chrome',
		//   use: {
		//     channel: 'chrome',
		//   },
		// },
	],

	/* Folder for test artifacts such as screenshots, videos, traces, etc. */
	outputDir: './testing/playwright/test-results/',

	/* Run your local dev server before starting the tests */
	// webServer: {
	//   command: 'npm start',
	//   port: 22080,
	// },
});

export default config;
