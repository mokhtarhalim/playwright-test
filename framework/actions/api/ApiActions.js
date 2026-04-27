import { request } from '@playwright/test';

class ApiActions {
    constructor() {
        this.baseURL = 'https://jsonplaceholder.typicode.com';
    }

    /**
     * Perform GET request to fetch all resources
     * @param {string} endpoint - API endpoint (e.g., '/posts', '/comments', '/albums', '/photos', '/todos', '/users')
     * @returns {Promise<Object>} - Response JSON
     */
    async getAll(endpoint) {
        const context = await request.newContext();
        const response = await context.get(`${this.baseURL}${endpoint}`);
        return {
            status: response.status(),
            data: await response.json()
        };
    }

    /**
     * Perform GET request to fetch a single resource by ID
     * @param {string} endpoint - API endpoint (e.g., '/posts', '/comments', '/todos')
     * @param {number|string} id - Resource ID
     * @returns {Promise<Object>} - Response JSON
     */
    async getById(endpoint, id) {
        const context = await request.newContext();
        const response = await context.get(`${this.baseURL}${endpoint}/${id}`);
        return {
            status: response.status(),
            data: await response.json()
        };
    }

    /**
     * Perform GET request with query parameters
     * @param {string} endpoint - API endpoint
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} - Response JSON
     */
    async getWithParams(endpoint, params) {
        const context = await request.newContext();
        const response = await context.get(`${this.baseURL}${endpoint}`, { params });
        return {
            status: response.status(),
            data: await response.json()
        };
    }

    /**
     * Perform GET request to fetch nested resources (e.g., /posts/1/comments)
     * @param {string} endpoint - Full endpoint path
     * @returns {Promise<Object>} - Response JSON
     */
    async getNested(endpoint) {
        const context = await request.newContext();
        const response = await context.get(`${this.baseURL}${endpoint}`);
        return {
            status: response.status(),
            data: await response.json()
        };
    }

    /**
     * Perform POST request to create a new resource
     * @param {string} endpoint - API endpoint (e.g., '/posts', '/comments', '/todos')
     * @param {Object} body - Request body data
     * @returns {Promise<Object>} - Response JSON
     */
    async post(endpoint, body) {
        const context = await request.newContext();
        const response = await context.post(`${this.baseURL}${endpoint}`, {
            data: body
        });
        return {
            status: response.status(),
            statusText: response.statusText(),
            headers: response.headers(),
            data: await response.json()
        };
    }

    /**
     * Perform POST request with custom headers
     * @param {string} endpoint - API endpoint
     * @param {Object} body - Request body data
     * @param {Object} headers - Custom headers
     * @returns {Promise<Object>} - Response JSON
     */
    async postWithHeaders(endpoint, body, headers) {
        const context = await request.newContext();
        const response = await context.post(`${this.baseURL}${endpoint}`, {
            data: body,
            headers: headers
        });
        return {
            status: response.status(),
            statusText: response.statusText(),
            headers: response.headers(),
            data: await response.json()
        };
    }

    /**
     * Perform POST request with form data
     * @param {string} endpoint - API endpoint
     * @param {Object} formData - Form data to send
     * @returns {Promise<Object>} - Response JSON
     */
    async postFormData(endpoint, formData) {
        const context = await request.newContext();
        const response = await context.post(`${this.baseURL}${endpoint}`, {
            form: formData
        });
        return {
            status: response.status(),
            statusText: response.statusText(),
            data: await response.json()
        };
    }

    /**
     * Perform PUT request to update an existing resource (full update)
     * @param {string} endpoint - API endpoint (e.g., '/posts', '/comments', '/todos')
     * @param {number|string} id - Resource ID
     * @param {Object} body - Request body data
     * @returns {Promise<Object>} - Response JSON
     */
    async put(endpoint, id, body) {
        const context = await request.newContext();
        const response = await context.put(`${this.baseURL}${endpoint}/${id}`, {
            data: body
        });
        return {
            status: response.status(),
            statusText: response.statusText(),
            headers: response.headers(),
            data: await response.json()
        };
    }

    /**
     * Perform PATCH request to partially update a resource
     * @param {string} endpoint - API endpoint (e.g., '/posts', '/comments', '/todos')
     * @param {number|string} id - Resource ID
     * @param {Object} body - Partial request body data
     * @returns {Promise<Object>} - Response JSON
     */
    async patch(endpoint, id, body) {
        const context = await request.newContext();
        const response = await context.patch(`${this.baseURL}${endpoint}/${id}`, {
            data: body
        });
        return {
            status: response.status(),
            statusText: response.statusText(),
            headers: response.headers(),
            data: await response.json()
        };
    }

    /**
     * Perform DELETE request to remove a resource
     * @param {string} endpoint - API endpoint (e.g., '/posts', '/comments', '/todos')
     * @param {number|string} id - Resource ID
     * @returns {Promise<Object>} - Response JSON
     */
    async delete(endpoint, id) {
        const context = await request.newContext();
        const response = await context.delete(`${this.baseURL}${endpoint}/${id}`);
        return {
            status: response.status(),
            statusText: response.statusText(),
            headers: response.headers()
        };
    }
}

export default new ApiActions();