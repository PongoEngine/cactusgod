// const colors = ["#f25c05", "#f20505", "#f28705", "#f2b705"];
const goldenconj = 0.618033;

function parseDynamics(str) {
  const length = str
    .split("")
    .filter((char) => char === "-" || parseInt(char))
    .join("").length;
  const patternWidth = 120;
  const patternHeight = 20;
  const width = length * 100;
  const height = width * goldenconj * goldenconj * goldenconj;
  const xVal = width / (length - 1);
  let x = 0;
  let num = null;
  let pushPoint = false;
  let isSharp = false;
  let lastY = null;
  const pushedPoints = [];
  const points = str
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
    .map((p) => {
      return createPoly(p.x, p.y, 40);
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
            dur="${20 / length}s" repeatCount="indefinite"/>
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" x="0" y="0" fill="url(#pattern-2)" />
      <polyline points="${points}" fill="none" stroke="#f25c05" stroke-width="5" />
      ${polys}
    </svg>`;
}

function createPoly(x, y, length) {
  const p1x = 0 + x;
  const p1y = -length * (Math.sqrt(3) / 4) + y;
  const p2x = length / 2 + x;
  const p2y = length * (Math.sqrt(3) / 4) + y;
  const p3x = -(length / 2) + x;
  const p3y = length * (Math.sqrt(3) / 4) + y;

  return `<polygon points="${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}" fill="none" stroke="#308ad9" stroke-width="4" />`;
}

hexo.extend.tag.register(
  "dynamics",
  function (_, content) {
    return parseDynamics(content);
  },
  { ends: true }
);
