import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Catalog from "../components/Catalog";

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

describe("Catalog component testing", () => {
  it("Catalog component renders", () => {
    act(() => {
      render(<Catalog uri={"/know/"} />, container);
    });
  });
});
