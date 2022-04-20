export default {
    install(Vue, options) {
        Vue.config.globalProperties.$loading = {
            show: () => {
                let element = document.getElementById('db-weiv-loading-module');
                element.style.display = 'block';
            },

            hide: () => {
                let element = document.getElementById('db-weiv-loading-module');
                element.style.display = 'none';
            }
        }
    }
}