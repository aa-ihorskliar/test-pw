import { test } from 'playwright/fixtures';
import { CampaignIntegrationPage } from 'playwright/pages/CampaignIntegrationPage';
import { faker } from '@faker-js/faker';

test.describe('Campaign integration', () => {
	test('Add Majestic', async ({ authorizedPage }, testInfo) => {
		testInfo.slow();

		const integrationName = 'Majestic';
		const integrationSelector = 'majestic';
		const campaignName = faker.company.name();

		const integrationPage = new CampaignIntegrationPage(authorizedPage, campaignName);
		await integrationPage.initialize();
		await integrationPage.goto();

		await integrationPage.enableIntegration(integrationSelector);
		await integrationPage.assertIntegrationIsEnabled(integrationName);

		await integrationPage.exploreIntegration(integrationName);
		await integrationPage.assertIntegrationPageIsLoaded(integrationName);

		await integrationPage.disableIntegration(integrationSelector);
		await integrationPage.assertIntegrationIsDisabled();
	});
});
