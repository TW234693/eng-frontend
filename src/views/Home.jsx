import { Button, Grid, CircularProgress } from "@mui/material";

import { useNavigate } from "react-router-dom";

export const Home = ({ checkLoggedInState, isClient, token, profile }) => {
  const navigation = useNavigate();

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
    ? [{ label: "My Profile", link: "/myProfile" }]
    : [
        { label: "My Profile", link: "/myProfile" },
        { label: "My Clients", link: "/myClients" },
        { label: "My Ingredients", link: "/myIngredients" },
      ];

  return (
    <Grid container spacing={3} marginBlock={false}>
      <Grid item xs={2}></Grid>
      <Grid item xs={8}>
        <h2>
          Welcome, {profile.name} {profile.surname}.
          <br />
          What would you like to do?
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
                    backgroundColor: "rgba(255,255,255, 0.2)",
                    border: "2px solid rgb(0,0,255)",
                  }}
                  onClick={() =>
                    navigation(link.link, {
                      replace: true,
                    })
                  }
                >
                  {link.label}
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
      <Grid item xs={2}></Grid>
    </Grid>
  );

  //   if (token && !isClient && profile && onLogOut) {
  //     return <UserProfile profile={profile} token={token} onLogOut={onLogOut} />;
  //   }
  //   if (token && isClient && profile && onLogOut) {
  //     return (
  //       <ClientProfile email={profile.email} token={token} onLogOut={onLogOut} />
  //     );
  //   }
};
