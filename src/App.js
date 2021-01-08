import enTranslations from "@shopify/polaris/locales/en.json";

import {
  AppProvider,
  Page,
  Card,
  Icon,
  TextField,
  Layout,
  Button,
  Banner,
  ResourceList,
  ResourceItem,
  Pagination,
} from "@shopify/polaris";

import { useState, useCallback, useEffect } from "react";
import { SearchMinor } from "@shopify/polaris-icons";
import axios from "axios";

import { debounce } from "lodash";

const apiKey = "172b6f36";

const url = `https://www.omdbapi.com/`;

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  const getMovies = (title, pageNumber) => {
    axios
      .get(`${url}?s=${title}&type=movie&page=${pageNumber}&apikey=${apiKey}`)
      .then(function (response) {
        const { Search, totalResults } = response.data;
        setTotalResults(totalResults ? totalResults : 0);
        setResults(Search ? Search : []);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const debouncedApiCall = useCallback(
    debounce(title => getMovies(title, 1), 500),
    []
  );

  useEffect(() => {
    debouncedApiCall(searchQuery);
  }, [searchQuery, debouncedApiCall]);

  const handleChange = newValue => {
    setSearchQuery(newValue);
  };

  const [results, setResults] = useState([]);

  const savedNominations = localStorage.getItem("nominations");

  const [nominations, setNominations] = useState(
    savedNominations ? JSON.parse(savedNominations) : []
  );

  const [totalResults, setTotalResults] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    console.log("updated localStorage");
    localStorage.setItem("nominations", JSON.stringify(nominations));
  }, [nominations]);

  const Result = movie => {
    const { Title, Year } = movie;
    return (
      <ResourceItem>
        <p>{`${Title} - ${Year}`}</p>
        <Button
          disabled={nominations.includes(movie) || nominations.length >= 5}
          onClick={() => setNominations([...nominations, movie])}
        >
          Nominate
        </Button>
      </ResourceItem>
    );
  };

  const Nomination = (movie, id, index) => {
    const { Title, Year, imdbID } = movie;
    const rank = index + 1;
    return (
      <ResourceItem>
        <p>{`${rank}. ${Title} - ${Year}`}</p>
        <Button
          onClick={() =>
            setNominations(
              nominations.filter(nomination => nomination.imdbID !== imdbID)
            )
          }
        >
          Remove
        </Button>
      </ResourceItem>
    );
  };

  return (
    <AppProvider i18n={enTranslations}>
      <Page title="The Shoppies 🎥">
        <Layout>
          {nominations.length >= 5 && (
            <Layout.Section>
              <Banner title="You're all done!">
                <p>You've reached the maximum of 5 nominations</p>
              </Banner>
            </Layout.Section>
          )}
          <Layout.Section>
            <Card sectioned>
              <TextField
                onChange={handleChange}
                label="Movie title"
                value={searchQuery}
                prefix={<Icon source={SearchMinor} color="inkLighter" />}
                placeholder="Search"
              />
            </Card>
          </Layout.Section>
          <Layout.Section oneHalf>
            <Card title={`Results for ${searchQuery ? searchQuery : "..."}`}>
              <ResourceList
                resourceName={{ singular: "movie", plural: "movies" }}
                items={results}
                renderItem={Result}
                showHeader
                totalItemsCount={totalResults}
              />
              <Card.Section>
                <Pagination
                  label="Results"
                  hasPrevious={currentPage > 1}
                  onPrevious={() => {
                    getMovies(searchQuery, currentPage - 1);
                    setCurrentPage(currentPage - 1);
                  }}
                  hasNext={currentPage * 10 < totalResults}
                  onNext={() => {
                    getMovies(searchQuery, currentPage + 1);
                    setCurrentPage(currentPage + 1);
                  }}
                />
              </Card.Section>
            </Card>
          </Layout.Section>
          <Layout.Section oneHalf>
            <Card title="Nominations">
              <Card.Section>
                <p>
                  Movies you nominate will appear here. You may nominate up to a
                  maximum of 5 movies.
                </p>
              </Card.Section>
              <ResourceList
                resourceName={{ singular: "customer", plural: "customers" }}
                items={nominations}
                renderItem={Nomination}
              />
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </AppProvider>
  );
}

export default App;
