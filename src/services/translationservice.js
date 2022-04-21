let supportedLanguages = [
    'English',
    'Arabic'
];

export default {
    install(Vue, options) {
        let translation = {
            supportedLanguages: supportedLanguages,

            current: {
                language: 'english',
                translations: require('@/assets/languages/english.json')
            },

            load(language) {
                if (supportedLanguages.indexOf(language)) {
                    this.current = {
                        language: language,
                        translations: require(`@/assets/languages/${language.toLowerCase()}.json`)
                    };
                }
            }
        }

        Vue.config.globalProperties.$translate = (key) => {
            let result = key.split('.').reduce((json, item) => {
                if (json) return json[item]
            }, translation.current.translations)

            return result ?? key.split('.').join(' ')
        }

        Vue.config.globalProperties.$translation = translation
    }
}