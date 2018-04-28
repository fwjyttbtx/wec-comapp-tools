import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routers'
import {
    Button,
    Select,
    Option,
    Card,
    Row,
    Col,
    Message,
    MessageBox,
    Tabs,
    TabPane,
    Table,
    TableColumn,
    Input,
    Menu,
    MenuItem,
    Dialog,
    Form,
    FormItem,
    Pagination,
    Tooltip,
    Loading
} from 'element-ui'
import App from './App.vue'
import axios from 'axios'

Vue.use(VueRouter);

Vue.use(Button);
Vue.use(Select);
Vue.use(Option);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Input);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Pagination);
Vue.use(Tooltip);
Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$http = axios;
Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;

const router = new VueRouter({routes});

new Vue({
    el: '#app',
    router,
    render: h => h(App)
});