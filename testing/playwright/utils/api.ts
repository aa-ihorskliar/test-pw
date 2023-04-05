import fetch, { RequestInit, Response } from 'node-fetch';

type Headers = { 'Content-Type': string; Authorization?: string };

/**
 * Wrapper around fetch
 */
export class API {
	readonly baseUrl: string;
	readonly enableLogs: boolean;
	private token: string;

	private static instance: API;

	/**
	 * @param baseUrl API URL
	 * @param enableLogs enable logs if true
	 */
	constructor(baseUrl: string, enableLogs = false) {
		this.baseUrl = baseUrl;
		this.token = '';

		// TODO: use ENV variable for enabling logs
		this.enableLogs = enableLogs;
	}

	/**
	 * Setter for auth token
	 */
	set authToken(userToken: string) {
		this.token = this.encodeAuthToken(userToken);
	}

	/**
	 * GET request
	 *
	 * @param url request URL
	 * @param authorized use authToken if true
	 */
	async get<T>(url: string, authorized = true): Promise<T> {
		return this.request(url, { authorized });
	}

	/**
	 * POST request
	 *
	 * @param url request URL
	 * @param body request body
	 * @param authorized use authToken if true
	 */
	async post<T>(url: string, body: unknown, authorized = true): Promise<T> {
		return this.request(url, {
			method: 'POST',
			body,
			authorized,
		});
	}

	/**
	 * PUT request
	 *
	 * @param url request URL
	 * @param body request body
	 * @param authorized use authToken if true
	 */
	async put<T>(url: string, body: unknown, authorized = true): Promise<T> {
		return this.request(url, {
			method: 'PUT',
			body,
			authorized,
		});
	}

	/**
	 * Make a request
	 *
	 * @param url request url
	 * @param options request options
	 * @param options.method request method
	 * @param options.body request body
	 * @param options.authorized use authToken if true
	 */
	private request = async <T>(
		url: string,
		options: {
			method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
			body?: unknown;
			authorized?: boolean;
		},
	): Promise<T> => {
		const { method = 'GET', authorized = true, body } = options;

		const [absoluteUrl, headers] = this.getRequestInfo(url, authorized);

		const init: RequestInit = {
			headers,
			method: method,
		};

		this.log('Request: ', `${method} `, absoluteUrl);
		this.log('Headers: ', JSON.stringify(headers));

		if (body) {
			init.body = JSON.stringify(body);
			// this.log('Body: ', init.body);
		}

		return await fetch(absoluteUrl, init).then<T>(this.handleResponse);
	};

	/**
	 * Create and return HTTP headers
	 *
	 * @param authorized add Authorized header if true
	 * @returns HTTP headers
	 */
	private getHeaders(authorized = true): Headers {
		const headers: Headers = {
			'Content-Type': 'application/json',
		};

		if (authorized && this.token) {
			headers['Authorization'] = this.token;
		}

		return headers;
	}

	/**
	 * Handle response
	 *
	 * @param res server response
	 */
	private handleResponse = async <T>(res: Response): Promise<T> => {
		const contentType = res.headers.get('content-type');
		if (contentType && contentType.includes('application/json')) {
			const json = await res.json();

			this.log('JSON RESPONSE:', JSON.stringify(json));

			return json;
		}

		this.log('NON-JSON RESPONSE:', await res.text());

		return {} as T;
	};

	/**
	 * Creates request URL and Headers
	 *
	 * @param url relative url
	 * @param authorized add Authorize header if true
	 * @returns absolute URL and headers
	 */
	private getRequestInfo = (url: string, authorized = true): [string, Headers] => {
		return [this.getUrl(url), this.getHeaders(authorized)];
	};

	/**
	 * Encode authentication token
	 *
	 * @param token cookie token
	 * @returns base64 encoded token
	 */
	private encodeAuthToken(token: string): string {
		return `Basic ${Buffer.from(`:${token}`).toString('base64')}`;
	}

	/**
	 * Creates an absolute URL
	 *
	 * @param url relative URL
	 * @returns absolute URL
	 */
	private getUrl(url: string): string {
		return `${this.baseUrl}${url}`;
	}

	/**
	 * Print logs if this.enableLogs is true
	 *
	 * @param args any logs
	 */
	private log(...args: unknown[]): void {
		if (this.enableLogs) {
			console.log(...args);
		}
	}
}
