import React from "react";
import { useAtom } from "jotai";
import { favouritesAtom } from "../store";
import { Row, Card, Col } from "react-bootstrap";
import ArtworkCard from "@/components/ArtworkCard";

function Favourites() {
  const [favouritesList] = useAtom(favouritesAtom);

  if(!favouritesList) return null;

  return (
    <>
      <Row className="gy-4">
        {favouritesList.length > 0 ? (
          favouritesList.map((currentObjectID) => (
            <Col lg={3} key={currentObjectID}>
              <ArtworkCard objectID={currentObjectID} />
            </Col>
          ))
        ) : (
          <Col>
            <Card>
              <Card.Body>
              <h4>Nothing Here</h4>
                <Card.Text>
                  Try adding some new artwork to the list.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </>
  );
}

export default Favourites;
