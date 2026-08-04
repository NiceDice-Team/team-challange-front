"use client";
import { useState, useEffect } from "react";

type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

interface RollingDiceProps {
  value: number;
  isRolling: boolean;
  onClick?: () => void;
}

const DICE_ROTATIONS: Record<DiceValue, string> = {
  1: "rotateX(0deg) rotateY(0deg)",
  2: "rotateX(0deg) rotateY(90deg)",
  3: "rotateX(0deg) rotateY(180deg)",
  4: "rotateX(0deg) rotateY(270deg)",
  5: "rotateX(90deg) rotateY(0deg)",
  6: "rotateX(270deg) rotateY(0deg)",
};

const RANDOM_ROTATIONS = [
  "rotateX(720deg) rotateY(720deg) rotateZ(360deg)",
  "rotateX(-720deg) rotateY(720deg) rotateZ(-360deg)",
  "rotateX(720deg) rotateY(-720deg) rotateZ(360deg)",
  "rotateX(1080deg) rotateY(360deg) rotateZ(720deg)",
  "rotateX(360deg) rotateY(1080deg) rotateZ(-720deg)",
  "rotateX(-1080deg) rotateY(-720deg) rotateZ(540deg)",
] as const;

const DOT_POSITIONS: Record<DiceValue, Array<[number, number]>> = {
  1: [[50, 50]], // center
  2: [
    [30, 30],
    [70, 70],
  ], // diagonal
  3: [
    [25, 25],
    [50, 50],
    [75, 75],
  ], // diagonal with center
  4: [
    [30, 30],
    [70, 30],
    [30, 70],
    [70, 70],
  ], // corners
  5: [
    [30, 30],
    [70, 30],
    [50, 50],
    [30, 70],
    [70, 70],
  ], // corners + center
  6: [
    [30, 25],
    [70, 25],
    [30, 50],
    [70, 50],
    [30, 75],
    [70, 75],
  ], // two columns
};

function getRandomRotation() {
  return RANDOM_ROTATIONS[Math.floor(Math.random() * RANDOM_ROTATIONS.length)];
}

function normalizeDiceValue(value: number): DiceValue {
  return value >= 1 && value <= 6 ? (value as DiceValue) : 1;
}

// 3D Dice Component
export default function RollingDice({ value, isRolling, onClick }: RollingDiceProps) {
  const [currentRotation, setCurrentRotation] = useState("");
  const [animationRotation, setAnimationRotation] = useState("");
  const normalizedValue = normalizeDiceValue(value);

  const renderDots = (num: DiceValue) => {
    return DOT_POSITIONS[num].map((pos, index) => (
      <div
        key={index}
        className="absolute bg-gray-900 rounded-full"
        style={{
          width: "16%",
          height: "16%",
          left: `${pos[0]}%`,
          top: `${pos[1]}%`,
          transform: "translate(-50%, -50%)",
        }}
      />
    ));
  };

  useEffect(() => {
    if (isRolling) {
      setAnimationRotation(getRandomRotation());
    } else {
      setCurrentRotation(DICE_ROTATIONS[normalizedValue]);
    }
  }, [isRolling, normalizedValue]);

  return (
    <>
      <style jsx>{`
        .dice-wrapper {
          width: 80px;
          height: 80px;
          position: relative;
          display: inline-block;
        }

        .dice-container {
          perspective: 200px;
          width: 60px;
          height: 60px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .dice-cube {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transform-origin: center center;
          transition: transform 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .dice-face {
          position: absolute;
          width: 60px;
          height: 60px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
        }
      `}</style>

      <div className="dice-wrapper" onClick={onClick}>
        <div className="dice-container cursor-pointer">
          <div
            className="dice-cube"
            style={{
              transform: isRolling ? `scale(1) ${animationRotation}` : `scale(1) ${currentRotation}`,
            }}
          >
            {/* Front face - 1 */}
            <div className="dice-face" style={{ transform: "translateZ(30px)" }}>
              <div className="relative w-full h-full">{renderDots(1)}</div>
            </div>

            {/* Right face - 2 */}
            <div className="dice-face" style={{ transform: "rotateY(90deg) translateZ(30px)" }}>
              <div className="relative w-full h-full">{renderDots(2)}</div>
            </div>

            {/* Back face - 3 */}
            <div className="dice-face" style={{ transform: "rotateY(180deg) translateZ(30px)" }}>
              <div className="relative w-full h-full">{renderDots(3)}</div>
            </div>

            {/* Left face - 4 */}
            <div className="dice-face" style={{ transform: "rotateY(-90deg) translateZ(30px)" }}>
              <div className="relative w-full h-full">{renderDots(4)}</div>
            </div>

            {/* Top face - 5 */}
            <div className="dice-face" style={{ transform: "rotateX(90deg) translateZ(30px)" }}>
              <div className="relative w-full h-full">{renderDots(5)}</div>
            </div>

            {/* Bottom face - 6 */}
            <div className="dice-face" style={{ transform: "rotateX(-90deg) translateZ(30px)" }}>
              <div className="relative w-full h-full">{renderDots(6)}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
