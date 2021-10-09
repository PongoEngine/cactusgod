// https://observablehq.com/@haakenlid/svg-circle

function polarToCartesian(x, y, r, degrees) {
  const radians = (degrees * Math.PI) / 180.0;
  return [x + r * Math.cos(radians), y + r * Math.sin(radians)];
}
function segmentPath(x, y, r0, r1, d0, d1) {
  const arc = Math.abs(d0 - d1) > 180 ? 1 : 0;
  const point = (radius, degree) =>
    polarToCartesian(x, y, radius, degree)
      .map((n) => n.toPrecision(5))
      .join(",");
  return [
    `M${point(r0, d0)}`,
    `A${r0},${r0},0,${arc},1,${point(r0, d1)}`,
    `L${point(r1, d1)}`,
    `A${r1},${r1},0,${arc},0,${point(r1, d0)}`,
    "Z",
  ].join("");
}

function downClass(n, timeSig) {
  return (n % (timeSig * 2) === 0)
    ? "down"
    : (n % (timeSig * 1) === 0)
      ? "back"
      : (n % Math.floor(timeSig / 2) === 0)
        ? "split"
        : ""
}

function segment(n, segments, level, isHit, timeSig, maxWidth, shuffle) {
  const width = 20;
  const offset = width * level + 5 * level;
  const radius = (maxWidth / 2) - offset;
  const margin = 0.05;
  const center = radius + offset;
  const degrees = 360 / segments;
  const middleOffset = degrees / 2;
  let start = degrees * n - middleOffset;
  let end = degrees * (n + 1 - margin) + (margin == 0 ? 1 : 0) - middleOffset;
  start = (start - 90) % 360
  end = (end - 90) % 360
  const isDown = n % 2 === 0
  if (isDown) {
    const dist = end - start;
    end = start + (dist * shuffle * 2)
  }
  else {
    const dist = end - start;
    const shuffled = dist * shuffle * 2;
    start += shuffled - dist
  }
  const path = segmentPath(center + 2, center + 2, radius, radius - width, start, end);
  const hitClass = isHit ? "hit" : "";
  return `<path class="tubs-segment ${downClass(n, timeSig)} ${hitClass}" d="${path}" fill="none" stroke="#fff" />`;
}

function getTubsLine(str) {
  const reg = /([^=]*)=([^@]*)@?([^|]*)?\|?([^,]*)?,?(\S*)/gm
  const match = reg.exec(str)
  const hits = match[1]
  const name = match[2]
  const shuffle = parseFloat(match[3] || "0.5")
  const x = parseFloat(match[4] || "0.5")
  const y = parseFloat(match[5] || "0.5")

  return {
    hits,
    name,
    shuffle,
    x,
    y
  }
}

function parseTubs_(tubs, timeSig) {
  const maxWidth = 550;
  const hpad = 100;

  let svg = tubs
    .split("\n")
    .filter((str) => str.length > 0)
    .map((str, level) => {
      const tubs = getTubsLine(str)

      const tubsLine = tubs.hits
        .split("")
        .filter((char) => char === "o" || char === "-")
        .map((char, index, items) => {
          const isHit = char === "o";
          return segment(index, items.length, level, isHit, timeSig, maxWidth, tubs.shuffle);
        });

      const xPox = maxWidth
      const yPos = level * 25
      return tubsLine.join("\n") + `
      <line stroke-width="1" class="tubs-line" x1="${maxWidth / 2}" y1="${yPos + 10}" x2="${xPox + 5}" y2="${yPos + 10}" />
      <text class="tubs-text" text-anchor="left" x="${xPox + 10}" y="${yPos + 15}">${tubs.name}</text>
      `;
    })
    .join("\n");

  return {
    str: svg,
    width: maxWidth + hpad,
    height: maxWidth + 12,
  };
}

function parseTubs(str, attrs) {
  const timeSig = parseInt(attrs[0]) || 4
  const items = str.split("^^^")
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map((s, index, items) => {
      const tubs = parseTubs_(s, timeSig);
      const width = tubs.width;
      const height = tubs.height;
      const display = index === 0 ? "block" : "none"
      const style = `display: ${display}`
      return `
        <svg version="1.1"
          width="${width}" viewBox="0 0 ${width} ${height}"
          class="tubs"
          style="${style}"
          xmlns="http://www.w3.org/2000/svg">
          ${tubs.str}
          <rect class="tubs-backing-cur" x="1" y="1" width="60" height="25" fill="none" />
          <text class="tubs-text-cur" text-anchor="middle" x="30" y="18">${index + 1}/${items.length}</text>
        </svg>`;
    })
  return `
    <div class="tubs-container">
      ${items.join("\n")}
    </div>`
}

hexo.extend.tag.register(
  "tubs",
  function (args, content) {
    return parseTubs(content, args);
  },
  { ends: true }
);
