import { Locator, Page } from '@playwright/test';
import { BasicPage } from 'playwright/pages/core/BasicPage';
import { URL_CONSTANTS } from 'playwright/constants';
import { waitForReCaptcha } from 'playwright/utils/auth';

/**
 *	Sign up page class.
 * 	Contains url, all locators, and methods for Sign up page.
 */
export class SignUpPage extends BasicPage {
	readonly url: string = URL_CONSTANTS.signup;
	readonly firstNameFormField: Locator;
	readonly lastNameFormField: Locator;
	readonly emailFormField: Locator;
	readonly passwordFormField: Locator;
	readonly firstName: Locator;
	readonly lastName: Locator;
	readonly email: Locator;
	readonly password: Locator;
	readonly submitButton: Locator;
	readonly loadingIndicator: Locator;

	/**
	 * @param page Playwright page object
	 */
	constructor(page: Page) {
		super(page);

		this.firstNameFormField = page.getByTestId('signupFirstNameFormField');
		this.lastNameFormField = page.getByTestId('signupLastNameFormField');
		this.emailFormField = page.getByTestId('signupEmailFormField');
		this.passwordFormField = page.getByTestId('signupPasswordFormField');

		this.firstName = page.getByPlaceholder('First name');
		this.lastName = page.getByPlaceholder('Last name');
		this.email = page.getByPlaceholder('Email');
		this.password = page.getByPlaceholder('Password');

		this.submitButton = page.getByRole('button', { name: 'Sign Up', exact: true });
		this.loadingIndicator = this.submitButton.getByTestId('button-loading-indicator');
	}

	/**
	 * Signs up a new user
	 *
	 * @param user the info about the user
	 * @param user.firstName user first name
	 * @param user.lastName user last name
	 * @param user.email user email
	 * @param user.password user password
	 */
	async signup({
		firstName,
		lastName,
		email,
		password,
	}: {
		firstName?: string;
		lastName?: string;
		email?: string;
		password?: string;
	}): Promise<void> {
		await waitForReCaptcha(this.page);
		if (firstName) await this.firstName.fill(firstName);
		if (lastName) await this.lastName.fill(lastName);
		if (email) await this.email.fill(email);
		if (password) await this.password.fill(password);
		await this.submitButton.click();
		await this.loadingIndicator.waitFor({ state: 'hidden' });
	}

	/**
	 * Wait for form validation error
	 *
	 * @param errorMessage the error message to wait for
	 */
	async waitFormValidation(errorMessage: string): Promise<void> {
		await this.page.getByText(errorMessage).waitFor();
	}

	/**
	 * Asserts that the error message for a duplicate email is shown
	 */
	async assertDuplicateEmailErrorIsShown(): Promise<void> {
		await this.waitFormValidation('username already exists');
	}

	/**
	 * Asserts that the required error message is shown for the provided inputs in the sign up form
	 */
	async assertRequiredErrorMessagesAreShown(): Promise<void> {
		const requiredMessage = 'Required';

		await this.firstNameFormField.getByText(requiredMessage).waitFor();
		await this.lastNameFormField.getByText(requiredMessage).waitFor();
		await this.passwordFormField.getByText(requiredMessage).waitFor();
		await this.emailFormField.getByText(requiredMessage).waitFor();
	}
}
