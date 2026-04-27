class ApiPage {
    constructor() {
        this.baseURL = 'https://jsonplaceholder.typicode.com';
    }

    // Get the base URL for API
    getBaseURL() {
        return this.baseURL;
    }

    //Get the available endpoints
     //returns {Object} - Available endpoints

    getEndpoints() {
        return {
            posts: '/posts',
            comments: '/comments',
            albums: '/albums',
            photos: '/photos',
            todos: '/todos',
            users: '/users'
        };
    }
}

export default new ApiPage();