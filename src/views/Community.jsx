import { ArrowBack, ArrowForward, Search } from "@mui/icons-material";
import { Button, Grid, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { UserProfileCard } from "../components/UserProfileCard";
import { trim } from "lodash";

export const Community = ({ loggedIn }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [currentFirstResultIndex, setCurrentFirstResultIndex] = useState(0);

  const searchViewLimit = 3;

  const navigation = useNavigate();
  const goBack = () => {
    navigation(loggedIn ? "/home" : "/login", { replace: true });
  };

  const onNext = () => {
    setCurrentFirstResultIndex(currentFirstResultIndex + searchViewLimit);
  };

  const onPrevious = () => {
    setCurrentFirstResultIndex(currentFirstResultIndex - searchViewLimit);
  };

  const onSearch = () => {
    const q = trim(query);
    Axios.get(`//localhost:3500/search/${q.length ? `q=${q}` : ""}`)
      .then((res) => {
        // console.log(res);
        console.log("set results");
        console.log(res.data);
        setSearchResults(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const getAllResults = async () => {
      await Axios.get(`//localhost:3500/search`)
        .then((res) => {
          console.log(res);
          setSearchResults(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getAllResults();
  }, []);

  const searchNavigation = useRef(null);

  useEffect(() => {
    if (searchNavigation.current) {
      searchNavigation.current.scrollIntoView();
    }
  });

  return (
    <Grid container spacing={3}>
      <Grid xs={12} item>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <Button
            onClick={goBack}
            variant={"contained"}
            startIcon={<ArrowBack />}
          >
            Go back
          </Button>
        </div>
      </Grid>
      <Grid xs={12} item>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <TextField
            placeholder={"Search for a dietitian"}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={(event) => {
              event.target.select();
            }}
            style={{ width: "60vw" }}
            InputProps={{
              style: {
                backgroundColor: "white",
              },
            }}
          />
          <Button variant="contained" startIcon={<Search />} onClick={onSearch}>
            Search
          </Button>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          {searchResults
            ? searchResults.map((result, i) => {
                return (
                  i >= currentFirstResultIndex &&
                  i < currentFirstResultIndex + searchViewLimit && (
                    <Grid key={i} item xs={6} md={4}>
                      {/* <div style={{ border: "2px solid red" }}>
                    {result.name} {result.surname}
                  </div> */}
                      <div style={{ height: "100%" }}>
                        <UserProfileCard profile={result} token={null} />
                      </div>
                    </Grid>
                  )
                );
              })
            : null}
        </Grid>
      </Grid>
      <Grid xs={12} item>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "10px",
          }}
          ref={searchNavigation}
        >
          <Button
            onClick={onPrevious}
            variant={"contained"}
            startIcon={<ArrowBack />}
            disabled={currentFirstResultIndex === 0}
          >
            Previous results
          </Button>

          <Button
            onClick={onNext}
            variant={"contained"}
            startIcon={<ArrowForward />}
            disabled={
              searchResults &&
              searchResults.length >= currentFirstResultIndex &&
              searchResults.length <= currentFirstResultIndex + searchViewLimit
            }
          >
            Next results
          </Button>
        </div>
      </Grid>
    </Grid>
  );
};
