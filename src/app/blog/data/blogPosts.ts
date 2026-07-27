export type Content = {
  title?: string;
  content: string[];
  imageSrc?: string;
}[];

export type BlogPost = {
  id: number;
  slug: string;
  date: string;
  readingTime: number;
  title: string;
  category: string;
  imageSrc: string;
  excerpt: string;
  content: Content;
};

interface BlogPostPreview {
  id: number;
  date: string;
  readingTime: number;
  name: string;
  category: string;
  imageSrc: string;
  blogUrl: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "heat-legends-review",
    date: "May 20, 2026",
    readingTime: 5,
    title: "Heat: Legends review",
    category: "Game Review",
    imageSrc:
      "https://cdn.shopify.com/s/files/1/0916/9970/8282/files/POST_1.png?v=1779286336",
    excerpt:
      "Legends is a new expansion for Heat: Pedal to the Metal, but not like the others. Instead of new maps and terrain, this one adds to the standout feature of the base game.",
    content: [
      {
        title: "Introduction",
        content: [
          "Many games with a solo mode include an AI to fill in for other people. This often leads to a conflict between predictability and complexity.",
          "Heat managed to completely bypass this conflict. This is probably one of the simplest AIs I’ve encountered in a board game (you flip over a Legends card, and each car uses one of two movement numbers depending on how close to the next corner they are), and yet it still gave you a decent opponent to race against.",
          "This is not just a system to make up for a lack of players; it’s a way to pack the track so there are more cars to race against and interact with. The entire system is so simple that it became standard to play with all 6 cars regardless of how many human players there were.",
        ],
      },
      {
        title: "Firmware update",
        content: [
          "While I love the automation in the game, things can get a little predictable. Cars are slow on corners and fast on straights, plan accordingly. The purpose of this Legends expansion is to tweak and expand the difficulty of these racers, giving them a hint of unpredictability. It also allows for even more cars on the track, because the original Legends cards only included 6 automated cars. Now you can get up to 12 cars on the track, although I think adding traffic jams to a racing game is a bold choice, so all 12 may be more for novelty than regular play. At least there’s always going to be chances for slipstreaming.",
          "As well as including more cars, there are two modules that can be applied with very little overhead.",
        ],
      },
      {
        title: "Star Power",
        content: [
          "On each of these replacement Legends cards, 12 cars are shown and a certain number of cars have a star on them.",
          "You can tweak the level of advantage with three difficulty levels. This allows a random selection of the automated cars to get a small nudge each turn.",
          "Each turn, as well as flipping the Legends card, you now flip over a Power Up card. These Power Up cards are used for both modules, so even when playing with both you’re just adding one card flip per turn to the admin.",
        ],
        imageSrc:
          "https://cdn.shopify.com/s/files/1/0916/9970/8282/files/CORRECT.png?v=1779285815",
      },
    ],
  },
  {
    id: 2,
    date: "May 15, 2023",
    readingTime: 7,
    title: "Zombicide series resurfaces after publisher goes under",
    category: "Game Tutorial",
    imageSrc:
      "https://cdn.shopify.com/s/files/1/0916/9970/8282/files/Zombicide_Dead_Men_Tales.png?v=1777380195",
    slug: "zombicide-series-resurfaces-after-publisher-goes-under",
    excerpt:
      "Zombie board games have a habit of refusing to stay gone for long. Just when the genre feels fully explored, it finds a new setting, a new twist, and claws its way back onto the tabletop.",
    content: [
      {
        title: "A Genre That Refuses to Stay Buried",
        content: [
          "What makes this latest Zombicide release particularly interesting is that it arrives after uncertainty around the franchise’s publisher had cast doubt over the line’s future. Rather than disappearing beneath the waves, the series has resurfaced with fresh momentum.",
          "That mirrors the wider zombie board game genre, which has shown remarkable staying power. At its heart, the appeal is simple: limited resources, overwhelming threats, and players trying to survive long enough to tell the story.",
        ],
      },
    ],
  },
  {
    id: 3,
    date: "May 15, 2023",
    readingTime: 7,
    title: "A new edition of Catan is coming!",
    category: "Game Review",
    imageSrc:
      "https://cdn.shopify.com/s/files/1/0916/9970/8282/files/Untitled_design_6_ac6549d0-1af3-44f6-85e3-2a7f0dfe0ed7.png?v=1779438139",
    slug: "a-new-edition-of-catan-is-coming",
    excerpt:
      "This news just dropped from the Official Settlers of Catan instagram page, and I checked the date to ensure it wasn’t April 1st as I have a habit of falling for these.  ",
    content: [
      {
        content: [
          "It would appear a Bluey themed version of the legendary game is in the pipeline and is expected to be available for play in 2027.",
          "This is hugely exciting for me as a parent of relatively young children that love Bluey. This could be an amazing Gateway into the world of bigger and more challenging board games for them. They are just starting to dabble with a few things at present and any fans of Catan will know how ruthless the game can be. I’m intrigued to see if it is just a makeover of the same game or will they make some Bluey twists to the rule set, I’m personally hoping for the latter.",
          "There is no other information to go on at this time other than this social media post. I cannot wait to see how it develops!",
        ],
      },
    ],
  },
  {
    id: 4,
    date: "May 24, 2026",
    readingTime: 7,
    title: "Foxpaw review",
    category: "Game Review",
    imageSrc:
      "https://cdn.shopify.com/s/files/1/0916/9970/8282/files/2025-12-22130614-FOXPAW-upc-lc.png",
    slug: "foxpaw-review",
    excerpt:
      "Congratulations! You have magic. You must still attend school though, but don’t worry, it will be a different experience to the regular school up the road. Select your House – according to your parents’ wishes, or not, it’s up to you – and collect your things; it’s time to go. And don’t forget your wand. Oh, you don’t have one? Maybe that’s something for you to work on.",
    content: [
      {
        title: "Design",
        content: [
          "The player boards are gorgeous, and intentionally designed. The colours and shape are inviting, and the designer has sensibly added slots – with corresponding symbols – for the cubes and Meeples to sit in. This provides some protection against table knocks, and a sense that everything has its place.",
          "The double-sided main board is colourful and chaotic. The more you stare at it the more you see, and I enjoy the path that links all of the stops. Several card types have locations on the board. Particularly satisfying is the continuation of the board design onto the spell cards, which seamlessly slot into position.",
        ],
        imageSrc:
          "https://cdn.shopify.com/s/files/1/0916/9970/8282/files/2025-12-22140303-GAMEPLAY-3-upc-lc.png",
      },
      {
        imageSrc:
          "https://cdn.shopify.com/s/files/1/0916/9970/8282/files/2025-12-22140308-GAMEPLAY-4-upc-lc.png",
        content: [
          "However, the board could be viewed as overwhelming. A plethora of options is not uncommon in worker placement, but could still be off-putting for first-time players. The division of light and dark spaces is nice, but can cause confusion. It is intuitive to match the light and dark spaces to the morning and night spaces, but only some of the light spaces are morning spaces and only some of the dark spaces are night. Although there are sun and moon symbols to clarify, the busy nature of the board makes them difficult to spot, risking resolving events in the wrong order or not re-energising at night due to mistaking another space for the dormitory.",
        ],
      },
    ],
  },
  {
    id: 5,
    date: "May 27, 2026",
    readingTime: 10,
    title: "LOTR: Duel for Middle Earth – Allies Expansion review",
    category: "Game Review",
    imageSrc:
      "https://cdn.shopify.com/s/files/1/0916/9970/8282/files/LOTR_Allies_Expan_3.png?v=1773834729",
    slug: "lotr-duel-for-middle-earth-allies-expansion-review",
    excerpt:
      "For players who already enjoy the original game, Allies increases your choices without significantly increasing complexity or playtime. ",
    content: [
      {
        title: "Unboxing",
        content: [
          "The Allies expansion comes in a compact paper envelope that matches the design of the base game. The components are minimal but nicely presented, with new illustrated cards and tokens that match the style of the main game.",
          "The expansion introduces 14 beautifully illustrated Ally cards, along with power tokens and player aids that integrate directly into the existing systems. The artwork continues the strong visual identity of the base game, bringing additional characters from Tolkien’s world to the table.",
          "Because this is a small expansion, the components don’t add much physical bulk to the game, but they do introduce new abilities and tactical choices that can influence the outcome of a duel. My only complaint is that they do not fit neatly into the original base box, which meant we had to make some adjustments to store everything together.",
        ],
        imageSrc:
          "https://cdn.shopify.com/s/files/1/0916/9970/8282/files/LOTR_Expan_2.png?v=1773834592",
      },
      {
        title: "Game play",
        content: [
          "The Allies expansion introduces new cards representing characters who can support either the Fellowship or the forces of Sauron. These allies bring unique abilities and special effects, creating new tactical decisions during play.",
          "Each player is dealt three allies at the start of the game. These allies can be activated at any time during a player’s turn by spending power tokens. Power tokens are gathered each round by selecting cards from the board that include a power token symbol.",
          "The additional cards create more variety in how each game unfolds. Certain allies can shift the balance of power, forcing players to adapt their plans and react to their opponent’s new abilities. Despite these additions, the core flow of the game remains unchanged, ensuring that the expansion enhances rather than complicates the experience.",
        ],
        imageSrc:
          "https://cdn.shopify.com/s/files/1/0916/9970/8282/files/LOTR_Duel_Expan.png?v=1773834487",
      },
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
export function getAllBlogSlugs() {
  return blogPosts.map((post) => post.slug);
}

export const blogPostsPreview: BlogPostPreview[] = [
  {
    id: 1,
    date: "May 20, 2026",
    readingTime: 5,
    name: "Heat: Legends review",
    category: "Game Review",
    imageSrc:
      "https://cdn.shopify.com/s/files/1/0916/9970/8282/files/POST_1.png?v=1779286336",
    blogUrl: "/blog/heat-legends-review",
  },
  {
    id: 2,
    date: "May 15, 2023",
    readingTime: 7,
    name: "Zombicide series resurfaces after publisher goes under",
    category: "Game Tutorial",
    imageSrc:
      "https://cdn.shopify.com/s/files/1/0916/9970/8282/files/Zombicide_Dead_Men_Tales.png?v=1777380195",
    blogUrl: "/blog/zombicide-series-resurfaces-after-publisher-goes-under",
  },
  {
    id: 3,
    date: "May 27, 2026",
    readingTime: 40,
    name: "A new edition of Catan is coming!",
    category: "Game Review",
    imageSrc:
      "https://cdn.shopify.com/s/files/1/0916/9970/8282/files/Untitled_design_6_ac6549d0-1af3-44f6-85e3-2a7f0dfe0ed7.png?v=1779438139",
    blogUrl: "/blog/a-new-edition-of-catan-is-coming",
  },
  {
    id: 4,
    date: "May 24, 2026",
    readingTime: 6,
    name: "Foxpaw review",
    category: "Game Review",
    imageSrc:
      "https://cdn.shopify.com/s/files/1/0916/9970/8282/files/2025-12-22130614-FOXPAW-upc-lc.png",
    blogUrl: "/blog/foxpaw-review",
  },
  {
    id: 5,
    date: "May 21, 2026",
    readingTime: 10,
    name: "LOTR: Duel for Middle Earth – Allies Expansion review",
    category: "Game Review",
    imageSrc:
      "https://cdn.shopify.com/s/files/1/0916/9970/8282/files/LOTR_Allies_Expan_3.png?v=1773834729",
    blogUrl: "/blog/lotr-duel-for-middle-earth-allies-expansion-review",
  },
];
