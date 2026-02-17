import {http} from '../../../service/config';

export default {

    listar: () => {
        return http.get('zoom-produtos')
    },
    buscaProduto: (nome) => {
        return http.get('zoom-produto/' + nome);
    },
    buscaProdutoOid: (oid) => {
        return http.get('zoom-produto/' + oid);
    }
}