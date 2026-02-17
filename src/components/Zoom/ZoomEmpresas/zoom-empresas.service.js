import {http} from '../../../service/config';

export default {

    listar: () => {
        return http.get('zoom-empresas')
    },
    buscaEmpresa: (nome) => {
        return http.get('zoom-empresas/' + nome);
    },
    buscaEmpresaOid: (oid) => {
        return http.get('zoom-empresas-oid/' + oid);
    }
}