import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { NavigationManager } from "./components/NavigationManager";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavigationManager />
      </BrowserRouter>
    </div>
  );
}

export default App;
