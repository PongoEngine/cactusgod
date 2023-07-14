function generateSineWave(amplitude, frequency, numSamples) {
  let sineWave = [];

  for(let i = 0; i < numSamples; i++) {
    // Normalizing the sine wave to [0, 1]
    // Original sine wave ranges from -1 to 1, adding 1 to make it 0 to 2, then dividing by 2 to make it 0 to 1
    let value = Math.sin(2 * Math.PI * frequency * (i / numSamples));
    sineWave.push(value * amplitude);
  }

  return sineWave;
}

function createPolyline(data, width, height) {
  // First, create the points for the polyline
  let points = '';
  for (let i = 0; i < data.length; i++) {
    const x = i / (data.length - 1) * width;  // Scale x to fit width
    const y = height - data[i] * height;  // Scale y to fit height, invert because SVG Y is top-down
    points += `${x},${y} `;
  }

  // Next, create the SVG element and polyline
  return `<polyline class="arrangement-wavy" points="${points.trim()}" fill="none" stroke-width="1" />`;
}

function mix(a, b) {
  const mult = (a * b) >= 0 ? 1 : -1;
  const a_ = Math.abs(a);
  const b_ = Math.abs(b);
  return ((a_ + b_) - a_ * b_) * mult;
}

function parseAttrs(str) {
  // const sts = {
  //   scale: undefined,
  //   structure: undefined,
  //   tempo: undefined,
  // };
  // str.split("\n").forEach((item) => {
  //   const keyVal = item.split(":");
  //   switch (keyVal[0].toLowerCase()) {
  //     case "scale":
  //       sts.scale = keyVal[1].trim();
  //       break;
  //     case "tempo":
  //       sts.tempo = keyVal[1].trim();
  //       break;
  //     case "signature":
  //       sts.signature = keyVal[1].trim();
  //       break;
  //   }
  // });
  const width = 1000;
  const height = 200;
  const sine1 = generateSineWave(1, 140, 256)
  const sine2 = generateSineWave(0.3, 243, 256);
  const mixedSine = [];
  for (let index = 0; index < sine1.length; index++) {
    const sine1Val = sine1[index];
    const sine2Val = sine2[index];
    mixedSine[index] = mix(sine1Val, sine2Val);
  }

  const sine1Offset = sine1.map(item => (item + 1) / 2);;
  const sine2Offset = sine2.map(item => (item + 1) / 2);;
  const mixedSineOffset = mixedSine.map(item => (item + 1) / 2);;

  return `
    <div class="arrangement">
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" transform="scale(1)" viewBox="0 0 ${width} ${height}">
        ${createPolyline(sine1Offset, width, height)}
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" transform="scale(1)" viewBox="0 0 ${width} ${height}">
        ${createPolyline(sine2Offset, width, height)}
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" transform="scale(1)" viewBox="0 0 ${width} ${height}">
        ${createPolyline(mixedSineOffset, width, height)}
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
