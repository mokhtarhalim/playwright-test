import { faker } from "@faker-js/faker";

// Generate random post data using faker
const generatePostData = () => ({
    title: faker.lorem.sentence({ min: 3, max: 10 }),
    body: faker.lorem.paragraph(),
    userId: faker.number.int({ min: 1, max: 10 })
});

// Generate random comment data using faker
const generateCommentData = (postId = null) => ({
    postId: postId || faker.number.int({ min: 1, max: 100 }),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    body: faker.lorem.sentence()
});

// Generate random todo data using faker
const generateTodoData = () => ({
    userId: faker.number.int({ min: 1, max: 10 }),
    title: faker.lorem.sentence({ min: 3, max: 8 }),
    completed: faker.datatype.boolean()
});

// Generate random album data using faker
const generateAlbumData = () => ({
    userId: faker.number.int({ min: 1, max: 10 }),
    title: faker.lorem.words({ min: 2, max: 5 })
});

// Generate random photo data using faker
const generatePhotoData = (albumId = null) => ({
    albumId: albumId || faker.number.int({ min: 1, max: 100 }),
    title: faker.lorem.words({ min: 1, max: 3 }),
    url: faker.image.url(),
    thumbnailUrl: faker.image.url({ width: 150, height: 150 })
});

// Generate random user data using faker
const generateUserData = () => ({
    name: faker.person.fullName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    website: faker.internet.url()
});

// Generate post update data (for PUT)
const generatePostUpdateData = () => ({
    title: faker.lorem.sentence({ min: 3, max: 10 }),
    body: faker.lorem.paragraph(),
    userId: faker.number.int({ min: 1, max: 10 })
});

// Generate post patch data (for PATCH - partial update)
const generatePostPatchData = () => ({
    title: faker.lorem.sentence({ min: 3, max: 10 })
});

// Generate post data with special characters
const generatePostDataWithSpecialChars = () => ({
    title: `Test with special chars: ${faker.string.symbol(5)}`,
    body: `Body with "quotes" and ${faker.lorem.word()} and newlines\nand tabs\t`,
    userId: faker.number.int({ min: 1, max: 10 })
});

// Generate post data with unicode/emoji characters
const generatePostDataWithUnicode = () => ({
    title: `Unicode test: ${faker.lorem.words(3)} 🌍`,
    body: `Emoji test: ${faker.internet.url()}`,
    userId: faker.number.int({ min: 1, max: 10 })
});

// Generate post data with long content (1000+ characters)
const generatePostDataWithLongContent = () => ({
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(10),
    userId: faker.number.int({ min: 1, max: 10 })
});

// Generate custom headers for API requests
const generateCustomHeaders = () => ({
    'X-Custom-Header': faker.string.alphanumeric(10),
    'X-Request-ID': faker.string.numeric(5)
});

// Generate todo data with completed = true
const generateTodoDataCompleted = () => ({
    userId: faker.number.int({ min: 1, max: 10 }),
    title: faker.lorem.sentence(),
    completed: true
});

// Generate todo data with completed = false
const generateTodoDataIncomplete = () => ({
    userId: faker.number.int({ min: 1, max: 10 }),
    title: faker.lorem.sentence(),
    completed: false
});

// Generate post data for PUT (full update)
const generatePostDataForUpdate = () => ({
    title: faker.lorem.sentence({ min: 3, max: 10 }),
    body: faker.lorem.paragraph(),
    userId: faker.number.int({ min: 1, max: 10 })
});

// Generate post data for PATCH (partial update - title only)
const generatePostDataForPatch = () => ({
    title: faker.lorem.sentence({ min: 3, max: 10 })
});

// Generate comment data for PUT (full update)
const generateCommentDataForUpdate = (postId = null) => ({
    postId: postId || faker.number.int({ min: 1, max: 100 }),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    body: faker.lorem.sentence()
});

// Generate todo data for PUT (full update)
const generateTodoDataForUpdate = () => ({
    userId: faker.number.int({ min: 1, max: 10 }),
    title: faker.lorem.sentence({ min: 3, max: 8 }),
    completed: faker.datatype.boolean()
});

// Generate album data for PUT (full update)
const generateAlbumDataForUpdate = () => ({
    userId: faker.number.int({ min: 1, max: 10 }),
    title: faker.lorem.words({ min: 2, max: 5 })
});

export {
    generatePostData,
    generateCommentData,
    generateTodoData,
    generateAlbumData,
    generatePhotoData,
    generateUserData,
    generatePostUpdateData,
    generatePostPatchData,
    generatePostDataWithSpecialChars,
    generatePostDataWithUnicode,
    generatePostDataWithLongContent,
    generateCustomHeaders,
    generateTodoDataCompleted,
    generateTodoDataIncomplete,
    generatePostDataForUpdate,
    generatePostDataForPatch,
    generateCommentDataForUpdate,
    generateTodoDataForUpdate,
    generateAlbumDataForUpdate
};