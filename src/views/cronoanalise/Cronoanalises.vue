<template>
    <v-app id="inspire">
        <v-data-table :headers="headers" :items="cronoanalises" :search="pesquisaRapida" sort-by="calories"
                      :loading="loading" loading-text="Loading... Please wait" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat color="dack">
                    <v-toolbar-title>Cronoanalise</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-text-field v-model="pesquisaRapida" label="Pesquisa rápida" single-line
                                  hide-details></v-text-field>
                    <v-icon>{{ icons.mdiMagnify }}</v-icon>
                    <div class="flex-grow-1"></div>
                    <router-link class="link-menu" @click="novaCronoanalise" to='/cronoanalise/new'>
                        <v-btn color="green" dark class="mb-2">Nova Cronoanalise</v-btn>
                    </router-link>
                </v-toolbar>
            </template>
            <template v-slot:item.detalhar="{ item }">
                <div>
                    <v-icon great color="blue" @click="detalharCronoanalise(item)">{{icons.mdiFileDocumentBoxSearch}}
                    </v-icon>
                </div>
            </template>
        </v-data-table>
    </v-app>
</template>

<script>

    import Router from '../../router';
    import Cronoanalise from './cronoanalise.service';
    import {mdiAccount, mdiMagnify, mdiFileDocumentBoxSearch} from '@mdi/js'

    export default {
        name: "Cronoanalises",
        Router,
        data: () => ({
            icons: {
                mdiAccount,
                mdiMagnify,
                mdiFileDocumentBoxSearch
            },
            msgDeAlertas: {
                success: '',
                error: '',
                info: '',
                warning: '',
            },
            cronoanalises: [],
            loading: false,
            pesquisaRapida: '',
            headers: [
                {
                    text: 'Código',
                    align: 'left',
                    value: 'produto.codigo'
                },
                {
                    text: 'Nome Produto',
                    align: 'left',
                    value: 'produto.nome',
                },
                {
                    text: 'Empresa',
                    align: 'left',
                    value: 'produto.empresa.nome',
                },
                {
                    text: 'Cronoanalista',
                    align: 'left',
                    value: 'cronoanalista',
                },
                {
                    text: 'Observações',
                    align: 'center',
                    value: 'produto.quantidadeObservacoes',
                },
                {
                    text: 'Data Criação',
                    align: 'center',
                    value: 'dataCriacao'
                },
                {
                    text: 'Detalhar',
                    value: 'detalhar',
                    align: 'center',
                    sortable: false
                },
            ],
        }),
        created() {
            this.initialize()
        },
        methods: {
            initialize() {
                this.loading = true;
                Cronoanalise.listar().then(resposta => {
                    this.loading = false;
                    this.cronoanalises = resposta.data;
                }).catch(onError => {
                    if (onError.response && onError.response.data) {
                        this.onError(onError.response.data.message);
                    } else {
                        this.onError(onError);
                    }
                    this.loading = false;
                });
            },
            detalharCronoanalise(item) {
                if (item && item.oid) {
                    Cronoanalise.detalharCronoanalise(item.oid).then().catch(onError => {
                        if (onError.response && onError.response.data) {
                            this.onError(onError.response.data.message);
                        } else {
                            this.onError(onError);
                        }
                    });
                    this.$router.push({path: `/detalhar-cronoanalise/${item.oid}`});
                }
            },
            close() {
                setTimeout(() => {
                    this.initialize();
                }, 300);
            },
            onSuccess(msg) {
                this.$swal.fire({
                    position: 'top',
                    type: 'success',
                    title: 'Sucesso',
                    text: msg,
                    showConfirmButton: false,
                    timer: 2000
                });
            },
            onError(msg) {
                this.$swal.fire({
                    position: 'top',
                    type: 'error',
                    title: 'Erro',
                    text: msg,
                    timer: 2000,
                })
            },
        },
        components: {},
    }
</script>

<style scoped>

</style>