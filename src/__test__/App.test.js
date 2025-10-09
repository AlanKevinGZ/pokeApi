import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";


jest.mock("../pages/Auth/Auth", () => {
  return function Auth() {
    return <div data-testid="auth-page">Auth Page</div>;
  };
});

jest.mock("../pages/Home/Home", () => {
  return function Home() {
    return <div data-testid="home-page">Home Page</div>;
  };
});

jest.mock("../pages/MoreInfo/MoreInfo", () => {
  return function MoreInfo() {
    return <div data-testid="more-info-page">More Info Page</div>;
  };
});


jest.mock("styled-components", () => ({
  ThemeProvider: ({ children }) => children,
}));


jest.mock("../theme/GlobalStyle", () => {
  return function GlobalStyle() {
    return null;
  };
});


jest.mock("../theme/Theme", () => ({}));


const renderWithRouter = (initialRoute = "/") => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );
};

describe("App Component", () => {
  describe("Routing", () => {
    test("renders Auth page on root route", () => {
      renderWithRouter("/");
      expect(screen.getByTestId("auth-page")).toBeInTheDocument();
      expect(screen.getByText("Auth Page")).toBeInTheDocument();
    });

    test("renders Home page on /home route", () => {
      renderWithRouter("/home");
      expect(screen.getByTestId("home-page")).toBeInTheDocument();
      expect(screen.getByText("Home Page")).toBeInTheDocument();
    });

    test("renders MoreInfo page on /more/:id route", () => {
      renderWithRouter("/more/123");
      expect(screen.getByTestId("more-info-page")).toBeInTheDocument();
      expect(screen.getByText("More Info Page")).toBeInTheDocument();
    });

    test("renders correctly with different IDs in MoreInfo", () => {
      renderWithRouter("/more/abc-def-456");
      expect(screen.getByTestId("more-info-page")).toBeInTheDocument();
    });
  });

  describe("Theme Provider", () => {
    test("wraps application with ThemeProvider", () => {
      const { container } = renderWithRouter("/");
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe("Navigation", () => {
    test("does not render multiple pages at the same time", () => {
      renderWithRouter("/home");
      expect(screen.getByTestId("home-page")).toBeInTheDocument();
      expect(screen.queryByTestId("auth-page")).not.toBeInTheDocument();
      expect(screen.queryByTestId("more-info-page")).not.toBeInTheDocument();
    });
  });

  describe("Non-existent routes", () => {
    test("does not render any page for undefined routes", () => {
      renderWithRouter("/non-existent-route");
      expect(screen.queryByTestId("auth-page")).not.toBeInTheDocument();
      expect(screen.queryByTestId("home-page")).not.toBeInTheDocument();
      expect(screen.queryByTestId("more-info-page")).not.toBeInTheDocument();
    });
  });
});