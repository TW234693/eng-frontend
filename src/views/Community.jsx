import { ArrowBack, ArrowForward, Search } from "@mui/icons-material";
import { Button, Card, Grid, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { UserProfileCard } from "../components/UserProfileCard";
import { trim } from "lodash";

import { useTranslation } from "react-i18next";

export const Community = ({ loggedIn }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [currentFirstResultIndex, setCurrentFirstResultIndex] = useState(0);

  const searchViewLimit = 3;

  const { t } = useTranslation();

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
    Axios.get(`//localhost:3500/search/${q.length ? `q=${encodeURI(q)}` : ""}`)
      .then((res) => {
        console.log("set results");
        console.log(res.data);
        setSearchResults(res.data);
      })
      .catch((err) => {
        setSearchResults(null);
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
            {`${t("go_back")}`}
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
            placeholder={`${t("community_searchForDietitian")}`}
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
            {`${t("search")}`}
          </Button>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          {searchResults ? (
            searchResults.map((result, i) => {
              return (
                i >= currentFirstResultIndex &&
                i < currentFirstResultIndex + searchViewLimit && (
                  <Grid key={i} item xs={6} md={4}>
                    <div style={{ height: "100%" }}>
                      <UserProfileCard profile={result} token={null} />
                    </div>
                  </Grid>
                )
              );
            })
          ) : (
            <>
              <Grid item xs={4}></Grid>
              <Grid item xs={4}>
                <Card>
                  <h3>{t("community_noResults")}</h3>
                </Card>
              </Grid>
              <Grid item xs={4}></Grid>
            </>
          )}
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
            {`${t("community_previousResults")}`}
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
            {`${t("community_nextResults")}`}
          </Button>
        </div>
      </Grid>
    </Grid>
  );
};
