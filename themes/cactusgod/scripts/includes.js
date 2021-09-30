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
  colorScheme.from_hue(hue).scheme("mono").variation(variation);
  const colors = colorScheme.colors();
  const color1a = colors[0];
  const color1b = colors[1];
  const color1c = colors[2];
  const color1d = colors[3];

  fancy += `
    <style>
      body {
        background-color: #${color1c};
        color: #111;
      }

      header {
        background-color: #${color1a};
      }

      a {
        color: #222;
        background-color: #${color1a};
      }

      a:hover {
        color: #${color1d};
      }

      .arrangement {
        border: 1px solid #${color1d};
      }

      .arrangement-wavy {
        stroke: #${color1a};
      }
      
      .tubs-backing {
        fill: none;
      }
      
      .tubs-line {
        fill: #${color1b};
      }

      .tubs-pattern-path {
        stroke: #${color1a};
      }

      .tubs-inst-name {
        fill: #111;
      }

      .tubs-note.filled {
        fill: #111;
      }

      .tubs-note.empty {
        fill: #${color1a};
      }

      .dyn-pattern-path {
        stroke: #${color1a};
      }

      .dyn-shine {
        fill: #${color1d};
      }

      .dyn-text {
        fill: #${color1c};
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
        fill: #111;
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
