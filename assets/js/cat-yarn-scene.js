import * as THREE from "../vendor/three/build/three.module.js";
import { OrbitControls } from "../vendor/three/examples/jsm/controls/OrbitControls.js";

const sceneRoots = document.querySelectorAll("[data-cat-yarn-scene]");

sceneRoots.forEach((root) => {
  if (root.dataset.sceneReady === "true") return;
  root.dataset.sceneReady = "true";
  initializeScene(root);
});

function initializeScene(root) {
  const locale = root.dataset.sceneLocale === "zh" ? "zh" : "en";
  const text = getText(locale);
  const canvas = root.querySelector("[data-scene-canvas]");
  const title = root.querySelector("[data-scene-title]");
  const hint = root.querySelector("[data-scene-hint]");
  const status = root.querySelector("[data-scene-status]");
  const lightTime = root.querySelector("[data-scene-light-time]");
  const viewButtons = [...root.querySelectorAll("[data-scene-view]")];
  const resetButton = root.querySelector("[data-scene-reset]");
  const loading = root.querySelector("[data-scene-loading]");

  title.textContent = text.title;
  hint.textContent = text.hint;
  status.textContent = text.loading;
  if (lightTime) lightTime.textContent = text.lightTime;
  if (loading) loading.textContent = text.loading;

  viewButtons.forEach((button) => {
    button.textContent = text.views[button.dataset.sceneView];
  });
  if (resetButton) resetButton.textContent = text.reset;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf7ead9, 9, 18);
  scene.background = new THREE.Color(0xf7ead9);

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  const defaultTarget = new THREE.Vector3(-0.3, 3.0, 0);
  camera.position.set(0.7, 5.05, 13.8);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.075;
  controls.enablePan = false;
  controls.minDistance = 5.8;
  controls.maxDistance = 16.5;
  controls.minPolarAngle = 0.48;
  controls.maxPolarAngle = 1.27;
  controls.minAzimuthAngle = -1.15;
  controls.maxAzimuthAngle = 1.15;
  controls.target.copy(defaultTarget);
  controls.update();

  const hemisphereLight = new THREE.HemisphereLight(0xfff6e8, 0x5c4139, 2.25);
  scene.add(hemisphereLight);

  const keyLight = new THREE.DirectionalLight(0xffead2, 3.1);
  keyLight.position.set(4.5, 7.5, 6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.left = -8;
  keyLight.shadow.camera.right = 8;
  keyLight.shadow.camera.top = 9;
  keyLight.shadow.camera.bottom = -3;
  keyLight.shadow.bias = -0.00035;
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0xffa66d, 1.35, 16);
  fillLight.position.set(-4, 4.5, 5.5);
  scene.add(fillLight);

  const world = new THREE.Group();
  scene.add(world);

  const ground = makeGround();
  world.add(ground);

  const floorLine = makeFloorLine();
  world.add(floorLine);

  const forest = makeForest();
  world.add(forest.group);

  const tree = makeTree({
    main: true,
    variation: { trunk: 1.22, spread: 1.05, leafDensity: 1, extraBranches: 4, seed: 20 },
  });
  world.add(tree.group);
  const treeSupports = [tree, ...forest.trees];

  const refreshTimeLighting = makeTimeLighting({
    root,
    scene,
    hemisphereLight,
    keyLight,
    fillLight,
    lightTime,
    text,
  });
  refreshTimeLighting();
  window.setInterval(refreshTimeLighting, 60000);

  const yarn = makeYarnBall();
  world.add(yarn.group);

  const cat = makeCat();
  world.add(cat.root);

  const yarnRadius = 0.28;
  const initialYarnPoint = new THREE.Vector3(-0.72, yarnRadius, 0);
  const yarnPoint = initialYarnPoint.clone();
  const yarnTarget = yarnPoint.clone();
  const yarnVelocity = new THREE.Vector3();
  const stagePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const scratchPoint = new THREE.Vector3();
  const cameraGoal = {
    position: null,
    target: null,
  };

  let dragging = false;
  let activePointerId = null;
  let lastDragX = 0;
  let depthPointerId = null;
  let lastDepthX = 0;
  let currentMode = "";
  const catPosition = new THREE.Vector3(-2.15, 0, 0);
  const catVelocity = new THREE.Vector3();
  let catYaw = 0;
  let walkPhase = 0;
  let lastFrame = performance.now();
  const gravity = -9.8;
  const catMovementScale = 1.525;
  const catNavigation = {
    waypoint: new THREE.Vector3(),
    lastWaypoint: new THREE.Vector3(),
    goal: new THREE.Vector3(),
    hasWaypoint: false,
    hasAvoidPoint: false,
    mode: "",
  };

  const viewPresets = {
    front: {
      position: new THREE.Vector3(0.7, 5.05, 13.8),
      target: defaultTarget.clone(),
    },
    side: {
      position: new THREE.Vector3(7.3, 4.8, 10.2),
      target: new THREE.Vector3(-0.45, 3.0, 0),
    },
    top: {
      position: new THREE.Vector3(0.25, 10.6, 8.4),
      target: new THREE.Vector3(-0.45, 2.6, 0),
    },
  };

  function setView(name) {
    const preset = viewPresets[name];
    if (!preset) return;

    cameraGoal.position = preset.position.clone();
    cameraGoal.target = preset.target.clone();
    viewButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.sceneView === name);
    });
  }

  function getTreeSupport(point) {
    const branchSupport = treeSupports.find((candidate) => isOnBranchSupport(point, candidate));
    if (branchSupport) return branchSupport;

    return treeSupports
      .filter((candidate) => isOnTree(point, candidate))
      .sort((first, second) => {
        const firstDistance = Math.hypot(
          point.x - first.collider.x,
          point.z - first.collider.z
        );
        const secondDistance = Math.hypot(
          point.x - second.collider.x,
          point.z - second.collider.z
        );
        return firstDistance - secondDistance;
      })[0] || null;
  }

  function resetYarn() {
    if (activePointerId !== null && canvas.hasPointerCapture(activePointerId)) {
      canvas.releasePointerCapture(activePointerId);
    }
    if (depthPointerId !== null && canvas.hasPointerCapture(depthPointerId)) {
      canvas.releasePointerCapture(depthPointerId);
    }
    dragging = false;
    controls.enabled = true;
    root.classList.remove("is-dragging");
    activePointerId = null;
    depthPointerId = null;
    yarnPoint.copy(initialYarnPoint);
    yarnTarget.copy(initialYarnPoint);
    yarnVelocity.set(0, 0, 0);
    currentMode = "";
    updateStatus("chase");
  }

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.sceneView));
  });
  if (resetButton) resetButton.addEventListener("click", resetYarn);

  controls.addEventListener("start", () => {
    if (!dragging) {
      cameraGoal.position = null;
      cameraGoal.target = null;
      viewButtons.forEach((button) => button.classList.remove("is-active"));
    }
  });

  function resize() {
    const width = root.clientWidth;
    const height = root.clientHeight;
    if (!width || !height) return;

    camera.aspect = width / height;
    camera.fov = width < 560 ? 42 : 36;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  if (typeof ResizeObserver !== "undefined") {
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);
  }
  resize();
  window.addEventListener("resize", resize);

  function setPointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function getStagePoint(event) {
    setPointer(event);
    stagePlane.constant = -yarnPoint.z;
    raycaster.setFromCamera(pointer, camera);
    return raycaster.ray.intersectPlane(stagePlane, scratchPoint)
      ? scratchPoint.clone()
      : null;
  }

  function constrainYarn(point) {
    const constrained = point.clone();
    constrained.x = THREE.MathUtils.clamp(constrained.x, -5.55, 5.55);
    constrained.y = THREE.MathUtils.clamp(constrained.y, yarnRadius, 6.55);
    constrained.z = THREE.MathUtils.clamp(constrained.z, -3, 3);

    if (constrained.y <= yarnRadius + 0.08) {
      constrained.y = yarnRadius;
    }

    return constrained;
  }

  function onPointerDown(event) {
    if (dragging) {
      if (event.pointerType !== "touch" || depthPointerId !== null || event.pointerId === activePointerId) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      depthPointerId = event.pointerId;
      lastDepthX = event.clientX;
      canvas.setPointerCapture(depthPointerId);
      return;
    }

    setPointer(event);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObject(yarn.pickMesh, false);
    if (!hits.length) return;

    event.preventDefault();
    event.stopPropagation();
    dragging = true;
    activePointerId = event.pointerId;
    controls.enabled = false;
    cameraGoal.position = null;
    cameraGoal.target = null;
    root.classList.add("is-dragging");
    yarnVelocity.set(0, 0, 0);
    stagePlane.constant = -yarnPoint.z;
    lastDragX = event.clientX;
    canvas.setPointerCapture(activePointerId);
  }

  function onPointerMove(event) {
    if (!dragging) return;
    if (event.pointerId === depthPointerId) {
      yarnTarget.z = THREE.MathUtils.clamp(
        yarnTarget.z + (event.clientX - lastDepthX) * 0.012,
        -3,
        3
      );
      lastDepthX = event.clientX;
      return;
    }
    if (event.pointerId !== activePointerId || depthPointerId !== null) return;
    if (event.shiftKey) {
      yarnTarget.z = THREE.MathUtils.clamp(
        yarnTarget.z + (event.clientX - lastDragX) * 0.012,
        -3,
        3
      );
      lastDragX = event.clientX;
      return;
    }
    lastDragX = event.clientX;
    const point = getStagePoint(event);
    if (point) {
      const constrained = constrainYarn(point);
      constrained.z = yarnTarget.z;
      yarnTarget.copy(constrained);
    }
  }

  function onWheel(event) {
    setPointer(event);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObject(yarn.pickMesh, false);
    if (!dragging && !hits.length) return;
    event.preventDefault();
    const nextZ = THREE.MathUtils.clamp(
      (dragging ? yarnTarget.z : yarnPoint.z) - event.deltaY * 0.004,
      -3,
      3
    );
    yarnTarget.z = nextZ;
    if (!dragging) yarnPoint.z = nextZ;
    yarnVelocity.set(0, 0, 0);
  }

  function finishDrag(event) {
    if (event.pointerId === depthPointerId) {
      if (canvas.hasPointerCapture(depthPointerId)) {
        canvas.releasePointerCapture(depthPointerId);
      }
      depthPointerId = null;
      return;
    }
    if (!dragging || event.pointerId !== activePointerId) return;

    dragging = false;
    controls.enabled = true;
    root.classList.remove("is-dragging");
    if (canvas.hasPointerCapture(activePointerId)) {
      canvas.releasePointerCapture(activePointerId);
    }
    if (depthPointerId !== null && canvas.hasPointerCapture(depthPointerId)) {
      canvas.releasePointerCapture(depthPointerId);
    }
    yarnVelocity.set(0, 0, 0);
    yarnPoint.copy(yarnTarget);
    activePointerId = null;
    depthPointerId = null;
  }

  canvas.addEventListener("pointerdown", onPointerDown, { capture: true });
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", finishDrag);
  canvas.addEventListener("pointercancel", finishDrag);
  canvas.addEventListener("wheel", onWheel, { passive: false });

  function getMode(point) {
    if (getTreeSupport(point)) return "sleep";
    if (point.y <= yarnRadius + 0.08) {
      return Math.hypot(point.x - catPosition.x, point.z - catPosition.z) < 1.2
        ? "play"
        : "chase";
    }
    return "fall";
  }

  function updateStatus(mode) {
    if (mode === currentMode) return;
    currentMode = mode;
    status.textContent = text.status[mode];
  }

  function animate(frameTime) {
    const delta = Math.min((frameTime - lastFrame) / 1000, 0.05);
    const elapsed = frameTime / 1000;
    lastFrame = frameTime;

    if (dragging) {
      yarnPoint.copy(yarnTarget);
      yarnVelocity.set(0, 0, 0);
    } else if (!getTreeSupport(yarnPoint)) {
      yarnVelocity.y += gravity * delta;
      yarnPoint.addScaledVector(yarnVelocity, delta);
      yarnPoint.x += yarnVelocity.x * delta;
      yarnVelocity.x *= Math.pow(0.18, delta);

      if (yarnPoint.y <= yarnRadius) {
        yarnPoint.y = yarnRadius;
        yarnVelocity.y = Math.abs(yarnVelocity.y) > 0.8
          ? Math.abs(yarnVelocity.y) * 0.3
          : 0;
      }
      yarnPoint.x = THREE.MathUtils.clamp(yarnPoint.x, -5.55, 5.55);
    } else {
      yarnVelocity.set(0, 0, 0);
    }

    updateYarn(yarn, yarnPoint, elapsed, yarnVelocity.x);
    const supportTree = getTreeSupport(yarnPoint);
    const mode = getMode(yarnPoint);
    updateStatus(mode);
    const ballDelta = new THREE.Vector3(
      yarnPoint.x - catPosition.x,
      0,
      yarnPoint.z - catPosition.z
    );
    const ballDistance = ballDelta.length();
    const ballDirection = ballDistance > 0.001
      ? ballDelta.clone().normalize()
      : new THREE.Vector3(1, 0, 0);
    const ballGap = 0.82;
    const catColliders = forest.colliders.concat(tree.collider);
    const targetPosition = mode === "chase" || mode === "play"
      ? new THREE.Vector3(yarnPoint.x, 0, yarnPoint.z).addScaledVector(
        ballDirection,
        -Math.min(ballGap, ballDistance)
      )
      : mode === "sleep"
        ? new THREE.Vector3(supportTree.sleepX, 0, supportTree.sleepZ)
        : new THREE.Vector3(-1.85 + Math.sin(elapsed * 0.55) * 0.35, 0, 0);
    if (mode === "chase" || mode === "play") {
      resolveCatPosition(targetPosition, catColliders);
    }
    const speed = mode === "chase" ? 8 : mode === "play" ? 3.6 : mode === "sleep" ? 4 : 2.3;
    const travelTarget = mode === "chase" || mode === "play"
      ? getCatTravelTarget(
        catPosition,
        targetPosition,
        catColliders,
        catNavigation,
        mode
      )
      : targetPosition;
    const targetDelta = travelTarget.clone().sub(catPosition);
    catVelocity.addScaledVector(targetDelta, delta * speed);
    catVelocity.multiplyScalar(mode === "sleep" ? 0.76 : 0.84);
    catPosition.addScaledVector(catVelocity, delta * catMovementScale);
    resolveCatPosition(catPosition, catColliders);
    if (ballDistance > 0.04 && (mode === "chase" || mode === "play")) {
      catYaw = Math.atan2(-ballDirection.z, ballDirection.x);
    } else if (catVelocity.length() > 0.015 && mode !== "sleep") {
      catYaw = Math.atan2(-catVelocity.z, catVelocity.x);
    }
    walkPhase += Math.min(catVelocity.length() * 4.6, 1.2);

    animateForest(forest, tree, elapsed);

    updateCat(cat, {
      delta,
      elapsed,
      mode,
      yarnPoint,
      catPosition,
      catVelocity,
      catYaw,
      walkPhase,
    });

    if (cameraGoal.position && cameraGoal.target) {
      camera.position.lerp(cameraGoal.position, 0.09);
      controls.target.lerp(cameraGoal.target, 0.09);
      if (
        camera.position.distanceTo(cameraGoal.position) < 0.015 &&
        controls.target.distanceTo(cameraGoal.target) < 0.015
      ) {
        camera.position.copy(cameraGoal.position);
        controls.target.copy(cameraGoal.target);
        cameraGoal.position = null;
        cameraGoal.target = null;
      }
    }

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  setView("front");
  root.classList.add("is-ready");
  requestAnimationFrame(animate);
}

