const fs = require("fs");
const path = require("path");
const ColorScheme = require("color-scheme");

function fileExists(filePath) {
  try {
    return fs.existsSync(path.join("source", filePath));
  } catch (err) {
    return false;
  }
}

function lastPost() {
  const posts = hexo.locals.get("posts").data.slice();
  posts.sort((a, b) => {
    return b.date.unix() - a.date.unix();
  });
  return posts[0];
}

function getHue(page) {
  if (page.hue !== undefined) {
    return page.hue;
  } else if (lastPost().hue !== undefined) {
    return lastPost().hue;
  }
  return 0;
}

function getVariation(page) {
  // if (page.variation !== undefined) {
  //   return page.variation;
  // } else if (lastPost().variation !== undefined) {
  //   return lastPost().variation;
  // }
  return "default";
}

hexo.extend.helper.register("fancy", function (a) {
  let fancy = "";
  const hue = getHue(this.page);
  const variation = getVariation(this.page);
  const colorScheme = new ColorScheme();
  colorScheme.from_hue(hue).scheme("triade").variation(variation);
  const colors = colorScheme.colors();
  const color1a = colors[0];
  const color1b = colors[1];
  const color1c = colors[2];
  const color1d = colors[3];

  fancy += `
    <style>
      body {
        background-color: #111;
        color: #fff;
      }

      header {
        background-color: #${color1a};
        color: #222;
      }

      code {
        background-color: #${color1c};
        color: #222;
      }

      figure {
        background-color: #${color1c};
        color: #222;
      }

      .arrangement {
        border: 1px solid #${color1d};
      }

      .arrangement-wavy {
        stroke: #${color1a};
      }

      .tubs-segment {
        fill: #444;
        stroke: #000;
      }

      .tubs-segment.down {
        stroke: #888;
        stroke-width: 3px;
      }

      .tubs-segment.back {
        stroke: #888;
        stroke-width: 2px;
      }

      .tubs-segment.split {
        stroke: #888;
        stroke-width: 1px;
      }

      .tubs-segment.hit {
        fill: #${color1a};
      }

      .tubs-line {
        stroke: #${color1d};
      }

      .tubs-text {
        fill: #fff;
      }

      .tubs-backing-cur {
        stroke: #${color1d};
      }

      .tubs-text-cur {
        fill: #fff;
      }

      .dyn-pattern-path {
        stroke: #${color1a};
      }

      .dyn-text {
        fill: #000;
      }

      .dyn-dynamics {
        fill: none;
        stroke: #${color1a};
      }

      .dyn-point-tri {
        fill: none;
        stroke: #${color1a};
      }

      .dyn-point-text {
        fill: #fff;
      }
    </style>
  `;

  const title = this.page.title;
  const cssPath = `/${title}/style.css`;
  const jsPath = `/${title}/script.js`;
  if (fileExists(cssPath)) {
    fancy += `<link href="${cssPath}" rel="stylesheet">`;
  }
  if (fileExists(jsPath)) {
    fancy += `<script src="${jsPath}"></script>`;
  }
  return fancy;
});
