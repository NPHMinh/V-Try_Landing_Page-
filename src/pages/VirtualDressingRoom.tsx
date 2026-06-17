import { useState, useRef } from "react";
import {
  trackVirtualTryOn,
  trackColorChange,
  trackSizeChange,
  trackAddToCart,
} from "../services/analytics";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Float,
  useGLTF,
} from "@react-three/drei";
import { Settings, Info, Ruler, UserCircle2, X } from "lucide-react";
import * as THREE from "three";
import SizeSuggestionModal from "../components/size-suggestion/SizeSuggestionModal";

// Realistic 3D Mannequin Component using useGLTF
function RealisticMannequin({
  color,
  activeTab,
  bodyParams,
}: {
  color: string;
  activeTab: string;
  bodyParams?: {
    height: number;
    weight: number;
    chest: number;
    waist: number;
    hips: number;
  };
}) {
  const group = useRef<THREE.Group>(null);

  // Load custom highpoly model
  const { nodes, materials } = useGLTF("/male_body_base_mesh_highpoly.glb");

  // Calculate scales based on an average human (170cm, 70kg, 90cm chest, 80cm waist, 90cm hips)
  const baseScale = 0.4;
  let scaleY = baseScale;
  let scaleXZ = baseScale;

  if (bodyParams && activeTab === "mybody") {
    scaleY = (bodyParams.height / 175) * baseScale;

    // Weight heavily influences overall thickness, while waist/chest/hips give nuanced variation to width/depth
    const shapeFactor =
      (bodyParams.chest / 95 + bodyParams.waist / 82 + bodyParams.hips / 95) /
      3;
    scaleXZ = ((bodyParams.weight / 70) * 0.6 + shapeFactor * 0.4) * baseScale;
  }

  return (
    <group
      ref={group}
      position={[0, 1.2 * (scaleY / baseScale), 0]}
      scale={[scaleXZ, scaleY, scaleXZ]}
      dispose={null}
    >
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          geometry={(nodes.Object_2 as THREE.Mesh).geometry}
          material={materials.material_0}
        >
          <meshStandardMaterial
            color={activeTab === "mybody" ? color : "#d1d5db"}
            roughness={0.4}
          />
        </mesh>
        <mesh
          geometry={(nodes.Object_3 as THREE.Mesh).geometry}
          material={materials.material_0}
        >
          <meshStandardMaterial
            color={activeTab === "mybody" ? color : "#d1d5db"}
            roughness={0.4}
          />
        </mesh>
        <mesh
          geometry={(nodes.Object_4 as THREE.Mesh).geometry}
          material={materials.material_0}
        >
          <meshStandardMaterial
            color={activeTab === "mybody" ? color : "#d1d5db"}
            roughness={0.4}
          />
        </mesh>
        <mesh
          geometry={(nodes.Object_5 as THREE.Mesh).geometry}
          material={materials.material_0}
        >
          <meshStandardMaterial
            color={activeTab === "mybody" ? color : "#d1d5db"}
            roughness={0.4}
          />
        </mesh>
        <mesh
          geometry={(nodes.Object_6 as THREE.Mesh).geometry}
          material={materials.material_0}
        >
          <meshStandardMaterial
            color={activeTab === "mybody" ? color : "#d1d5db"}
            roughness={0.4}
          />
        </mesh>
      </group>
    </group>
  );
}

// Preload the models
useGLTF.preload("/male_body_base_mesh_highpoly.glb");
useGLTF.preload("/t-shirt.glb");

