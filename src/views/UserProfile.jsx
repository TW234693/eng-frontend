const UserProfile = ({ email, token, onLogIn }) => {
  const navigation = useNavigate();
  const [profileInfo, setProfileInfo] = useState(null);
  useEffect(() => {
    Axios.get(`//localhost:3500/search/email=${email}`)
      .then((res) => {
        setProfileInfo(res.data);
      })
      .catch(() => {
        console.log("Something went wrong while fetching profile info.");
      });
  }, [email]);

  useEffect(() => {
    if (profileInfo) {
      onLogIn(profileInfo);
    }
  }, [onLogIn, profileInfo]);

  if (!profileInfo) {
    return;
  }
};