function makeTimeLighting({ root, scene, hemisphereLight, keyLight, fillLight, lightTime, text }) {
  const nightSky = new THREE.Color(0x2b3857);
  const daySky = new THREE.Color(0xf4dfc4);
  const dawnSky = new THREE.Color(0xe79a76);
  const nightGround = new THREE.Color(0x596171);
  const dayGround = new THREE.Color(0x8b6d50);
  const nightKey = new THREE.Color(0xa9c2ee);
  const dayKey = new THREE.Color(0xffefcf);
  const dawnKey = new THREE.Color(0xff9a64);
  const skyColor = new THREE.Color();
  const groundColor = new THREE.Color();
  const keyColor = new THREE.Color();

  return () => {
    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60;
    const daylight = THREE.MathUtils.clamp(
      Math.sin(((hour - 6) / 12) * Math.PI),
      0,
      1
    );
    const dawn = THREE.MathUtils.clamp(
      1 - Math.abs(hour - 6) / 2.2,
      0,
      1
    ) + THREE.MathUtils.clamp(1 - Math.abs(hour - 18) / 2.2, 0, 1);

    skyColor.lerpColors(nightSky, daySky, daylight);
    groundColor.lerpColors(nightGround, dayGround, daylight);
    keyColor.lerpColors(nightKey, dayKey, daylight);
    if (dawn > 0) {
      skyColor.lerp(dawnSky, Math.min(dawn * 0.42, 0.42));
      keyColor.lerp(dawnKey, Math.min(dawn * 0.58, 0.58));
    }

    scene.background.copy(skyColor);
    scene.fog.color.copy(skyColor);
    root.classList.toggle("is-night", daylight < 0.34);
    hemisphereLight.color.copy(skyColor).lerp(new THREE.Color(0xffffff), 0.3);
    hemisphereLight.groundColor.copy(groundColor);
    hemisphereLight.intensity = 1.12 + daylight * 1.35;

    const sunAngle = ((hour - 12) / 12) * Math.PI;
    keyLight.position.set(
      Math.sin(sunAngle) * 7.5,
      2.2 + daylight * 7.8,
      5.8 + Math.cos(sunAngle) * 2.2
    );
    keyLight.color.copy(keyColor);
    keyLight.intensity = 1.18 + daylight * 2.45;
    fillLight.color.copy(keyColor).lerp(new THREE.Color(0xffb17d), 0.38);
    fillLight.intensity = 0.56 + daylight * 0.86;
    fillLight.position.set(-4.5, 2.8 + daylight * 2.8, 4.5);

    if (lightTime) {
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      lightTime.textContent = `${text.lightTime} · ${hours}:${minutes}`;
    }
  };
}

