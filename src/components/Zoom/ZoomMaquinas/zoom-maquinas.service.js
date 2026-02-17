import {http} from '../../../service/config';

export default {

    listar: () => {
        return http.get('zoom-maquinas')
    },
    buscaMaquina: (nome) => {
        return http.get('zoom-maquinas/' + nome);
    }
}