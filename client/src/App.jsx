import "./App.css";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
const httpLink = createHttpLink({
  uri: "/graphql",
});

import { Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";

// this creates the request middleware that will attach JWT token to every request as authorization in header
const authLink = setContext((_, { headers }) => {
  // retrieve token if it exists in localstorage
  const token = localStorage.getItem("id_token");
  console.log("Token:", token);
  return {
    // returns the updated headers using the spread operator so the context httplink read
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
