import { test, expect } from '@playwright/test';
import apiActions from '../../framework/actions/api/ApiActions.js';
import apiSteps from '../../framework/steps/api/ApiSteps.js';

class DeleteApiTests {
    constructor() {
        this.apiActions = apiActions;
        this.apiSteps = apiSteps;
    }

    /**
     * Delete an existing post
     */
    async deleteExistingPost() {
        const response = await this.apiSteps.deleteResource('/posts', 1);
        this.apiSteps.verifyDeletedResource(response);
        
        // Verify response has no body (empty response for DELETE)
        expect(response.data).toBeUndefined();
        
        console.log('Deleted post status:', response.status);
    }

    /**
     * Delete an existing comment
     */
    async deleteExistingComment() {
        const response = await this.apiSteps.deleteResource('/comments', 1);
        this.apiSteps.verifyDeletedResource(response);
        
        // Verify response has no body (empty response for DELETE)
        expect(response.data).toBeUndefined();
        
        console.log('Deleted comment status:', response.status);
    }

    /**
     * Delete an existing todo
     */
    async deleteExistingTodo() {
        const response = await this.apiSteps.deleteResource('/todos', 1);
        this.apiSteps.verifyDeletedResource(response);
        
        // Verify response has no body (empty response for DELETE)
        expect(response.data).toBeUndefined();
        
        console.log('Deleted todo status:', response.status);
    }

    /**
     * Delete an existing album
     */
    async deleteExistingAlbum() {
        const response = await this.apiSteps.deleteResource('/albums', 1);
        this.apiSteps.verifyDeletedResource(response);
        
        // Verify response has no body (empty response for DELETE)
        expect(response.data).toBeUndefined();
        
        console.log('Deleted album status:', response.status);
    }

    /**
     * Verify status text is OK
     * Status: 200, StatusText: "OK"
     */
    async verifyStatusTextIsOk() {
        const response = await this.apiSteps.deleteResource('/posts', 2);
        
        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');
        
        console.log('Status text:', response.statusText);
    }

    /**
     * Delete multiple posts sequentially
     */
    async deleteMultiplePostsSequentially() {
        const deletedIds = [];
        
        for (let i = 10; i <= 12; i++) {
            const response = await this.apiSteps.deleteResource('/posts', i);
            this.apiSteps.verifyDeletedResource(response);
            deletedIds.push(i);
        }
        
        console.log('Deleted posts with IDs:', deletedIds);
        expect(deletedIds).toHaveLength(3);
    }

    /**
     * Verify response headers
     */
    async verifyResponseHeaders() {
        const response = await this.apiSteps.deleteResource('/posts', 3);
        
        this.apiSteps.verifyDeletedResource(response);
        expect(response.headers).toBeDefined();
        
        console.log('Response headers:', response.headers);
    }

    /**
     * Delete comment and verify status
     */
    async deleteCommentAndVerifyStatus() {
        const response = await this.apiSteps.deleteResource('/comments', 2);
        
        this.apiSteps.verifyDeletedResource(response);
        
        // Verify response has no body (empty response for DELETE)
        expect(response.data).toBeUndefined();
        
        console.log('Comment delete status:', response.status);
    }

    /**
     * Delete todo and verify status
     */
    async deleteTodoAndVerifyStatus() {
        const response = await this.apiSteps.deleteResource('/todos', 3);
        
        this.apiSteps.verifyDeletedResource(response);
        
        // Verify response has no body (empty response for DELETE)
        expect(response.data).toBeUndefined();
        
        console.log('Todo delete status:', response.status);
    }

    /**
     * Delete album and verify status
     */
    async deleteAlbumAndVerifyStatus() {
        const response = await this.apiSteps.deleteResource('/albums', 2);
        
        this.apiSteps.verifyDeletedResource(response);
        
        // Verify response has no body (empty response for DELETE)
        expect(response.data).toBeUndefined();
        
        console.log('Album delete status:', response.status);
    }
}

// Export the class
export { DeleteApiTests };

// ==================== Playwright Tests ====================

const deleteApiTests = new DeleteApiTests();

test.describe('DELETE API Tests', () => {
    test('DELETE - Delete an existing post', async () => {
        await deleteApiTests.deleteExistingPost();
    });

    test('DELETE - Delete an existing comment', async () => {
        await deleteApiTests.deleteExistingComment();
    });

    test('DELETE - Delete an existing todo', async () => {
        await deleteApiTests.deleteExistingTodo();
    });

    test('DELETE - Delete an existing album', async () => {
        await deleteApiTests.deleteExistingAlbum();
    });

    test('DELETE - Verify status text is OK', async () => {
        await deleteApiTests.verifyStatusTextIsOk();
    });

    test('DELETE - Delete multiple posts sequentially', async () => {
        await deleteApiTests.deleteMultiplePostsSequentially();
    });

    test('DELETE - Verify response headers', async () => {
        await deleteApiTests.verifyResponseHeaders();
    });

    test('DELETE - Delete comment and verify status', async () => {
        await deleteApiTests.deleteCommentAndVerifyStatus();
    });

    test('DELETE - Delete todo and verify status', async () => {
        await deleteApiTests.deleteTodoAndVerifyStatus();
    });

    test('DELETE - Delete album and verify status', async () => {
        await deleteApiTests.deleteAlbumAndVerifyStatus();
    });
});