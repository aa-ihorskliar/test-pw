import { faker } from '@faker-js/faker';
import { Locator, Page } from '@playwright/test';
import { clientCountOptions } from 'Features/Account/Onboarding/OnboardingWizard.constants';
import { CLICK_DELAY } from 'playwright/constants';
import { IUser } from 'playwright/types';
import { createUser } from 'playwright/utils/auth';
import { URL_CONSTANTS } from 'playwright/constants';
import { SignUpPage } from './SignUpPage';

export type OnboardForm = {
	company?: string;
	phoneNumber?: string;
	website?: string;
	clientNumber?: string;
};

/**
 *	Onboarding page class.
 */
export class OnboardingPage extends SignUpPage {
	readonly url: string = URL_CONSTANTS.onboard;
	readonly companyField: Locator;
	readonly phoneNumberField: Locator;
	readonly websiteField: Locator;
	readonly clientNumberField: Locator;
	readonly continueButton: Locator;
	readonly createCampaignButton: Locator;
	readonly demoCampaignButton: Locator;

	/**
	 * @param page Playwright page object
	 */
	constructor(page: Page) {
		super(page);

		this.companyField = this.page.getByPlaceholder('Enter your company name');
		this.phoneNumberField = this.page.getByPlaceholder('Enter your phone number');
		this.websiteField = this.page.getByPlaceholder('Enter your company website URL');
		this.clientNumberField = this.page.getByRole('button', {
			name: 'Select the number of clients',
		});
		this.continueButton = this.page.getByRole('button', { name: 'Continue' });
		this.createCampaignButton = this.page.getByRole('button', { name: 'Create', exact: true });
		this.demoCampaignButton = this.page.getByText('demo campaign');
	}

	/**
	 * Creates and signs up a user. Once the sign up step is complete, the newly signed up user is
	 * returned
	 *
	 * @returns the newly signed up user
	 */
	async signupUser(): Promise<IUser> {
		await this.page.goto(URL_CONSTANTS.signup);

		const user = createUser();
		await super.signup(user);
		await this.page.waitForURL(URL_CONSTANTS.onboard);

		return user;
	}

	/**
	 * Adds the company info to the user
	 *
	 * @param info the info about the user's company
	 * @param info.company company name
	 * @param info.phoneNumber phone number
	 * @param info.website website
	 * @param info.clientNumber number of clients
	 */
	async addCompanyInfo({
		company = 'Acme Corporation',
		phoneNumber = '1234567890',
		website = `http://${faker.internet.domainName()}`,
		clientNumber = clientCountOptions[0].value,
	}: OnboardForm): Promise<void> {
		await this.page.getByText('Tell us about your Company').waitFor();

		if (company) await this.companyField.fill(company);
		if (phoneNumber) await this.phoneNumberField.fill(phoneNumber);
		if (website) await this.websiteField.fill(website);

		if (clientNumber) {
			await this.clientNumberField.waitFor({ state: 'visible' });
			await this.clientNumberField.click();
			await this.page.locator(`[data-value="${clientNumber}"]`).waitFor({ state: 'visible' });
			await this.page.locator(`[data-value="${clientNumber}"]`).click();
		}

		await this.continueButton.waitFor({ state: 'visible' });
		await this.continueButton.click({ delay: CLICK_DELAY });
	}

	/**
	 * Create the users first campaign
	 */
	createFirstCampaign = async (): Promise<void> => {
		await this.page.waitForSelector("text=Let's Create Your First Campaign");
		await this.createCampaignButton.waitFor({ state: 'visible' });
		await this.createCampaignButton.click({ delay: CLICK_DELAY });
	};

	/**
	 * Wait for the campaign to be created after onboarding
	 */
	async waitForCampaignToBeCreated(): Promise<void> {
		await this.page.waitForSelector('text=Creating Campaign');
		await this.page.waitForSelector('text=Campaign Created');
		await this.page.waitForURL(/\/campaign\/\d+\/integrations/);
	}
}
