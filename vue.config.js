module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                win: {
                    target: 'portable',
                    asar: true,
                    icon: 'build/icon.ico'
                }
              }
        }
    }
}