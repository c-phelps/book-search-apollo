const typeDefs = `
    type User {
        _id: ID!
        username: String
        email: String
        password: String
        savedBooks: [Book]
        bookCount: Int
    }
    type Book {
        _id: ID!
        bookId: String!
        authors: [String]
        description: String!
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
        description: String!
        title: String!
        bookId: string!
        image: String
        link: string
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
