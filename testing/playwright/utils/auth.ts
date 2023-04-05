import { Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { QuerySuccessResponse } from 'Modules/Api/Experimental/Responses';
import { LoginGrant } from 'Modules/Api/LoginGrant/LoginGrant.types';
import { IUser } from 'playwright/types';
import { API } from 'playwright/utils/api';
import { CAPTCHA_TOKEN, SITE_ADDRESS, TEST_USER } from 'playwright/constants';
import { LoginPage } from 'playwright/pages/LoginPage';

/**
 * Sign out user
 *
 * @param page Page
 * @returns void
 */
export const signOut = async (page: Page): Promise<void> => {
	await page.evaluate(() => {
		window.sessionStorage.removeItem('user_token');

		const cookies = document.cookie.split(";");
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i];
			const eqPos = cookie.indexOf("=");
			const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
		}
	});
};

/**
 * Logs the user in on the provide page
 *
 * @param page the playwright page
 * @param login the user's login info
 * @param login.email the user's email
 * @param login.password the user's password
 */
export const login = async (
	page: Page,
	login: { email: string; password: string },
): Promise<void> => {
	const loginPage = new LoginPage(page);
	loginPage.goto();
	await loginPage.login(login);
};

/**
 * Set user token in session storage and cookies
 *
 * @param userToken string
 */
export const setUserToken = (userToken: string): void => {
	window.sessionStorage.setItem('user_token', userToken);

	const time = Number(new Date());
	const dayInMs = 864e5;
	const expires = new Date(time + 30 * dayInMs).toUTCString();
	document.cookie = `user_token=${userToken};path=/;expires=${expires}`;
};

/**
 * Login user
 *
 * @param baseUrl string
 * @returns Promise<string> user_token
 */
export const authorize = async (baseUrl: string): Promise<string> => {
	const api = new API(baseUrl);
	const query = {
		connector_type: 'default',
		provider: 'agency-analytics-identity',
		operation: 'create',
		asset: 'session',
		rows: [
			{
				username: TEST_USER.email,
				password: TEST_USER.password,
				site_address: SITE_ADDRESS,
				captcha: CAPTCHA_TOKEN,
			},
		],
	};
	const res = await api.post<QuerySuccessResponse<LoginGrant>>('/query', query, false);

	if (res?.code !== 200 || !Array.isArray(res.results.rows) || res.results.rows.length === 0) {
		const context = { baseUrl, query, res };
		throw new Error(`Authentication failed:\n${JSON.stringify(context, null, 2)}`);
	}

	return res.results.rows[0].token;
};

/**
 *	Generate random user data
 *
 *	@returns user
 */
export const createUser = (): IUser => ({
	firstName: faker.name.firstName(),
	lastName: faker.name.lastName(),
	email: faker.internet.email(),
	password: faker.internet.password(),
});

/**
 * Wait for reCAPTCHA iframe initialization
 *
 * @param page Playwright Page object
 */
export const waitForReCaptcha = async (page: Page): Promise<void> => {
	await page.waitForFunction(
		'window.hasOwnProperty("grecaptcha") && typeof window.grecaptcha.execute === "function"',
	);
};
