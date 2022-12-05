module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                win: {
                    target: 'portable',
                    asar: true,
                    icon: 'build/icon.png'
                },
                linux:{
                    target:[
                        "deb",
                    ],
                    category: "Development",
                    icon: 'build/icon.png'
                },
                directories:{
                    buildResources: "build"
                }
              }
        }
    }
}