function animateForest(forest, mainTree, elapsed) {
  [...forest.windGroups, ...mainTree.windGroups].forEach((cluster) => {
    const baseRotation = cluster.userData.baseRotation;
    const phase = cluster.userData.windPhase || 0;
    cluster.rotation.z = baseRotation.z + Math.sin(elapsed * 0.65 + phase) * 0.026;
    cluster.rotation.x = baseRotation.x + Math.cos(elapsed * 0.52 + phase) * 0.018;
  });
}

function getText(locale) {
  if (locale === "zh") {
    return {
      title: "\u67ab\u6797\u4e2d\u7684\u6bdb\u7ebf\u7403",
      hint: "\u62d6\u52a8\u6bdb\u7ebf\u7403\u6539\u53d8 X/Y \u4f4d\u7f6e\uff0c\u6309\u4f4f Shift \u5e76\u6c34\u5e73\u79fb\u52a8\u6539\u53d8 Z \u6df1\u5ea6\uff0c\u6eda\u8f6e\u53ef\u5fae\u8c03\u3002\u624b\u673a\u7aef\u7528\u4e00\u6839\u624b\u6307\u62d6\u52a8\uff0c\u518d\u7528\u7b2c\u4e8c\u6839\u624b\u6307\u6c34\u5e73\u79fb\u52a8\u6539\u53d8 Z \u6df1\u5ea6\u3002\u677e\u624b\u540e\u5b83\u4f1a\u53d7\u91cd\u529b\u4e0b\u843d\uff0c\u62d6\u52a8\u7a7a\u767d\u5904\u53ef\u65cb\u8f6c 3D \u89c6\u89d2\u3002",
      reset: "\u91cd\u7f6e\u6bdb\u7ebf\u7403",
      loading: "3D \u573a\u666f\u52a0\u8f7d\u4e2d...",
      lightTime: "\u81ea\u7136\u5149\u7167\u540c\u6b65\u5f53\u524d\u65f6\u95f4",
      views: {
        front: "\u6b63\u9762",
        side: "\u4fa7\u9762",
        top: "\u4fef\u89c6",
      },
      status: {
        chase: "\u6bdb\u7ebf\u7403\u5728\u5730\u677f\u7ebf\u4e0a\uff0c\u5c0f\u732b\u6b63\u8dd1\u5411\u5b83\u3002",
        play: "\u5c0f\u732b\u5df2\u7ecf\u505c\u5728\u6bdb\u7ebf\u7403\u524d\uff0c\u5f00\u5fc3\u5730\u7528\u524d\u722a\u62cd\u5b83\u3002",
        fall: "\u6bdb\u7ebf\u7403\u6b63\u5728\u53d7\u91cd\u529b\u4e0b\u843d\u3002",
        watch: "\u6bdb\u7ebf\u7403\u5728\u7a7a\u4e2d\uff0c\u5c0f\u732b\u6b63\u5728\u6293\u4f4f\u5b83\u7684\u76ee\u5149\u3002",
        sleep: "\u6bdb\u7ebf\u7403\u505c\u5728\u67ab\u6811\u4e0a\uff0c\u5c0f\u732b\u5377\u8d77\u6765\u4f11\u606f\u3002",
      },
    };
  }

  return {
    title: "Yarn ball in the maple grove",
    hint: "Drag the yarn ball for X/Y placement. Hold Shift and move horizontally to adjust Z depth; use the wheel for fine control. On touch devices, drag with one finger and move a second finger horizontally to adjust Z depth. Release it in the air and gravity pulls it down; drag open space to orbit the 3D scene.",
    reset: "Reset yarn",
    loading: "Loading the 3D scene...",
    lightTime: "Natural light synced to local time",
    views: {
      front: "Front",
      side: "Side",
      top: "High",
    },
    status: {
      chase: "The yarn is on the floor line, so the cat is running toward it.",
      play: "The cat has stopped in front of the yarn and is happily batting it with both paws.",
      fall: "The yarn ball is falling under gravity.",
      watch: "The yarn is in the air, and the cat is keeping a close eye on it.",
      sleep: "The yarn reached a maple tree, so the cat has curled up for a nap.",
    },
  };
}

function makeFloorLine() {
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-6.2, 0.018, 0.08),
    new THREE.Vector3(6.2, 0.018, 0.08),
  ]);
  const material = new THREE.LineBasicMaterial({
    color: 0x654733,
    transparent: true,
    opacity: 0.9,
  });
  return new THREE.Line(geometry, material);
}

