import { test, expect } from '@playwright/test';
import apiSteps from '../../framework/steps/api/ApiSteps.js';

test.describe('GET API Tests - JSONPlaceholder', () => {
    
    test('GET - Fetch all posts', async () => {
        const response = await apiSteps.fetchAllResources('/posts');
        
        // Verify status code is 200 (OK)
        apiSteps.verifyStatus(response, 200);
        
        // Verify response has data
        apiSteps.verifyResponseHasData(response);
        
        // Verify response structure contains expected keys
        apiSteps.verifyResponseKeys(response, ['userId', 'id', 'title', 'body']);
        
        console.log('Total posts fetched:', response.data.length);
    });

    test('GET - Fetch all comments', async () => {
        const response = await apiSteps.fetchAllResources('/comments');
        
        apiSteps.verifyStatus(response, 200);
        apiSteps.verifyResponseHasData(response);
        apiSteps.verifyResponseKeys(response, ['postId', 'id', 'name', 'email', 'body']);
        
        console.log('Total comments fetched:', response.data.length);
    });

    test('GET - Fetch all albums', async () => {
        const response = await apiSteps.fetchAllResources('/albums');
        
        apiSteps.verifyStatus(response, 200);
        apiSteps.verifyResponseHasData(response);
        apiSteps.verifyResponseKeys(response, ['userId', 'id', 'title']);
        
        console.log('Total albums fetched:', response.data.length);
    });

    test('GET - Fetch all photos', async () => {
        const response = await apiSteps.fetchAllResources('/photos');
        
        apiSteps.verifyStatus(response, 200);
        apiSteps.verifyResponseHasData(response);
        apiSteps.verifyResponseKeys(response, ['albumId', 'id', 'title', 'url', 'thumbnailUrl']);
        
        console.log('Total photos fetched:', response.data.length);
    });

    test('GET - Fetch all todos', async () => {
        const response = await apiSteps.fetchAllResources('/todos');
        
        apiSteps.verifyStatus(response, 200);
        apiSteps.verifyResponseHasData(response);
        apiSteps.verifyResponseKeys(response, ['userId', 'id', 'title', 'completed']);
        
        console.log('Total todos fetched:', response.data.length);
    });

    test('GET - Fetch all users', async () => {
        const response = await apiSteps.fetchAllResources('/users');
        
        apiSteps.verifyStatus(response, 200);
        apiSteps.verifyResponseHasData(response);
        apiSteps.verifyResponseKeys(response, ['id', 'name', 'username', 'email']);
        
        console.log('Total users fetched:', response.data.length);
    });

    test('GET - Fetch single post by ID', async () => {
        const response = await apiSteps.fetchResourceById('/posts', 1);
        
        apiSteps.verifyStatus(response, 200);
        
        // Verify single resource response
        expect(response.data).toHaveProperty('userId');
        expect(response.data).toHaveProperty('id', 1);
        expect(response.data).toHaveProperty('title');
        expect(response.data).toHaveProperty('body');
        
        console.log('Post fetched:', response.data);
    });

    test('GET - Fetch single todo by ID', async () => {
        const response = await apiSteps.fetchResourceById('/todos', 1);
        
        apiSteps.verifyStatus(response, 200);
        
        // Verify single todo response
        expect(response.data).toHaveProperty('userId');
        expect(response.data).toHaveProperty('id', 1);
        expect(response.data).toHaveProperty('title');
        expect(response.data).toHaveProperty('completed');
        
        console.log('Todo fetched:', response.data);
    });

    test('GET - Fetch comments for a specific post using query params', async () => {
        const response = await apiSteps.fetchResourcesWithParams('/comments', { postId: 1 });
        
        apiSteps.verifyStatus(response, 200);
        apiSteps.verifyResponseHasData(response);
        
        // Verify all returned comments belong to postId 1
        response.data.forEach(comment => {
            expect(comment.postId).toBe(1);
        });
        
        console.log('Comments for post 1:', response.data.length);
    });

    test('GET - Fetch nested resources - comments for a post', async () => {
        const response = await apiSteps.fetchNestedResources('/posts/1/comments');
        
        apiSteps.verifyStatus(response, 200);
        apiSteps.verifyResponseHasData(response);
        apiSteps.verifyResponseKeys(response, ['postId', 'id', 'name', 'email', 'body']);
        
        // Verify all comments belong to post 1
        response.data.forEach(comment => {
            expect(comment.postId).toBe(1);
        });
        
        console.log('Nested comments fetched:', response.data.length);
    });

    test('GET - Fetch nested resources - photos for an album', async () => {
        const response = await apiSteps.fetchNestedResources('/albums/1/photos');
        
        apiSteps.verifyStatus(response, 200);
        apiSteps.verifyResponseHasData(response);
        apiSteps.verifyResponseKeys(response, ['albumId', 'id', 'title', 'url', 'thumbnailUrl']);
        
        // Verify all photos belong to album 1
        response.data.forEach(photo => {
            expect(photo.albumId).toBe(1);
        });
        
        console.log('Nested photos fetched:', response.data.length);
    });

    test('GET - Fetch todos for a specific user', async () => {
        const response = await apiSteps.fetchResourcesWithParams('/todos', { userId: 1 });
        
        apiSteps.verifyStatus(response, 200);
        apiSteps.verifyResponseHasData(response);
        
        // Verify all returned todos belong to userId 1
        response.data.forEach(todo => {
            expect(todo.userId).toBe(1);
        });
        
        console.log('Todos for user 1:', response.data.length);
    });

    test('GET - Fetch posts for a specific user', async () => {
        const response = await apiSteps.fetchResourcesWithParams('/posts', { userId: 1 });
        
        apiSteps.verifyStatus(response, 200);
        apiSteps.verifyResponseHasData(response);
        
        // Verify all returned posts belong to userId 1
        response.data.forEach(post => {
            expect(post.userId).toBe(1);
        });
        
        console.log('Posts for user 1:', response.data.length);
    });

    test('GET - Verify non-existent resource returns 404', async () => {
        const response = await apiSteps.fetchResourceById('/posts', 999999);
        
        // JSONPlaceholder returns 404 for non-existent resources
        expect(response.status).toBe(404);
        
        console.log('Non-existent resource response:', response.data);
    });
});