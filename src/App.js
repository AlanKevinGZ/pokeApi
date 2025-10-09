import { ThemeProvider } from "styled-components";
import Theme from "./theme/Theme";
import GlobalStyle from "./theme/GlobalStyle";
import { Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import Home from "./pages/Home/Home";
import MoreInfo from "./pages/MoreInfo/MoreInfo";

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <GlobalStyle />

      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/more/:id" element={<MoreInfo />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
