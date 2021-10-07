// https://observablehq.com/@haakenlid/svg-circle

function polarToCartesian(x, y, r, degrees) {
  const radians = (degrees * Math.PI) / 180.0;
  return [x + r * Math.cos(radians), y + r * Math.sin(radians)];
}
function segmentPath(x, y, r0, r1, d0, d1) {
  // https://svgwg.org/specs/paths/#PathDataEllipticalArcCommands
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

function segment(n, segments, level, isHit, maxWidth) {
  const width = 20;
  const offset = width * level + 10 * level;
  const radius = (maxWidth / 2) - offset;
  const margin = 0;
  const center = radius + offset;
  const degrees = 360 / segments;
  const middleOffset = degrees / 2;
  let start = degrees * n - middleOffset;
  let end = degrees * (n + 1 - margin) + (margin == 0 ? 1 : 0) - middleOffset;
  start = (start - 90) % 360
  end = (end - 90) % 360
  const path = segmentPath(center, center, radius, radius - width, start, end);
  const evenClass = (n + level) % 2 == 0 ? "odd" : "even";
  const hitClass = isHit ? "hit" : "";
  return `<path class="tubs-segment ${evenClass} ${hitClass}" d="${path}" fill="none" stroke="#fff" />`;
}

function parseTubs_(tubs, timeSig) {
  const maxWidth = 500;
  const hpad = 240;

  const svg = tubs
    .split("\n")
    .filter((str) => str.length > 0)
    .map((str, level) => {
      const items = str.split("=");
      const nameItems = items[1].split("@")
      const tubsName = nameItems[0];
      const tubsShuffle = nameItems[1];
      let shuffle = 0.5;
      if(tubsShuffle) {
        shuffle = parseFloat(tubsShuffle)
      }
      console.log(shuffle)

      const tubsLine = items[0]
        .split("")
        .filter((char) => char === "o" || char === "-")
        .map((char, index, items) => {
          const isHit = char === "o";
          return segment(index, items.length, level, isHit, maxWidth);
        });

      const xPox = maxWidth
      const yPos = level * 30
      return tubsLine.join("\n") + `
      <line stroke-width="1" class="tubs-line" x1="${maxWidth / 2}" y1="${yPos + 10}" x2="${xPox + 5}" y2="${yPos + 10}" />
      <text class="tubs-text" text-anchor="left" x="${xPox + 10}" y="${yPos + 15}">${tubsName}</text>
      `;
    })
    .join("\n");

  return {
    str: svg,
    width: maxWidth + 2 + hpad,
    height: maxWidth + 12,
  };
}

function parseTubs(str, timeSig) {
  const items = str.split("^^^").map((content) => {
    return parseTubs_(content, timeSig);
  });
  const width = items[0].width;
  let yPos = 0;
  const content = items
    .map((c, index) => {
      const gElem = `<g transform="translate(0, ${yPos})">${c.str}</g>`;
      yPos += items[index].height;
      return gElem;
    })
    .join("\n");
  return `
  <svg version="1.1"
    width="${width}" viewBox="0 0 ${width} ${yPos}"
    class="tubs"
    xmlns="http://www.w3.org/2000/svg">
    ${content}
  </svg>`;
}

hexo.extend.tag.register(
  "tubs",
  function (args, content) {
    return parseTubs(content, args);
  },
  { ends: true }
);
