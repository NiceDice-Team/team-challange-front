// Description: This is a Next.js configuration file that sets up an alias for the 'src' directory.
// It allows you to import modules from the 'src' directory using '@' as a prefix, making the imports cleaner and more manageable.

const path = require('path');

module.exports = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
};