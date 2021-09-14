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
    image1: { value: "", width: 0, height: 0 },
    image2: { value: "", width: 0, height: 0 },
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
  const height = width * getGC(3);
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
  const img1Width = data.image2.width * img1scale * getGC(2);
  const img1Height = height * getGC(2);
  const img1X = width * getGC(6);
  const img1Y = height * getGC(5);

  const img2scale = height / data.image1.height;
  const img2Width = data.image1.width * img2scale * getGC(3);
  const img2Height = height * getGC(3);
  const img2X = width * getGC(1);
  const img2Y = height - img2Height;
  const msgHeight = height * getGC(4);
  const letterSpacing = msgHeight * getGC(6);
  const fullHeight = height + msgHeight;
  return `
    <svg version="1.1"
    width="${width}" viewBox="0 0 ${width} ${fullHeight}"
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
      <rect width="${width}" height="${height}" x="0" y="0" fill="#22262b" />
      <rect width="${width}" height="${height}" x="0" y="0" fill="url(#pattern-2)" />
      <text font-weight="700" letter-spacing="-${letterSpacing}" font-size="${msgHeight * 1.25}" fill="#202225" alignment-baseline="hanging" text-anchor="middle" x="${width/2}" y="${height / 2}">${data.tagline}</text>
      <image xlink:href="${
        data.image1.value
      }" x="${img1X}" y="${img1Y}" width="${img1Width}" height="${img1Height}"></image>
      <image xlink:href="${
        data.image2.value
      }" x="${img2X}" y="${img2Y}" width="${img2Width}" height="${img2Height}"></image>
      <polyline points="${points}" fill="none" stroke="#f25c05" stroke-width="5" />
      ${polys}
      <rect width="${width}" height="${msgHeight}" x="0" y="${height}" fill="#202225" />
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
