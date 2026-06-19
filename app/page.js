"use client";
import Particles from "./components/Particles";
import MagicBento from "./components/MagicBento";
import ContactForm from "./components/ContactForm"; // импорт формы

export default function Home() {
  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* Частицы */}
      <Particles
        particleColors={["#1fff01"]}
        particleCount={999}
        particleSpread={10}
        speed={0.5}
        particleBaseSize={500}
        moveParticlesOnHover
        alphaParticles={false}
        disableRotation={false}
        pixelRatio={1}
      />

      {/* Текст поверх частиц */}
      <div
        style={{
          position: "absolute",
          top: "20%",          // сместим немного вверх
          left: "50%",
          transform: "translateX(-50%)",
          color: "#ffffff",
          fontSize: "4rem",
          fontWeight: "bold",
          textShadow: "0 0 20px rgba(43, 255, 0, 0.92)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        Good Site
      </div>

      {/* Форма – размещаем ниже текста, тоже абсолютно */}
      <div
        style={{
          position: "absolute",
          top: "55%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          width: "90%",
          maxWidth: "500px",
        }}
      >
        <ContactForm />
      </div>

      {/* MagicBento – можно оставить как есть или убрать/переместить */}
      <MagicBento 
        textAutoHide={true}
        enableStars
        enableSpotlight
        enableBorderGlow={true}
        enableTilt={false}
        enableMagnetism={false}
        clickEffect
        spotlightRadius={400}
        particleCount={12}
        glowColor="25, 255, 25"
        disableAnimations={false}
      />
    </div>
  );
}