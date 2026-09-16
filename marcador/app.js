let dragging = false;
let pinchStartDistance = 0;
let initialScale = 2;

const objeto = document.querySelector("#objeto").object3D;
const modelo = document.querySelector("#modelo");

/* AUTO AJUSTE AO CARREGAR MODELO */
modelo.addEventListener("model-loaded", () => {

    // Resetar posição
    objeto.position.set(0, 0, 0);

    // Resetar rotação
    objeto.rotation.set(0, THREE.Math.degToRad(-90), 0);

    // Resetar escala inicial
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

/* FUNÇÃO DE DISTÂNCIA DO PINCH */
function getPinchDistance(e) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

/* TOUCH START */
window.addEventListener("touchstart", e => {
    if (e.touches.length === 2) {
        pinchStartDistance = getPinchDistance(e);
        initialScale = modelo.getAttribute("scale").x;
    } else if (e.touches.length === 1) {
        dragging = true;
    }
});

/* TOUCH END */
window.addEventListener("touchend", () => dragging = false);

/* TOUCH MOVE */
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

        return;
    }

    // DRAG COM UM DEDO
    if (!dragging || e.touches.length !== 1) return;

    const touch = e.touches[0];
    const xNorm = (touch.clientX / window.innerWidth) * 2 - 1;

    const camera = document.querySelector("a-camera").object3D;

    const vector = new THREE.Vector3(xNorm, 0, -1);
    vector.unproject(camera);

    const distance = 3;
    const dir = vector.sub(camera.position).normalize();
    const newPos = camera.position.clone().add(dir.multiplyScalar(distance));

    objeto.position.x = newPos.x;
    objeto.position.z = newPos.z;
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

/* TROCA DE MODELO VIA SELECT */
document.querySelector("#modelSelect").addEventListener("change", (e) => {
    const newModelURL = e.target.value;

    modelo.setAttribute("src", newModelURL);

    objeto.rotation.set(0, THREE.Math.degToRad(-90), 0);
    objeto.position.set(0, 0, 0);
    modelo.setAttribute("scale", { x: 2, y: 2, z: 2 });
});
