function parseTubs(str, timeSig) {
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
          const textColor = isEmpty ? "rgb(157, 131, 93)" : "#222";
          const isDown = charIndex % sepIndex === 0;
          const cmds = [];
          if (isDown) {
            if (!isStart) {
              cmds.push(
                `<rect width="0.5" height="${cellDim - 1}" x="${
                  xPos - 6
                }" y="0" fill="rgb(110, 88, 69)" />`
              );
              xPos += 4;
            }
            isStart = false;
          }
          cmds.push(
            `<text fill="${textColor}" text-anchor="middle" x="${xPos}" y="${textY}">${char}</text>`
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
          <text fill="#222" x="${
            charWidth / 2 + xPos
          }" y="${textY}">${rowTitle}</text>
          <rect width="0.5" height="${cellDim}" x="${width}" y="0" fill="rgb(210, 49, 52)" />
          <rect width="${width}" height="0.5" x="0" y="${
        cellDim - 1
      }" fill="rgb(210, 49, 52)" />
        </g>
      `;
    })
    .join("");
  width += maxText * charWidth + charWidth;
  const baseHeight = 20;
  const patternWidth = 120;
  const patternHeight = 20;
  return `
    <div><svg version="1.1"
    width="${width}" viewBox="0 0 ${width} ${height + baseHeight}"
    class="tubs"
    xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="pattern" x="0" y="0" width="${patternWidth}" height="${patternHeight}" patternUnits="userSpaceOnUse">
          <image xlink:href="/img/pattern.svg" x="0" y="0" width="${patternWidth}" height="${patternHeight}"></image>
          <animateTransform attributeType="xml"
            attributeName="patternTransform"
            type="translate" from="0" to="${-patternWidth}" begin="0"
            dur="2s" repeatCount="indefinite"/>
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" x="0" y="0" fill="#fff" />
      <rect width="${width}" height="0.5" x="0" y="${
    height - 1
  }" fill="rgb(210, 49, 52)" />
      ${lines}
      <rect fill="url(#pattern)" width="${width}" height="${baseHeight}" x="0" y="${height}" />
      <rect fill="rgb(210, 49, 52)" width="${width}" height="0.5" x="0" y="${
    height + baseHeight - 0.5
  }" />
      <rect fill="rgb(210, 49, 52)" width="0.5" height="${
        height + baseHeight
      }" x="0" y="0" />
      <rect fill="rgb(210, 49, 52)" width="0.5" height="${height + baseHeight}" x="${
    width - 1
  }" y="0" />
      <rect fill="rgb(210, 49, 52)" width="${width}" height="0.5" x="0" y="0" />
    </svg></div>`;
}
hexo.extend.tag.register(
  "tubs",
  function (args, content) {
    return parseTubs(content, args);
  },
  { ends: true }
);
