import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Auth from "../Auth";
import "@testing-library/jest-dom";


const mockTheme = {
  colors: {
    primary: "#2c3e50",
    buttons: "#3498db",
    textInfo: "#333333",
  },
};


const HomePage = () => <h1>Home Page</h1>;


const renderWithProviders = (initialRoute = "/") => {
  return render(
    <ThemeProvider theme={mockTheme}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );
};


describe("Auth Component", () => {
  beforeEach(() => {
    global.alert = jest.fn(); 
  });

  test("renders login form correctly", () => {
    renderWithProviders();

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("admin@admin.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("123")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ingresar/i })).toBeInTheDocument();
  });

  test("updates email input value", () => {
    renderWithProviders();
    const emailInput = screen.getByPlaceholderText("admin@admin.com");

    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    expect(emailInput).toHaveValue("test@test.com");
  });

  test("updates password input value", () => {
    renderWithProviders();
    const passwordInput = screen.getByPlaceholderText("123");

    fireEvent.change(passwordInput, { target: { value: "mypassword" } });
    expect(passwordInput).toHaveValue("mypassword");
  });

  test("navigates to /home with valid credentials", () => {
    renderWithProviders();

    fireEvent.change(screen.getByPlaceholderText("admin@admin.com"), {
      target: { value: "admin@admin.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("123"), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  test("shows alert with invalid credentials", () => {
    renderWithProviders();

    fireEvent.change(screen.getByPlaceholderText("admin@admin.com"), {
      target: { value: "wrong@email.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("123"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(global.alert).toHaveBeenCalledWith("usuario invalido");
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("email input has correct type", () => {
    renderWithProviders();
    expect(screen.getByPlaceholderText("admin@admin.com")).toHaveAttribute("type", "email");
  });

  test("password input has correct type", () => {
    renderWithProviders();
    expect(screen.getByPlaceholderText("123")).toHaveAttribute("type", "password");
  });

  test("inputs are required", () => {
    renderWithProviders();
    expect(screen.getByPlaceholderText("admin@admin.com")).toBeRequired();
    expect(screen.getByPlaceholderText("123")).toBeRequired();
  });

  test("matches snapshot", () => {
    const { container } = renderWithProviders();
    expect(container).toMatchSnapshot();
  });
});
