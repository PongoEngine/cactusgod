const example = `
x-x--x-|----x--|-----x-|-x----- * Bass
--x--x-|---x--x|---x--x|--x---x * Vocals
-x-----|x------|x------|x------ * HiHats
-------|-------|-------|------- * Snare
`;

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
            const line = str.split("").filter(char => {
                return char !== "|"
            }).map((char, index) => {
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

const tubs = parseTubs(example, "7/8")
// console.log(tubs)