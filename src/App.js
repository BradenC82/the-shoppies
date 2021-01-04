import enTranslations from "@shopify/polaris/locales/en.json";
import { AppProvider, Page, Card } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { Icon, TextField } from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";
import axios from "axios";
import Result from "./components/Result";
import { debounce } from "lodash";

const apiKey = "172b6f36";

const url = `http://www.omdbapi.com/`;

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  const getMovies = title => {
    axios
      .get(`${url}?s=${title}&type=movie&page=1&apikey=${apiKey}`)
      .then(function (response) {
        const { Search, totalResults } = response.data;
        console.log(Search);
        setResults(Search ? Search : []);
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const debouncedApiCall = useCallback(
    debounce(title => getMovies(title), 2000),
    []
  );

  useEffect(() => {
    debouncedApiCall(searchQuery);
  }, [searchQuery, debouncedApiCall]);

  const handleChange = newValue => {
    setSearchQuery(newValue);
  };

  const [results, setResults] = useState([]);

  return (
    <AppProvider i18n={enTranslations}>
      <Page title="The Shoppies">
        <Card sectioned>
          <TextField
            onChange={handleChange}
            label="Tags"
            value={searchQuery}
            prefix={<Icon source={SearchMinor} color="inkLighter" />}
            placeholder="Search"
          />
        </Card>
        <div style={{ display: "flex" }}>
          <Card sectioned>
            <h1>Results for {searchQuery}</h1>
            {results.map(movie => (
              <Result title={movie.Title} year={movie.Year}></Result>
            ))}
          </Card>
        </div>
      </Page>
    </AppProvider>
  );
}

export default App;
