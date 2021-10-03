const goldenconj = 0.618033;
function getGC(times) {
  return Math.pow(goldenconj, times);
}
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
    image: { value: "", width: 0, height: 0 },
    tagline: "",
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
      case "image":
        obj.image.value = value;
        const imageDims = getDim(value);
        obj.image.width = imageDims.width;
        obj.image.height = imageDims.height;
        break;
      case "tagline":
        obj.tagline = value.toUpperCase();
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
  const height = width * getGC(2);
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
  const stokeWidth = 10 * getGC(4);
  const msgHeight = height * getGC(4);
  const letterSpacing = msgHeight * getGC(6);
  const rotation = 45;
  return `
    </div>
    <svg version="1.1"
    width="${width}" viewBox="0 0 ${width} ${height}"
    class="dynamics"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <pattern id="pattern-2" x="0" y="0" width="${patternWidth}" height="${patternHeight}" patternUnits="userSpaceOnUse">
          <path stroke-width="${stokeWidth}" class="dyn-pattern-path" d='M-50.129 12.685C-33.346 12.358-16.786 4.918 0 5c16.787.082 43.213 10 60 10s43.213-9.918 60-10c16.786-.082 33.346 7.358 50.129 7.685' stroke-width='0.5' stroke='rgb(0, 0, 0)' fill='none' />
          <animateTransform
            attributeName="patternTransform"
            attributeType="XML"
            type="translate" 
            dur="${20 / data.length}s"
            from="0" 
            to="${-patternWidth}" 
            repeatCount="indefinite" />
        </pattern>
      </defs>
      <rect class="dyn-shine" transform-origin="50% 50%" transform="rotate(${rotation})" width="${width}" height="${
    height / 2
  }" x="0" y="${height}" />
      <rect class="dyn-rect-back" width="${width}" height="${height}" x="0" y="0" fill="url(#pattern-2)" />
      <rect class="dyn-rect-front" width="${width}" height="${height}" x="${msgHeight}" y="${msgHeight}" fill="url(#pattern-2)" />
      <text class="dyn-text no-user-select" font-weight="700" letter-spacing="-${letterSpacing}" font-size="${
    msgHeight * 1.25
  }" alignment-baseline="hanging" text-anchor="middle" x="${
    width / 2
  }" y="${height / 2}">${data.tagline}</text>
      ${polys}
      <polyline class="dyn-dynamics" points="${points}" stroke-width="5" />
    </svg>
    <div class="colored-back">`;
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
      class="dyn-point-tri"
      points="${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}"
      stroke-width="4"
    />`,
  ];
  if (label) {
    cmds.push(`
      <text class="dyn-point-text" text-anchor="left" x="${x + 10}" y="${
      y - 10
    }">${label}</text>
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
