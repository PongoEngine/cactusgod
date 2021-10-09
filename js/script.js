
document.querySelectorAll(".tubs-container").forEach(tub => {
    let index = 0;
    const tubs = tub.querySelectorAll(".tubs")
    tub.addEventListener("click", () => {
        tubs[index].style.display = "none"
        index++;
        index %= tubs.length;
        tubs[index].style.display = "block"
    });
})
// console.log(items)