import { test, expect } from '@playwright/test';
import apiActions from '../../framework/actions/api/ApiActions.js';
import apiSteps from '../../framework/steps/api/ApiSteps.js';
import {
    generatePostDataForPatch
} from '../../framework/datasets/api/api.data.js';

class PatchApiTests {
    constructor() {
        this.apiActions = apiActions;
        this.apiSteps = apiSteps;
    }

    /**
     * Update post title only with faker data
     * Example: { title: "Patched Title" }
     */
    async updatePostTitleOnly() {
        const patchData = generatePostDataForPatch();
        const response = await this.apiSteps.patchResource('/posts', 1, patchData);
        this.apiSteps.verifyStatus(response, 200);
        expect(response.data.title).toBe(patchData.title);
        
        // Verify response contains the patched data
        expect(response.data.body).toBeDefined();
        expect(response.data.userId).toBeDefined();
        
        console.log('Patched post title:', response.data);
    }

    /**
     * Update post body only
     * Example: { body: "Patched body content" }
     */
    async updatePostBodyOnly() {
        const patchData = {
            body: 'Patched body content'
        };
        
        const response = await this.apiSteps.patchResource('/posts', 2, patchData);
        this.apiSteps.verifyStatus(response, 200);
        expect(response.data.body).toBe(patchData.body);
        
        // Verify response contains the patched data
        expect(response.data.title).toBeDefined();
        expect(response.data.userId).toBeDefined();
        
        console.log('Patched post body:', response.data);
    }

    /**
     * Update multiple fields in post
     * Example: { title: "New Title", body: "New Body" }
     */
    async updateMultipleFieldsInPost() {
        const patchData = {
            title: 'New Title',
            body: 'New Body'
        };
        
        const response = await this.apiSteps.patchResource('/posts', 3, patchData);
        this.apiSteps.verifyStatus(response, 200);
        expect(response.data.title).toBe(patchData.title);
        expect(response.data.body).toBe(patchData.body);
        
        // Verify response contains the patched data
        expect(response.data.userId).toBeDefined();
        
        console.log('Multiple fields patched:', response.data);
    }

    /**
     * Update todo completed status to true
     * Example: { completed: true }
     */
    async updateTodoCompletedStatusToTrue() {
        const patchData = {
            completed: true
        };
        
        const response = await this.apiSteps.patchResource('/todos', 1, patchData);
        this.apiSteps.verifyStatus(response, 200);
        expect(response.data.completed).toBe(true);
        
        // Verify response contains the patched data
        expect(response.data.title).toBeDefined();
        expect(response.data.userId).toBeDefined();
        
        console.log('Todo completed set to true:', response.data);
    }

    /**
     * Update todo completed status to false
     * Example: { completed: false }
     */
    async updateTodoCompletedStatusToFalse() {
        const patchData = {
            completed: false
        };
        
        const response = await this.apiSteps.patchResource('/todos', 2, patchData);
        this.apiSteps.verifyStatus(response, 200);
        expect(response.data.completed).toBe(false);
        
        // Verify response contains the patched data
        expect(response.data.title).toBeDefined();
        expect(response.data.userId).toBeDefined();
        
        console.log('Todo completed set to false:', response.data);
    }

    /**
     * Update album title only
     * Example: { title: "Updated Album" }
     */
    async updateAlbumTitleOnly() {
        const patchData = {
            title: 'Updated Album Title'
        };
        
        const response = await this.apiSteps.patchResource('/albums', 1, patchData);
        this.apiSteps.verifyStatus(response, 200);
        expect(response.data.title).toBe(patchData.title);
        
        // Verify response contains the patched data
        expect(response.data.userId).toBeDefined();
        
        console.log('Album title patched:', response.data);
    }

    /**
     * Verify status text is OK
     * Status: 200, StatusText: "OK"
     */
    async verifyStatusTextIsOk() {
        const patchData = generatePostDataForPatch();
        const response = await this.apiSteps.patchResource('/posts', 4, patchData);
        
        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');
        
        console.log('Status text:', response.statusText);
    }

    /**
     * Verify other fields are preserved
     */
    async verifyOtherFieldsArePreserved() {
        const patchData = {
            title: 'New Title Only'
        };
        
        const response = await this.apiSteps.patchResource('/posts', 5, patchData);
        this.apiSteps.verifyStatus(response, 200);
        expect(response.data.title).toBe(patchData.title);
        expect(response.data.body).toBeDefined();
        expect(response.data.userId).toBeDefined();
        
        console.log('Other fields preserved:', response.data);
    }

    /**
     * Update multiple posts with different patches
     */
    async updateMultiplePostsWithDifferentPatches() {
        const patch1 = { title: 'First Patch' };
        const patch2 = { body: 'Second Patch Body' };
        const patch3 = { title: 'Third Patch', body: 'Third Patch Body' };
        
        const response1 = await this.apiSteps.patchResource('/posts', 6, patch1);
        const response2 = await this.apiSteps.patchResource('/posts', 7, patch2);
        const response3 = await this.apiSteps.patchResource('/posts', 8, patch3);
        
        this.apiSteps.verifyStatus(response1, 200);
        this.apiSteps.verifyStatus(response2, 200);
        this.apiSteps.verifyStatus(response3, 200);
        
        expect(response1.data.title).toBe(patch1.title);
        expect(response2.data.body).toBe(patch2.body);
        expect(response3.data.title).toBe(patch3.title);
        expect(response3.data.body).toBe(patch3.body);
        
        console.log('Multiple posts patched:', response1.data, response2.data, response3.data);
    }

    /**
     * Verify response headers
     */
    async verifyResponseHeaders() {
        const patchData = generatePostDataForPatch();
        const response = await this.apiSteps.patchResource('/posts', 9, patchData);
        
        expect(response.headers).toBeDefined();
        
        console.log('Response headers:', response.headers);
    }
}

// Export the class
export { PatchApiTests };

// ==================== Playwright Tests ====================

const patchApiTests = new PatchApiTests();

test.describe('PATCH API Tests', () => {
    test('PATCH - Update post title only with faker data', async () => {
        await patchApiTests.updatePostTitleOnly();
    });

    test('PATCH - Update post body only', async () => {
        await patchApiTests.updatePostBodyOnly();
    });

    test('PATCH - Update multiple fields in post', async () => {
        await patchApiTests.updateMultipleFieldsInPost();
    });

    test('PATCH - Update todo completed status to true', async () => {
        await patchApiTests.updateTodoCompletedStatusToTrue();
    });

    test('PATCH - Update todo completed status to false', async () => {
        await patchApiTests.updateTodoCompletedStatusToFalse();
    });

    test('PATCH - Update album title only', async () => {
        await patchApiTests.updateAlbumTitleOnly();
    });

    test('PATCH - Verify status text is OK', async () => {
        await patchApiTests.verifyStatusTextIsOk();
    });

    test('PATCH - Verify other fields are preserved', async () => {
        await patchApiTests.verifyOtherFieldsArePreserved();
    });

    test('PATCH - Update multiple posts with different patches', async () => {
        await patchApiTests.updateMultiplePostsWithDifferentPatches();
    });

    test('PATCH - Verify response headers', async () => {
        await patchApiTests.verifyResponseHeaders();
    });
});