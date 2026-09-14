let currentModelSrc = "";

const objeto = document.querySelector("#objeto").object3D;
const modelo = document.querySelector("#modelo");

/* AUTO AJUSTE AO CARREGAR MODELO */
modelo.addEventListener("model-loaded", () => {
    objeto.position.set(0, 0, -2);
    objeto.rotation.set(0, 0, 0);

    modelo.setAttribute("scale", { x: 1, y: 1, z: 1 });

    const mesh = modelo.getObject3D("mesh");
    if (!mesh) return;

    const box = new THREE.Box3().setFromObject(mesh);
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

/* ZOOM */
document.querySelector("#zoomIn").addEventListener("click", () => {
    let scale = modelo.getAttribute("scale").x;
    scale *= 1.15;
    modelo.setAttribute("scale", { x: scale, y: scale, z: scale });
});
document.querySelector("#zoomOut").addEventListener("click", () => {
    let scale = modelo.getAttribute("scale").x;
    scale *= 0.85;
    if (scale < 0.001) scale = 0.001;
    modelo.setAttribute("scale", { x: scale, y: scale, z: scale });
});

/* TROCA DE MODELO */
const modelButtons = document.querySelectorAll(".model-btn");

modelButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        modelButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const newModelURL = btn.dataset.src;
        currentModelSrc = newModelURL;

        modelo.setAttribute("src", newModelURL);

        objeto.position.set(0, 0, -2);
        objeto.rotation.set(0, 0, 0);
        modelo.setAttribute("scale", { x: 1, y: 1, z: 1 });
    });
});
