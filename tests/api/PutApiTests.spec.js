import { test, expect } from '@playwright/test';
import apiActions from '../../framework/actions/api/ApiActions.js';
import apiSteps from '../../framework/steps/api/ApiSteps.js';
import {
    generatePostDataForUpdate,
    generateCommentDataForUpdate,
    generateTodoDataForUpdate,
    generateAlbumDataForUpdate
} from '../../framework/datasets/api/api.data.js';

class PutApiTests {
    constructor() {
        this.apiActions = apiActions;
        this.apiSteps = apiSteps;
    }

    /**
     * Update an existing post with faker data
     * Example: { title: "Updated Title", body: "Updated body", userId: 1 }
     */
    async updatePostWithFakerData() {
        const postData = generatePostDataForUpdate();
        const response = await this.apiSteps.updateResource('/posts', 1, postData);
        this.apiSteps.verifyStatus(response, 200);
        this.apiSteps.verifyUpdatedResource(response, postData);
        
        // Verify response contains the updated data
        expect(response.data.title).toBe(postData.title);
        expect(response.data.body).toBe(postData.body);
        expect(response.data.userId).toBe(postData.userId);
        
        console.log('Updated post:', response.data);
    }

    /**
     * Update an existing comment with faker data
     * Example: { postId: 1, name: "Updated Name", email: "updated@test.com", body: "Updated comment" }
     */
    async updateCommentWithFakerData() {
        const commentData = generateCommentDataForUpdate(1);
        const response = await this.apiSteps.updateResource('/comments', 1, commentData);
        this.apiSteps.verifyStatus(response, 200);
        this.apiSteps.verifyUpdatedResource(response, commentData);
        
        // Verify response contains the updated data
        expect(response.data.name).toBe(commentData.name);
        expect(response.data.email).toBe(commentData.email);
        expect(response.data.body).toBe(commentData.body);
        
        console.log('Updated comment:', response.data);
    }

    /**
     * Update an existing todo with faker data
     * Example: { userId: 1, title: "Updated todo", completed: true }
     */
    async updateTodoWithFakerData() {
        const todoData = generateTodoDataForUpdate();
        const response = await this.apiSteps.updateResource('/todos', 1, todoData);
        this.apiSteps.verifyStatus(response, 200);
        this.apiSteps.verifyUpdatedResource(response, todoData);
        
        // Verify response contains the updated data
        expect(response.data.title).toBe(todoData.title);
        expect(response.data.completed).toBe(todoData.completed);
        
        console.log('Updated todo:', response.data);
    }

    /**
     * Update an existing album with faker data
     * Example: { userId: 1, title: "Updated Album Title" }
     */
    async updateAlbumWithFakerData() {
        const albumData = generateAlbumDataForUpdate();
        const response = await this.apiSteps.updateResource('/albums', 1, albumData);
        this.apiSteps.verifyStatus(response, 200);
        this.apiSteps.verifyUpdatedResource(response, albumData);
        
        // Verify response contains the updated data
        expect(response.data.title).toBe(albumData.title);
        expect(response.data.userId).toBe(albumData.userId);
        
        console.log('Updated album:', response.data);
    }

    /**
     * Update post with different userId
     * Example: { title: "New Title", body: "New body content", userId: 5 }
     */
    async updatePostWithDifferentUserId() {
        const postData = generatePostDataForUpdate();
        const response = await this.apiSteps.updateResource('/posts', 5, postData);
        this.apiSteps.verifyStatus(response, 200);
        expect(response.data.userId).toBe(postData.userId);
        
        // Verify response contains the updated data
        expect(response.data.title).toBe(postData.title);
        expect(response.data.body).toBe(postData.body);
        
        console.log('Post updated with userId:', response.data);
    }

    /**
     * Verify all fields are updated in post
     */
    async verifyAllFieldsUpdatedInPost() {
        const postData = generatePostDataForUpdate();
        const response = await this.apiSteps.updateResource('/posts', 2, postData);
        this.apiSteps.verifyStatus(response, 200);
        expect(response.data.title).toBe(postData.title);
        expect(response.data.body).toBe(postData.body);
        expect(response.data.userId).toBe(postData.userId);
        
        console.log('Full post update verification:', response.data);
    }

    /**
     * Verify status code is 200
     */
    async verifyStatusCodeIs200() {
        const postData = generatePostDataForUpdate();
        const response = await this.apiSteps.updateResource('/posts', 3, postData);
        expect(response.status).toBe(200);
        
        console.log('Status code:', response.status);
    }

    /**
     * Verify status text is OK
     */
    async verifyStatusTextIsOk() {
        const postData = generatePostDataForUpdate();
        const response = await this.apiSteps.updateResource('/posts', 4, postData);
        expect(response.statusText).toBe('OK');
        
        console.log('Status text:', response.statusText);
    }

    /**
     * Update multiple resources sequentially
     */
    async updateMultipleResourcesSequentially() {
        const postData = generatePostDataForUpdate();
        const commentData = generateCommentDataForUpdate(1);
        
        const postResponse = await this.apiSteps.updateResource('/posts', 6, postData);
        const commentResponse = await this.apiSteps.updateResource('/comments', 3, commentData);
        
        this.apiSteps.verifyStatus(postResponse, 200);
        this.apiSteps.verifyStatus(commentResponse, 200);
        
        console.log('Multiple resources updated:', postResponse.data, commentResponse.data);
    }

    /**
     * Verify response headers
     */
    async verifyResponseHeaders() {
        const postData = generatePostDataForUpdate();
        const response = await this.apiSteps.updateResource('/posts', 7, postData);
        
        expect(response.headers).toBeDefined();
        
        console.log('Response headers:', response.headers);
    }
}

// Export the class
export { PutApiTests };

// ==================== Playwright Tests ====================

const putApiTests = new PutApiTests();

test.describe('PUT API Tests', () => {
    test('PUT - Update an existing post with faker data', async () => {
        await putApiTests.updatePostWithFakerData();
    });

    test('PUT - Update an existing comment with faker data', async () => {
        await putApiTests.updateCommentWithFakerData();
    });

    test('PUT - Update an existing todo with faker data', async () => {
        await putApiTests.updateTodoWithFakerData();
    });

    test('PUT - Update an existing album with faker data', async () => {
        await putApiTests.updateAlbumWithFakerData();
    });

    test('PUT - Update post with different userId', async () => {
        await putApiTests.updatePostWithDifferentUserId();
    });

    test('PUT - Verify all fields are updated in post', async () => {
        await putApiTests.verifyAllFieldsUpdatedInPost();
    });

    test('PUT - Verify status code is 200', async () => {
        await putApiTests.verifyStatusCodeIs200();
    });

    test('PUT - Verify status text is OK', async () => {
        await putApiTests.verifyStatusTextIsOk();
    });

    test('PUT - Update multiple resources sequentially', async () => {
        await putApiTests.updateMultipleResourcesSequentially();
    });

    test('PUT - Verify response headers', async () => {
        await putApiTests.verifyResponseHeaders();
    });
});