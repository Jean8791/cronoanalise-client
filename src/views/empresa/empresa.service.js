import {http} from '../../service/config';

export default {

    listar: () => {
        return http.get('empresas')
    },

    post: (empresa) => {
        return http.post('empresa', empresa)
    },

    remover: (oid) => {
        return http.post('empresa/' + oid + '/parada');
    },

    bloquear: (empresa) => {
        return http.post('empresa-bloquear', empresa);
    },

    buscaEmpresa: (oid) => {
        return http.get('empresa/' + oid);
    }
}