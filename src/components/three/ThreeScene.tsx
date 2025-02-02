/* "use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import Logo3D from "./Logo";

const ThreeScene: React.FC<{ className?: string }> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && containerRef.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      containerRef.current.appendChild(renderer.domElement);
      camera.position.z = 5;

      Logo3D("../../img/logo.svg").then((logoMesh) => {
        if (logoMesh) {
          scene.add(logoMesh);
        }

        const renderScene = () => {
          renderer.render(scene, camera);
          requestAnimationFrame(renderScene);
        };

        renderScene();
      });

      const handleResize = () => {
        const width = containerRef.current?.clientWidth!;
        const height = containerRef.current?.clientHeight!;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return <div ref={containerRef} className={props.className} />;
};

export default ThreeScene;
 */
