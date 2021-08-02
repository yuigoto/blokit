import React from "react";
import ReactDOM from "react-dom";
import Main from "@docs/Main";
import { MainContextProvider } from "@docs/context";
import "@blocks/index";
import "@docs/styles/docs.scss";

const main: HTMLDivElement = document.createElement("div");
if (main) {
  document.body.appendChild(main);

  ReactDOM.render(
    <MainContextProvider>
      <Main />
    </MainContextProvider>,
    main
  );
}
