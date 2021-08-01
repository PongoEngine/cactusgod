function getSepIndex(timeSig) {
    if(!timeSig) {
        return undefined
    }
    const reg = /(\d+)\/(\d+)/gm;
    const matches = reg.exec(timeSig);
    if(matches) {
        return matches[1]
    }
    return undefined
}

function parseTubs(str, timeSig) {
    const sepIndex = getSepIndex(timeSig);
    const lines = str.split("\n")
        .map(str => str.trim())
        .filter(str => str.length > 0)
        .map(str => {
            let hasSpace = false;
            const line = str.split("").filter(char => {
                return char !== "|"
            }).map((char, index) => {
                if(char === " ") {
                    hasSpace = true
                    return "<span class='spacer'></span>"
                }
                if(hasSpace) {
                    return char
                }
                const charClass = char === "-" ? "empty" : ""
                const isDown = index % sepIndex === 0;
                const downClass = isDown ? "down" : ""
                const cellClass = ["cell", charClass, downClass].filter(str => str.length).join(" ");
                return `<span class="${cellClass}">${char}</span>`
            }).join("")
            return `<div class="row">${line}</div>`
        }).join("")
    return `<div class="tubs">${lines}</div>`
}

hexo.extend.tag.register("tubs", function (args, content) {
    return parseTubs(content, args);
}, {ends: true});