import { FunctionComponent } from "react";
import { useMainContext } from "@docs/context";

export const BaseHeader: FunctionComponent = () => {
  const { data } = useMainContext();

  const downloadData = () => {
    const fileData = `data:text/plain;charset=utf-8,${data}`;

    const link = document.createElement("a");
    link.href = fileData;

    const date = new Date();
    const _dat = date.toLocaleDateString("pt-BR").split(/\/|,/).reverse();

    link.style = "visibility:hidden";
    link.download = `Blokit_Data_${_dat.join("")}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className={"blokit__header"}>
      <span className="title">
        BloKit
        <small>
          Gutenberg Block Construction Kit
        </small>
      </span>
      <span className={"download"}>
        <button onClick={downloadData}>
          Get Serialized Data
        </button>
      </span>
    </header>
  );
};
