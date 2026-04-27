import { test, expect } from '@playwright/test';
import apiSteps from '../../framework/steps/api/ApiSteps.js';
import { 
    generatePostData,
    generateCommentData,
    generateTodoData,
    generateAlbumData,
    generatePostDataForUpdate,
    generatePostDataForPatch,
    generateCommentDataForUpdate,
    generateTodoDataForUpdate,
    generateAlbumDataForUpdate
} from '../../framework/datasets/api/api.data.js';

test.describe('PUT API Tests', () => {
    // Example: { title: "Updated Title", body: "Updated body", userId: 1 }
    test('PUT - Update an existing post with faker data', async () => {
        const postData = generatePostDataForUpdate();

        const response = await apiSteps.updateResource('/posts', 1, postData);

        apiSteps.verifyStatus(response, 200);
        apiSteps.verifyUpdatedResource(response, postData);

        console.log('Updated post:', response.data);
    });

    // Example: { postId: 1, name: "Updated Name", email: "updated@test.com", body: "Updated comment" }
    test('PUT - Update an existing comment with faker data', async () => {
        const commentData = generateCommentDataForUpdate(1);

        const response = await apiSteps.updateResource('/comments', 1, commentData);

        apiSteps.verifyStatus(response, 200);
        apiSteps.verifyUpdatedResource(response, commentData);

        console.log('Updated comment:', response.data);
    });

    // Example: { userId: 1, title: "Updated todo", completed: true }
    test('PUT - Update an existing todo with faker data', async () => {
        const todoData = generateTodoDataForUpdate();

        const response = await apiSteps.updateResource('/todos', 1, todoData);

        apiSteps.verifyStatus(response, 200);
        apiSteps.verifyUpdatedResource(response, todoData);

        console.log('Updated todo:', response.data);
    });

    // Example: { userId: 1, title: "Updated Album Title" }
    test('PUT - Update an existing album with faker data', async () => {
        const albumData = generateAlbumDataForUpdate();

        const response = await apiSteps.updateResource('/albums', 1, albumData);

        apiSteps.verifyStatus(response, 200);
        apiSteps.verifyUpdatedResource(response, albumData);

        console.log('Updated album:', response.data);
    });

    // Example: { title: "New Title", body: "New body content", userId: 5 }
    test('PUT - Update post with different userId', async () => {
        const postData = generatePostDataForUpdate();

        const response = await apiSteps.updateResource('/posts', 5, postData);

        apiSteps.verifyStatus(response, 200);
        expect(response.data.userId).toBe(postData.userId);

        console.log('Post updated with userId:', response.data);
    });

    // Example: Verify all fields are updated
    test('PUT - Verify all fields are updated in post', async () => {
        const postData = generatePostDataForUpdate();

        const response = await apiSteps.updateResource('/posts', 2, postData);

        apiSteps.verifyStatus(response, 200);
        expect(response.data.title).toBe(postData.title);
        expect(response.data.body).toBe(postData.body);
        expect(response.data.userId).toBe(postData.userId);

        console.log('Full post update verification:', response.data);
    });

    // Example: Status: 200, StatusText: "OK"
    test('PUT - Verify status text is OK', async () => {
        const postData = generatePostDataForUpdate();

        const response = await apiSteps.updateResource('/posts', 3, postData);

        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');

        console.log('Status text:', response.statusText);
    });

    // Example: Update post -> Verify response has all fields
    test('PUT - Verify response contains all expected fields', async () => {
        const postData = generatePostDataForUpdate();

        const response = await apiSteps.updateResource('/posts', 4, postData);

        apiSteps.verifyStatus(response, 200);
        expect(response.data).toHaveProperty('id');
        expect(response.data).toHaveProperty('title');
        expect(response.data).toHaveProperty('body');
        expect(response.data).toHaveProperty('userId');

        console.log('Response fields:', Object.keys(response.data));
    });

    // Example: Update multiple posts sequentially
    test('PUT - Update multiple posts sequentially with faker', async () => {
        const updatedIds = [];

        for (let i = 1; i <= 3; i++) {
            const postData = generatePostDataForUpdate();

            const response = await apiSteps.updateResource('/posts', i, postData);
            apiSteps.verifyStatus(response, 200);
            updatedIds.push(response.data.id);
        }

        console.log('Updated posts with IDs:', updatedIds);
        expect(updatedIds).toHaveLength(3);
    });

    // Example: Update comment -> Verify postId is preserved
    test('PUT - Update comment preserves postId', async () => {
        const postId = 5;
        const commentData = generateCommentDataForUpdate(postId);

        const response = await apiSteps.updateResource('/comments', 5, commentData);

        apiSteps.verifyStatus(response, 200);
        expect(response.data.postId).toBe(postId);

        console.log('Comment postId preserved:', response.data);
    });
});

