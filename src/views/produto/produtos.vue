<template>
    <v-app id="inspire">
        <v-data-table :headers="headers" :items="produtos" :search="pesquisaRapida" sort-by="calories"
                      :loading="loading" loading-text="Loading... Please wait" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat color="dack">
                    <v-toolbar-title>Produtos</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-text-field v-model="pesquisaRapida" label="Pesquisa rápida" single-line
                                  hide-details></v-text-field>
                    <v-icon>{{ icons.mdiMagnify }}</v-icon>
                    <div class="flex-grow-1"></div>
                    <router-link class="link-menu" to='/produto/new'>
                        <v-btn color="green" dark class="mb-2">Novo Produto</v-btn>
                    </router-link>
                </v-toolbar>
            </template>
            <template v-slot:item.editar="{ item }">
                <v-icon small color="blue" class="mr-2" @click="editItem(item)">{{icons.mdiPencil}}</v-icon>
            </template>
            <template v-slot:item.excluir="{ item }">
                <div>
                    <v-icon small color="red" @click="excluir(item)">{{icons.mdiDelete}}</v-icon>
                </div>
            </template>
        </v-data-table>
    </v-app>
</template>


<script>
    import Router from '../../router';
    import Produto from './produto.service';
    import {mdiAccount, mdiDelete, mdiMagnify, mdiPencil} from '@mdi/js'


    export default {
        Router,
        data: () => ({
            icons: {
                mdiAccount,
                mdiMagnify,
                mdiPencil,
                mdiDelete,
            },
            msgDeAlertas: {
                success: '',
                error: '',
                info: '',
                warning: '',
            },
            produtos: [],
            loading: false,
            pesquisaRapida: '',
            headers: [
                {
                    text: 'Nome',
                    align: 'left',
                    value: 'nome',
                },
                {
                    text: 'Código',
                    align: 'left',
                    value: 'codigo'
                },
                {
                    text: 'Data Criação',
                    align: 'center',
                    value: 'dataCriacao'
                },
                {
                    text: 'Editar',
                    value: 'editar',
                    align: 'center',
                    sortable: false
                },
                {
                    text: 'Excluir',
                    value: 'excluir',
                    align: 'center',
                    sortable: false,
                    showgroupby: false,
                },
            ],
        }),

        created() {
            this.initialize()
        },

        methods: {
            initialize() {
                this.loading = true;
                Produto.listar().then(resposta => {
                    this.produtos = resposta.data;
                    this.loading = false;
                }).catch(onError => {
                    if (onError.response && onError.response.data) {
                        this.onError(onError.response.data.message);
                    } else {
                        this.onError(onError);
                    }
                    this.loading = false;
                });
            },

            editItem(item) {
                if (item && item.oid) {
                    this.$router.push({path: `/produto/${item.oid}`});
                }
            },
            excluir(item) {
                this.$swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger'
                    },
                    buttonsStyling: false
                });
                this.$swal.fire({
                    position: 'top',
                    title: 'Deseja excluir esse produto?',
                    type: 'question',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sim, excluir!',
                    cancelButtonText: 'Não, cancelar!',
                    confirmButtonColor: 'hsl(119, 37%, 50%)',
                    cancelButtonColor: '#d33',
                    reverseButtons: true
                }).then(resposta => {
                    if (resposta.value) {
                        Produto.bloquear(item).then(resposta => {
                            this.onSuccess(resposta.data);
                            this.close();
                        }).catch(onError => {
                            if (onError.response && onError.response.data) {
                                this.onError(onError.response.data.message);
                            } else {
                                this.onError(onError);
                            }
                            this.close();
                        });
                    } else {
                        this.onCancelado();
                        this.close();
                    }
                });
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
            onCancelado(msg) {
                this.$swal.fire({
                    position: 'top',
                    type: 'error',
                    title: 'Cancelado',
                    text: msg,
                    timer: 2000,
                })
            },
        },
        components: {},
    };
</script>

<style>

</style>