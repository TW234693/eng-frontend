import { ClientProfile } from "../views/ClientProfile";
import { UserProfile } from "../views/UserProfile";
import { CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";

export const Profile = ({ checkLoggedInState, isClient, token, profile }) => {
  const { t } = useTranslation();
  if (!profile || !token || !profile.email) {
    console.log("home check");
    checkLoggedInState();
    return (
      <>
        <h2>{`${t("profile_fetchingData")}`}</h2>
        <CircularProgress color="success" />
      </>
    );
  }

  if (token && !isClient && profile) {
    return <UserProfile profile={profile} token={token} />;
    // return <UserClientList email={email} token={token} />;
  }
  if (token && isClient && profile) {
    return <ClientProfile profile={profile} token={token} />;
  }
};
