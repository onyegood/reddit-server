
const REGISTER_USER_MUTATION = `
mutation Register($username: String!, $password: String!){
    register(options: {username: $username, password: $password}){
        errors {
            field
            message
        }
        user {
            id
            username
        }
    }
}
`;

export default REGISTER_USER_MUTATION;