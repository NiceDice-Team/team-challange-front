"use client";
import Link from "next/link";
import { useState } from "react";
import RollingDice from "../utils/dice"; // Import the dice component

// 404 Not Found Page
export default function NotFound() {
  const [diceValue, setDiceValue] = useState(4);
  const [joke, setJoke] = useState("Roll the dice if you ready!");
  const [isLoading, setIsLoading] = useState(false);
  const [isRolling, setIsRolling] = useState(false);

  const fetchJoke = async () => {
    try {
      const response = await fetch("https://sv443.net/jokeapi/v2/joke/Dark");
      const data = await response.json();

      if (data.type === "single") {
        setJoke(data.joke);
      } else {
        setJoke(`${data.setup} - ${data.delivery}`);
      }
    } catch (error) {
      console.error("Error fetching joke:", error);
      setJoke("Oops! Couldn't fetch a joke. Try again!");
    }
  };

  const handleRollDice = async () => {
    setIsRolling(true);
    setIsLoading(true);

    // Simulate rolling animation
    setTimeout(() => {
      const newValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(newValue);
      setIsRolling(false);
    }, 1200);

    // Fetch joke after animation
    setTimeout(async () => {
      await fetchJoke();
      setIsLoading(false);
    }, 1200);
  };

  return (
    <section className="min-h-screen w-full bg-not-found-gradient text-white flex flex-col justify-between items-center p-4 md:p-8">
      <h2 className="uppercase text-6xl sm:text-8xl md:text-9xl lg:text-[156px] font-bold mt-8 md:mt-0">404</h2>

      <div className="my-4">
        <RollingDice value={diceValue} isRolling={isRolling} onClick={handleRollDice} />
      </div>

      <div className="w-full max-w-4xl p-8 md:px-16 lg:px-[171px] py-8 md:py-10 flex flex-col items-center gap-6 md:gap-10 bg-white/30 shadow-xl ">
        <h3 className="font-bold text-3xl md:text-4xl lg:text-5xl text-center">Game over!</h3>

        <div className="relative text-base md:text-xl lg:text-2xl text-center min-h-[4rem] md:min-h-[6rem] lg:min-h-[8rem] flex items-center justify-center px-4">
          <p className={`transition-all duration-500 ${isLoading ? "opacity-30 blur-sm" : "opacity-100 blur-0"}`}>
            {joke}
          </p>
          {/* Loading spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="animate-pulse text-base md:text-xl lg:text-2xl">Rolling for a new joke...</span>
            </div>
          )}
        </div>

        <p className="text-pretty text-base md:text-xl lg:text-xl text-center">
          It looks like you&apos;ve rolled off the board! The page you&apos;re looking for doesn&apos;t exist in our
          game collection!
        </p>

        <button
          className="uppercase bg-[var(--color-orange)] text-sm md:text-base px-6 md:px-8 py-3 md:py-4 hover:opacity-90 transition-opacity "
          onClick={handleRollDice}
          disabled={isLoading}
        >
          Roll again
        </button>
      </div>

      <Link
        href="/"
        className="flex flex-row items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity mb-8 md:mb-0"
      >
        <span className="text-sm md:text-base">Go back home</span>
        <div className="w-5 h-5 md:w-6 md:h-6 flex justify-center items-center mt-0.5 md:mt-1">
          <svg className="w-full h-full" viewBox="0 0 14 12" fill="none">
            <path
              d="M7.646 0.646894C7.69245 0.60033 7.74762 0.563387 7.80837 0.538181C7.86911 0.512974 7.93423 0.5 8 0.5C8.06577 0.5 8.13089 0.512974 8.19163 0.538181C8.25238 0.563387 8.30755 0.60033 8.354 0.646894L13.354 5.64689C13.4006 5.69334 13.4375 5.74852 13.4627 5.80926C13.4879 5.87001 13.5009 5.93513 13.5009 6.00089C13.5009 6.06666 13.4879 6.13178 13.4627 6.19253C13.4375 6.25327 13.4006 6.30845 13.354 6.35489L8.354 11.3549C8.26011 11.4488 8.13278 11.5015 8 11.5015C7.86722 11.5015 7.73989 11.4488 7.646 11.3549C7.55211 11.261 7.49937 11.1337 7.49937 11.0009C7.49937 10.8681 7.55211 10.7408 7.646 10.6469L11.793 6.50089H1C0.867392 6.50089 0.740215 6.44822 0.646447 6.35445C0.552679 6.26068 0.5 6.1335 0.5 6.00089C0.5 5.86829 0.552679 5.74111 0.646447 5.64734C0.740215 5.55357 0.867392 5.50089 1 5.50089H11.793L7.646 1.35489C7.59944 1.30845 7.56249 1.25327 7.53729 1.19253C7.51208 1.13178 7.49911 1.06666 7.49911 1.00089C7.49911 0.935126 7.51208 0.870005 7.53729 0.80926C7.56249 0.748515 7.59944 0.693339 7.646 0.646894Z"
              fill="white"
            />
          </svg>
        </div>
      </Link>
    </section>
  );
}
