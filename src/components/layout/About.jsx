import SubscribeSection from "../home/SubscribeSection";

export default function About() {
  return (
    <section id="about" className="flex flex-col items-center justify-center">
      <h2 className="uppercase text-center text-[20px] leading-[24px] font-normal sm:text-2xl md:text-3xl lg:text-[40px] mt-8 sm:mt-12 md:mt-16 lg:mt-20 text-[#040404]">
        About us
      </h2>

      <div className="flex flex-col items-center gap-2 mt-5 sm:mt-7 md:mt-8 mb-6 sm:mb-8 md:mb-10 self-stretch sm:max-w-3xl sm:mx-auto">
        <p className="text-center text-[16px] leading-[24px] font-medium px-4 sm:px-0 text-[#040404]">
          Welcome to DICE & DECKS -{"\u00A0"}
          <br className="sm:hidden" />
          Where Every Game Tells a Story.
        </p>

        <p className="text-center text-[16px] leading-[24px] font-normal px-6 sm:px-0 text-[#040404]">
          We{"\u2019"}re passionate about bringing you the best
          tabletop experiences, from classic favorites to new
          releases. We believe board games unite people,
          spark imagination, and create lasting memories -
          for families, casual players, and gamers alike.
          More than a store, we{"\u2019"}re here to help you find
          the perfect game for your style and your table.
          Let{"\u2019"}s play, connect, and make every game
          night unforgettable!
        </p>
      </div>

      <div className="hidden w-full sm:block">
        <SubscribeSection variant="homeDesktop" />
      </div>
    </section>
  );
}
