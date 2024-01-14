import Axios from "axios";
import { Link } from "react-router-dom";

export const TestComponent = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.get("//localhost:3500/search").then((res) => {
      // console.log(res);
    });
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();
    Axios.get(
      "https://api.edamam.com/api/food-database/v2/parser?app_id=0c65f087&app_key=18eeb75562b0c31f4d1da3640e19f270&ingr=Banana&nutrition-type=cooking&category=generic-foods"
    ).then((res) => {
      console.log(res);
    });
  };

  return (
    <>
      <form>
        <button onClick={handleSubmit2}>Get ingredients</button>
      </form>
      <Link to="../login">Login Here</Link>
    </>
  );
};
