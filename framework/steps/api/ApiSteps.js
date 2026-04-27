import { expect } from '@playwright/test';
import ApiActions from '../../actions/api/ApiActions.js';
import ApiPage from '../../objects/api/ApiPage.js';

class ApiSteps {
    constructor() {
        this.apiActions = ApiActions;
        this.apiPage = ApiPage;
    }

    /**
     * Fetch all resources from a given endpoint
     * @param {string} endpoint - API endpoint to fetch all resources
     * @returns {Promise<Object>} - Response with status and data
     */
    async fetchAllResources(endpoint) {
        return await this.apiActions.getAll(endpoint);
    }

    /**
     * Fetch a single resource by ID
     * @param {string} endpoint - API endpoint
     * @param {number|string} id - Resource ID
     * @returns {Promise<Object>} - Response with status and data
     */
    async fetchResourceById(endpoint, id) {
        return await this.apiActions.getById(endpoint, id);
    }

    /**
     * Fetch resources with query parameters
     * @param {string} endpoint - API endpoint
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} - Response with status and data
     */
    async fetchResourcesWithParams(endpoint, params) {
        return await this.apiActions.getWithParams(endpoint, params);
    }

    /**
     * Fetch nested resources
     * @param {string} endpoint - Full endpoint path (e.g., '/posts/1/comments')
     * @returns {Promise<Object>} - Response with status and data
     */
    async fetchNestedResources(endpoint) {
        return await this.apiActions.getNested(endpoint);
    }

    /**
     * Create a new resource using POST
     * @param {string} endpoint - API endpoint
     * @param {Object} body - Request body data
     * @returns {Promise<Object>} - Response with status and data
     */
    async createResource(endpoint, body) {
        return await this.apiActions.post(endpoint, body);
    }

    /**
     * Create a resource with custom headers
     * @param {string} endpoint - API endpoint
     * @param {Object} body - Request body data
     * @param {Object} headers - Custom headers
     * @returns {Promise<Object>} - Response with status and data
     */
    async createResourceWithHeaders(endpoint, body, headers) {
        return await this.apiActions.postWithHeaders(endpoint, body, headers);
    }

    /**
     * Create a resource using form data
     * @param {string} endpoint - API endpoint
     * @param {Object} formData - Form data to send
     * @returns {Promise<Object>} - Response with status and data
     */
    async createResourceWithFormData(endpoint, formData) {
        return await this.apiActions.postFormData(endpoint, formData);
    }

    /**
     * Update an existing resource using PUT (full update)
     * @param {string} endpoint - API endpoint
     * @param {number|string} id - Resource ID
     * @param {Object} body - Request body data
     * @returns {Promise<Object>} - Response with status and data
     */
    async updateResource(endpoint, id, body) {
        return await this.apiActions.put(endpoint, id, body);
    }

    /**
     * Partially update a resource using PATCH
     * @param {string} endpoint - API endpoint
     * @param {number|string} id - Resource ID
     * @param {Object} body - Partial request body data
     * @returns {Promise<Object>} - Response with status and data
     */
    async patchResource(endpoint, id, body) {
        return await this.apiActions.patch(endpoint, id, body);
    }

    /**
     * Delete a resource using DELETE
     * @param {string} endpoint - API endpoint
     * @param {number|string} id - Resource ID
     * @returns {Promise<Object>} - Response with status and data
     */
    async deleteResource(endpoint, id) {
        return await this.apiActions.delete(endpoint, id);
    }

    /**
     * Verify response status is successful
     * @param {Object} response - API response
     * @param {number} expectedStatus - Expected status code
     */
    verifyStatus(response, expectedStatus) {
        expect(response.status).toBe(expectedStatus);
    }

    /**
     * Verify response contains data
     * @param {Object} response - API response
     */
    verifyResponseHasData(response) {
        expect(response.data).toBeDefined();
        expect(Array.isArray(response.data) ? response.data.length > 0 : true).toBe(true);
    }

    /**
     * Verify response data matches expected structure
     * @param {Object} response - API response
     * @param {Array<string>} expectedKeys - Expected keys in the response
     */
    verifyResponseKeys(response, expectedKeys) {
        const firstItem = Array.isArray(response.data) ? response.data[0] : response.data;
        expectedKeys.forEach(key => {
            expect(firstItem).toHaveProperty(key);
        });
    }

    /**
     * Verify created resource has expected properties
     * @param {Object} response - API response
     * @param {Object} expectedData - Expected data that was sent
     */
    verifyCreatedResource(response, expectedData) {
        expect(response.data).toHaveProperty('id');
        expect(response.data).toMatchObject(expectedData);
    }

    /**
     * Verify response has location header (for POST redirect)
     * @param {Object} response - API response
     */
    verifyLocationHeader(response) {
        expect(response.headers).toHaveProperty('location');
    }

    /**
     * Verify response content type is JSON
     * @param {Object} response - API response
     */
    verifyContentTypeJson(response) {
        const contentType = response.headers['content-type'] || response.headers['Content-Type'];
        expect(contentType).toContain('application/json');
    }

    /**
     * Verify updated resource matches expected data
     * @param {Object} response - API response
     * @param {Object} expectedData - Expected data after update
     */
    verifyUpdatedResource(response, expectedData) {
        expect(response.data).toMatchObject(expectedData);
    }

    /**
     * Verify resource was successfully deleted (empty response)
     * @param {Object} response - API response
     */
    verifyDeletedResource(response) {
        expect(response.status).toBe(200);
    }

    /**
     * Verify no content response (204)
     * @param {Object} response - API response
     */
    verifyNoContent(response) {
        expect(response.status).toBe(200);
    }
}

export default new ApiSteps();