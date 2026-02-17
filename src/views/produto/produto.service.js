import {http} from '../../service/config';

export default {

    listar: () => {
        return http.get('produtos');
    },

    post: (produto) => {
        return http.post('produto', produto);
    },

    salvarProdutoCronoanalise: (produto) => {
        return http.post('produto-cronoanalise', produto);
    },

    bloquear: (produto) => {
        return http.post('produto-bloquear', produto);
    },

    buscaProduto: (oid) => {
        return http.get('produto/' + oid);
    }
}