// Three.js 3D Gaming Scene
import * as THREE from 'three';
import gsap from 'gsap';

export class GameScene3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.mouse = { x: 0, y: 0 };
        this.objects = [];
        this.particles = [];
        this.clock = new THREE.Clock();
        this.raycaster = new THREE.Raycaster();
        this.hoveredObject = null;

        this.init();
        this.createGamingObjects();
        this.createParticleField();
        this.animate();

        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('click', () => {
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.objects);
            if (intersects.length > 0) {
                const obj = intersects[0].object;
                gsap.to(obj.rotation, {
                    x: obj.rotation.x + Math.PI * 2,
                    y: obj.rotation.y + Math.PI * 2,
                    duration: 1.2,
                    ease: "back.out(1.5)"
                });
            }
        });
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(60, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.camera.position.z = 12;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
        this.scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x00f0ff, 2, 30);
        pointLight1.position.set(5, 5, 5);
        this.scene.add(pointLight1);
        this.pointLight1 = pointLight1;

        const pointLight2 = new THREE.PointLight(0xa855f7, 2, 30);
        pointLight2.position.set(-5, -5, 5);
        this.scene.add(pointLight2);
        this.pointLight2 = pointLight2;

        const pointLight3 = new THREE.PointLight(0xec4899, 1.5, 25);
        pointLight3.position.set(0, 3, -5);
        this.scene.add(pointLight3);
    }

    createGamingObjects() {
        const glowCyan = new THREE.MeshPhongMaterial({
            color: 0x00f0ff,
            emissive: 0x00f0ff,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.85,
            shininess: 100,
        });

        const glowPurple = new THREE.MeshPhongMaterial({
            color: 0xa855f7,
            emissive: 0xa855f7,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.85,
            shininess: 100,
        });

        const glowPink = new THREE.MeshPhongMaterial({
            color: 0xec4899,
            emissive: 0xec4899,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.8,
            shininess: 100,
        });

        const wireframeCyan = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            wireframe: true,
            transparent: true,
            opacity: 0.3,
        });

        const wireframePurple = new THREE.MeshBasicMaterial({
            color: 0xa855f7,
            wireframe: true,
            transparent: true,
            opacity: 0.3,
        });

        // 1. D20 Die (Icosahedron) — classic gaming dice
        const d20 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 0), glowCyan);
        d20.position.set(-5, 3, -2);
        d20.userData = { rotSpeed: { x: 0.008, y: 0.012 }, floatSpeed: 1.2, floatAmp: 0.5, origY: 3 };
        this.scene.add(d20);
        this.objects.push(d20);

        // 2. Crystal / Gem (Octahedron)
        const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.9, 0), glowPurple);
        crystal.position.set(5.5, -1, -1);
        crystal.userData = { rotSpeed: { x: 0.015, y: 0.01 }, floatSpeed: 0.8, floatAmp: 0.6, origY: -1 };
        this.scene.add(crystal);
        this.objects.push(crystal);

        // 3. Power-Up Star (custom from Dodecahedron)
        const star = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8, 0), glowPink);
        star.position.set(-4, -3.5, 0);
        star.userData = { rotSpeed: { x: 0.01, y: 0.015 }, floatSpeed: 1.5, floatAmp: 0.4, origY: -3.5 };
        this.scene.add(star);
        this.objects.push(star);

        // 4. Wireframe Sphere — looks like a planet/world
        const planet = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 16), wireframeCyan);
        planet.position.set(4.5, 3.5, -3);
        planet.userData = { rotSpeed: { x: 0.003, y: 0.005 }, floatSpeed: 0.6, floatAmp: 0.3, origY: 3.5 };
        this.scene.add(planet);
        this.objects.push(planet);

        // 5. Torus — portal ring
        const torus = new THREE.Mesh(new THREE.TorusGeometry(1, 0.25, 16, 32), glowCyan.clone());
        torus.material.opacity = 0.6;
        torus.position.set(0, -4, -2);
        torus.userData = { rotSpeed: { x: 0.02, y: 0.005 }, floatSpeed: 1.0, floatAmp: 0.5, origY: -4 };
        this.scene.add(torus);
        this.objects.push(torus);

        // 6. Wireframe Box — game block/crate
        const crate = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), wireframePurple);
        crate.position.set(-6, 0, -1);
        crate.userData = { rotSpeed: { x: 0.012, y: 0.008 }, floatSpeed: 0.9, floatAmp: 0.4, origY: 0 };
        this.scene.add(crate);
        this.objects.push(crate);

        // 7. Cone — projectile / arrow
        const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.5, 4), glowCyan.clone());
        arrow.material.opacity = 0.7;
        arrow.position.set(6, 1, 0);
        arrow.userData = { rotSpeed: { x: 0.01, y: 0.02 }, floatSpeed: 1.3, floatAmp: 0.6, origY: 1 };
        this.scene.add(arrow);
        this.objects.push(arrow);

        // 8. Small wireframe torus knot — magical item
        const knot = new THREE.Mesh(
            new THREE.TorusKnotGeometry(0.6, 0.2, 64, 8),
            new THREE.MeshBasicMaterial({ color: 0xec4899, wireframe: true, transparent: true, opacity: 0.4 })
        );
        knot.position.set(-2, 5, -3);
        knot.userData = { rotSpeed: { x: 0.007, y: 0.013 }, floatSpeed: 0.7, floatAmp: 0.3, origY: 5 };
        this.scene.add(knot);
        this.objects.push(knot);

        // 9. Capsule — health pickup
        const capsule = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.4, 1, 8, 16),
            glowPurple.clone()
        );
        capsule.material.opacity = 0.7;
        capsule.position.set(3, -3, 1);
        capsule.userData = { rotSpeed: { x: 0.015, y: 0.008 }, floatSpeed: 1.1, floatAmp: 0.5, origY: -3 };
        this.scene.add(capsule);
        this.objects.push(capsule);

        // 10. Ring — coin
        const ring = new THREE.Mesh(
            new THREE.RingGeometry(0.5, 0.8, 32),
            new THREE.MeshPhongMaterial({ color: 0xfbbf24, emissive: 0xfbbf24, emissiveIntensity: 0.4, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
        );
        ring.position.set(-3, -1.5, 1);
        ring.userData = { rotSpeed: { x: 0.02, y: 0.01 }, floatSpeed: 1.4, floatAmp: 0.4, origY: -1.5 };
        this.scene.add(ring);
        this.objects.push(ring);
    }

    createParticleField() {
        const count = 200;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const cyan = new THREE.Color(0x00f0ff);
        const purple = new THREE.Color(0xa855f7);
        const pink = new THREE.Color(0xec4899);
        const colorsArr = [cyan, purple, pink];

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 30;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;

            const c = colorsArr[Math.floor(Math.random() * colorsArr.length)];
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const mat = new THREE.PointsMaterial({
            size: 0.06,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true,
        });

        this.particleSystem = new THREE.Points(geo, mat);
        this.scene.add(this.particleSystem);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = this.clock.getElapsedTime();

        // Animate objects
        this.objects.forEach(obj => {
            const d = obj.userData;
            obj.rotation.x += d.rotSpeed.x;
            obj.rotation.y += d.rotSpeed.y;
            obj.position.y = d.origY + Math.sin(time * d.floatSpeed) * d.floatAmp;
        });

        // Animate particles
        if (this.particleSystem) {
            this.particleSystem.rotation.y = time * 0.02;
            this.particleSystem.rotation.x = Math.sin(time * 0.01) * 0.1;
        }

        // Move lights subtly with mouse
        this.pointLight1.position.x = 5 + this.mouse.x * 3;
        this.pointLight1.position.y = 5 + this.mouse.y * 3;
        this.pointLight2.position.x = -5 + this.mouse.x * 2;
        this.pointLight2.position.y = -5 + this.mouse.y * 2;

        // Hover Logic (Raycaster)
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.objects);

        if (intersects.length > 0) {
            const obj = intersects[0].object;
            if (this.hoveredObject !== obj) {
                if (this.hoveredObject) {
                    gsap.to(this.hoveredObject.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
                    if (this.hoveredObject.material.emissiveIntensity !== undefined) {
                        gsap.to(this.hoveredObject.material, { emissiveIntensity: 0.3, duration: 0.3 });
                    }
                }
                this.hoveredObject = obj;
                gsap.to(obj.scale, { x: 1.25, y: 1.25, z: 1.25, duration: 0.3, ease: 'back.out(1.2)' });
                if (obj.material.emissiveIntensity !== undefined) {
                    gsap.to(obj.material, { emissiveIntensity: 0.8, duration: 0.3 });
                }
            }
        } else {
            if (this.hoveredObject) {
                gsap.to(this.hoveredObject.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
                if (this.hoveredObject.material.emissiveIntensity !== undefined) {
                    gsap.to(this.hoveredObject.material, { emissiveIntensity: 0.3, duration: 0.3 });
                }
                this.hoveredObject = null;
            }
        }

        // Subtle camera movement with mouse
        this.camera.position.x += (this.mouse.x * 0.8 - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.mouse.y * 0.5 - this.camera.position.y) * 0.02;
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        if (!this.container) return;
        const w = this.container.clientWidth;
        const h = this.container.clientHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    }
}

// Mini floating 3D scene for section dividers
export class MiniScene3D {
    constructor(containerId, type = 'default') {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.clock = new THREE.Clock();
        this.type = type;

        this.init();
        this.createObjects();
        this.animate();

        window.addEventListener('resize', () => this.onResize());
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, this.container.clientWidth / this.container.clientHeight, 0.1, 100);
        this.camera.position.z = 6;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        const light1 = new THREE.PointLight(0x00f0ff, 2, 20);
        light1.position.set(3, 3, 3);
        this.scene.add(light1);

        const light2 = new THREE.PointLight(0xa855f7, 2, 20);
        light2.position.set(-3, -2, 3);
        this.scene.add(light2);

        this.scene.add(new THREE.AmbientLight(0x404060, 0.3));
    }

    createObjects() {
        this.meshes = [];

        if (this.type === 'swords') {
            // Crossed swords — two cones
            const mat = new THREE.MeshPhongMaterial({
                color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.3,
                transparent: true, opacity: 0.8
            });
            const sword1 = new THREE.Mesh(new THREE.ConeGeometry(0.15, 3, 4), mat);
            sword1.rotation.z = Math.PI / 6;
            sword1.position.x = -0.5;
            this.scene.add(sword1);
            this.meshes.push(sword1);

            const sword2 = new THREE.Mesh(new THREE.ConeGeometry(0.15, 3, 4), mat.clone());
            sword2.material.color.set(0xa855f7);
            sword2.material.emissive.set(0xa855f7);
            sword2.rotation.z = -Math.PI / 6;
            sword2.position.x = 0.5;
            this.scene.add(sword2);
            this.meshes.push(sword2);

            // Shield — torus
            const shield = new THREE.Mesh(
                new THREE.TorusGeometry(0.8, 0.15, 8, 6),
                new THREE.MeshPhongMaterial({ color: 0xfbbf24, emissive: 0xfbbf24, emissiveIntensity: 0.3, transparent: true, opacity: 0.6 })
            );
            shield.position.z = 0.5;
            this.scene.add(shield);
            this.meshes.push(shield);

        } else if (this.type === 'gems') {
            // Cluster of gems
            const colors = [0x00f0ff, 0xa855f7, 0xec4899, 0x10b981, 0xfbbf24];
            for (let i = 0; i < 7; i++) {
                const geo = i % 2 === 0 ? new THREE.OctahedronGeometry(0.3 + Math.random() * 0.3, 0) : new THREE.IcosahedronGeometry(0.25 + Math.random() * 0.2, 0);
                const mat = new THREE.MeshPhongMaterial({
                    color: colors[i % colors.length],
                    emissive: colors[i % colors.length],
                    emissiveIntensity: 0.3,
                    transparent: true,
                    opacity: 0.8,
                });
                const gem = new THREE.Mesh(geo, mat);
                gem.position.set(
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2
                );
                gem.userData = { rotX: (Math.random() - 0.5) * 0.03, rotY: (Math.random() - 0.5) * 0.03, origY: gem.position.y, floatSpeed: 0.5 + Math.random() };
                this.scene.add(gem);
                this.meshes.push(gem);
            }

        } else if (this.type === 'portal') {
            // Spinning portal ring
            const torus = new THREE.Mesh(
                new THREE.TorusGeometry(1.5, 0.08, 16, 64),
                new THREE.MeshPhongMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.5, transparent: true, opacity: 0.7 })
            );
            this.scene.add(torus);
            this.meshes.push(torus);

            const torus2 = new THREE.Mesh(
                new THREE.TorusGeometry(1.2, 0.06, 16, 64),
                new THREE.MeshPhongMaterial({ color: 0xa855f7, emissive: 0xa855f7, emissiveIntensity: 0.5, transparent: true, opacity: 0.6 })
            );
            torus2.rotation.x = Math.PI / 3;
            this.scene.add(torus2);
            this.meshes.push(torus2);

            const torus3 = new THREE.Mesh(
                new THREE.TorusGeometry(0.9, 0.04, 16, 64),
                new THREE.MeshPhongMaterial({ color: 0xec4899, emissive: 0xec4899, emissiveIntensity: 0.5, transparent: true, opacity: 0.5 })
            );
            torus3.rotation.x = -Math.PI / 4;
            torus3.rotation.y = Math.PI / 5;
            this.scene.add(torus3);
            this.meshes.push(torus3);

            // Core glow
            const core = new THREE.Mesh(
                new THREE.SphereGeometry(0.3, 16, 16),
                new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })
            );
            this.scene.add(core);
            this.meshes.push(core);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const time = this.clock.getElapsedTime();

        if (this.type === 'swords') {
            this.meshes.forEach((m, i) => {
                m.rotation.y = Math.sin(time * 0.5 + i) * 0.3;
                m.position.y = Math.sin(time * 0.8 + i * 0.5) * 0.2;
            });
        } else if (this.type === 'gems') {
            this.meshes.forEach(m => {
                m.rotation.x += m.userData.rotX || 0.01;
                m.rotation.y += m.userData.rotY || 0.01;
                if (m.userData.origY !== undefined) {
                    m.position.y = m.userData.origY + Math.sin(time * (m.userData.floatSpeed || 1)) * 0.3;
                }
            });
        } else if (this.type === 'portal') {
            if (this.meshes[0]) this.meshes[0].rotation.z = time * 0.5;
            if (this.meshes[1]) { this.meshes[1].rotation.z = -time * 0.7; this.meshes[1].rotation.x = Math.PI / 3 + Math.sin(time * 0.3) * 0.2; }
            if (this.meshes[2]) { this.meshes[2].rotation.z = time * 0.9; this.meshes[2].rotation.y = Math.PI / 5 + Math.cos(time * 0.4) * 0.2; }
            if (this.meshes[3]) { this.meshes[3].scale.setScalar(0.3 + Math.sin(time * 2) * 0.1); }
        }

        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        if (!this.container) return;
        const w = this.container.clientWidth;
        const h = this.container.clientHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    }
}

