module.exports = {
    pluginOptions: {
      electronBuilder: {
        builderOptions: {
          // Copy static assets to the build directory
          extraResources: [
            {
              from: './src/assets/logo.png',
              to: './',
            },
          ],
        },
      },
    },
  };