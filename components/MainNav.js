import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { searchHistoryAtom } from "@/store";
import { useAtom } from "jotai";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Container,
  ListGroup,
  NavDropdown,
} from "react-bootstrap";
import { removeToken, readToken } from "@/lib/authenticate";

import { addToHistory } from "@/lib/userData";

const MainNav = () => {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const tempArtwork = {
    objectID: 0,
    title: "Nothing here....",
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [artworks, setArtworks] = useState([]);
  const [focused, setFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const token = readToken();

  function logout() {
    setIsExpanded(false);
    removeToken();
    router.push("/login");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (searchQuery) {
      setSearchHistory(await addToHistory(`title=true&q=${searchQuery}`));
      router.push(`/artwork?title=true&q=${searchQuery}`);
      setSearchQuery("");
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    const fetchArtworks = async () => {
      if (!searchQuery || (searchQuery && searchQuery.trim() === "")) {
        setArtworks([tempArtwork]);
        return;
      }

      const finalQuery = new URLSearchParams({
        title: true,
        q: searchQuery,
      });
      const response = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`
      );
      const { objectIDs } = await response.json();
      if (objectIDs) {
        const artworkList = objectIDs.slice(0, 10);
        const artworkDetails = await Promise.all(
          artworkList.map(async (objectID) => {
            const artworkDetailsResponse = await fetch(
              `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
            );
            const artworkDetailsData = await artworkDetailsResponse.json();
            return artworkDetailsData;
          })
        ).catch((err) => console.log(err));
        setArtworks(artworkDetails);
      } else {
        setArtworks([tempArtwork]);
      }
    };

    fetchArtworks();
  }, [searchQuery]);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleItemClick = async (artwork) => {
    if(searchQuery){
    setSearchHistory(await addToHistory(`title=true&q=${searchQuery}`));
    setSearchQuery("");
    }
    if (artwork.objectID !== 0) {
      router.push(`/artwork/${artwork.objectID}`);
      setSearchQuery("");
    }
    setArtworks([tempArtwork]);
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    const handleDocumentClick = (event) => {
      const searchInput = document.getElementById("search-input");
      const listGroup = document.getElementById("list-group");

      if (
        searchInput &&
        !searchInput.contains(event.target) &&
        listGroup &&
        !listGroup.contains(event.target)
      ) {
        setFocused(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  };

  return (
    <>
      <Navbar
        className="fixed-top navbar-dark bg-primary"
        expand="lg"
        expanded={isExpanded}
      >
        <Container>
          <Navbar.Brand>Yashasvini Bhanuraj</Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setIsExpanded(!isExpanded)}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/" passHref legacyBehavior>
                <Nav.Link
                  onClick={() => setIsExpanded(false)}
                  active={router.pathname === "/"}
                >
                  Home
                </Nav.Link>
              </Link>
              {token && (
                <>
                  <Link href="/search" passHref legacyBehavior>
                    <Nav.Link
                      onClick={() => setIsExpanded(false)}
                      active={router.pathname === "/search"}
                    >
                      Advanced Search
                    </Nav.Link>
                  </Link>
                </>
              )}
            </Nav>
            {token && (
              <>
                <Form
                  onSubmit={handleSubmit}
                  className="d-flex"
                  style={{ justifyContent: "flex-end" }}
                >
                  <FormControl
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    value={searchQuery}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    id="search-input"
                  />
                  {focused && (
                    <ListGroup
                      style={{
                        position: "absolute",
                        top: "60px",
                        width: "40%",
                        zIndex: "1", // ensure the group appears on top
                      }}
                      id="list-group"
                    >
                      {artworks.map((artwork) => (
                        <ListGroup.Item
                          action
                          key={artwork.objectID}
                          as="a"
                          onClick={() => handleItemClick(artwork)}
                        >
                          {artwork.title}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                  <Button type="submit" variant="btn btn-success">
                    Search
                  </Button>
                </Form>
                <Nav>
                  <NavDropdown title={token.userName} id="basic-nav-dropdown">
                    <Link href="/favourites" passHref legacyBehavior>
                      <NavDropdown.Item
                        onClick={() => setIsExpanded(false)}
                        active={router.pathname === "/favourites"}
                      >
                        Favourites
                      </NavDropdown.Item>
                    </Link>
                    <Link href="/history" passHref legacyBehavior>
                      <NavDropdown.Item
                        onClick={() => setIsExpanded(false)}
                        active={router.pathname === "/history"}
                      >
                        {" "}
                        Search History
                      </NavDropdown.Item>
                    </Link>
                    <NavDropdown.Divider></NavDropdown.Divider>
                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </>
            )}
            {!token && (
              <>
                <Nav>
                  <Link href="/register" passHref legacyBehavior>
                    <Nav.Link
                      onClick={() => setIsExpanded(false)}
                      active={router.pathname === "/register"}
                    >
                      Register
                    </Nav.Link>
                  </Link>
                  <Link href="/login" passHref legacyBehavior>
                    <Nav.Link
                      onClick={() => setIsExpanded(false)}
                      active={router.pathname === "/login"}
                    >
                      Log In
                    </Nav.Link>
                  </Link>
                </Nav>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
      <br />
    </>
  );
};

export default MainNav;
