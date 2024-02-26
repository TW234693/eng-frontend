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

export const ClientProfile = ({ profile, token }) => {
  const navigation = useNavigate();

  const [dietitianProfile, setDietitianProfile] = useState(null);
  const [currentRating, setCurrentRating] = useState(null);
  const [originalRating, setOriginalRating] = useState(null);

  const [dialogOpened, setDialogOpened] = useState(false);

  const dietitianText =
    profile.user && dietitianProfile === null
      ? "Fetching dietitian data"
      : "You do not have a dietitian assigned to you. You may find a dietitian through the community tab.";

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
        <h2>Fatching profile data...</h2>
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
          Go back
        </Button>
      </Grid>
      <Grid item xs={6}>
        <h2 style={{ margin: 0 }}>You</h2>
        <ClientProfileCard profile={profile} token={token} fullHeight={false} />
      </Grid>
      <Grid item xs={6} marginBlock={false}>
        <h2 style={{ margin: 0 }}>Your current dietitian</h2>
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
                    Your rating:{" "}
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
                    Save
                  </Button>

                  <Button
                    startIcon={<Cancel />}
                    color="error"
                    onClick={onResetRating}
                  >
                    Reset
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
              Unassign Yourself
            </Button>
            <Dialog
              open={dialogOpened}
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClose={() => setDialogOpened(false)}
            >
              <DialogContent>
                <Alert severity="warning">
                  Are you sure you want to unassign yourself? This operation
                  cannot be undone.
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
                    Yes, I understand
                  </Button>
                  <Button
                    onClick={() => setDialogOpened(false)}
                    color="error"
                    variant="contained"
                  >
                    Cancel
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