function makeGround() {
  const group = new THREE.Group();
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 11),
    new THREE.MeshStandardMaterial({
      color: 0x6a6541,
      roughness: 1,
      metalness: 0,
      transparent: true,
      opacity: 0.82,
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -0.015, -0.15);
  ground.receiveShadow = true;
  group.add(ground);

  const grassMaterials = [0x6f693f, 0x927944, 0x7e6039, 0x5f5d3a, 0xa0834a].map(
    (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.98 })
  );
  const bladeGeometry = new THREE.ConeGeometry(0.032, 0.24, 5);
  const grassCount = 180;
  for (let index = 0; index < grassCount; index += 1) {
    const tuft = new THREE.Group();
    const column = index % 30;
    const row = Math.floor(index / 30);
    tuft.position.set(
      -6 + column * 0.41 + Math.sin(index * 1.7) * 0.08,
      0.08,
      -4.3 + row * 0.78 + Math.cos(index * 1.2) * 0.12
    );
    for (let bladeIndex = 0; bladeIndex < 3; bladeIndex += 1) {
      const blade = new THREE.Mesh(
        bladeGeometry,
        grassMaterials[(index + bladeIndex) % grassMaterials.length]
      );
      blade.position.x = (bladeIndex - 1) * 0.045;
      blade.position.z = (bladeIndex - 1) * 0.03;
      blade.rotation.z = (bladeIndex - 1) * 0.22 + Math.sin(index) * 0.04;
      blade.rotation.x = Math.cos(index + bladeIndex) * 0.08;
      blade.castShadow = false;
      blade.receiveShadow = true;
      tuft.add(blade);
    }
    group.add(tuft);
  }

  const fallenLeafGeometry = makeMapleLeafGeometry();
  const fallenLeafMaterials = [0x8f2f25, 0xb7472d, 0xd36b35, 0xe08a43, 0x7a3828].map(
    (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.92, side: THREE.DoubleSide })
  );
  const fallenLeafCount = 240;
  for (let index = 0; index < fallenLeafCount; index += 1) {
    const randomX = Math.abs(Math.sin(index * 12.9898 + 4.17));
    const randomZ = Math.abs(Math.sin(index * 78.233 + 1.91));
    const leaf = new THREE.Mesh(
      fallenLeafGeometry,
      fallenLeafMaterials[index % fallenLeafMaterials.length]
    );
    leaf.position.set(-6.35 + randomX * 12.7, 0.035, -4.65 + randomZ * 8.9);
    leaf.rotation.set(
      -Math.PI / 2 + (randomZ - 0.5) * 0.22,
      (randomX - 0.5) * 0.2,
      randomX * Math.PI * 2
    );
    leaf.scale.setScalar(0.11 + (index % 5) * 0.018);
    leaf.castShadow = false;
    leaf.receiveShadow = true;
    group.add(leaf);
  }

  return group;
}

function makeForest() {
  const group = new THREE.Group();
  const windGroups = [];
  const colliders = [];
  const treeSupports = [];
  const trees = [
    {
      position: new THREE.Vector3(-5.45, 0, -3.55),
      scale: 0.9,
      variation: { trunk: 0.78, spread: 0.84, leafDensity: 0.96, extraBranches: 1, seed: 1 },
    },
    {
      position: new THREE.Vector3(-1.25, 0, -3.9),
      scale: 0.8,
      variation: { trunk: 1.18, spread: 1.08, leafDensity: 0.99, extraBranches: 3, seed: 4 },
    },
    {
      position: new THREE.Vector3(2.55, 0, -3.25),
      scale: 0.96,
      variation: { trunk: 0.9, spread: 1.24, leafDensity: 0.94, extraBranches: 2, seed: 8 },
    },
    {
      position: new THREE.Vector3(5.35, 0, -3.7),
      scale: 0.86,
      variation: { trunk: 1.28, spread: 0.74, leafDensity: 0.97, extraBranches: 0, seed: 12 },
    },
    {
      position: new THREE.Vector3(-5.35, 0, 0.95),
      scale: 0.72,
      variation: { trunk: 0.96, spread: 1.16, leafDensity: 0.95, extraBranches: 2, seed: 16 },
    },
    {
      position: new THREE.Vector3(4.85, 0, 1.55),
      scale: 0.76,
      variation: { trunk: 1.08, spread: 0.9, leafDensity: 0.98, extraBranches: 3, seed: 24 },
    },
  ];

  trees.forEach((options) => {
    const tree = makeTree({ ...options, main: false });
    group.add(tree.group);
    windGroups.push(...tree.windGroups);
    colliders.push(tree.collider);
    treeSupports.push(tree);
  });

  const shrubbery = makeShrubbery();
  group.add(shrubbery.group);
  colliders.push(...shrubbery.colliders);

  return { group, windGroups, colliders, trees: treeSupports };
}

function makeShrubbery() {
  const group = new THREE.Group();
  const colliders = [];
  const materials = [0x5f623b, 0x7a6a3d, 0x94643b, 0x6b5238, 0x8a753f].map(
    (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.96 })
  );
  const geometry = new THREE.IcosahedronGeometry(0.48, 1);
  const placements = [
    [-5.25, 0.55, 0.9, 0], [-4.45, 0.85, 0.62, 1], [-2.2, 1.3, 0.78, 2],
    [-0.5, 1.25, 0.72, 2], [1.2, 0.9, 0.5, 3], [3.55, 0.42, 0.68, 0],
    [4.35, 0.8, 0.86, 1], [5.35, 0.35, 0.66, 0],
  ];

  placements.forEach(([x, z, scale, materialIndex], index) => {
    const shrub = new THREE.Group();
    shrub.position.set(x, 0.18, z);
    for (let part = 0; part < 4; part += 1) {
      const bush = new THREE.Mesh(
        geometry,
        materials[(materialIndex + part) % materials.length]
      );
      bush.position.set(
        (part - 1.5) * 0.25,
        (part % 2) * 0.18,
        Math.sin(index + part) * 0.14
      );
      bush.scale.setScalar(scale * (0.72 + (part % 3) * 0.12));
      bush.castShadow = false;
      bush.receiveShadow = true;
      shrub.add(bush);
    }
    group.add(shrub);
    colliders.push({ x, z, radius: scale * 0.72 });
  });

  return { group, colliders };
}

