import {
  Diversity2,
  Kitchen,
  ManageAccounts,
  MenuBook,
  PeopleAlt,
  Restaurant,
} from "@mui/icons-material";
import { Button, Grid, CircularProgress } from "@mui/material";

import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";

export const Home = ({ checkLoggedInState, isClient, token, profile }) => {
  const navigation = useNavigate();

  const { t } = useTranslation();

  if (!profile || !token || !profile.email) {
    console.log("home check");
    checkLoggedInState();
    return (
      <>
        <h2>Fetching profile data...</h2>
        <CircularProgress color="success" />
      </>
    );
  }

  const links = isClient
    ? [
        {
          label: t("home_profile"),
          link: "/myProfile",
          icon: <ManageAccounts />,
        },
        {
          label: t("home_community"),
          link: "/community",
          icon: <Diversity2 />,
        },
        { label: t("home_myMeals"), link: "/myMeals", icon: <Restaurant /> },
      ]
    : [
        {
          label: t("home_profile"),
          link: "/myProfile",
          icon: <ManageAccounts />,
        },
        { label: t("home_clients"), link: "/myClients", icon: <PeopleAlt /> },
        {
          label: t("home_ingredients"),
          link: "/myIngredients",
          icon: <Kitchen />,
        },
        {
          label: t("home_community"),
          link: "/community",
          icon: <Diversity2 />,
        },
        {
          label: t("home_templates"),
          link: "/myMealTemplates",
          icon: <MenuBook />,
        },
      ];

  return (
    <Grid container spacing={3} marginBlock={false}>
      <Grid item xs={2}></Grid>
      <Grid item xs={8}>
        <h2>
          {t("home_welcome")}, {profile.name} {profile.surname}.
        </h2>
        <Grid container marginBlock={false}>
          {links.map((link, index) => {
            return (
              <Grid
                item
                xs={6}
                style={{
                  minHeight: "150px",
                  padding: "10px",
                }}
                key={index}
              >
                <Button
                  style={{
                    minWidth: "100%",
                    minHeight: "100%",
                    backgroundColor: "rgba(255,255,255, 1)",
                    border: "2px solid rgb(50,120,255)",
                    borderRadius: "15px",
                  }}
                  onClick={() =>
                    navigation(link.link, {
                      replace: true,
                    })
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ flexGrow: 3, transform: "scale(2)" }}>
                      {link.icon}
                    </div>
                    <div style={{ flexGrow: 1 }}>{link.label}</div>
                  </div>
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
      <Grid item xs={2}></Grid>
    </Grid>
  );
};
