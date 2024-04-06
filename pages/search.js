import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Form, Row, Col, Button } from "react-bootstrap";
import { searchHistoryAtom } from "../store";
import { useAtom } from "jotai";
import { addToHistory } from "@/lib/userData";

function AdvancedSearch() {
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitForm = async (data) => {
    console.log(data);
    let queryString = `${data.searchBy}=true`;
    if (data.geoLocation) queryString += `&geoLocation=${data.geoLocation}`;
    if (data.medium) queryString += `&medium=${data.medium}`;
    queryString += `&isOnView=${data.isOnView}`;
    queryString += `&isHighlight=${data.isHighlight}`;
    queryString += `&q=${data.q}`;
    setSearchHistory(await addToHistory(queryString));
    router.push(`/artwork?${queryString}`);
  };

  return (
    <Form onSubmit={handleSubmit(submitForm)}>
      <Row>
        <Col>
          <Form.Group controlId="q" className="mb-3">
            <Form.Label>Search Query</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter search query"
              {...register("q", { required: true })}
              className={errors.q ? "is-invalid" : ""}
            />
            {errors.q && (
              <div className="invalid-feedback">This field is required</div>
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Form.Label>Search By</Form.Label>
          <Form.Select
            name="searchBy"
            defaultValue="title"
            className="mb-3"
            {...register("searchBy")}
          >
            <option value="title">Title</option>
            <option value="tags">Tags</option>
            <option value="artistOrCulture">Artist or Culture</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Group controlId="geoLocation" className="mb-3">
            <Form.Label>Geo Location</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter geo-location"
              {...register("geoLocation")}
            />
            <Form.Text muted>
              Case Sensitive String (ie "Europe", "France", "Paris", "China",
              "New York", etc.), with multiple values separated by the |
              operator
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="medium" className="mb-3">
            <Form.Label>Medium</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter medium"
              {...register("medium")}
            />
            <Form.Text muted>
              Case Sensitive String (ie: "Ceramics", "Furniture", "Paintings",
              "Sculpture", "Textiles", etc.), with multiple values separated by
              the | operator
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group controlId="isHighlight">
            <Form.Check
              type="checkbox"
              label="Highlighted"
              {...register("isHighlight")}
            />
          </Form.Group>
          <Form.Group controlId="isOnView">
            <Form.Check
              type="checkbox"
              label="Currently on View"
              {...register("isOnView")}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <br />
          <Button type="submit">Search</Button>
        </Col>
      </Row>
    </Form>
  );
}

export default AdvancedSearch;
