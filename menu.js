
const menu = document.getElementById("menu");
const openBtn = document.getElementById("open_menu");
const closeBtn = document.getElementById("close_menu");



openBtn.addEventListener("click", () => {
    menu.classList.add("open");
});

closeBtn.addEventListener("click", () => {
    menu.classList.remove("open");
});


