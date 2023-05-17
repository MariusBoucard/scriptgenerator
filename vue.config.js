module.exports = {
    pluginOptions: {
      electronBuilder: {
        builderOptions: {
          productName: 'Script Generator\'s',
        linux: {
          target: ['deb', 'snap', 'AppImage'],
          icon: 'public/icon.png'
        },
        mac: {
          target: ['dmg', 'zip'],
          icon: 'public/icon.icns'
        },
        win: {
          target: ['nsis', 'zip'],
          icon: 'icon.png'
        },
          // Copy static assets to the build directory
          extraResources: [
            {
              from: './src/assets/logo.png',
              to: './public/logo.png',
            },
          ],
        },
      },
    },
  };