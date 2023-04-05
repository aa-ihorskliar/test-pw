import { test } from 'playwright/fixtures';
import { CreateCampaignPage } from 'playwright/pages/CreateCampaignPage';
import { faker } from '@faker-js/faker';

test.describe('Create campaign', () => {
	test('Cannot create a campaign without providing a website', async ({ authorizedPage }) => {
		const campaignPage = new CreateCampaignPage(authorizedPage.page);
		await campaignPage.goto();

		await campaignPage.create({ title: 'my campaign' });

		await campaignPage.assertInvalidWebsiteErrorMessage();
		await campaignPage.page.waitForURL(/#create-campaign-wizard/);
	});

	test('Submit basic form', async ({ authorizedPage }, testInfo) => {
		const campaignPage = new CreateCampaignPage(authorizedPage.page);
		await campaignPage.goto();

		const title = faker.random.alphaNumeric(24);
		const website = faker.internet.domainName();
		await campaignPage.create({ title, website });

		await campaignPage.assertCampaignWasCreated();

		await campaignPage.goto();
		await campaignPage.assertExists(title);
	});

	test('Submit advanced form', async ({ authorizedPage }) => {
		const campaignPage = new CreateCampaignPage(authorizedPage.page);
		await campaignPage.goto();

		const title = faker.random.alphaNumeric(24);
		const website = faker.internet.domainName();
		const group = 'Test Group';
		const timezone = 'Asia/Dubai';
		await campaignPage.createAdvancedCampaign({ title, website, group, timezone });

		await campaignPage.assertCampaignWasCreated();

		await campaignPage.goto();
		await campaignPage.assertExists(group);
		await campaignPage.select(group);
		await campaignPage.assertExists(title);
	});
});
