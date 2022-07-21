import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Thread from "../components/Thread";

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

describe("Thread component testing", () => {
  it("Thread component renders", () => {
    act(() => {
      render(<Thread uri={"/know/"} id={1} />, container);
    });
  });
});