// Tic-Tac-Toe 3D Victory/Defeat Particle Explosions
export class TicTacToe3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.clock = new THREE.Clock();
        this.particles = [];
        this.active = false;

        this.init();
        this.animate();
        window.addEventListener('resize', () => this.onResize());
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, this.container.clientWidth / this.container.clientHeight, 0.1, 100);
        this.camera.position.z = 10;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        const light = new THREE.PointLight(0xffffff, 2, 30);
        light.position.set(0, 5, 5);
        this.scene.add(light);
        this.scene.add(new THREE.AmbientLight(0x404060, 0.5));
    }

    playEffect(type) {
        this.resetEffect();
        this.active = true;

        let color1, color2, geometry;
        const count = 50;

        if (type === 'victory') {
            color1 = 0x00f0ff; // cyan
            color2 = 0xfbbf24; // gold
            geometry = new THREE.OctahedronGeometry(0.2, 0);
        } else if (type === 'defeat') {
            color1 = 0xec4899; // pink/red
            color2 = 0xa855f7; // purple
            geometry = new THREE.TetrahedronGeometry(0.2, 0);
        } else {
            color1 = 0x8888a8; // grey
            color2 = 0xffffff;
            geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        }

        for (let i = 0; i < count; i++) {
            const mat = new THREE.MeshPhongMaterial({
                color: i % 2 === 0 ? color1 : color2,
                emissive: i % 2 === 0 ? color1 : color2,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.8
            });
            const mesh = new THREE.Mesh(geometry, mat);

            mesh.position.set((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, 0);

            mesh.userData = {
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2 + 0.15, // Upward burst
                vz: (Math.random() - 0.5) * 0.2,
                rx: Math.random() * 0.1,
                ry: Math.random() * 0.1
            };

            this.scene.add(mesh);
            this.particles.push(mesh);
        }
    }

    resetEffect() {
        this.particles.forEach(p => {
            this.scene.remove(p);
            p.geometry.dispose();
            p.material.dispose();
        });
        this.particles = [];
        this.active = false;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        if (!this.active || !this.renderer) return;

        this.particles.forEach(p => {
            p.position.x += p.userData.vx;
            p.position.y += p.userData.vy;
            p.position.z += p.userData.vz;
            p.userData.vy -= 0.005; // gravity
            p.rotation.x += p.userData.rx;
            p.rotation.y += p.userData.ry;

            if (p.position.y < -10) {
                p.material.opacity = Math.max(0, p.material.opacity - 0.02);
            }
        });

        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        if (!this.container || !this.camera || !this.renderer) return;
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
}
