/**
 * This file needs some improvements, but it works as expected.
 */
const path = require("path");
const fs = require("fs");
const work_dir = process.cwd();

const params = process.argv.slice(2).reduce((acc, item) => {
  const [ name, value ] = /--([^=]+)=(.*)$/.exec(item).slice(1,3);
  acc[name] = (name === "path")
    ? value.trim().replace(/^\/|\/$/g, "")
    : value.trim();
  return acc;
}, {});

const getTemplate = (template) => {
  return path.resolve(work_dir, "scripts", "template", template);
};

const toSafeUrlName = (value, trim = false) => {
  let _value = value;

  if (typeof _value !== "string" && _value.toString) {
    _value = _value.toString();
  } else if (!_value.toString) {
    return "";
  }

  if (true === trim) _value = _value.trim();

  return _value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s\s/g, "-")
    .replace(/\s/g, "-");
};

if (
  !params.hasOwnProperty("prefix")
  || !params.hasOwnProperty("name")
  || !params.hasOwnProperty("path")
) {
  throw new Error(
    `[BloKit:generate]: 'prefix', 'name' and 'path' arguments are required.`
  );
}

params.slug = toSafeUrlName(params.name);

if (!params.hasOwnProperty("namespace")) {
  params.namespace = "blokit";
}

const info = require("./template/info.json");

info.title = params.name;
info.name = `${params.prefix}/${params.slug}`;

let templatePath = path.resolve(work_dir, "src", "blocks", params.path);
let mainTemplate = fs.readFileSync(getTemplate("index.tsx.template"));
let editTemplate = fs.readFileSync(getTemplate("edit.tsx.template"));
let saveTemplate = fs.readFileSync(getTemplate("save.tsx.template"));
let frontCssTemplate = fs.readFileSync(getTemplate("style.scss.template"));
let adminCssTemplate = fs.readFileSync(getTemplate("editor.scss.template"));

fs.mkdirSync(templatePath, { recursive: true });

if (!fs.existsSync(`${templatePath}/index.tsx`)) {
  fs.writeFileSync(
    `${templatePath}/index.tsx`,
    mainTemplate.toString().replace(/#{NAMESPACE}/g, params.namespace)
  );

  fs.writeFileSync(`${templatePath}/edit.tsx`, editTemplate);
  fs.writeFileSync(`${templatePath}/save.tsx`, saveTemplate);
  fs.writeFileSync(`${templatePath}/style.scss`, frontCssTemplate);
  fs.writeFileSync(`${templatePath}/editor.scss`, adminCssTemplate);

  fs.writeFileSync(
    `${templatePath}/info.json`,
    JSON.stringify(info, null, 2)
  );

  console.log(
    `[BloKit:generate]: successfully created '${info.name}' at '${templatePath}'.`
  );

  console.log(
    `[BloKit:generate]: you may import the file at '${templatePath}/index.tsx' into 'src/index.tsx' to transpile the block.`
  );
} else {
  throw new Error(
    `[BloKit:generate]: block already exists in path.`
  );
}
