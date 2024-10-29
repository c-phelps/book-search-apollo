import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";

import { GET_ME } from "../utils/queries";
import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";
import { REMOVE_BOOK } from "../utils/mutations";

// const [removeBook, { error }] = useQuery(REMOVE_BOOK);

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);
  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    // console.log("BOOKID:", bookId);
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // const response = await deleteBook(bookId, token);
      await removeBook({
        variables: { bookId },
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  const userData = data?.me;

  return (
    <div fluid="true" className="text-light bg-dark p-5">
      <Container>
        <h1>Viewing saved books!</h1>
        <h2 className="pt-5">
          {userData?.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? "book" : "books"}:`
            : "You have no saved books!"}
        </h2>
      </Container>
      <Container>
        <Row>
          {userData?.savedBooks.map((book) => (
            <Col md="4" key={book.bookId}>
              <Card border="dark">
                {book.image && <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant="top" />}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors.join(", ")}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className="btn-block btn-danger" onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default SavedBooks;