function makeTree(options = {}) {
  const group = new THREE.Group();
  const main = options.main !== false;
  const scale = options.scale || (main ? 1 : 0.8);
  const position = options.position || new THREE.Vector3(-3.35, 0, 0);
  const variation = options.variation || {};
  const trunkFactor = variation.trunk || 1;
  const spread = variation.spread || 1;
  const leafDensity = variation.leafDensity || 1;
  const seed = variation.seed || 0;
  const heightFactor = main ? 1 : 0.92 + ((seed % 4) * 0.045);
  const branchSkew = ((seed % 7) - 3) * 0.08;
  const windGroups = [];
  const bark = new THREE.MeshStandardMaterial({
    color: main ? 0x56321f : 0x63452f,
    roughness: 0.96,
  });
  const barkLight = new THREE.MeshStandardMaterial({
    color: main ? 0x86563a : 0x8d6449,
    roughness: 0.92,
  });
  const leafMaterials = (main
    ? [0x762721, 0x942b24, 0xb4382a, 0xcf4b31, 0xe26c38, 0xe79542, 0x7f3b28, 0xaa572d]
    : [0x702a25, 0x8e3229, 0xa94231, 0xc45b37, 0xd77b41, 0x75412b]
  ).map(
    (color) =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.88,
        metalness: 0,
        side: THREE.DoubleSide,
      })
  );

  const trunkTop = new THREE.Vector3(0.25, 4.28 * heightFactor, 0);
  const branches = [
    [new THREE.Vector3(0, 0.1, 0), trunkTop, 0.62, 0.2, bark],
    [new THREE.Vector3(0.12, 2.45, 0), new THREE.Vector3(-1.78, 4.42, 0.02), 0.29, 0.1, bark],
    [new THREE.Vector3(0.18, 2.95, 0), new THREE.Vector3(3.0, 4.6, 0), 0.3, 0.095, bark],
    [new THREE.Vector3(-0.42, 3.45, 0), new THREE.Vector3(-1.42, 5.08, -0.05), 0.14, 0.04, barkLight],
    [new THREE.Vector3(-1.0, 3.83, 0), new THREE.Vector3(-2.55, 5.05, 0.04), 0.105, 0.03, barkLight],
    [new THREE.Vector3(0.82, 3.72, 0), new THREE.Vector3(0.35, 5.45, -0.06), 0.12, 0.035, barkLight],
    [new THREE.Vector3(1.46, 4.05, 0), new THREE.Vector3(2.36, 5.48, 0.05), 0.1, 0.028, barkLight],
    [new THREE.Vector3(2.02, 4.26, 0), new THREE.Vector3(3.48, 4.95, -0.04), 0.08, 0.022, barkLight],
    [new THREE.Vector3(-0.12, 4.04, 0), new THREE.Vector3(-0.76, 5.92, 0.06), 0.08, 0.024, barkLight],
  ];
  const optionalBranches = [
    [new THREE.Vector3(-1.5, 4.0, 0), new THREE.Vector3(-2.9, 4.72, -0.04), 0.075, 0.022, barkLight],
    [new THREE.Vector3(0.62, 4.2, 0), new THREE.Vector3(1.0, 5.86, 0.04), 0.075, 0.022, barkLight],
    [new THREE.Vector3(2.3, 4.42, 0), new THREE.Vector3(3.6, 5.42, -0.03), 0.06, 0.018, barkLight],
    [new THREE.Vector3(-0.48, 4.7, 0), new THREE.Vector3(-1.1, 6.28, 0.02), 0.055, 0.016, barkLight],
  ];
  branches.push(...optionalBranches.slice(0, variation.extraBranches || 0));

  const adjustedBranches = branches.map(([start, end, radiusStart, radiusEnd, material], index) => {
    const adjustedStart = start.clone();
    const adjustedEnd = end.clone();
    if (index > 0) {
      adjustedStart.x = adjustedStart.x * spread + branchSkew;
      adjustedEnd.x = adjustedEnd.x * spread + branchSkew;
      adjustedStart.y *= heightFactor;
      adjustedEnd.y *= heightFactor;
    }
    return [
      adjustedStart,
      adjustedEnd,
      radiusStart * trunkFactor,
      radiusEnd * trunkFactor,
      material,
    ];
  });
  adjustedBranches.forEach(([start, end, radiusStart, radiusEnd, material]) => {
    group.add(makeBranchSegment(start, end, radiusStart, radiusEnd, material));
  });

  const roots = [
    [new THREE.Vector3(0, 0.18, 0), new THREE.Vector3(-0.72, 0.02, 0.14)],
    [new THREE.Vector3(0, 0.16, 0), new THREE.Vector3(0.72, 0.02, -0.06)],
    [new THREE.Vector3(0.04, 0.14, 0), new THREE.Vector3(0.1, 0.02, 0.6)],
  ];
  roots.forEach(([start, end]) => {
    group.add(makeBranchSegment(start, end, 0.22, 0.035, barkLight));
  });

  const rootFlare = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.34, 0.44, 16),
    bark
  );
  rootFlare.position.y = 0.19;
  group.add(rootFlare);

  const leafGeometry = makeMapleLeafGeometry();
  const canopyCenters = (main
    ? [
      [-2.55, 2.78, 0.02, 0.76], [-1.65, 2.94, -0.12, 0.84], [-0.72, 2.86, 0.1, 0.88],
      [0.28, 2.98, -0.08, 0.9], [1.3, 2.82, 0.08, 0.84], [2.25, 3.02, -0.04, 0.72],
      [-2.85, 3.48, -0.08, 0.82], [-1.92, 3.58, 0.08, 0.9], [-0.9, 3.42, -0.04, 0.94],
      [0.14, 3.55, 0.12, 0.96], [1.18, 3.46, -0.1, 0.9], [2.25, 3.62, 0.05, 0.78],
      [-2.4, 4.38, 0.1, 0.84], [-1.65, 4.5, -0.12, 0.9], [-0.85, 4.55, 0.04, 0.92],
      [-0.05, 4.55, -0.1, 0.94], [0.78, 4.66, 0.06, 0.9], [1.58, 4.72, -0.08, 0.88],
      [2.4, 4.62, 0.08, 0.82], [3.0, 4.48, -0.08, 0.7], [-2.12, 5.12, 0.03, 0.86],
      [-1.3, 5.18, -0.08, 0.92], [-0.44, 5.2, 0.12, 0.94], [0.42, 5.22, -0.04, 0.96],
      [1.28, 5.26, 0.08, 0.92], [2.14, 5.18, -0.1, 0.84], [2.86, 5.08, 0.04, 0.7],
      [-1.82, 5.82, 0.04, 0.78], [-1.0, 5.9, -0.08, 0.88], [-0.1, 5.96, 0.1, 0.9],
      [0.82, 5.92, -0.04, 0.88], [1.72, 5.86, 0.06, 0.8], [2.42, 5.72, -0.08, 0.66],
      [-1.35, 6.48, 0.02, 0.7], [-0.5, 6.55, -0.06, 0.78], [0.38, 6.58, 0.08, 0.78],
      [1.2, 6.48, -0.02, 0.68],
    ]
    : [
      [-1.72, 2.62, 0.02, 0.7], [-0.88, 2.86, -0.08, 0.8], [-0.04, 2.7, 0.06, 0.84],
      [0.78, 2.92, -0.05, 0.76], [-1.95, 3.38, -0.08, 0.78], [-1.02, 3.52, 0.06, 0.86],
      [-0.12, 3.34, -0.04, 0.9], [0.78, 3.5, 0.08, 0.8],
      [-1.45, 4.15, 0, 0.84], [-0.65, 4.35, 0.04, 0.9], [0.18, 4.2, -0.03, 0.88],
      [0.98, 4.4, 0.06, 0.82], [-1.0, 5.0, -0.04, 0.8], [-0.12, 5.15, 0.02, 0.86],
      [0.78, 5.05, 0.08, 0.78], [-0.55, 5.86, -0.02, 0.72], [0.35, 5.82, 0.04, 0.68],
    ])
    .filter((_, index) => main || leafDensity >= 0.9 || ((index + seed) % 10) / 10 < leafDensity)
    .map(([x, y, z, clusterScale], index) => [
      x * spread + branchSkew,
      y * heightFactor,
      z + Math.sin(index + seed) * 0.035,
      clusterScale * (0.9 + ((index + seed) % 4) * 0.045),
    ]);

  canopyCenters.forEach(([x, y, z, clusterScale], clusterIndex) => {
    const cluster = new THREE.Group();
    cluster.position.set(x, y, z);
    cluster.rotation.set(0, clusterIndex * 0.7, (clusterIndex % 2 ? 1 : -1) * 0.08);
    cluster.userData.windPhase = clusterIndex * 0.48 + position.x + seed;
    cluster.userData.baseRotation = cluster.rotation.clone();
    windGroups.push(cluster);

    const leafCount = Math.max(18, Math.round((main ? 26 : 22) * (0.92 + leafDensity * 0.08)));
    for (let index = 0; index < leafCount; index += 1) {
      const leaf = new THREE.Mesh(
        leafGeometry,
        leafMaterials[(clusterIndex + index) % leafMaterials.length]
      );
      const angle = (index / leafCount) * Math.PI * 2;
      const radius = 0.18 + (index % 7) * 0.12;
      leaf.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle * 1.7) * (0.18 + (index % 3) * 0.06),
        Math.sin(angle) * (0.18 + (index % 4) * 0.045)
      );
      leaf.scale.setScalar(clusterScale * (0.58 + (index % 7) * 0.055));
      leaf.rotation.set(
        -0.2 + Math.sin(index * 1.9) * 0.28,
        angle + clusterIndex * 0.2,
        Math.cos(index * 1.4) * 0.24
      );
      leaf.castShadow = main && index % 3 === 0;
      leaf.receiveShadow = true;
      cluster.add(leaf);
    }
    group.add(cluster);
  });

  group.position.copy(position);
  group.scale.setScalar(scale);

  group.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = main;
      node.receiveShadow = true;
    }
  });

  const hitSegments = adjustedBranches.map(([start, end, radiusStart]) => ({
    start: new THREE.Vector2(
      position.x + start.x * scale,
      position.y + start.y * scale
    ),
    end: new THREE.Vector2(
      position.x + end.x * scale,
      position.y + end.y * scale
    ),
    z: position.z + ((start.z + end.z) * 0.5) * scale,
    radius: radiusStart * scale + 0.1,
  }));

  return {
    group,
    hitSegments,
    windGroups,
    sleepX: position.x + (0.62 * trunkFactor + 0.52) * scale,
    sleepZ: position.z,
    collider: {
      x: position.x,
      z: position.z,
      radius: 0.62 * trunkFactor * scale,
    },
    canopyBounds: {
      left: position.x - 3.0 * scale,
      right: position.x + 3.6 * scale,
      bottom: position.y + 3.9 * scale,
      top: position.y + 7.45 * scale,
      depth: 1.1 * scale,
    },
  };
}

