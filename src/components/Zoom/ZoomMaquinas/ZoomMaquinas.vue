<template>
    <div id="ZoomMaquinas">
        <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on }">
                <v-text-field v-model="maquina.nome" v-on:blur="consultaPeloNome()" label="Nome"
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
                                  :items="maquinas"
                                  :search="pesquisaRapida"
                                  sort-by="calories"
                                  :single-select="singleSelect"
                                  item-key="oid"
                                  :loading="loading" loading-text="Loading... Please wait"
                                  class="elevation-1"
                                  v-model="maquinaSelecionada">
                    </v-data-table>
                </v-card-text>
                <br>
                <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn color="grey darken-1" @click="close">Voltar</v-btn>
                    <v-btn color="green darken-1" @click="save">Salvar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import {mdiMagnify} from '@mdi/js';
    import ZoomMaquinas from './zoom-maquinas.service';

    export default {
        name: "ZoomMaquinas",
        data: () => ({
            icons: {
                mdiMagnify,
            },
            dialog: false,
            formTitle: 'Zoom De Maquinas',
            headers: [
                {
                    text: 'Nome',
                    align: 'center',
                    value: 'nome'
                },
                {
                    text: 'Descrição',
                    align: 'center',
                    value: 'descricao'
                },
            ],
            loading: false,
            pesquisaRapida: '',
            singleSelect: true,
            maquinaSelecionada: [],
            maquinas: [],
            maquina: {
                oid: '',
                nome: '',
                descricao: '',
            },
        }),
        methods: {
            initialize() {
                this.loading = true;
                ZoomMaquinas.listar().then(resposta => {
                    this.dialog = true;
                    this.maquinas = resposta.data;
                    this.loading = false;
                }).catch(onError => {
                    this.msgDeAlertas.error = onError;
                });
            },
            consultaPeloNome() {
                if (this.maquina.nome) {
                    ZoomMaquinas.buscaMaquina(this.maquina.nome).then(resposta => {
                        this.maquina = resposta.data;
                        this.$emit('maquinaSelecionada', this.maquina);
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
                this.maquinaSelecionada = [];
                this.maquinas = [];
            },
            save() {
                if (this.maquinaSelecionada && this.maquinaSelecionada.length > 0) {
                    if (this.maquinaSelecionada) {
                        this.maquina = this.maquinaSelecionada[0];
                        this.$emit('maquinaSelecionada', this.maquina);
                    }
                    this.close();
                } else {

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
        },
    }
</script>

<style scoped>

</style>