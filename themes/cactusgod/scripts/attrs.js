function parseAttrs(str) {
  const sts = {
    scale: undefined,
    structure: undefined,
    tempo: undefined,
  };
  str.split("\n").forEach((item) => {
    const keyVal = item.split(":");
    switch (keyVal[0].toLowerCase()) {
      case "scale":
        sts.scale = keyVal[1].trim();
        break;
      case "tempo":
        sts.tempo = keyVal[1].trim();
        break;
      case "signature":
        sts.signature = keyVal[1].trim();
        break;
    }
  });
  return `
    <p class="arrangement-container">
      Scale / Key - ${sts.scale}
      <br>
      Tempo - ${sts.tempo}
      <br>
      Time Signature - ${sts.signature}
    </p>
  `;
}

hexo.extend.tag.register(
  "attrs",
  function (_, content) {
    return parseAttrs(content);
  },
  { ends: true }
);
