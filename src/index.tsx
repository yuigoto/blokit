import { registerBlockType } from "@wordpress/blocks";
import * as Demo from "blocks/example/demo";

// Global block CSS
import "./editor.scss";
import "./style.scss";

const blocksToRegister = [
  Demo,
];

const registerBlock = (block) => {
  const { name, config } = block;
  registerBlockType(name, config);
};

blocksToRegister.forEach(item => {
  registerBlock(item);
});
