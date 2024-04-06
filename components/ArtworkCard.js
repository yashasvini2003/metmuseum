import { Card, Button } from 'react-bootstrap';
import Link from 'next/link';
import useSWR from 'swr';
import Error from 'next/error';

const ArtworkCard = ({ objectID }) => {
  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
  );

  if (error) {
    return <Error statusCode={404} />;
  }

  if (!data) {
    return null;
  }

  const {
    objectID: id,
    primaryImageSmall,
    primaryImage,
    title,
    objectDate,
    classification,
    medium,
  } = data;

  return (
    <Card>
      <Card.Img
        variant="top"
        src={primaryImageSmall || 'https://via.placeholder.com/375x375.png?text=[+Not+Available+]'}
        alt={title || 'N/A'}
      />
      <Card.Body>
        <Card.Title>{title || 'N/A'}</Card.Title>
        <Card.Text>
          <strong>Date:</strong> {objectDate || 'N/A'} <br/>
          <strong>Classification:</strong> {classification || 'N/A'} <br/>
          <strong>Medium:</strong> {medium || 'N/A'} <br/><br/>
          <Link href={`/artwork/${id}`} passHref>
        <Button variant="outline-primary">
          <strong>ID: </strong> {id}
        </Button>
      </Link>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ArtworkCard;