function makeBranchSegment(start, end, radiusStart, radiusEnd, material) {
  const direction = end.clone().sub(start);
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radiusEnd, radiusStart, direction.length(), 12),
    material
  );
  mesh.position.copy(start).addScaledVector(direction, 0.5);
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.normalize()
  );
  return mesh;
}

function makeMapleLeafGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.65);
  shape.lineTo(0.12, 0.2);
  shape.lineTo(0.45, 0.38);
  shape.lineTo(0.25, 0.06);
  shape.lineTo(0.56, -0.03);
  shape.lineTo(0.14, -0.13);
  shape.lineTo(0.24, -0.52);
  shape.lineTo(0, -0.24);
  shape.lineTo(-0.24, -0.52);
  shape.lineTo(-0.14, -0.13);
  shape.lineTo(-0.56, -0.03);
  shape.lineTo(-0.25, 0.06);
  shape.lineTo(-0.45, 0.38);
  shape.lineTo(-0.12, 0.2);
  shape.closePath();

  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.035,
    bevelEnabled: false,
  });
}

function makeYarnBall() {
  const group = new THREE.Group();
  const red = new THREE.MeshStandardMaterial({
    color: 0xc93838,
    roughness: 0.68,
    metalness: 0.02,
  });
  const thread = new THREE.MeshStandardMaterial({
    color: 0xf3a3a0,
    roughness: 0.7,
  });

  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.28, 28, 20), red);
  ball.castShadow = true;
  group.add(ball);

  const pickMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.43, 16, 12),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
  );
  group.add(pickMesh);

  const ringGeometry = new THREE.TorusGeometry(0.248, 0.011, 8, 36);
  const ringRotations = [
    [0.35, 0.2, 0.1],
    [1.48, -0.45, 0.55],
    [0.85, 1.15, -0.42],
  ];

  ringRotations.forEach(([x, y, z]) => {
    const ring = new THREE.Mesh(ringGeometry, thread);
    ring.rotation.set(x, y, z);
    group.add(ring);
  });

  const tailGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0.16, -0.18, 0.03),
    new THREE.Vector3(0.37, -0.34, 0.02),
    new THREE.Vector3(0.24, -0.52, 0.01),
  ]);
  const tail = new THREE.Line(
    tailGeometry,
    new THREE.LineBasicMaterial({ color: 0xc93838 })
  );
  group.add(tail);

  return {
    group,
    pickMesh,
  };
}

function updateYarn(yarn, point, elapsed, rollSpeed) {
  yarn.group.position.copy(point);
  yarn.group.rotation.set(
    Math.sin(elapsed * 0.9) * 0.08,
    elapsed * 0.55 + rollSpeed * 0.8,
    Math.cos(elapsed * 0.7) * 0.08
  );
}

function makeCat() {
  const root = new THREE.Group();
  const orange = new THREE.MeshStandardMaterial({
    color: 0x9098a1,
    roughness: 0.9,
  });
  const cream = new THREE.MeshStandardMaterial({
    color: 0xd9d8d2,
    roughness: 0.94,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: 0x242b32,
    roughness: 0.9,
  });
  const eyeColor = new THREE.MeshStandardMaterial({
    color: 0xd99a3e,
    roughness: 0.42,
    metalness: 0.02,
  });
  const pink = new THREE.MeshStandardMaterial({
    color: 0xe88a84,
    roughness: 0.9,
  });

  const awake = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.56, 32, 24), orange);
  body.scale.set(1.24, 0.78, 0.76);
  body.position.set(-0.16, 0.78, 0);
  awake.add(body);

  const shoulder = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 28, 20),
    orange
  );
  shoulder.scale.set(0.74, 0.88, 0.74);
  shoulder.position.set(0.3, 0.9, 0);
  awake.add(shoulder);

  const stripeMaterial = new THREE.MeshStandardMaterial({
    color: 0x4f5860,
    roughness: 0.9,
  });
  [-0.5, -0.22, 0.06].forEach((x) => {
    const stripe = new THREE.Mesh(
      new THREE.TorusGeometry(0.36, 0.018, 10, 24),
      stripeMaterial
    );
    stripe.position.set(x, 0.8, 0);
    stripe.rotation.y = Math.PI / 2;
    stripe.scale.set(1.12, 0.82, 0.82);
    awake.add(stripe);
  });

  const chest = new THREE.Mesh(new THREE.SphereGeometry(0.31, 24, 18), cream);
  chest.scale.set(0.75, 1.12, 0.75);
  chest.position.set(0.31, 0.79, 0);
  awake.add(chest);

  const neck = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 18), orange);
  neck.scale.set(0.82, 1.08, 0.86);
  neck.position.set(0.37, 1.04, 0);
  awake.add(neck);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 24), orange);
  head.position.set(0.54, 1.27, 0);
  awake.add(head);

  const muzzles = [-0.12, 0.12].map((z) => {
    const muzzle = new THREE.Mesh(
      new THREE.SphereGeometry(0.17, 24, 18),
      cream
    );
    muzzle.scale.set(1.18, 0.78, 0.8);
    muzzle.position.set(0.86, 1.16, z);
    awake.add(muzzle);
    return muzzle;
  });

  const ears = [
    [0.45, 1.6, -0.23, -0.18],
    [0.45, 1.6, 0.23, 0.18],
  ];
  ears.forEach(([x, y, z, rotation]) => {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.38, 16), orange);
    ear.scale.z = 0.72;
    ear.position.set(x, y, z);
    ear.rotation.set(0, 0, rotation);
    awake.add(ear);

    const innerEar = new THREE.Mesh(
      new THREE.ConeGeometry(0.09, 0.2, 16),
      pink
    );
    innerEar.scale.z = 0.66;
    innerEar.position.set(x + 0.045, y - 0.005, z);
    innerEar.rotation.set(0, 0, rotation);
    awake.add(innerEar);
  });

  const eyeWhites = [
    [0.87, 1.33, -0.16],
    [0.87, 1.33, 0.16],
  ];
  const pupils = [];
  eyeWhites.forEach(([x, y, z]) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.09, 24, 18), eyeColor);
    eye.scale.set(1, 1.08, 0.56);
    eye.position.set(x, y, z);
    awake.add(eye);

    const pupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 20, 14),
      dark
    );
    pupil.scale.set(0.42, 1.6, 0.48);
    pupil.position.set(x + 0.057, y, z);
    awake.add(pupil);
    pupils.push(pupil);
  });

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.045, 20, 16), pink);
  nose.scale.set(1.1, 0.72, 0.8);
  nose.position.set(0.96, 1.19, 0);
  awake.add(nose);

  const mouth = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0.96, 1.17, -0.02),
      new THREE.Vector3(0.93, 1.1, -0.08),
      new THREE.Vector3(0.96, 1.17, 0.02),
      new THREE.Vector3(0.93, 1.1, 0.08),
    ]),
    new THREE.LineBasicMaterial({ color: 0x5a2c25 })
  );
  awake.add(mouth);

  const whiskers = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0.93, 1.17, -0.03),
      new THREE.Vector3(1.24, 1.1, -0.3),
      new THREE.Vector3(0.93, 1.2, -0.03),
      new THREE.Vector3(1.28, 1.24, -0.24),
      new THREE.Vector3(0.93, 1.17, 0.03),
      new THREE.Vector3(1.24, 1.1, 0.3),
      new THREE.Vector3(0.93, 1.2, 0.03),
      new THREE.Vector3(1.28, 1.24, 0.24),
    ]),
    new THREE.LineBasicMaterial({ color: 0x6d5146 })
  );
  awake.add(whiskers);

  const legs = [
    makeLeg(0.35, -0.3, orange),
    makeLeg(0.35, 0.3, orange),
    makeLeg(-0.5, -0.3, orange),
    makeLeg(-0.5, 0.3, orange),
  ];
  legs.forEach((leg) => awake.add(leg));

  const happyFace = makeHappyFace();
  awake.add(happyFace.group);

  const tailPivot = new THREE.Group();
  const tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.67, 0.9, 0),
    new THREE.Vector3(-1.1, 1.02, 0),
    new THREE.Vector3(-1.44, 1.42, 0.08),
    new THREE.Vector3(-1.19, 1.69, 0.1),
  ]);
  const tail = new THREE.Mesh(
    new THREE.TubeGeometry(tailCurve, 20, 0.08, 8, false),
    orange
  );
  tailPivot.add(tail);
  awake.add(tailPivot);
  awake.scale.setScalar(0.96);

  const sleeping = new THREE.Group();
  const sleepingBody = new THREE.Mesh(
    new THREE.SphereGeometry(0.58, 24, 18),
    orange
  );
  sleepingBody.scale.set(1.3, 0.64, 0.92);
  sleepingBody.position.set(0, 0.43, 0);
  sleeping.add(sleepingBody);

  const sleepingHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 20, 16),
    orange
  );
  sleepingHead.scale.set(0.95, 0.74, 0.82);
  sleepingHead.position.set(-0.65, 0.55, 0.07);
  sleeping.add(sleepingHead);

  [
    [-0.79, 0.79, -0.17, -0.38],
    [-0.5, 0.79, 0.2, 0.32],
  ].forEach(([x, y, z, rotation]) => {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.25, 4), orange);
    ear.position.set(x, y, z);
    ear.rotation.z = rotation;
    sleeping.add(ear);
  });

  const sleepEyes = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.86, 0.58, -0.22),
      new THREE.Vector3(-0.72, 0.53, -0.22),
      new THREE.Vector3(-0.86, 0.58, 0.22),
      new THREE.Vector3(-0.72, 0.53, 0.22),
    ]),
    new THREE.LineBasicMaterial({ color: 0x4a312a })
  );
  sleeping.add(sleepEyes);

  const sleepingTail = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.5, 0.37, 0),
        new THREE.Vector3(0.98, 0.18, 0.06),
        new THREE.Vector3(1.0, 0.7, 0.1),
        new THREE.Vector3(0.52, 0.88, 0.06),
      ]),
      24,
      0.085,
      8,
      false
    ),
    orange
  );
  sleeping.add(sleepingTail);

  const zzz = makeTextSprite("Zzz", "#a0554b");
  zzz.position.set(0.55, 1.36, 0);
  zzz.scale.set(0.9, 0.45, 1);
  sleeping.add(zzz);
  sleeping.visible = false;
  sleeping.scale.setScalar(0.9);

  const hearts = makeHeartSet();
  hearts.group.visible = false;

  root.add(awake, sleeping, hearts.group);
  root.position.set(-2.15, 0, 0);
  root.scale.setScalar(0.74);

  root.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });

  return {
    root,
    awake,
    sleeping,
    body,
    legs,
    frontLegs: legs.slice(0, 2),
    tailPivot,
    pupils,
    head,
    muzzles,
    happyFace,
    hearts,
    zzz,
  };
}

