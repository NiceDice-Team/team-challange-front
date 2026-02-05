"use client";

import Link from "next/link";
import { useState } from "react";
import RollingDice from "../utils/dice";
import { ArrowRightIcon } from "@/svgs/icons";

interface JokeData {
  type: string;
  joke?: string;
  setup?: string;
  delivery?: string;
}

/**
 * 404 Not Found Page component
 * Features an interactive dice rolling joke generator
 */
export default function NotFound(): React.ReactElement {
  const [diceValue, setDiceValue] = useState<number>(4);
  const [joke, setJoke] = useState<string>("Roll the dice if you ready!");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  /**
   * Fetch a random joke from the API
   */
  const fetchJoke = async (): Promise<void> => {
    try {
      const response = await fetch("https://sv443.net/jokeapi/v2/joke/Dark");
      const data: JokeData = await response.json();

      if (data.type === "single") {
        setJoke(data.joke || "No joke found!");
      } else {
        setJoke(`${data.setup} - ${data.delivery}`);
      }
    } catch (error) {
      console.error("Error fetching joke:", error);
      setJoke("Oops! Couldn't fetch a joke. Try again!");
    }
  };

  /**
   * Handle dice roll animation and joke fetching
   */
  const handleRollDice = async (): Promise<void> => {
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
      <h2 className="uppercase text-6xl sm:text-8xl md:text-9xl lg:text-[156px] font-bold mt-8 md:mt-0">
        404
      </h2>

      <div className="my-4">
        <RollingDice value={diceValue} isRolling={isRolling} onClick={handleRollDice} />
      </div>

      <div className="w-full max-w-4xl p-8 md:px-16 lg:px-[171px] py-8 md:py-10 flex flex-col items-center gap-6 md:gap-10 bg-white/30 shadow-xl ">
        <h3 className="font-bold text-3xl md:text-4xl lg:text-5xl text-center">
          Game over!
        </h3>

        <div className="relative text-base md:text-xl lg:text-2xl text-center min-h-[4rem] md:min-h-[6rem] lg:min-h-[8rem] flex items-center justify-center px-4">
          <p
            className={`transition-all duration-500 ${
              isLoading ? "opacity-30 blur-sm" : "opacity-100 blur-0"
            }`}
          >
            {joke}
          </p>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="animate-pulse text-base md:text-xl lg:text-2xl">
                Rolling for a new joke...
              </span>
            </div>
          )}
        </div>

        <p className="text-pretty text-base md:text-xl lg:text-xl text-center">
          It looks like you&apos;ve rolled off the board! The page you&apos;re looking for
          doesn&apos;t exist in our game collection!
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
          <ArrowRightIcon className="w-full h-full" />
        </div>
      </Link>
    </section>
  );
}
