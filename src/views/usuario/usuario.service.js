import {http} from '../../service/config';

export default {

    listar: () => {
        return http.get('usuarios');
    },

    post: (usuario) => {
        return http.post('usuario', usuario);
    },

    bloquear: (usuario) => {
        return http.post('usuario-bloquear', usuario);
    },

    buscaUsuario: (oid) => {
        return http.get('usuario/' + oid);
    },

    getUsuarioLogado: (usuario) => {
        return http.post("get-usuario-logado", usuario)
    }
}