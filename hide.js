
const hideBtn = document.getElementById("ocultar");
const controls_btns = document.querySelectorAll(".hide");
const showBtn = document.getElementById("mostrar");


hideBtn.addEventListener("click", () => {
    controls_btns.forEach(btn => {
        btn.style.display = "none";
    });

    hideBtn.style.display = "none";
    showBtn.style.display = "block";


});

showBtn.addEventListener("click", () => {
    controls_btns.forEach(btn => {
        btn.style.display = "flex";
    });

    hideBtn.style.display = "block";
    showBtn.style.display = "none";

});



