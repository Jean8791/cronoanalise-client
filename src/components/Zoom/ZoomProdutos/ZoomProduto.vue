<template>
    <div id="ZoomProdutos">
        <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on }">
                <v-text-field v-model="produto.nome" label="Produto"
                              prepend-icon="mdi-magnify"
                              @click:prepend="initialize()"></v-text-field>
            </template>
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                    <div class="flex-grow-1"></div>
                    <v-text-field prepend-icon="mdi-magnify" v-model="pesquisaRapida" label="Pesquisa rápida"
                                  single-line
                                  hide-details></v-text-field>
                </v-card-title>
                <br>
                <v-card-text>

                    <v-data-table :headers="headers" show-select
                                  :items="produtos"
                                  :search="pesquisaRapida"
                                  sort-by="calories"
                                  :single-select="singleSelect"
                                  item-key="oid"
                                  :loading="loading" loading-text="Loading... Please wait"
                                  class="elevation-1"
                                  v-model="produtoSelecionado">
                    </v-data-table>
                </v-card-text>
                <br>
                <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn color="grey darken-1" @click="close">Voltar</v-btn>
                    <v-btn color="green darken-1" @click="selecionar">Selecionar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import {mdiMagnify} from '@mdi/js';
    import ZoomProduto from './zoom-produto-service';

    export default {
        name: "ZoomProduto",
        mounted() {
            this.innerMethod();
        },
        props: ['oidProduto'],
        data: () => ({
            icons: {
                mdiMagnify,
            },
            dialog: false,
            formTitle: 'Zoom De Produto',
            headers: [
                {
                    text: 'Nome',
                    align: 'center',
                    value: 'nome'
                },
                {
                    text: 'Código',
                    align: 'center',
                    value: 'codigo'
                }
            ],
            loading: false,
            pesquisaRapida: '',
            singleSelect: true,
            produtoSelecionado: [],
            produtos: [],
            produto: {},
        }),
        methods: {
            initialize() {
                this.loading = true;
                ZoomProduto.listar().then(resposta => {
                    this.dialog = true;
                    this.produtos = resposta.data;
                    this.loading = false;
                }).catch(onError => {
                    if (onError.response && onError.response.data) {
                        this.onError(onError.response.data.message);
                    } else {
                        this.onError(onError);
                    }
                });
            },
            consultaPeloOid() {
                if (this.oidProduto) {
                    ZoomProduto.buscaProdutoOid(this.oidProduto).then(resposta => {
                        this.produto = resposta.data;
                        this.$emit('produtoSelecionado', this.produto);
                    }).catch(onError => {
                        if (onError.response && onError.response.data) {
                            this.onError(onError.response.data.message);
                        } else {
                            this.onError(onError);
                        }
                    })
                }
            },
            close() {
                this.dialog = false;
                this.produtoSelecionado = [];
                this.produtos = [];
            },
            selecionar() {
                if (this.produtoSelecionado && this.produtoSelecionado.length > 0) {
                    if (this.produtoSelecionado) {
                        this.produto = this.produtoSelecionado[0];
                        this.$emit('produtoSelecionado', this.produto);
                    }
                    this.close();
                } else {
                    this.onError('Falha ao selecionar Produto');
                    this.close();
                }
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
            innerMethod() {
                this.consultaPeloOid();
            },
        },
    }
</script>

<style scoped>

</style>