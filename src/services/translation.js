class Translation {
    constructor(defaultLanguage, supportedLanguages) {
        this.defaultLanguage = defaultLanguage;
        this.supportedLanguages = supportedLanguages;
        this.currentLanguage = {
            language: defaultLanguage,
            translations: require(`@/assets/languages/${defaultLanguage.toLowerCase()}.json`)
        };
    }

    load(language) {
        if (this.supportedLanguages.indexOf(language) !== -1) {
            this.currentLanguage = {
                language: language,
                translations: require(`@/assets/languages/${language.toLowerCase()}.json`)
            };
        }

        console.log(this.currentLanguage)
    }

    translate(key) {
        let result = key.split('.').reduce((json, item) => {
            if (json) return json[item]
        }, this.currentLanguage.translations)

        return result ?? key.split('.').join(' ')
    }
}

export default Translation