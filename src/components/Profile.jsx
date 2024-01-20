import { ClientProfile } from "../views/ClientProfile";
import { UserProfile } from "../views/UserProfile";
import { CircularProgress } from "@mui/material";

export const Profile = ({ checkLoggedInState, isClient, token, profile }) => {
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

  if (token && !isClient && profile) {
    return <UserProfile profile={profile} token={token} />;
    // return <UserClientList email={email} token={token} />;
  }
  if (token && isClient && profile) {
    return <ClientProfile email={profile.email} token={token} />;
  }
};
