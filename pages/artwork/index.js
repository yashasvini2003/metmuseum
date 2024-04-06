import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Row, Col, Pagination, Card } from 'react-bootstrap';
import useSWR from 'swr';
import validObjectIDList from "@/public/data/validObjectIDList.json"
import ArtworkCard from '@/components/ArtworkCard';
import Error from 'next/error';

const PER_PAGE = 12;
const validObjectIDSet = new Set(validObjectIDList.objectIDs);

const Artwork = () => {
  const router = useRouter();
  let finalQuery = router.asPath.split('?')[1];

  console.log(finalQuery)

  const [artworkList, setArtworkList] = useState(null);
  const [page, setPage] = useState(1);

  const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`);

  useEffect(() => {
    if (data) {
      let filteredResults = data.objectIDs?.filter(x => validObjectIDSet.has(x));
      const results = [];
      for (let i = 0; i < filteredResults?.length; i += PER_PAGE) {
        const chunk = filteredResults?.slice(i, i + PER_PAGE);
        results.push(chunk);
      }
      setArtworkList(results);
      setPage(1);
    }
  }, [data]);

  function previousPage() {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  function nextPage() {
    if (page < artworkList.length) {
      setPage(page + 1);
    }
  }

  if (error) return <Error statusCode={404} />;
  if (!artworkList) return null;

  return (
    <>
      <Row className="gy-4">
        {artworkList.length > 0 ? (
          artworkList[page - 1].map((currentObjectID) => (
            <Col lg={3} key={currentObjectID}>
              <ArtworkCard objectID={currentObjectID} />
            </Col>
          ))
        ) : (
          <Col>
            <Card>
              <Card.Body>
              <Card.Text>
                <h4>Nothing Here</h4>
              Try searching for something else.
              </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
      {artworkList.length > 0 && (
        <Row className="mt-4">
          <Col>
            <Pagination>
              <Pagination.Prev onClick={previousPage} />
              <Pagination.Item>{page}</Pagination.Item>
              <Pagination.Next onClick={nextPage} />
            </Pagination>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Artwork;
