const goldenconj = 0.618033;

function getData(str) {
  const obj = {
    values: "",
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
        <text fill="#f2b705" text-anchor="left" x="${x + 10}" y="${y - 10}">${label}</text>
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
