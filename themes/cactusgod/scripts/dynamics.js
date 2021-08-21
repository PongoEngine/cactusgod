const goldenconj = 0.618033;
const fs = require("fs");
const path = require("path");
const parser = require("xml2json");

function getDim(value) {
  const data = fs.readFileSync(path.join("source", value)).toString();
  const json = JSON.parse(parser.toJson(data));
  return {
    width: parseFloat(json.svg.width),
    height: parseFloat(json.svg.height),
  };
}

function getData(str) {
  const obj = {
    values: "",
    image1: { value: "", width: 0, height: 0 },
    image2: { value: "", width: 0, height: 0 },
    labels: [],
    length: 0,
  };
  str.split("\n").forEach((item) => {
    const keyVal = item.split(":");
    const key = keyVal[0].toLowerCase().trim();
    const value = keyVal[1].trim();
    switch (key) {
      case "values":
        obj.values = value;
        obj.length = value
          .split("")
          .filter((char) => char === "-" || parseInt(char))
          .join("").length;
        break;
      case "labels":
        obj.labels = value
          .split("|")
          .map((v) => v.trim())
          .filter((v) => v.length);
        break;
      case "image1":
        obj.image1.value = value;
        const image1Dims = getDim(value);
        obj.image1.width = image1Dims.width;
        obj.image1.height = image1Dims.height;
        break;
      case "image2":
        obj.image2.value = value;
        const image2Dims = getDim(value);
        obj.image2.width = image2Dims.width;
        obj.image2.height = image2Dims.height;
        break;
    }
  });
  return obj;
}

function parseDynamics(str) {
  const data = getData(str);
  const patternWidth = 120;
  const patternHeight = 20;
  const width = data.length * 100;
  const height = width * goldenconj * goldenconj * goldenconj;
  const xVal = width / (data.length - 1);
  let x = 0;
  let num = null;
  let pushPoint = false;
  let isSharp = false;
  let lastY = null;
  const pushedPoints = [];
  const points = data.values
    .split("")
    .map((char) => {
      switch (char) {
        case "-":
          break;
        case "/":
        case "\\":
          isSharp = true;
          num = null;
          break;
        case "|":
          pushPoint = true;
          num = null;
          break;
        default:
          num = parseInt(char);
          break;
      }
      if (num) {
        const val = num / 10;
        const y = height - height * val;
        const cmds = [];
        if (isSharp) {
          cmds.push(`${x},${lastY} `);
          isSharp = false;
        }
        cmds.push(`${x},${y} `);
        lastY = y;
        if (pushPoint) {
          pushedPoints.push({ x, y });
          pushPoint = false;
        }
        x += xVal;
        return cmds.join("");
      }
      return "";
    })
    .join("");
  const polys = pushedPoints
    .map((p, i) => {
      const label = data.labels[i];
      return createPoly(p.x, p.y, 40, label);
    })
    .join("\n");
  const img1scale = height / data.image2.height;
  const img1Width = data.image2.width * img1scale * goldenconj * goldenconj;
  const img1Height = height * goldenconj * goldenconj;
  const img1X = width * goldenconj * goldenconj * goldenconj * goldenconj * goldenconj * goldenconj;
  const img1Y = height * goldenconj * goldenconj * goldenconj * goldenconj * goldenconj;
  
  const img2scale = height / data.image1.height;
  const img2Width = data.image1.width * img2scale * goldenconj * goldenconj;
  const img2Height = height * goldenconj * goldenconj;
  const img2X = width * goldenconj;
  const img2Y = height - img2Height;
  return `
    <svg version="1.1"
    width="${width}" viewBox="0 0 ${width} ${height}"
    class="dynamics"
    xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="pattern-2" x="0" y="0" width="${patternWidth}" height="${patternHeight}" patternUnits="userSpaceOnUse">
          <image xlink:href="/img/pattern.svg" x="0" y="0" width="${patternWidth}" height="${patternHeight}"></image>
          <animateTransform attributeType="xml"
            attributeName="patternTransform"
            type="translate" from="0" to="${-patternWidth}" begin="0"
            dur="${20 / data.length}s" repeatCount="indefinite"/>
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" x="0" y="0" fill="url(#pattern-2)" />
      <image xlink:href="${
        data.image1.value
      }" x="${img1X}" y="${img1Y}" width="${img1Width}" height="${img1Height}"></image>
      <image xlink:href="${
        data.image2.value
      }" x="${img2X}" y="${img2Y}" width="${img2Width}" height="${img2Height}"></image>
      <polyline points="${points}" fill="none" stroke="#f25c05" stroke-width="5" />
      ${polys}
    </svg>`;
}

function createPoly(x, y, length, label) {
  const p1x = 0 + x;
  const p1y = -length * (Math.sqrt(3) / 4) + y;
  const p2x = length / 2 + x;
  const p2y = length * (Math.sqrt(3) / 4) + y;
  const p3x = -(length / 2) + x;
  const p3y = length * (Math.sqrt(3) / 4) + y;
  const cmds = [
    `<polygon
      points="${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}"
      fill="none"
      stroke="#f2b705"
      stroke-width="4"
    />`,
  ];
  if (label) {
    cmds.push(`
      <a href="#${label}">
        <text fill="#f2b705" text-anchor="left" x="${x + 10}" y="${
      y - 10
    }">${label}</text>
      </a>
    `);
  }
  return cmds.join("\n");
}

hexo.extend.tag.register(
  "dynamics",
  function (_, content) {
    return parseDynamics(content);
  },
  { ends: true }
);
