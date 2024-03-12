import {
  Alert,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  Rating,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ClientProfileCard } from "../components/ClientProfileCard";
import { ArrowBack, Cancel, DeleteForever, Save } from "@mui/icons-material";
import Axios from "axios";
import { useEffect, useState } from "react";
import { UserProfileCard } from "../components/UserProfileCard";
import { useTranslation } from "react-i18next";

export const ClientProfile = ({ profile, token }) => {
  const { t } = useTranslation();
  const navigation = useNavigate();

  const [dietitianProfile, setDietitianProfile] = useState(null);
  const [currentRating, setCurrentRating] = useState(null);
  const [originalRating, setOriginalRating] = useState(null);

  const [dialogOpened, setDialogOpened] = useState(false);

  const dietitianText =
    profile.user && dietitianProfile === null
      ? t("clientProfile_fetchingDietitianData")
      : t("clientProfile_noDietitian");

  const onDialogConfirm = () => {
    console.log(`token ${token}`);
    Axios.patch(
      `//localhost:3500/clients/unassign/email=${profile.email}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    Axios.get(
      `//localhost:3500/clients/getCurrentUser/email=${profile.email}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => {
        const dietitianData = res.data;
        setDietitianProfile(dietitianData);
        if (dietitianData.rating) {
          const currentRating = dietitianData.rating.find(
            (rating) => rating.client === profile._id
          );
          if (currentRating) {
            setOriginalRating(currentRating.value);
            setCurrentRating(currentRating.value);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [profile.email, token, profile._id]);

  const onUpdateRating = () => {
    Axios.patch(
      `//localhost:3500/clients/rateUser/email=${profile.email}`,
      {
        rating: currentRating,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onResetRating = () => {
    setCurrentRating(originalRating);
  };

  if (!profile || !token) {
    return (
      <>
        <h2>{t("clientProfile_fetchingData")}.</h2>
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
          {t("go_back")}
        </Button>
      </Grid>
      <Grid item xs={6}>
        <h2 style={{ margin: 0 }}>{t("clientProfile_you")}</h2>
        <ClientProfileCard profile={profile} token={token} fullHeight={false} />
      </Grid>
      <Grid item xs={6} marginBlock={false}>
        <h2 style={{ margin: 0 }}>{t("clientProfile_yourDietitian")}</h2>
        {dietitianProfile ? (
          <>
            <Card style={{ margin: "10px", padding: "10px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <h3 style={{ margin: "0 10px 0 0", display: "inline" }}>
                    {`${t("clientProfile_yourRating")}: `}
                  </h3>
                  <Rating
                    value={currentRating}
                    onChange={(_, newRating) => {
                      setCurrentRating(newRating);
                    }}
                  />
                </div>
                <div>
                  <Button
                    startIcon={<Save />}
                    color="success"
                    onClick={onUpdateRating}
                  >
                    {t("clientProfile_save")}
                  </Button>

                  <Button
                    startIcon={<Cancel />}
                    color="error"
                    onClick={onResetRating}
                  >
                    {t("clientProfile_reset")}
                  </Button>
                </div>
              </div>
            </Card>
            <UserProfileCard profile={dietitianProfile} fullHeight={false} />
            <Button
              variant="contained"
              color="error"
              onClick={() => setDialogOpened(true)}
              startIcon={<DeleteForever />}
              fullWidth
              style={{ width: "inherit" }}
            >
              {t("clientProfile_unassign")}
            </Button>
            <Dialog
              open={dialogOpened}
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClose={() => setDialogOpened(false)}
            >
              <DialogContent>
                <Alert severity="warning">
                  {t("clientProfile_unassignWarning")}
                </Alert>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    onClick={onDialogConfirm}
                    color="success"
                    variant="contained"
                  >
                    {t("clientProfile_iUnderstand")}
                  </Button>
                  <Button
                    onClick={() => setDialogOpened(false)}
                    color="error"
                    variant="contained"
                  >
                    {t("clientProfile_cancel")}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <Card style={{ padding: "10px" }}>
            <p>{dietitianText}</p>
          </Card>
        )}
      </Grid>
    </Grid>
  );
};
