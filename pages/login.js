import {
  Card,
  Form,
  Alert,
  Button,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useState } from "react";
import { authenticateUser } from "@/lib/authenticate";
import { useRouter } from "next/router";
import { searchHistoryAtom, favouritesAtom } from "@/store";
import { useAtom } from "jotai";
import { getFavourites, getHistory } from "@/lib/userData";

export default function Login() {
  const [warning, setWarning] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

  async function updateAtoms() {
    setFavouritesList(await getFavourites());
    setSearchHistory(await getHistory());
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await authenticateUser(user, password);
      await updateAtoms();
      router.push("/favourites");
    } catch (err) {
      setWarning(err.message);
    }
  }

  return (
    <>
      <Container>
      <Row className="justify-content-md-center">
          <Col sm={8}>
            <Card bg='light'>
              <Card.Body>
                <h2>Login</h2>
                Enter your login information below:
                <br />
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label>User:</Form.Label>
                    <Form.Control
                      type="text"
                      value={user}
                      id="userName"
                      name="userName"
                      onChange={(e) => setUser(e.target.value)}
                    />
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      id="password"
                      name="password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>

                  {warning && (
                    <>
                      <br />
                      <Alert variant="danger">{warning}</Alert>
                    </>
                  )}

                  <br />
                  <Button
                    variant="primary"
                    className="pull-right"
                    type="submit"
                  >
                    Login
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
