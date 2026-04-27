import { test, expect } from '@playwright/test';
import apiSteps from '../../framework/steps/api/ApiSteps.js';
import { 
    generatePostData, 
    generateCommentData, 
    generateTodoData, 
    generateAlbumData,
    generatePostDataWithSpecialChars,
    generatePostDataWithUnicode,
    generatePostDataWithLongContent,
    generateCustomHeaders,
    generateTodoDataCompleted,
    generateTodoDataIncomplete
} from '../../framework/datasets/api/api.data.js';

test.describe('POST API Tests - JSONPlaceholder', () => {

    // Example: { title: "Random title", body: "Random body text", userId: 5 }
    test('POST - Create a new post with faker data', async () => {
        const postData = generatePostData();

        const response = await apiSteps.createResource('/posts', postData);

        // Verify status is 201 (Created)
        apiSteps.verifyStatus(response, 201);

        // Verify response contains the created resource
        apiSteps.verifyCreatedResource(response, postData);

        // Verify response has ID
        expect(response.data.id).toBeDefined();

        console.log('Created post:', response.data);
    });

    // Example: { postId: 1, name: "John Doe", email: "john@example.com", body: "Comment text" }
    test('POST - Create a new comment with faker data', async () => {
        const commentData = generateCommentData(1);

        const response = await apiSteps.createResource('/comments', commentData);

        apiSteps.verifyStatus(response, 201);
        apiSteps.verifyCreatedResource(response, commentData);

        console.log('Created comment:', response.data);
    });

    // Example: { userId: 3, title: "Buy groceries", completed: false }
    test('POST - Create a new todo with faker data', async () => {
        const todoData = generateTodoData();

        const response = await apiSteps.createResource('/todos', todoData);

        apiSteps.verifyStatus(response, 201);
        apiSteps.verifyCreatedResource(response, todoData);

        console.log('Created todo:', response.data);
    });

    // Example: { userId: 2, title: "My Photo Album" }
    test('POST - Create a new album with faker data', async () => {
        const albumData = generateAlbumData();

        const response = await apiSteps.createResource('/albums', albumData);

        apiSteps.verifyStatus(response, 201);
        apiSteps.verifyCreatedResource(response, albumData);

        console.log('Created album:', response.data);
    });

    // Example: { title: "Test @#$%^&*()", body: "Body with \"quotes\" and 'apostrophes'", userId: 7 }
    test('POST - Create post with faker special characters', async () => {
        const postData = generatePostDataWithSpecialChars();

        const response = await apiSteps.createResource('/posts', postData);

        apiSteps.verifyStatus(response, 201);
        expect(response.data.title).toBe(postData.title);

        console.log('Post with special characters created:', response.data);
    });

    // Example: { title: "Unicode 你好世界 🌍", body: "Emoji 🎉🚀💻", userId: 4 }
    test('POST - Create post with faker unicode characters', async () => {
        const postData = generatePostDataWithUnicode();

        const response = await apiSteps.createResource('/posts', postData);

        apiSteps.verifyStatus(response, 201);
        expect(response.data.title).toBe(postData.title);

        console.log('Post with unicode created:', response.data);
    });

    // Example: { title: "Short title", body: "Long text with 1000+ characters...", userId: 5 }
    test('POST - Create post with faker long content', async () => {
        const postData = generatePostDataWithLongContent();

        const response = await apiSteps.createResource('/posts', postData);

        apiSteps.verifyStatus(response, 201);
        expect(response.data.body.length).toBeGreaterThan(100);

        console.log('Post with long content created, length:', response.data.body.length);
    });

    // Example: { title: "Post title", body: "Post body", userId: 8 }
    test('POST - Create post with faker different userId', async () => {
        const postData = generatePostData();

        const response = await apiSteps.createResource('/posts', postData);

        apiSteps.verifyStatus(response, 201);
        expect(response.data.userId).toBe(postData.userId);

        console.log('Post created for userId:', response.data);
    });

    // Example: headers: { 'X-Custom-Header': 'abc123', 'X-Request-ID': '12345' }
    test('POST - Create post with custom headers', async () => {
        const postData = generatePostData();
        const customHeaders = generateCustomHeaders();

        const response = await apiSteps.createResourceWithHeaders('/posts', postData, customHeaders);

        apiSteps.verifyStatus(response, 201);
        apiSteps.verifyContentTypeJson(response);

        console.log('Post with custom headers created:', response.data);
    });

    // Example: Content-Type: application/json, Location: /posts/101
    test('POST - Verify response headers', async () => {
        const postData = generatePostData();

        const response = await apiSteps.createResource('/posts', postData);

        apiSteps.verifyStatus(response, 201);
        apiSteps.verifyContentTypeJson(response);

        console.log('Response headers:', response.headers);
    });

    // Example: Create 3 posts sequentially, each with unique faker data
    test('POST - Create multiple posts sequentially with faker', async () => {
        const postIds = [];

        for (let i = 1; i <= 3; i++) {
            const postData = generatePostData();

            const response = await apiSteps.createResource('/posts', postData);
            apiSteps.verifyStatus(response, 201);
            postIds.push(response.data.id);
        }

        console.log('Created posts with IDs:', postIds);
        expect(postIds).toHaveLength(3);
    });

    // Example: { postId: 42, name: "Commenter Name", email: "email@test.com", body: "Comment body" }
    test('POST - Create comment with faker different postId', async () => {
        const commentData = generateCommentData(42);

        const response = await apiSteps.createResource('/comments', commentData);

        apiSteps.verifyStatus(response, 201);
        expect(response.data.postId).toBe(42);

        console.log('Comment created for post:', response.data);
    });

    // Example: { userId: 1, title: "Finish homework", completed: true }
    test('POST - Create todo with completed true', async () => {
        const todoData = generateTodoDataCompleted();

        const response = await apiSteps.createResource('/todos', todoData);

        apiSteps.verifyStatus(response, 201);
        expect(response.data.completed).toBe(true);

        console.log('Completed todo created:', response.data);
    });

    // Example: { userId: 1, title: "Start homework", completed: false }
    test('POST - Create todo with completed false', async () => {
        const todoData = generateTodoDataIncomplete();

        const response = await apiSteps.createResource('/todos', todoData);

        apiSteps.verifyStatus(response, 201);
        expect(response.data.completed).toBe(false);

        console.log('Incomplete todo created:', response.data);
    });

    // Example: Status: 201, StatusText: "Created"
    test('POST - Verify status text is Created', async () => {
        const postData = generatePostData();

        const response = await apiSteps.createResource('/posts', postData);

        expect(response.status).toBe(201);
        expect(response.statusText).toBe('Created');

        console.log('Status text:', response.statusText);
    });

    // Example: { userId: 5, title: "Vacation Photos" }
    test('POST - Create album with faker different userId', async () => {
        const albumData = generateAlbumData();

        const response = await apiSteps.createResource('/albums', albumData);

        apiSteps.verifyStatus(response, 201);
        expect(response.data.userId).toBe(albumData.userId);

        console.log('Album created:', response.data);
    });

    // Example: { title: "My Post", body: "Full content here", userId: 3 }
    test('POST - Create post with faker full user data', async () => {
        const postData = generatePostData();

        const response = await apiSteps.createResource('/posts', postData);

        apiSteps.verifyStatus(response, 201);
        
        // Verify all fields match
        expect(response.data.title).toBe(postData.title);
        expect(response.data.body).toBe(postData.body);
        expect(response.data.userId).toBe(postData.userId);

        console.log('Full post created:', response.data);
    });

    // Example: Create post -> Create comment for that post -> Create todo (all with faker data)
    test('POST - Create multiple different resources with faker', async () => {
        // Create a post
        const postData = generatePostData();
        const postResponse = await apiSteps.createResource('/posts', postData);
        apiSteps.verifyStatus(postResponse, 201);
        
        // Create a comment for that post
        const commentData = generateCommentData(postResponse.data.id);
        const commentResponse = await apiSteps.createResource('/comments', commentData);
        apiSteps.verifyStatus(commentResponse, 201);
        
        // Create a todo
        const todoData = generateTodoData();
        const todoResponse = await apiSteps.createResource('/todos', todoData);
        apiSteps.verifyStatus(todoResponse, 201);

        console.log('Created multiple resources:', {
            post: postResponse.data.id,
            comment: commentResponse.data.id,
            todo: todoResponse.data.id
        });
    });
});