// routes.js

import Login from './views/Login';
import Logo from "./views/Logo";
import Home from './views/Home';
import Usuarios from './views/usuario/Usuarios';
import Usuario from './views/usuario/show/Usuario';
import Empresas from './views/empresa/Empresas';
import Empresa from './views/empresa/show/Empresa';
import Produtos from './views/produto/produtos';
import Produto from './views/produto/show/Produto';
import Cronoanalises from './views/cronoanalise/Cronoanalises';
import Cronoanalise from './views/cronoanalise/show/Cronoanalise';
import DetalharCronoanalise from "./views/cronoanalise/DetalharCronoanalise";


const routes = [
    {path: '/login', component: Login},
    {path: '/', component: Logo},
    {path: '/home', component: Home},
    {path: '/usuarios', component: Usuarios},
    {path: '/usuario/:oid', component: Usuario},
    {path: '/empresas', component: Empresas},
    {path: '/empresa/:oid', component: Empresa},
    {path: '/produtos', component: Produtos},
    {path: '/produto/:oid', component: Produto},
    {path: '/cronoanalises', component: Cronoanalises},
    {path: '/cronoanalise/:oid', component: Cronoanalise},
    {path: '/detalhar-cronoanalise/:oid', component: DetalharCronoanalise}
];

export default routes;