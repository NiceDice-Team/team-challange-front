// Description: This is a Next.js configuration file that sets up an alias for the 'src' directory.
// It allows you to import modules from the 'src' directory using '@' as a prefix, making the imports cleaner and more manageable.
const path = require("path");

// визначаємо staging режим
const isStage =
  process.env.NODE_ENV === "staging" ||
  process.env.NEXT_PUBLIC_ENV === "staging";

module.exports = {
  // залишаємо твій alias
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },

  // додаємо лише конфіг для stage, прод цього не має відчувати
  basePath: isStage ? "/frontend" : "",
  assetPrefix: isStage ? "/frontend/" : "",
};

