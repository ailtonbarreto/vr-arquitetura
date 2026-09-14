let pinchStartDistance = 0;
let initialScale = 2;

const objeto = document.querySelector("#objeto").object3D;
const modelo = document.querySelector("#modelo");

/* AUTO AJUSTE AO CARREGAR MODELO */
modelo.addEventListener("model-loaded", () => {

    // Posição fixa no mundo (VR)
    objeto.position.set(0, 1, -4);

    // Rotação fixa
    objeto.rotation.set(0, THREE.Math.degToRad(-90), 0);

    // Escala inicial
    modelo.setAttribute("scale", { x: 2, y: 2, z: 2 });

    // Ajuste automático baseado no tamanho real do modelo
    const obj = modelo.getObject3D("mesh");
    if (!obj) return;

    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    const desiredSize = 3;
    const scaleFactor = desiredSize / maxDim;

    modelo.setAttribute("scale", {
        x: scaleFactor,
        y: scaleFactor,
        z: scaleFactor
    });
});

/* ZOOM TOUCH (pinça) */
function getPinchDistance(e) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

window.addEventListener("touchstart", e => {
    if (e.touches.length === 2) {
        pinchStartDistance = getPinchDistance(e);
        initialScale = modelo.getAttribute("scale").x;
    }
});

window.addEventListener("touchmove", e => {

    // PINCH ZOOM
    if (e.touches.length === 2) {
        const pinchDistance = getPinchDistance(e);
        const scaleFactor = pinchDistance / pinchStartDistance;
        const newScale = initialScale * scaleFactor;

        modelo.setAttribute("scale", {
            x: newScale,
            y: newScale,
            z: newScale
        });
    }
});

/* ROT Y */
document.querySelector("#rotateLeft").addEventListener("click", () => {
    objeto.rotation.y += THREE.Math.degToRad(5);
});
document.querySelector("#rotateRight").addEventListener("click", () => {
    objeto.rotation.y -= THREE.Math.degToRad(5);
});

/* MOVE Y */
document.querySelector("#moveUp").addEventListener("click", () => {
    objeto.position.y += 0.2;
});
document.querySelector("#moveDown").addEventListener("click", () => {
    objeto.position.y -= 0.2;
});

/* PITCH X */
document.querySelector("#tiltForward").addEventListener("click", () => {
    objeto.rotation.x += THREE.Math.degToRad(5);
});
document.querySelector("#tiltBackward").addEventListener("click", () => {
    objeto.rotation.x -= THREE.Math.degToRad(5);
});

/* ROLL Z */
document.querySelector("#rollRight").addEventListener("click", () => {
    objeto.rotation.z += THREE.Math.degToRad(5);
});
document.querySelector("#rollLeft").addEventListener("click", () => {
    objeto.rotation.z -= THREE.Math.degToRad(5);
});

/* ZOOM DESKTOP */
document.querySelector("#zoomIn").addEventListener("click", () => {
    let scale = modelo.getAttribute("scale").x;
    scale += scale * 0.15;
    modelo.setAttribute("scale", { x: scale, y: scale, z: scale });
});

document.querySelector("#zoomOut").addEventListener("click", () => {
    let scale = modelo.getAttribute("scale").x;
    scale -= scale * 0.15;
    if (scale < 0.0001) scale = 0.0001;
    modelo.setAttribute("scale", { x: scale, y: scale, z: scale });
});

/* BOTÕES DE MODELO */
const modelButtons = document.querySelectorAll(".model-btn");

modelButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        // Remove active de todos
        modelButtons.forEach(b => b.classList.remove("active"));

        // Adiciona active ao botão clicado
        btn.classList.add("active");

        // Pega o src do botão
        const newModelURL = btn.dataset.src;

        // Troca o GLB
        modelo.setAttribute("src", newModelURL);

        // Resetar transformações
        objeto.rotation.set(0, THREE.Math.degToRad(-90), 0);
        objeto.position.set(0, 1, -4);
        modelo.setAttribute("scale", { x: 2, y: 2, z: 2 });
    });
});
