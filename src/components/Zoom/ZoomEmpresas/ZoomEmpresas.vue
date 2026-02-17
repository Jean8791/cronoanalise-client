<template>
    <div id="ZoomEmpresas">
        <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on }">
                <v-text-field v-model="empresa.nome" label="Empresa"
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
                                  :items="empresas"
                                  :search="pesquisaRapida"
                                  sort-by="calories"
                                  :single-select="singleSelect"
                                  item-key="oid"
                                  :loading="loading" loading-text="Loading... Please wait"
                                  class="elevation-1"
                                  v-model="empresaSelecionada">
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
    import ZoomEmpresas from './zoom-empresas.service';

    export default {
        mounted() {
            this.innerMethod();
        },
        name: "ZoomEmpresas",
        props: ['oidEmpresa'],
        data: () => ({
            icons: {
                mdiMagnify,
            },
            dialog: false,
            formTitle: 'Zoom De Empresas',
            headers: [
                {
                    text: 'Nome',
                    align: 'center',
                    value: 'nome'
                },
                {
                    text: 'CNPJ',
                    align: 'center',
                    value: 'cnpj'
                },
                {
                    text: 'Turno',
                    align: 'center',
                    value: 'turno'
                }
            ],
            loading: false,
            pesquisaRapida: '',
            singleSelect: true,
            empresaSelecionada: [],
            empresas: [],
            empresa: {},
        }),
        methods: {
            initialize() {
                this.loading = true;
                ZoomEmpresas.listar().then(resposta => {
                    this.dialog = true;
                    this.empresas = resposta.data;
                    this.loading = false;
                }).catch(onError => {
                    this.msgDeAlertas.error = onError;
                });
            },
            consultaPeloOid() {
                if (this.oidEmpresa) {
                    ZoomEmpresas.buscaEmpresaOid(this.oidEmpresa).then(resposta => {
                        this.empresa = resposta.data;
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
                this.empresaSelecionada = [];
                this.empresas = [];
            },
            selecionar() {
                if (this.empresaSelecionada && this.empresaSelecionada.length > 0) {
                    if (this.empresaSelecionada) {
                        this.empresa = this.empresaSelecionada[0];
                        this.$emit('empresaSelecionada', this.empresa);
                    }
                    this.close();
                } else {
                    this.onError('Falha ao selecionar Empresa');
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