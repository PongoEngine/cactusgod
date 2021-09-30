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
    <div class="arrangement">
      <p>
        Scale / Key - ${sts.scale}
        <br>
        Tempo - ${sts.tempo}
        <br>
        Time Signature - ${sts.signature}
      </p>
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="16" transform="scale(1)" viewBox="0 0 120 16">
        <pattern id="wavy" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path class="arrangement-wavy" d="M45.69 13.342c-1.677.945-3.557 1.6-5.48 1.588-1.922-.012-3.795-.691-5.462-1.653-1.668-.962-3.156-2.202-4.637-3.435-1.48-1.232-2.97-2.47-4.641-3.427-1.67-.957-3.547-1.628-5.47-1.628-1.923 0-3.8.67-5.47 1.628-1.67.956-3.161 2.195-4.641 3.427-1.48 1.233-2.97 2.473-4.637 3.435-1.667.962-3.54 1.641-5.463 1.653-1.922.012-3.802-.643-5.478-1.588v13.316c1.676-.945 3.556-1.6 5.478-1.588 1.923.012 3.796.691 5.463 1.653 1.668.962 3.156 2.202 4.637 3.435 1.48 1.232 2.97 2.47 4.641 3.427 1.67.957 3.547 1.628 5.47 1.628 1.923 0 3.8-.67 5.47-1.628 1.67-.956 3.161-2.195 4.641-3.427 1.48-1.233 2.97-2.473 4.637-3.435 1.667-.962 3.54-1.641 5.463-1.653 1.922-.012 3.802.643 5.478 1.588z" stroke-width="1" stroke="rgb(0, 0, 0)" fill="none" />
        </pattern>
        <rect fill="url(#wavy)" width="120" height="16" x="0" y="0" />
      </svg>
    </div>
  `;
}

hexo.extend.tag.register(
  "attrs",
  function (_, content) {
    return parseAttrs(content);
  },
  { ends: true }
);
