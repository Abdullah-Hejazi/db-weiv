import { createApp } from "vue";
import { createPinia } from "pinia";

import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/md-dark-deeppurple/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

// components
import Menubar from 'primevue/menubar';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Checkbox from 'primevue/checkbox';
import InputNumber from 'primevue/inputnumber';
import Tooltip from 'primevue/tooltip';
import Dialog from 'primevue/dialog';
import InlineMessage from 'primevue/inlinemessage';
import PanelMenu from 'primevue/panelmenu';
import Divider from 'primevue/divider';
import Toolbar from 'primevue/toolbar';


import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue);

app.component('Menubar', Menubar);
app.component('Card', Card);
app.component('Button', Button);
app.component('InputText', InputText);
app.component('Password', Password);
app.component('Checkbox', Checkbox);
app.component('InputNumber', InputNumber);
app.component('Dialog', Dialog);
// app.component('Tooltip', Tooltip);
app.component('InlineMessage', InlineMessage);
app.component('PanelMenu', PanelMenu);
app.component('Divider', Divider);
app.component('Toolbar', Toolbar);

app.directive('Tooltip', Tooltip);

app.mount("#app");
