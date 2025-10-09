import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";


jest.mock("react-dom/client", () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
  })),
}));


jest.mock("../App", () => {
  return function App() {
    return <div>App Component</div>;
  };
});


jest.mock("../store", () => ({
  store: {
    getState: jest.fn(),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
}));

describe("index.js", () => {
  let mockCreateRoot;
  let mockRender;

  beforeEach(() => {
    
    jest.clearAllMocks();

   
    mockCreateRoot = ReactDOM.createRoot;
    mockRender = jest.fn();
    mockCreateRoot.mockReturnValue({
      render: mockRender,
    });

    
    document.getElementById = jest.fn(() => ({
      id: "root",
    }));
  });

  test("calls ReactDOM.createRoot with root element", () => {
    
    require("../index");

    expect(document.getElementById).toHaveBeenCalledWith("root");
    expect(mockCreateRoot).toHaveBeenCalledWith(
      expect.objectContaining({ id: "root" })
    );
  });

  
  
});