test.describe('PATCH API Tests', () => {
    // Example: { title: "Patched Title" }
    test('PATCH - Update post title only with faker data', async () => {
        const patchData = generatePostDataForPatch();

        const response = await apiSteps.patchResource('/posts', 1, patchData);

        apiSteps.verifyStatus(response, 200);
        expect(response.data.title).toBe(patchData.title);

        console.log('Patched post title:', response.data);
    });

    // Example: { body: "Patched body content" }
    test('PATCH - Update post body only', async () => {
        const patchData = {
            body: 'Patched body content'
        };

        const response = await apiSteps.patchResource('/posts', 2, patchData);

        apiSteps.verifyStatus(response, 200);
        expect(response.data.body).toBe(patchData.body);

        console.log('Patched post body:', response.data);
    });

    // Example: { title: "New Title", body: "New Body" }
    test('PATCH - Update multiple fields in post', async () => {
        const patchData = {
            title: 'New Title',
            body: 'New Body'
        };

        const response = await apiSteps.patchResource('/posts', 3, patchData);

        apiSteps.verifyStatus(response, 200);
        expect(response.data.title).toBe(patchData.title);
        expect(response.data.body).toBe(patchData.body);

        console.log('Multiple fields patched:', response.data);
    });

    // Example: { completed: true }
    test('PATCH - Update todo completed status to true', async () => {
        const patchData = {
            completed: true
        };

        const response = await apiSteps.patchResource('/todos', 1, patchData);

        apiSteps.verifyStatus(response, 200);
        expect(response.data.completed).toBe(true);

        console.log('Todo completed set to true:', response.data);
    });

    // Example: { completed: false }
    test('PATCH - Update todo completed status to false', async () => {
        const patchData = {
            completed: false
        };

        const response = await apiSteps.patchResource('/todos', 2, patchData);

        apiSteps.verifyStatus(response, 200);
        expect(response.data.completed).toBe(false);

        console.log('Todo completed set to false:', response.data);
    });

    // Example: { title: "Updated Album" }
    test('PATCH - Update album title only', async () => {
        const patchData = {
            title: 'Updated Album Title'
        };

        const response = await apiSteps.patchResource('/albums', 1, patchData);

        apiSteps.verifyStatus(response, 200);
        expect(response.data.title).toBe(patchData.title);

        console.log('Album title patched:', response.data);
    });

    // Example: Status: 200, StatusText: "OK"
    test('PATCH - Verify status text is OK', async () => {
        const patchData = generatePostDataForPatch();

        const response = await apiSteps.patchResource('/posts', 4, patchData);

        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');

        console.log('Status text:', response.statusText);
    });

    // Example: Verify other fields are preserved
    test('PATCH - Verify other fields are preserved', async () => {
        const patchData = {
            title: 'New Title Only'
        };

        const response = await apiSteps.patchResource('/posts', 5, patchData);

        apiSteps.verifyStatus(response, 200);
        expect(response.data.title).toBe(patchData.title);
        expect(response.data.body).toBeDefined();
        expect(response.data.userId).toBeDefined();

        console.log('Other fields preserved:', response.data);
    });

    // Example: Update multiple posts with different patches
    test('PATCH - Update multiple posts with different patches', async () => {
        const patch1 = { title: 'First Patch' };
        const patch2 = { body: 'Second Patch Body' };
        const patch3 = { title: 'Third Patch', body: 'Third Patch Body' };

        const response1 = await apiSteps.patchResource('/posts', 6, patch1);
        const response2 = await apiSteps.patchResource('/posts', 7, patch2);
        const response3 = await apiSteps.patchResource('/posts', 8, patch3);

        apiSteps.verifyStatus(response1, 200);
        apiSteps.verifyStatus(response2, 200);
        apiSteps.verifyStatus(response3, 200);

        console.log('Multiple patches applied:', response1.data.id, response2.data.id, response3.data.id);
    });

    // Example: PATCH returns the full updated object
    test('PATCH - Verify returns full updated object', async () => {
        const patchData = {
            title: 'Full Object Return'
        };

        const response = await apiSteps.patchResource('/posts', 9, patchData);

        apiSteps.verifyStatus(response, 200);
        expect(response.data).toHaveProperty('id');
        expect(response.data).toHaveProperty('title');
        expect(response.data).toHaveProperty('body');
        expect(response.data).toHaveProperty('userId');

        console.log('Full object returned:', response.data);
    });
});

