function parseTubs_(str, timeSig) {
  const charWidth = 11;
  const cellDim = 20;
  const textOffset = 5;
  const textY = cellDim - textOffset;
  let width = 0;
  let maxText = 0;
  let height = 0;
  const sepIndex = parseInt(timeSig);
  const lines = str
    .split("\n")
    .map((str) => str.trim())
    .filter((str) => str.length > 0)
    .map((str, rowIndex) => {
      height += cellDim;
      let rowTitle = "";
      let hasEquals = false;
      let xPos = 14;
      let isStart = true;
      const row = str
        .split("")
        .filter((char) => {
          return char !== "|";
        })
        .map((char, charIndex) => {
          if (char === "=") {
            hasEquals = true;
            return "";
          }
          if (hasEquals) {
            rowTitle += char.trim();
            return "";
          }
          if (char.toLowerCase() === ".") {
            char = "•";
          } else if (char.toLowerCase() === "o") {
            char = "⚬";
          } else if (char.toLowerCase() === "x") {
            char = "✖";
          }
          const isEmpty = char === "-" ? true : false;
          const textClass = isEmpty ? "empty" : "filled";
          const isDown = charIndex % sepIndex === 0;
          const cmds = [];
          if (isDown) {
            if (!isStart) {
              cmds.push(
                `<rect class="tubs-line" width="0.5" height="${cellDim - 1
                }" x="${xPos - 6}" y="0" />`
              );
              xPos += 4;
            }
            isStart = false;
          }
          cmds.push(
            `<text class="tubs-note ${textClass}" text-anchor="middle" x="${xPos}" y="${textY}">${char}</text>`
          );
          xPos += cellDim - textOffset;
          if (width < xPos) {
            width = xPos;
          }
          return cmds.join("\n");
        })
        .join("");
      if (maxText < rowTitle.length) {
        maxText = rowTitle.length;
      }
      return `
        <g transform="translate(0,${rowIndex * cellDim})">
          ${row}
          <text class="tubs-inst-name" x="${charWidth / 2 + xPos
        }" y="${textY}">${rowTitle}</text>
          <rect class="tubs-line" width="0.5" height="${cellDim}" x="${width}" y="0" />
          <rect class="tubs-line" width="${width}" height="0.5" x="0" y="${cellDim - 1
        }" />
        </g>
      `;
    })
    .join("");
  width += maxText * charWidth + charWidth;
  const baseHeight = 20;
  const patternWidth = 120;
  const patternHeight = 20;
  const svgContent = `
    <defs>
      <pattern id="pattern" x="0" y="0" width="${patternWidth}" height="${patternHeight}" patternUnits="userSpaceOnUse">
      <path class="tubs-pattern-path" d='M-50.129 12.685C-33.346 12.358-16.786 4.918 0 5c16.787.082 43.213 10 60 10s43.213-9.918 60-10c16.786-.082 33.346 7.358 50.129 7.685' stroke-width='0.5' stroke='rgb(0, 0, 0)' fill='none' />
      </pattern>
    </defs>
    <rect class="tubs-backing" width="${width}" height="${height
    }" x="0" y="0" />
    <rect class="tubs-line" width="${width}" height="0.5" x="0" y="${height - 1
    }" />
    ${lines}
    <rect fill="url(#pattern)" width="${width}" height="${baseHeight}" x="0" y="${height}" />
    <rect class="tubs-line" width="${width}" height="0.5" x="0" y="${height + baseHeight - 0.5
    }" />
    <rect class="tubs-line" width="0.5" height="${height + baseHeight
    }" x="0" y="0" />
    <rect class="tubs-line" width="0.5" height="${height + baseHeight}" x="${width - 1
    }" y="0" />`;

  return {
    str: svgContent,
    width: width,
    height: height + baseHeight,
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
    <rect class="tubs-line" width="${width}" height="0.5" x="0" y="0" />
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
