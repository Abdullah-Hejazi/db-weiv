import { createApp } from "vue";

import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/arya-blue/theme.css';
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
import Panel from 'primevue/panel';
import Divider from 'primevue/divider';
import Toolbar from 'primevue/toolbar';
import ProgressSpinner from 'primevue/progressspinner';
import BlockUI from 'primevue/blockui';
import Menu from 'primevue/menu';
import Breadcrumb from 'primevue/breadcrumb';
import Dropdown from 'primevue/dropdown';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import ConfirmationService from 'primevue/confirmationservice';
import ConfirmDialog from 'primevue/confirmdialog';
import ScrollPanel from 'primevue/scrollpanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import TabMenu from 'primevue/tabmenu';
import Paginator from 'primevue/paginator';
import ScrollTop from 'primevue/scrolltop';


import App from "./App.vue";
import router from "./router";
import store from '@/stores/store';

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {ripple: true});
app.use(store);

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
app.component('ProgressSpinner', ProgressSpinner);
app.component('BlockUI', BlockUI);
app.component('Menu', Menu);
app.component('Panel', Panel);
app.component('Breadcrumb', Breadcrumb);
app.component('Dropdown', Dropdown);
// app.component('ToastService', ToastService);
app.component('Toast', Toast);
// app.component('ConfirmationService', ConfirmationService);
app.component('ConfirmDialog', ConfirmDialog);
app.component('ScrollPanel', ScrollPanel);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('TabMenu', TabMenu);
app.component('Paginator', Paginator);
app.component('ScrollTop', ScrollTop);


app.directive('Tooltip', Tooltip);
app.use(ToastService);
app.use(ConfirmationService);

app.mount("#app");