// Static T-Shirt 3D Component overlay
function TShirtGarment({
  color,
  activeTab,
  bodyParams,
  selectedSize,
}: {
  color: string;
  activeTab: string;
  bodyParams?: {
    height: number;
    weight: number;
    chest: number;
    waist: number;
    hips: number;
  };
  selectedSize?: string;
}) {
  const group = useRef<THREE.Group>(null);

  const { nodes } = useGLTF("/t-shirt.glb");

  // Calculate scales based on an average human
  // The T-shirt model is much larger by default compared to the humanoid base mesh,
  // so we use a much smaller baseScale.
  const baseScale = 0.015;
  let scaleY = baseScale;
  let scaleXZ = baseScale;

  if (bodyParams && activeTab === "mybody") {
    scaleY = (bodyParams.height / 175) * baseScale;
    const shapeFactor =
      (bodyParams.chest / 95 + bodyParams.waist / 82 + bodyParams.hips / 95) /
      3;
    scaleXZ = ((bodyParams.weight / 70) * 0.6 + shapeFactor * 0.4) * baseScale;
  }

  let sizeMultiplier = 1.0;
  if (selectedSize === "S") sizeMultiplier = 0.95;
  if (selectedSize === "L") sizeMultiplier = 1.05;
  if (selectedSize === "XL") sizeMultiplier = 1.1;

  // T-Shirt might need its own position adjustments to fit exactly on the shoulders
  return (
    <group
      ref={group}
      position={[0, 0.83, 0.1]} // Lowering the position relative to the avatar since its scale/origin is different
      scale={[
        scaleXZ * 1.2 * sizeMultiplier,
        scaleY * 1.23 * sizeMultiplier,
        scaleXZ * 1.3 * sizeMultiplier,
      ]} // Slightly wider + user size
      dispose={null}
    >
      <group rotation={[-Math.PI / -50, 0, 0]}>
        <mesh
          geometry={
            (nodes.AM_102_035_003_AM_102_035_002_0 as THREE.Mesh).geometry
          }
        >
          <meshStandardMaterial
            color={color}
            roughness={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}

const COLORS = [
  { name: "Coral Red", hex: "#FF6F61" },
  { name: "Navy Blue", hex: "#1e3a8a" },
  { name: "Forest Green", hex: "#065f46" },
  { name: "Onyx Black", hex: "#111827" },
  { name: "Heather Gray", hex: "#9ca3af" },
];

export default function VirtualDressingRoom() {
  const [selectedColor, setSelectedColor] = useState(COLORS[0].hex);
  const [selectedSize, setSelectedSize] = useState("M");
  const [activeTab, setActiveTab] = useState("mybody");
  const [isTryOn, setIsTryOn] = useState(false);
  const [showProductInfo, setShowProductInfo] = useState(true);
  const [showBodyStats, setShowBodyStats] = useState(true);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);

  // Body Parameters State
  const [bodyParams, setBodyParams] = useState({
    height: 175,
    weight: 70,
    chest: 95,
    waist: 82,
    hips: 95,
  });

  const handleParamChange = (field: keyof typeof bodyParams, value: number) => {
    setBodyParams((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-zinc-50 overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0 cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
          <directionalLight position={[-5, 5, -5]} intensity={0.5} />

          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.1}>
            <RealisticMannequin
              color="#e5e5e5" // Base mannequin color is neutral when clothes are applied
              activeTab={activeTab}
              bodyParams={bodyParams}
            />
            {/* The clothing overlay */}
            {isTryOn && (
              <TShirtGarment
                color={selectedColor}
                activeTab={activeTab}
                bodyParams={bodyParams}
                selectedSize={selectedSize}
              />
            )}
          </Float>

          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.4}
            scale={5}
            blur={2}
            far={4}
          />
          <OrbitControls
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2 + 0.1}
            minDistance={2}
            maxDistance={6}
          />
        </Canvas>
      </div>

      {/* UI Overlay: Top Left (Product Details) */}
      <div
        className={`absolute top-4 left-4 md:top-6 md:left-6 z-20 transition-all duration-500 ease-in-out ${
          showProductInfo ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-6 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 w-[calc(100vw-2rem)] sm:w-80 relative">
          <button
            onClick={() => setShowProductInfo(false)}
            className="absolute -top-2 -right-2 p-2 bg-white border border-gray-100 shadow-lg rounded-xl transition-all hover:bg-gray-50 text-gray-400 hover:text-gray-900 z-30 flex items-center justify-center sm:top-4 sm:right-4 sm:p-1.5 sm:bg-transparent sm:border-none sm:shadow-none"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4 text-[#FF6F61]">
            <Info className="w-5 h-5" />
            <h2 className="text-sm font-bold tracking-widest uppercase">
              Product Details
            </h2>
          </div>

          <div className="mb-4 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <img
              src="/t-shirt-demo.jpg"
              alt="V-TRY T-Shirt Demo"
              className="w-full h-48 sm:h-75 object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
            V-TRY T-SHIRT
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mb-6 leading-relaxed">
            Premium lightweight cotton blend. Designed for a perfectly tailored
            fit that breathes and adapts to your unique body shape.
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Select Size
                </label>
                <button
                  onClick={() => setIsSizeModalOpen(true)}
                  className="text-xs text-[#FF6F61] hover:underline flex items-center gap-1"
                >
                  <Ruler className="w-3 h-3" /> Size Guide
                </button>
              </div>
              <div className="flex gap-2">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      // TODO: Truyền product thật từ API vào trackSizeChange
                      trackSizeChange({ size });
                    }}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg border transition-all ${
                      selectedSize === size
                        ? "border-[#FF6F61] bg-[#FF6F61]/10 text-[#FF6F61]"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              const nextState = !isTryOn;
              setIsTryOn(nextState);
              // TODO: Truyền product, color, size thật vào trackVirtualTryOn
              trackVirtualTryOn({
                color: selectedColor,
                size: selectedSize,
                action: nextState ? "try_on" : "take_off",
              });
            }}
            className={`w-full font-bold py-3 sm:py-3.5 rounded-xl transition-colors shadow-lg mb-3 text-sm sm:text-base ${
              isTryOn
                ? "bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-50"
                : "bg-[#FF6F61] text-white hover:bg-[#fa5c4d]"
            }`}
          >
            {isTryOn ? "Take Off Garment" : "Try On In 3D"}
          </button>

          <button
            onClick={() => {
              // TODO: Truyền product thật, size, color từ state/API vào trackAddToCart
              trackAddToCart({
                size: selectedSize,
                color: selectedColor,
              });
            }}
            className="w-full bg-gray-900 text-white font-bold py-3 sm:py-3.5 rounded-xl hover:bg-gray-800 transition-colors shadow-lg text-sm sm:text-base"
          >
            Add to Cart - $89
          </button>
        </div>
      </div>

      {/* Show Product Info Toggle Button */}
      {!showProductInfo && (
        <button
          onClick={() => setShowProductInfo(true)}
          className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-white/20 text-gray-900 hover:bg-white transition-all animate-in fade-in slide-in-from-left-4"
        >
          <Info className="w-6 h-6 text-[#FF6F61]" />
        </button>
      )}

      {/* UI Overlay: Top Right (Body Stats) */}
      <div
        className={`absolute top-4 right-4 md:top-6 md:right-6 z-20 transition-all duration-500 ease-in-out ${
          showBodyStats ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-[calc(100vw-2rem)] sm:w-80 relative">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-2 mb-4 relative">
            <button
              onClick={() => setShowBodyStats(false)}
              className="absolute -top-2 -right-2 p-2 bg-white border border-gray-100 shadow-lg rounded-xl transition-all hover:bg-gray-50 text-gray-400 hover:text-gray-900 z-30 flex items-center justify-center sm:-top-1 sm:-right-1 sm:p-1.5 sm:rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex">
              <button
                onClick={() => setActiveTab("mannequin")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  activeTab === "mannequin"
                    ? "bg-white shadow-sm text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <UserCircle2 className="w-4 h-4" />
                Standard
              </button>
              <button
                onClick={() => setActiveTab("mybody")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  activeTab === "mybody"
                    ? "bg-[#FF6F61] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Settings className="w-4 h-4" />
                My Body AI
              </button>
            </div>
          </div>

          {activeTab === "mybody" && (
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-5 sm:p-6 animate-in fade-in slide-in-from-top-4">
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-4 px-1">
                Adjust Body Parameters
              </h3>

              <div className="space-y-4 sm:space-y-5">
                <div>
                  <div className="flex justify-between text-[10px] sm:text-xs font-semibold text-gray-500 mb-2 px-1">
                    <span>Height</span>
                    <span>{bodyParams.height} cm</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="210"
                    value={bodyParams.height}
                    onChange={(e) =>
                      handleParamChange("height", Number(e.target.value))
                    }
                    className="w-full accent-[#FF6F61]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] sm:text-xs font-semibold text-gray-500 mb-2 px-1">
                    <span>Weight</span>
                    <span>{bodyParams.weight} kg</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="150"
                    value={bodyParams.weight}
                    onChange={(e) =>
                      handleParamChange("weight", Number(e.target.value))
                    }
                    className="w-full accent-[#FF6F61]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] sm:text-xs font-semibold text-gray-500 mb-2 px-1">
                    <span>Chest</span>
                    <span>{bodyParams.chest} cm</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="130"
                    value={bodyParams.chest}
                    onChange={(e) =>
                      handleParamChange("chest", Number(e.target.value))
                    }
                    className="w-full accent-[#FF6F61]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] sm:text-xs font-semibold text-gray-500 mb-2 px-1">
                    <span>Waist</span>
                    <span>{bodyParams.waist} cm</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="120"
                    value={bodyParams.waist}
                    onChange={(e) =>
                      handleParamChange("waist", Number(e.target.value))
                    }
                    className="w-full accent-[#FF6F61]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] sm:text-xs font-semibold text-gray-500 mb-2 px-1">
                    <span>Hips</span>
                    <span>{bodyParams.hips} cm</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="130"
                    value={bodyParams.hips}
                    onChange={(e) =>
                      handleParamChange("hips", Number(e.target.value))
                    }
                    className="w-full accent-[#FF6F61]"
                  />
                </div>

                <button className="w-full mt-2 bg-gray-100 text-gray-900 text-xs sm:text-sm font-bold py-2.5 rounded-xl hover:bg-gray-200 transition-colors">
                  Apply Real-time Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Show Body Stats Toggle Button */}
      {!showBodyStats && (
        <button
          onClick={() => setShowBodyStats(true)}
          className="absolute top-6 right-6 z-20 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-white/20 text-gray-900 hover:bg-white transition-all animate-in fade-in slide-in-from-right-4"
        >
          <Settings className="w-6 h-6 text-[#FF6F61]" />
        </button>
      )}

      {/* UI Overlay: Bottom Middle (Color Selector Carousel) */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 w-full max-w-[90vw] sm:w-auto">
        <div className="bg-white/90 backdrop-blur-xl px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-2xl border border-white/20 flex flex-col items-center mx-auto">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            {COLORS.find((c) => c.hex === selectedColor)?.name}
          </span>
          <div className="flex items-center gap-4">
            {COLORS.map((color) => (
              <button
                key={color.hex}
                onClick={() => {
                  setSelectedColor(color.hex);
                  // TODO: Truyền product thật vào trackColorChange
                  trackColorChange({
                    colorName: color.name,
                    colorHex: color.hex,
                  });
                }}
                className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  selectedColor === color.hex
                    ? "border-gray-900 scale-110 shadow-md"
                    : "border-transparent hover:scale-110"
                }`}
                style={{ backgroundColor: color.hex }}
                aria-label={`Select ${color.name}`}
              />
            ))}
          </div>
          <div className="mt-3 text-[10px] text-gray-400 font-medium tracking-wide flex items-center gap-1">
            <OrbitControlsIcon /> DRAG TO ROTATE • SCROLL TO ZOOM
          </div>
        </div>
      </div>
      <SizeSuggestionModal
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
        productId="tank-top"
        productName="V-TRY T-Shirt"
        onSelectSize={(size) => setSelectedSize(size)}
        onApplyBodyParams={(params) => {
          setBodyParams(params);
          setActiveTab("mybody");
        }}
      />
    </div>
  );
}

// Simple internal icon
function OrbitControlsIcon() {
  return (
    <svg
      className="w-3 h-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}
