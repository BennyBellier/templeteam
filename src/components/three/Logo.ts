/* "use client"; // Assurez-vous que ce fichier est exécuté côté client

import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";

const Logo3D = (svgPath: string): Promise<THREE.Group | null> => {
  return new Promise((resolve, reject) => {
    const loader = new SVGLoader();

    loader.load(
      svgPath,
      (data) => {
        const paths = data.paths;
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, depthWrite: false });

        const group = new THREE.Group();

        paths.forEach((path) => {
          const shapes = path.toShapes(true);

          shapes.forEach((shape) => {
            const geometry = new THREE.ExtrudeGeometry(shape, {
              depth: 5,
              bevelEnabled: false,
            });
            const mesh = new THREE.Mesh(geometry, material);
            group.add(mesh);
          });
        });

        // group.position.set(-50, -50, 0);
        group.scale.set(10, 10, 10);

        resolve(group);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.error("An error happened", error);
        reject(error);
      }
    );
  });
};

export default Logo3D;

 */