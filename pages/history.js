import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { Button, Card, ListGroup } from "react-bootstrap";
import { searchHistoryAtom } from "../store";
import styles from "@/styles/History.module.css";
import { removeFromHistory } from "@/lib/userData";


function History() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();

  if(!searchHistory) return null;

  // logic for parsing search queries
  let parsedHistory = [];
  searchHistory.forEach((h) => {
    let params = new URLSearchParams(h); // 
    let entries = params.entries();
    parsedHistory.push(Object.fromEntries(entries));
    //console.log(parsedHistory)
  });

  // function for navigating to artwork page on history item click
  const historyClicked = (e, index) => {
    e.stopPropagation();
    router.push(`/artwork?${searchHistory[index]}`);
  };

  // function for removing history item
  const removeHistoryClicked = async (e, index) => {
    e.stopPropagation();
    setSearchHistory(await removeFromHistory(searchHistory[index]));
  };

  return (
    <div>
      {parsedHistory.length === 0 && (
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4>
            <Card.Text>Try searching for some artwork.</Card.Text>
          </Card.Body>
        </Card>
      )}
      {parsedHistory.length > 0 && (
        <ListGroup>
          {parsedHistory.map((historyItem, index) => (
            <ListGroup.Item
              key={index}
              className={styles.historyListItem}
              onClick={(e) => historyClicked(e, index)}
            >
              {Object.keys(historyItem).map((key) => (
                <span key={key}>
                  {key}: <strong>{historyItem[key]}</strong>&nbsp;
                </span>
              ))}
              <Button
                className="float-end"
                variant="danger"
                size="sm"
                onClick={(e) => removeHistoryClicked(e, index)}
              >
                &times;
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}

export default History;