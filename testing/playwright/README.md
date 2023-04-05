# Playwright Testing Suite

Before running Playwright, make sure the app is running locally. By default,
Playwright will use http://localhost:22080.

You can change this behavior in the playwright.config.ts config file. For example, to
run the test suits on a staging URL.

NOTE: Do **NOT** push changes to the base URL in config file.

```
# Commands to be run in repository root.
# Run Playwright tests:

## Headless:
npm run test:playwright

## Debug mode:
npm run test:playwright:debug
```

