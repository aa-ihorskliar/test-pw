import { test } from 'playwright/fixtures';
import { TEST_USER, URL_CONSTANTS } from 'playwright/constants';
import { OnboardingPage } from 'playwright/pages/OnboardingPage';
import { BillingPage } from 'playwright/pages/BillingPage';
import { faker } from '@faker-js/faker';

test('Create test user', async ({ page }, testInfo) => {
	testInfo.slow();

	// Sign up and onboard test user
	const onboardingPage = new OnboardingPage(page);
	await onboardingPage.page.goto(URL_CONSTANTS.signup);
	await onboardingPage.signup({
		firstName: 'Play',
		lastName: 'Wright',
		email: TEST_USER.email,
		password: TEST_USER.password,
	});
	await onboardingPage.addCompanyInfo({});
	await onboardingPage.createFirstCampaign();
	await onboardingPage.waitForCampaignToBeCreated();

	// Set 100 campaigns
	const billingPage = new BillingPage(page);
	await billingPage.goto();
	await billingPage.setPlan({ campaignsQuantity: 100 });
	await billingPage.setAddons();
	await billingPage.setPaymentDetails({
		city: faker.address.city(),
		address: faker.address.streetAddress(),
		zip: faker.address.zipCode('### ###'),
	});
});
