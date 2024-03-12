import { Button, CircularProgress, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserProfileCard } from "../components/UserProfileCard";
import { ArrowBack } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export const UserProfile = ({ profile, token }) => {
  const { t } = useTranslation();
  const navigation = useNavigate();

  if (!profile || !token) {
    return (
      <>
        <h2>{`${t("profile_fetchingData")}`}</h2>
        <CircularProgress color="success" />
      </>
    );
  }

  return (
    <Grid container spacing={3} marginBlock={false}>
      <Grid item xs={12}>
        <Button
          onClick={() => {
            navigation("/home", { replace: true });
          }}
          variant={"contained"}
          startIcon={<ArrowBack />}
        >
          {`${t("go_back")}`}
        </Button>
      </Grid>
      <Grid item xs={3}></Grid>
      <Grid item xs={6}>
        <UserProfileCard profile={profile} token={token} />
      </Grid>
      <Grid item xs={3}></Grid>
    </Grid>
  );
};
