import { FunctionComponent } from "react";

export const BaseFooter: FunctionComponent = () => {
  return (
    <footer className={"blokit__footer"}>
      <p>
        &copy;2021 <a href={"https://yuiti.dev"}>YUITI</a>
      </p>
    </footer>
  );
};
