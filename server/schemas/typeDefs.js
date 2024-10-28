const typeDefs = `
    type User {
        _id: ID!
        username: String
        email: String
        savedBooks: [Book]
        bookCount: Int
    }
    type Book {
        _id: ID!
        bookId: String!
        authors: [String]
        description: String
        image: String
        link: String
        title: String!
    }
    
    type Auth {
        token: ID!
        user: User 
    }
    # BookInput for saveBook Mutation
    input BookInput
    {
        authors: [String]
        bookId: String!
        description: String!
        title: String!
        image: String
    }
    # Query
    type Query {
        me: User
    }
    # Mutations, note saveBook is using the input BookInput rather than listing each input        
    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(input: BookInput!): User
        removeBook(bookId: String!): User
    }
`;

module.exports = typeDefs;