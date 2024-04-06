import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { favouritesAtom } from "../store";
import { Card, Button } from "react-bootstrap";
import { addToFavourites, removeFromFavourites } from "@/lib/userData";
import useSWR from "swr";
import Link from "next/link";
import Error from "next/error";
import Share from "@/components/Share";

const ArtworkCardDetail = ({ objectID }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);

  useEffect(()=>{
    let obj = objectID
    if (typeof(objectID) == "number"){
      obj = objectID.toString()
    }else{
      obj = objectID
    }
    setShowAdded(favouritesList?.includes(obj))
    }, [favouritesList])

  const favouritesClicked = async () => {
    if (showAdded) {
      let obj = objectID
    if (typeof(objectID) == "number"){
      obj = objectID.toString()
    }else{
      obj = objectID
    }
      setFavouritesList(await removeFromFavourites(obj));
      setShowAdded(false);
    } else {
      let obj = objectID
    if (typeof(objectID) == "number"){
      obj = objectID.toString()
    }else{
      obj = objectID
    }
      setFavouritesList(await addToFavourites(obj));
      setShowAdded(true);
    }
  };

  const { data, error } = useSWR(
    objectID
      ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
      : null
  );

  if (error) return <Error statusCode={404} />;
  if (!data) return null;

  const {
    primaryImage,
    title,
    objectDate,
    classification,
    medium,
    artistDisplayName,
    creditLine,
    dimensions,
    artistWikidata_URL,
    objectURL,
  } = data;

  return (
    <Card>
      {primaryImage && <Card.Img variant="top" src={primaryImage} />}
      <Card.Body>
        <Card.Title>{title || "N/A"}</Card.Title>
        <Card.Text>
          <strong>Date:</strong> {objectDate || "N/A"} <br />
          <strong>Classification:</strong> {classification || "N/A"} <br />
          <strong>Medium:</strong> {medium || "N/A"} <br />
          {showDetails && (
            <>
              <br />
              {artistDisplayName && (
                <>
                  <strong>Artist: </strong>
                  {artistDisplayName} {"( "}
                  <a href={artistWikidata_URL} target="_blank" rel="noreferrer">
                    wiki
                  </a>
                  {" )"}
                  <br />
                </>
              )}
              <strong>Credit Line: </strong>
              {creditLine || "N/A"}
              <br />
              <strong>Dimensions: </strong>
              {dimensions || "N/A"}
            </>
          )}
        </Card.Text>
        <Button variant="primary" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Hide Details" : "Show Details"}
        </Button>{" "}
        <Link href={objectURL} target="_blank" passHref>
          <Button variant="secondary">View on Met Museum</Button>
        </Link>{" "}
        <Button
          variant={showAdded ? "primary" : "outline-primary"}
          onClick={favouritesClicked}
        >
          {showAdded ? " - Favourite" : "+ Favourite"}
        </Button>{" "}
        <Share url={objectURL} />
      </Card.Body>
    </Card>
  );
};

export default ArtworkCardDetail;
