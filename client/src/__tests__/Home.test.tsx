import React from "react";
import ReactDOM, { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Home from "../components/Home";

let container: any = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe("Home component testing", () => {
  it("Renders with welcome text", () => {
    act(() => {
      render(<Home />, container);
    });
    const span = container.querySelector("#imgtxt");
    expect(span.textContent).toBe('"Take it easy!"');
  });
});