function makeLeg(x, z, material) {
  const pivot = new THREE.Group();
  pivot.position.set(x, 0.67, z);
  const leg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.085, 0.11, 0.58, 16),
    material
  );
  leg.position.y = -0.28;
  pivot.add(leg);

  const paw = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 16), material);
  paw.scale.set(1.12, 0.57, 1);
  paw.position.set(0.055, -0.58, 0);
  pivot.add(paw);
  return pivot;
}

function makeTextSprite(label, color) {
  const source = document.createElement("canvas");
  source.width = 256;
  source.height = 128;
  const context = source.getContext("2d");
  context.font = "bold 72px Georgia";
  context.fillStyle = color;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(label, 128, 64);

  const texture = new THREE.CanvasTexture(source);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  return new THREE.Sprite(material);
}

function makeHappyFace() {
  const group = new THREE.Group();
  const faceMaterial = new THREE.LineBasicMaterial({ color: 0x3b211b });
  const cheekMaterial = new THREE.MeshStandardMaterial({
    color: 0xe88a84,
    roughness: 0.88,
    transparent: true,
    opacity: 0.78,
  });

  const closedEyes = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0.77, 1.35, 0.34),
      new THREE.Vector3(0.87, 1.3, 0.34),
      new THREE.Vector3(0.97, 1.3, 0.34),
      new THREE.Vector3(1.07, 1.35, 0.34),
    ]),
    faceMaterial
  );
  group.add(closedEyes);

  const smile = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0.86, 1.13, 0.37),
      new THREE.Vector3(0.93, 1.07, 0.38),
      new THREE.Vector3(1.0, 1.13, 0.37),
    ]),
    faceMaterial
  );
  group.add(smile);

  [-0.14, 0.14].forEach((z) => {
    const cheek = new THREE.Mesh(
      new THREE.SphereGeometry(0.065, 12, 8),
      cheekMaterial
    );
    cheek.scale.set(1.3, 0.68, 0.5);
    cheek.position.set(0.82, 1.14, z + 0.28);
    group.add(cheek);
  });

  group.visible = false;
  return { group };
}

function makeHeartSet() {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({
    color: 0xe45c66,
    emissive: 0x3b080d,
    emissiveIntensity: 0.58,
    roughness: 0.72,
    side: THREE.DoubleSide,
  });
  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, -0.18);
  heartShape.bezierCurveTo(-0.42, 0.08, -0.34, 0.38, 0, 0.18);
  heartShape.bezierCurveTo(0.34, 0.38, 0.42, 0.08, 0, -0.18);
  const geometry = new THREE.ExtrudeGeometry(heartShape, {
    depth: 0.045,
    bevelEnabled: true,
    bevelSize: 0.018,
    bevelThickness: 0.012,
    bevelSegments: 2,
  });
  const items = [
    { x: 0.12, y: 2.08, z: 0.28, scale: 0.38, phase: 0.1 },
    { x: 0.86, y: 1.86, z: 0.18, scale: 0.27, phase: 1.8 },
    { x: -0.72, y: 1.92, z: 0.16, scale: 0.23, phase: 3.2 },
    { x: 0.48, y: 2.38, z: 0.08, scale: 0.19, phase: 4.3 },
  ].map((config) => {
    const heart = new THREE.Mesh(geometry, material);
    heart.position.set(config.x, config.y, config.z);
    heart.scale.setScalar(config.scale);
    heart.userData = config;
    heart.castShadow = true;
    group.add(heart);
    return heart;
  });
  return { group, items };
}

