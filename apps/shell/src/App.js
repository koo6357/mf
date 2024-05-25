import { Link, Route, Routes } from "react-router-dom";
import Apple from "fruit_apple/App";
import Banana from "fruit_banana/App";

const App = () => {
  return (
    <div>
      <Link to={"/"}>apple</Link>
      <br />
      <Link to={"/banana"}>banana</Link>

      <Routes>
        <Route path={"/"} element={<Apple />} />
        <Route path={"/banana"} element={<Banana />} />
      </Routes>
    </div>
  );
};

export default App;
