import { __ } from "@wordpress/i18n";

import Info from "./info.json";
import Edit from "./edit";
import Save from "./save";
import "./editor.scss";

const {
  title,
  description,
  name,
  category,
  keywords,
  attributes,
  icon
} = Info;

const config = {
  title: __( title, "blokit" ),
  description: __( description, "blokit" ),
  category,
  icon,
  keywords,
  attributes,
  edit: Edit,
  save: Save
};

export { name, config };
