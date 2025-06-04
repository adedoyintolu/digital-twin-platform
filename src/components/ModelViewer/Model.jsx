import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

function Model(props) {
  const { data, cognitive, cognitiveLevel } = props.props;
  const [hoveredPart, setHoveredPart] = useState(null);
  const [modelNodes, setModelNodes] = useState({});
  const [allMeshes, setAllMeshes] = useState([]);
  const [wireframeMode, setWireframeMode] = useState(true); // Enable wireframe by default

  console.log("Received data:", data);
  console.log("Cognitive level:", cognitiveLevel);

  const modelRef = useRef();
  const originalMaterials = useRef(new Map());

  // Color mapping functions
  const getColorByNumber = (num) => {
    if (!num && num !== 0) return "grey";
    if (num > 6) return "red";
    if (num > 3) return "orange";
    return "green";
  };

  const getThreeColor = (colorString) => {
    switch (colorString) {
      case "red":
        return new THREE.Color(0xff0000);
      case "orange":
        return new THREE.Color(0xff9800);
      case "green":
        return new THREE.Color(0x4caf50);
      default:
        return new THREE.Color(0xd3d3d3);
    }
  };

  const getCognitiveColor = (num) => {
    if (num >= 70) return "red";
    if (num >= 31) return "orange";
    return "green";
  };

  const gltf = useLoader(GLTFLoader, "/images/DT.glb");

  // Scan model for nodes and meshes when it loads
  useEffect(() => {
    if (gltf.scene) {
      const nodes = {};
      const meshes = [];

      console.log("🔍 Scanning GLB model for all nodes and meshes:");

      gltf.scene.traverse((child) => {
        // Store all named nodes
        if (child.name && child.name.trim() !== "") {
          nodes[child.name.toLowerCase()] = child;
          console.log(
            `📦 Found node: "${child.name}" at position:`,
            child.position
          );
        }

        // Store all meshes and their materials
        if (child.isMesh) {
          meshes.push(child);
          originalMaterials.current.set(child.uuid, child.material.clone());
          console.log(
            `🎨 Found mesh: "${child.name}" | Material: ${child.material.type}`
          );
        }
      });

      setModelNodes(nodes);
      setAllMeshes(meshes);
      console.log("✅ Scanning complete. Nodes:", Object.keys(nodes));
      console.log("✅ Total meshes found:", meshes.length);
    }
  }, [gltf]);

  // Apply color changes to actual model materials
  useEffect(() => {
    if (allMeshes.length > 0 && (data || cognitive || cognitiveLevel)) {
      console.log("🎨 Applying material colors to model...");

      // Try to find and color specific meshes based on your actual GLB mesh names
      allMeshes.forEach((mesh) => {
        const meshName = mesh.name.toLowerCase();
        let targetColor = null;
        let bodyPart = null;
        let dataValue = null;

        // COGNITIVE LOAD -> BRAIN ONLY (not whole head)
        if (
          meshName.includes("brain") &&
          cognitive &&
          cognitiveLevel !== undefined
        ) {
          targetColor = getThreeColor(getCognitiveColor(cognitiveLevel));
          bodyPart = "brain (cognitive load)";
          dataValue = cognitiveLevel;
        }
        // EXERTION -> HEART ONLY
        else if (meshName.includes("heart") && data?.exertion !== undefined) {
          targetColor = getThreeColor(getColorByNumber(data.exertion));
          bodyPart = "heart (exertion)";
          dataValue = data.exertion;
        }
        // DISCOMFORT DATA -> BODY PARTS
        else if (data) {
          // Check for hand/wrist meshes (hand1, hand2, hand1.001, hand2.001)
          if (
            meshName.includes("hand") ||
            meshName.includes("wrist") ||
            meshName.includes("finger")
          ) {
            targetColor = getThreeColor(getColorByNumber(data.hand_wrist));
            bodyPart = "hand_wrist";
            dataValue = data.hand_wrist;
          }
          // Check for upper arm/arm meshes (but exclude hand references)
          else if (
            (meshName.includes("arm") || meshName.includes("bicep")) &&
            !meshName.includes("lower")
          ) {
            targetColor = getThreeColor(getColorByNumber(data.upper_arm));
            bodyPart = "upper_arm";
            dataValue = data.upper_arm;
          }
          // Check for shoulder meshes
          else if (
            meshName.includes("shoulder") ||
            meshName.includes("clavicle")
          ) {
            targetColor = getThreeColor(getColorByNumber(data.shoulder));
            bodyPart = "shoulder";
            dataValue = data.shoulder;
          }
          // Check for chest/torso meshes (body, Body1 - but exclude back and heart)
          else if (
            (meshName.includes("chest") ||
              meshName.includes("torso") ||
              meshName.includes("body")) &&
            !meshName.includes("back") &&
            !meshName.includes("heart")
          ) {
            targetColor = getThreeColor(getColorByNumber(data.chest));
            bodyPart = "chest";
            dataValue = data.chest;
          }
          // Check for back/spine meshes (Back_lp.001, back)
          else if (
            meshName.includes("back") ||
            meshName.includes("spine") ||
            meshName.includes("pelvis")
          ) {
            targetColor = getThreeColor(getColorByNumber(data.lower_back));
            bodyPart = "lower_back";
            dataValue = data.lower_back;
          }
          // Check for thigh/upper leg meshes (leg1, leg2 - but exclude lower leg)
          else if (
            (meshName.includes("leg") ||
              meshName.includes("thigh") ||
              meshName.includes("femur")) &&
            !meshName.includes("lower")
          ) {
            targetColor = getThreeColor(getColorByNumber(data.thigh));
            bodyPart = "thigh";
            dataValue = data.thigh;
          }
          // Check for lower leg meshes (Lower-leg R, Lowerleg L, lower)
          else if (
            meshName.includes("lower") &&
            (meshName.includes("leg") ||
              meshName.includes("calf") ||
              meshName.includes("shin"))
          ) {
            targetColor = getThreeColor(getColorByNumber(data.lower_leg_foot));
            bodyPart = "lower_leg_foot";
            dataValue = data.lower_leg_foot;
          }
          // Check for foot meshes
          else if (meshName.includes("foot") || meshName.includes("ankle")) {
            targetColor = getThreeColor(getColorByNumber(data.lower_leg_foot));
            bodyPart = "lower_leg_foot";
            dataValue = data.lower_leg_foot;
          }
          // Check for head/neck meshes (head, head.001 - but NOT brain)
          // else if ((meshName.includes('head') || meshName.includes('neck')) && !meshName.includes('brain')) {
          //   targetColor = getThreeColor(getColorByNumber(data.neck));
          //   bodyPart = 'neck';
          //   dataValue = data.neck;
          // }
          // Check for head/neck meshes (head, head.001 - but NOT brain)
          else if (
            meshName.includes("head") &&
            (!meshName.includes("neck") || !meshName.includes("brain"))
          ) {
            targetColor = getThreeColor(getColorByNumber(data.head));
            bodyPart = "head";
            dataValue = data.neck;
          }
          // Check for head/neck meshes (head, head.001 - but NOT brain)
          else if (
            meshName.includes("neck") &&
            !meshName.includes("head") &&
            !meshName.includes("brain")
          ) {
            targetColor = getThreeColor(getColorByNumber(data.neck));
            bodyPart = "neck";
            dataValue = data.neck;
          }
        }

        // Apply color if we found a match
        if (targetColor && bodyPart) {
          const originalMaterial = originalMaterials.current.get(mesh.uuid);
          if (originalMaterial) {
            mesh.material = originalMaterial.clone();
            mesh.material.color = targetColor;
            mesh.material.emissive = targetColor.clone().multiplyScalar(0.1);

            // Apply wireframe mode for better visibility of internal organs
            mesh.material.wireframe = wireframeMode;

            // Adjust opacity for better internal organ visibility
            mesh.material.transparent = true;
            mesh.material.opacity = wireframeMode ? 1.0 : 0.8;

            mesh.material.needsUpdate = true;

            console.log(
              `✅ Colored mesh "${
                mesh.name
              }" as ${bodyPart} with value ${dataValue} (${
                getColorByNumber(dataValue) + getCognitiveColor(dataValue)
              }) color`
            );
          }
        } else {
          // Apply wireframe to unmapped meshes too for consistency
          const originalMaterial = originalMaterials.current.get(mesh.uuid);
          if (originalMaterial && wireframeMode) {
            mesh.material = originalMaterial.clone();
            mesh.material.wireframe = wireframeMode;
            mesh.material.transparent = true;
            mesh.material.opacity = 0.3; // Lower opacity for unmapped parts
            mesh.material.needsUpdate = true;
          }
          console.log(`⚪ No mapping found for mesh: "${mesh.name}"`);
        }
      });
    }
  }, [allMeshes, data, cognitive, cognitiveLevel, wireframeMode]); // Add wireframeMode dependency

  // Toggle wireframe mode
  const toggleWireframe = () => {
    setWireframeMode(!wireframeMode);
  };


  return (
    <>
      <primitive object={gltf.scene} ref={modelRef} scale={[2, 1.6, 2]} />
      {/* Wireframe Toggle Button */}
      <Html position={[-1.5, 1.5, 1]} style={{ pointerEvents: "all" }}>
        <button
          onClick={toggleWireframe}
          style={{
            background: wireframeMode
              ? "rgba(76, 175, 80, 0.9)"
              : "rgba(244, 67, 54, 0.9)",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          {wireframeMode ? "🔍 Wireframe ON" : "👤 Normal View"}
        </button>
      </Html>

      {/* Hover tooltip */}
      {hoveredPart && (
        <Html position={[1.5, 1, 1]} style={{ pointerEvents: "none" }}>
          <div
            style={{
              background: "rgba(0,0,0,0.9)",
              color: "white",
              padding: "8px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
              {hoveredPart.label}
            </div>
            <div>Value: {hoveredPart.value?.toFixed(1)}</div>
            <div>
              Risk:{" "}
              {hoveredPart.color === "red"
                ? "High"
                : hoveredPart.color === "orange"
                ? "Medium"
                : "Low"}
            </div>
          </div>
        </Html>
      )}
    </>
  );
}

// Analysis Panel Component (same as before)
function AnalysisPanel({ data, cognitive, cognitiveLevel, seeLess, onClick }) {
  if (!data && !cognitive) return null;

  const getColorByNumber = (num) => {
    if (!num && num !== 0) return "#4CAF50";
    if (num > 6) return "#F44336";
    if (num > 3) return "#FF9800";
    return "#4CAF50";
  };

  const getRiskLevel = (num) => {
    if (!num && num !== 0) return "Low";
    if (num > 6) return "High";
    if (num > 3) return "Medium";
    return "Low";
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        background: "rgba(255,255,255,0.95)",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        maxWidth: "300px",
        fontSize: "14px",
        zIndex: 100,
      }}
    >
      <div
        style={
          seeLess
            ? {
                height: "40px",
                overflow: "hidden",
              }
            : {}
        }
      >
        <h3
          style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "bold" }}
        >
          Digital Twin Analysis
        </h3>

        {cognitive && (
          <div style={{ marginBottom: "12px" }}>
            <h4
              style={{
                margin: "0 0 8px 0",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Cognitive Load
            </h4>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Level: {cognitiveLevel?.toFixed(1)}%</span>
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: "4px",
                  color: "white",
                  fontSize: "12px",
                  backgroundColor:
                    cognitiveLevel >= 70
                      ? "#F44336"
                      : cognitiveLevel >= 31
                      ? "#FF9800"
                      : "#4CAF50",
                }}
              >
                {cognitiveLevel >= 70
                  ? "High"
                  : cognitiveLevel >= 31
                  ? "Medium"
                  : "Low"}
              </span>
            </div>
          </div>
        )}

        {data && (
          <div>
            <h4
              style={{
                margin: "0 0 8px 0",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Body Part Discomfort
            </h4>
            <div style={{ display: "grid", gap: "4px" }}>
              {Object.entries(data).filter(([part, value]) => !['shoulder'].includes(part)).map(([part, value]) => (

                <div
                  key={part}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "12px",
                  }}
                >
                  <span style={{ textTransform: "capitalize" }}>
                    {part.replace("_", " ")}:
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span>{value?.toFixed(1)}</span>
                    <span
                      style={{
                        padding: "1px 6px",
                        borderRadius: "3px",
                        color: "white",
                        fontSize: "10px",
                        backgroundColor: getColorByNumber(value),
                      }}
                    >
                      {getRiskLevel(value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onClick}
        style={{
          marginTop: "12px",
          padding: "8px 12px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "15px",
          cursor: "pointer",
          fontSize: "14px",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#1976D2")}
      >
        See {seeLess ? "More" : "Less"}
      </button>
    </div>
  );
}

const ModelViewer = (props) => {
  const { data, cognitive, cognitiveLevel } = props;
  const [state, setState] = useState(false);

  console.log("ModelViewer props:", { data, cognitive, cognitiveLevel });

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [-55.5, 0, 10.25], fov: 9 }}
        style={{ height: "1300px", width: "100%", marginTop: "0px" }}
      >
        <ambientLight intensity={1.25} />
        <ambientLight intensity={0.1} />
        <directionalLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <Suspense fallback={null}>
          <Model position={[0.025, -0.9, 1]} props={props} />
        </Suspense>
      </Canvas>

      <AnalysisPanel
        data={data}
        cognitive={cognitive}
        cognitiveLevel={cognitiveLevel}
        onClick={() => setState((prev) => !prev)}
        seeLess={state}
      />

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          background: "rgba(255,255,255,0.9)",
          padding: "12px",
          borderRadius: "6px",
          fontSize: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: "4px" }}>Controls:</div>
        <div>• Drag: Rotate model</div>
        <div>• Scroll: Zoom in/out</div>
        <div>• Hover spheres: View details</div>
        <div>• Toggle wireframe: See internal organs</div>
        <div style={{ fontSize: "10px", color: "#666", marginTop: "4px" }}>
          Wireframe mode reveals brain & heart
        </div>
      </div>
    </div>
  );
};

export default ModelViewer;
