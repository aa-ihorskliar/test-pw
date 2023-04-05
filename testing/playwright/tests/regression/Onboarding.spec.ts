import { test } from 'playwright/fixtures';
import { login, signOut } from 'playwright/utils/auth';
import { OnboardingPage } from 'playwright/pages/OnboardingPage';
import { URL_CONSTANTS } from 'playwright/constants';

test.describe('Onboarding Page', () => {
	test.afterEach(async ({ page }) => {
		await signOut(page);
	});

	test('The user can onboard after signing up', async ({ page }) => {
		const onboardingPage = new OnboardingPage(page);
		await onboardingPage.signupUser();
		await onboardingPage.addCompanyInfo({});
		await onboardingPage.createFirstCampaign();
		await onboardingPage.waitForCampaignToBeCreated();
	});

	test('The user is able to onboard after logging out', async ({ page }, testInfo) => {
		testInfo.slow();

		const onboardingPage = new OnboardingPage(page);
		const user = await onboardingPage.signupUser();

		await signOut(page);
		await login(page, user);
		await onboardingPage.page.waitForURL(URL_CONSTANTS.onboard);

		await onboardingPage.addCompanyInfo({});
		await onboardingPage.createFirstCampaign();
		await onboardingPage.waitForCampaignToBeCreated();
	});

	test('The user can onboard after signing up with demo campaign', async ({ page }, testInfo) => {
		testInfo.slow();

		const onboardingPage = new OnboardingPage(page);
		const user = await onboardingPage.signupUser();
		await onboardingPage.addCompanyInfo({});

		await signOut(page);
		await login(page, user);
		await onboardingPage.page.waitForURL(URL_CONSTANTS.onboard);

		await onboardingPage.createFirstCampaign();
		await onboardingPage.waitForCampaignToBeCreated();
	});
});