function updateCat(cat, state) {
  const {
    delta,
    elapsed,
    mode,
    yarnPoint,
    catPosition,
    catVelocity,
    catYaw,
    walkPhase,
  } = state;
  const sleeping = mode === "sleep";
  const playing = mode === "play";
  const moving = mode === "chase" && catVelocity.length() > 0.035;
  const joyful = playing;

  cat.root.position.x = catPosition.x;
  cat.root.position.z = catPosition.z;
  cat.root.rotation.y = catYaw;
  cat.awake.visible = !sleeping;
  cat.sleeping.visible = sleeping;
  cat.happyFace.group.visible = joyful;
  cat.hearts.group.visible = joyful;

  if (sleeping) {
    cat.sleeping.rotation.z = Math.sin(elapsed * 1.6) * 0.02;
    cat.zzz.position.y = 1.36 + Math.sin(elapsed * 1.3) * 0.07;
    return;
  }

  cat.awake.rotation.y = 0;
  const bob = moving ? Math.sin(walkPhase * 2) * 0.035 : 0;
  cat.body.position.y = 0.78 + bob;
  cat.head.position.y = 1.27 + bob + (joyful ? Math.sin(elapsed * 8) * 0.025 : 0);
  cat.muzzles.forEach((muzzle) => {
    muzzle.position.y = 1.16 + bob;
  });
  cat.head.rotation.z = joyful ? Math.sin(elapsed * 4.2) * 0.06 : 0;
  cat.tailPivot.rotation.z = Math.sin(elapsed * 3.2) * (moving ? 0.18 : 0.09);

  const stride = moving ? 0.5 : 0.08;
  cat.legs.forEach((leg, index) => {
    const offset = index % 2 === 0 ? 0 : Math.PI;
    leg.rotation.z = Math.sin(walkPhase * 2.3 + offset) * stride;
  });
  cat.frontLegs.forEach((leg, index) => {
    leg.rotation.x = playing
      ? Math.sin(elapsed * 8 + index * Math.PI) * 0.2 - 0.2
      : 0;
    leg.rotation.z += playing
      ? Math.cos(elapsed * 8 + index * Math.PI) * 0.12
      : 0;
  });

  const verticalLook = THREE.MathUtils.clamp(
    (yarnPoint.y - 1.15) * 0.05,
    -0.035,
    0.05
  );
  cat.pupils.forEach((pupil, index) => {
    pupil.position.y = 1.33 + bob + verticalLook;
    pupil.position.z = (index === 0 ? -0.16 : 0.16) + (yarnPoint.z * 0.06);
  });

  cat.hearts.items.forEach((heart) => {
    const { x, y, phase } = heart.userData;
    const travel = (elapsed * 0.24 + phase * 0.06) % 1;
    heart.position.x = x + Math.sin(elapsed * 1.5 + phase) * 0.08;
    heart.position.y = y + travel * 0.72;
    heart.position.z = 0.12 + Math.cos(elapsed * 1.2 + phase) * 0.04;
    heart.rotation.z = Math.sin(elapsed * 1.7 + phase) * 0.14;
    heart.scale.setScalar(heart.userData.scale * (0.88 + Math.sin(elapsed * 4 + phase) * 0.1));
  });

  cat.root.position.y = THREE.MathUtils.damp(
    cat.root.position.y,
    0,
    14,
    delta
  );
}

function getCatTravelTarget(start, target, colliders, navigation, mode) {
  const goalMoved = navigation.goal.distanceToSquared(target) > 2.2 * 2.2;
  if (navigation.mode !== mode || goalMoved) {
    navigation.mode = mode;
    navigation.goal.copy(target);
    navigation.hasWaypoint = false;
    navigation.hasAvoidPoint = false;
  }

  if (navigation.hasWaypoint && start.distanceTo(navigation.waypoint) < 0.34) {
    navigation.lastWaypoint.copy(navigation.waypoint);
    navigation.hasWaypoint = false;
    navigation.hasAvoidPoint = true;
  }

  if (!navigation.hasWaypoint) {
    const waypoint = findCatWaypoint(
      start,
      target,
      colliders,
      navigation.hasAvoidPoint ? navigation.lastWaypoint : null
    );
    if (waypoint) {
      navigation.waypoint.copy(waypoint);
      navigation.hasWaypoint = true;
      navigation.hasAvoidPoint = false;
    }
  }

  return navigation.hasWaypoint ? navigation.waypoint : target;
}

function findCatWaypoint(start, target, colliders, avoidPoint) {
  const blocker = colliders.find((collider) => (
    segmentHitsCatCollider(start, target, collider)
  ));
  if (!blocker) return null;

  const routeRadius = blocker.radius + 0.42 + 0.24;
  const goalAngle = Math.atan2(target.z - blocker.z, target.x - blocker.x);
  let bestPoint = null;
  let bestScore = Infinity;

  for (let index = 0; index < 18; index += 1) {
    const angle = goalAngle + (index / 18) * Math.PI * 2;
    const candidate = new THREE.Vector3(
      blocker.x + Math.cos(angle) * routeRadius,
      0,
      blocker.z + Math.sin(angle) * routeRadius
    );
    if (avoidPoint && candidate.distanceTo(avoidPoint) < 0.82) continue;
    if (colliders.some((collider) => (
      Math.hypot(candidate.x - collider.x, candidate.z - collider.z) < collider.radius + 0.54
    ))) {
      continue;
    }
    if (colliders.some((collider) => segmentHitsCatCollider(start, candidate, collider))) {
      continue;
    }

    const remainingBlocked = colliders.some((collider) => (
      segmentHitsCatCollider(candidate, target, collider)
    ));
    const score = start.distanceTo(candidate) + candidate.distanceTo(target)
      + (remainingBlocked ? 2.8 : 0);
    if (score < bestScore) {
      bestScore = score;
      bestPoint = candidate;
    }
  }

  return bestPoint;
}

function segmentHitsCatCollider(start, target, collider) {
  const deltaX = target.x - start.x;
  const deltaZ = target.z - start.z;
  const lengthSquared = deltaX * deltaX + deltaZ * deltaZ;
  const projection = lengthSquared > 0.0001
    ? THREE.MathUtils.clamp(
      ((collider.x - start.x) * deltaX + (collider.z - start.z) * deltaZ) / lengthSquared,
      0,
      1
    )
    : 0;
  const closestX = start.x + deltaX * projection;
  const closestZ = start.z + deltaZ * projection;
  return Math.hypot(closestX - collider.x, closestZ - collider.z) < collider.radius + 0.42;
}

function resolveCatPosition(position, colliders) {
  const catRadius = 0.42;
  for (let pass = 0; pass < 2; pass += 1) {
    colliders.forEach((collider) => {
      const dx = position.x - collider.x;
      const dz = position.z - collider.z;
      const distance = Math.hypot(dx, dz);
      const minimumDistance = collider.radius + catRadius;
      if (distance >= minimumDistance) return;

      if (distance < 0.001) {
        position.x = collider.x + minimumDistance;
        position.z = collider.z;
        return;
      }

      const push = minimumDistance - distance;
      position.x += (dx / distance) * push;
      position.z += (dz / distance) * push;
    });
  }
}

function isOnBranchSupport(point, tree) {
  const position = new THREE.Vector2(point.x, point.y);

  return tree.hitSegments.some((segment) => (
    distanceToSegment(position, segment.start, segment.end) < segment.radius + 0.24 &&
    Math.abs(point.z - segment.z) < segment.radius + 0.3 &&
    point.y > 0.45
  ));
}

function isOnTree(point, tree) {
  const position = new THREE.Vector2(point.x, point.y);

  return isOnBranchSupport(point, tree) || (
    point.x >= tree.canopyBounds.left &&
    point.x <= tree.canopyBounds.right &&
    point.y >= tree.canopyBounds.bottom &&
    point.y <= tree.canopyBounds.top &&
    Math.abs(point.z - tree.collider.z) <= tree.canopyBounds.depth
  );
}

function distanceToSegment(point, start, end) {
  const segment = end.clone().sub(start);
  const lengthSquared = segment.lengthSq();
  if (!lengthSquared) return point.distanceTo(start);

  const projection = THREE.MathUtils.clamp(
    point.clone().sub(start).dot(segment) / lengthSquared,
    0,
    1
  );
  return point.distanceTo(start.clone().addScaledVector(segment, projection));
}
