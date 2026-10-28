import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function FarmScene3D() {
    const mountRef = useRef(null);

    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        let width = container.clientWidth || 400;
        let height = container.clientHeight || 400;

        // 1. Scene, Camera, Renderer
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2('#F4F2EC', 0.04);

        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        camera.position.set(4.5, 3.2, 5.5);
        camera.lookAt(0, 0.7, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        // 2. Lighting (Warm farm sunlight)
        const hemiLight = new THREE.HemisphereLight('#E8F5E9', '#D7CCC8', 1.1);
        scene.add(hemiLight);

        const dirLight = new THREE.DirectionalLight('#FFF8E1', 1.8);
        dirLight.position.set(5, 8, 4);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 20;
        dirLight.shadow.camera.left = -4;
        dirLight.shadow.camera.right = 4;
        dirLight.shadow.camera.top = 4;
        dirLight.shadow.camera.bottom = -4;
        dirLight.shadow.bias = -0.001;
        scene.add(dirLight);

        // Ambient fill
        const ambientLight = new THREE.AmbientLight('#A3B18A', 0.4);
        scene.add(ambientLight);

        // 3. Environment: Rolling Pasture Platform
        const groundGeo = new THREE.CylinderGeometry(3.5, 3.7, 0.4, 32);
        const groundMat = new THREE.MeshStandardMaterial({
            color: '#40916C',
            roughness: 0.85,
            metalness: 0.1,
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.position.y = -0.2;
        ground.receiveShadow = true;
        scene.add(ground);

        // Under-earth pedestal
        const soilGeo = new THREE.CylinderGeometry(3.7, 3.8, 0.3, 32);
        const soilMat = new THREE.MeshStandardMaterial({
            color: '#582F0E',
            roughness: 0.9,
        });
        const soil = new THREE.Mesh(soilGeo, soilMat);
        soil.position.y = -0.55;
        scene.add(soil);

        // 4. Stylized 3D Cattle (Limousin / Sapi Unggul)
        const cowGroup = new THREE.Group();

        // Materials
        const bodyMat = new THREE.MeshStandardMaterial({
            color: '#8A4117', // Limousin warm red-brown
            roughness: 0.7,
        });
        const whiteMat = new THREE.MeshStandardMaterial({
            color: '#F4F2EC',
            roughness: 0.8,
        });
        const hornMat = new THREE.MeshStandardMaterial({
            color: '#E0CEB5',
            roughness: 0.4,
        });
        const muzzleMat = new THREE.MeshStandardMaterial({
            color: '#D4A373',
            roughness: 0.8,
        });
        const hoofMat = new THREE.MeshStandardMaterial({
            color: '#2B2523',
            roughness: 0.9,
        });

        // Main Torso
        const bodyGeo = new THREE.BoxGeometry(1.6, 1.0, 0.85);
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.set(0, 1.1, 0);
        body.castShadow = true;
        body.receiveShadow = true;
        cowGroup.add(body);

        // Shoulders / Hump (Pejantan)
        const humpGeo = new THREE.BoxGeometry(0.6, 0.35, 0.8);
        const hump = new THREE.Mesh(humpGeo, bodyMat);
        hump.position.set(0.4, 1.6, 0);
        hump.castShadow = true;
        cowGroup.add(hump);

        // Head Group
        const headGroup = new THREE.Group();
        headGroup.position.set(0.85, 1.5, 0);

        const headGeo = new THREE.BoxGeometry(0.65, 0.65, 0.55);
        const head = new THREE.Mesh(headGeo, bodyMat);
        head.castShadow = true;
        headGroup.add(head);

        // Muzzle
        const muzzleGeo = new THREE.BoxGeometry(0.35, 0.35, 0.45);
        const muzzle = new THREE.Mesh(muzzleGeo, muzzleMat);
        muzzle.position.set(0.35, -0.15, 0);
        muzzle.castShadow = true;
        headGroup.add(muzzle);

        // Horns
        const hornGeo = new THREE.ConeGeometry(0.08, 0.4, 8);
        const hornL = new THREE.Mesh(hornGeo, hornMat);
        hornL.position.set(0.05, 0.4, 0.28);
        hornL.rotation.set(-0.3, 0, -0.3);
        hornL.castShadow = true;
        headGroup.add(hornL);

        const hornR = new THREE.Mesh(hornGeo, hornMat);
        hornR.position.set(0.05, 0.4, -0.28);
        hornR.rotation.set(0.3, 0, -0.3);
        hornR.castShadow = true;
        headGroup.add(hornR);

        // Ears
        const earGeo = new THREE.BoxGeometry(0.12, 0.12, 0.25);
        const earL = new THREE.Mesh(earGeo, bodyMat);
        earL.position.set(-0.1, 0.15, 0.35);
        earL.rotation.y = 0.2;
        headGroup.add(earL);

        const earR = new THREE.Mesh(earGeo, bodyMat);
        earR.position.set(-0.1, 0.15, -0.35);
        earR.rotation.y = -0.2;
        headGroup.add(earR);

        cowGroup.add(headGroup);

        // 4 Legs
        const legPositions = [
            { x: 0.55, z: 0.3 },
            { x: 0.55, z: -0.3 },
            { x: -0.55, z: 0.3 },
            { x: -0.55, z: -0.3 },
        ];

        const legGeo = new THREE.BoxGeometry(0.2, 0.8, 0.2);
        const hoofGeo = new THREE.BoxGeometry(0.22, 0.15, 0.22);

        legPositions.forEach((pos) => {
            const leg = new THREE.Mesh(legGeo, bodyMat);
            leg.position.set(pos.x, 0.4, pos.z);
            leg.castShadow = true;
            cowGroup.add(leg);

            const hoof = new THREE.Mesh(hoofGeo, hoofMat);
            hoof.position.set(pos.x, 0.075, pos.z);
            hoof.castShadow = true;
            cowGroup.add(hoof);
        });

        // Tail
        const tailGroup = new THREE.Group();
        tailGroup.position.set(-0.8, 1.4, 0);

        const tailGeo = new THREE.CylinderGeometry(0.04, 0.03, 0.6, 6);
        const tailMesh = new THREE.Mesh(tailGeo, bodyMat);
        tailMesh.position.y = -0.25;
        tailMesh.rotation.z = -0.15;
        tailGroup.add(tailMesh);

        const tuftGeo = new THREE.ConeGeometry(0.08, 0.2, 6);
        const tuft = new THREE.Mesh(tuftGeo, hoofMat);
        tuft.position.set(-0.05, -0.55, 0);
        tuft.rotation.z = Math.PI;
        tailGroup.add(tuft);

        cowGroup.add(tailGroup);
        scene.add(cowGroup);

        // 5. Wooden Farm Fence on Background
        const fenceWoodMat = new THREE.MeshStandardMaterial({ color: '#A07855', roughness: 0.9 });
        const postGeo = new THREE.BoxGeometry(0.12, 1.0, 0.12);
        const railGeo = new THREE.BoxGeometry(2.4, 0.08, 0.05);

        const fenceGroup = new THREE.Group();
        fenceGroup.position.set(-0.6, 0, -1.8);
        fenceGroup.rotation.y = 0.2;

        for (let i = 0; i < 3; i++) {
            const post = new THREE.Mesh(postGeo, fenceWoodMat);
            post.position.set((i - 1) * 1.0, 0.5, 0);
            post.castShadow = true;
            fenceGroup.add(post);
        }

        const railTop = new THREE.Mesh(railGeo, fenceWoodMat);
        railTop.position.set(0, 0.75, 0.05);
        railTop.castShadow = true;
        fenceGroup.add(railTop);

        const railMid = new THREE.Mesh(railGeo, fenceWoodMat);
        railMid.position.set(0, 0.45, 0.05);
        railMid.castShadow = true;
        fenceGroup.add(railMid);

        scene.add(fenceGroup);

        // 6. Natural Grass Tufts
        const grassMat = new THREE.MeshStandardMaterial({ color: '#52B788', roughness: 0.7 });
        const bladeGeo = new THREE.ConeGeometry(0.04, 0.3, 4);

        for (let i = 0; i < 12; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 1.2 + Math.random() * 1.8;
            const gx = Math.cos(angle) * dist;
            const gz = Math.sin(angle) * dist;

            const grassClump = new THREE.Group();
            grassClump.position.set(gx, 0, gz);

            for (let b = 0; b < 3; b++) {
                const blade = new THREE.Mesh(bladeGeo, grassMat);
                blade.position.set((b - 1) * 0.05, 0.15, (Math.random() - 0.5) * 0.05);
                blade.rotation.set((Math.random() - 0.5) * 0.4, 0, (Math.random() - 0.5) * 0.4);
                grassClump.add(blade);
            }
            scene.add(grassClump);
        }

        // 7. Interactive Mouse Coordinates with Damping
        let mouseX = 0;
        let mouseY = 0;
        let targetRotX = 0;
        let targetRotY = 0;

        const onMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / width) * 2 - 1;
            const y = -(((e.clientY - rect.top) / height) * 2 - 1);
            mouseX = x;
            mouseY = y;
        };

        window.addEventListener('mousemove', onMouseMove);

        // 8. Animation Loop (60fps optimized)
        let animationFrameId;
        let clock = new THREE.Clock();

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();

            // Cattle idle animation: breathing + head motion + tail swish
            body.scale.y = 1 + Math.sin(elapsedTime * 2.2) * 0.015;
            headGroup.rotation.y = Math.sin(elapsedTime * 1.2) * 0.06;
            headGroup.rotation.x = Math.sin(elapsedTime * 1.8) * 0.03;
            tailGroup.rotation.z = Math.sin(elapsedTime * 3.5) * 0.15;

            // Camera subtle orbit following mouse with smooth lerp
            targetRotY = mouseX * 0.4;
            targetRotX = mouseY * 0.2;

            scene.rotation.y += (targetRotY - scene.rotation.y) * 0.05;
            scene.rotation.x += (targetRotX - scene.rotation.x) * 0.05;

            renderer.render(scene, camera);
        };

        animate();

        // 9. Resize Handling
        const handleResize = () => {
            if (!container) return;
            width = container.clientWidth;
            height = container.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // 10. Clean Cleanup on Unmount (Prevent any leaks or scroll lag)
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', handleResize);
            if (renderer.domElement && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
            scene.clear();
        };
    }, []);

    return (
        <div className="relative w-full h-full min-h-[360px] sm:min-h-[440px] lg:min-h-[480px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#F4F2EC] to-[#E7E5DF] border border-[#E7E5DF] shadow-inner flex items-center justify-center">
            {/* 3D Canvas Mount */}
            <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing w-full h-full" />

            {/* Subtle Overlay Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E7E5DF] shadow-xs text-xs font-semibold text-[#1B4332]">
                <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-ping" />
                <span>3D Preview Interaktif • Gerakkan Kursor</span>
            </div>

            {/* Spec Overlay Card Bottom */}
            <div className="absolute bottom-4 right-4 left-4 sm:left-auto sm:max-w-xs z-10 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-[#E7E5DF] shadow-md">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#C2410C]">
                        Kualitas Super Grade A
                    </span>
                    <span className="text-xs font-medium text-[#2D6A4F] bg-[#D8F3DC] px-2 py-0.5 rounded-full">
                        PMK Sehat
                    </span>
                </div>
                <h4 className="text-sm font-bold text-[#1C1917] leading-tight">
                    Sapi Limousin Pejantan Boyolali
                </h4>
                <div className="mt-2 pt-2 border-t border-[#E7E5DF] flex items-center justify-between text-xs text-[#57534E]">
                    <span>Bobot Riil: <strong className="text-[#1C1917]">620 kg</strong></span>
                    <span>Umur: <strong className="text-[#1C1917]">28 Bln</strong></span>
                </div>
            </div>
        </div>
    );
}
