function getSepIndex(timeSig) {
    if (!timeSig) {
        return undefined
    }
    const reg = /(\d+)\/(\d+)/gm;
    const matches = reg.exec(timeSig);
    if (matches) {
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
                if (char === " ") {
                    hasSpace = true
                    return "<td class='title'>"
                }
                if (hasSpace) {
                    return char
                }
                if (char.toLowerCase() === ".") {
                    char = '•'
                }
                else if (char.toLowerCase() === "o") {
                    char = '⚬'
                }
                else if (char.toLowerCase() === "x") {
                    char = '✖'
                }
                const charClass = char === "-" ? "empty" : ""
                const isDown = index % sepIndex === 0;
                const downClass = isDown ? "down" : ""
                const cellClass = ["cell", charClass, downClass].filter(str => str.length).join(" ");
                return `<td class="${cellClass}">${char}</td>`
            }).join("")
            return `<tr class="row">${line}</td></tr>`
        }).join("")
    return `<div class="tubs-container"><table cellspacing="0" cellpadding="1" class="tubs"><tbody>${lines}</tbody></table></div>`
}

hexo.extend.tag.register("tubs", function (args, content) {
    return parseTubs(content, args);
}, { ends: true });