import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import BoardIndex from "../components/BoardIndex";

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

describe("BoardIndex component testing", () => {
  it("BoardIndex component renders", () => {
    act(() => {
      render(<BoardIndex uri={"/know/"} />, container);
    });
  });
});