test.describe('DELETE API Tests', () => {
    // Example: Delete post with ID 1
    test('DELETE - Delete an existing post', async () => {
        const response = await apiSteps.deleteResource('/posts', 1);

        apiSteps.verifyDeletedResource(response);

        console.log('Deleted post status:', response.status);
    });

    // Example: Delete comment with ID 1
    test('DELETE - Delete an existing comment', async () => {
        const response = await apiSteps.deleteResource('/comments', 1);

        apiSteps.verifyDeletedResource(response);

        console.log('Deleted comment status:', response.status);
    });

    // Example: Delete todo with ID 1
    test('DELETE - Delete an existing todo', async () => {
        const response = await apiSteps.deleteResource('/todos', 1);

        apiSteps.verifyDeletedResource(response);

        console.log('Deleted todo status:', response.status);
    });

    // Example: Delete album with ID 1
    test('DELETE - Delete an existing album', async () => {
        const response = await apiSteps.deleteResource('/albums', 1);

        apiSteps.verifyDeletedResource(response);

        console.log('Deleted album status:', response.status);
    });

    // Example: Status: 200, StatusText: "OK"
    test('DELETE - Verify status text is OK', async () => {
        const response = await apiSteps.deleteResource('/posts', 2);

        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');

        console.log('Status text:', response.statusText);
    });

    // Example: Delete multiple posts sequentially
    test('DELETE - Delete multiple posts sequentially', async () => {
        const deletedIds = [];

        for (let i = 10; i <= 12; i++) {
            const response = await apiSteps.deleteResource('/posts', i);
            apiSteps.verifyDeletedResource(response);
            deletedIds.push(i);
        }

        console.log('Deleted posts with IDs:', deletedIds);
        expect(deletedIds).toHaveLength(3);
    });

    // Example: Delete post -> Verify response headers
    test('DELETE - Verify response headers', async () => {
        const response = await apiSteps.deleteResource('/posts', 3);

        apiSteps.verifyDeletedResource(response);
        expect(response.headers).toBeDefined();

        console.log('Response headers:', response.headers);
    });

    // Example: Delete comment -> Verify status
    test('DELETE - Delete comment and verify status', async () => {
        const response = await apiSteps.deleteResource('/comments', 2);

        apiSteps.verifyDeletedResource(response);

        console.log('Comment delete status:', response.status);
    });

    // Example: Delete todo -> Verify status
    test('DELETE - Delete todo and verify status', async () => {
        const response = await apiSteps.deleteResource('/todos', 3);

        apiSteps.verifyDeletedResource(response);

        console.log('Todo delete status:', response.status);
    });

    // Example: Delete album -> Verify status
    test('DELETE - Delete album and verify status', async () => {
        const response = await apiSteps.deleteResource('/albums', 2);

        apiSteps.verifyDeletedResource(response);

        console.log('Album delete status:', response.status);
    });
});