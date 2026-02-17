import {http} from '../../service/config';

export default {

    listar: () => {
        return http.get('cronoanalises');
    },

    post: (cronoanalise) => {
        return http.post('cronoanalise', cronoanalise);
    },

    detalharCronoanalise: (oid) => {
        return http.get('cronoanalise-detalhar/' + oid);
    },

    getCronoanalise: (oid) => {
        return http.get('cronoanalise/' + oid);
    },

    getUltimoRegistro() {
        return http.get('cronoanalise-ultimo');
    }
}