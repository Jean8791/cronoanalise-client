<template>
    <v-card>
        <v-card-title>
            <span>{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col cols="12" sm="5" md="5">
                        <v-text-field v-model="produto.nome"
                                      label="Nome" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="2" md="2">
                        <v-text-field v-model="produto.codigo"
                                      label="Código" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="5" md="5">
                        <zoomEmpresas :oidEmpresa="produto.empresa.oid"
                                      v-on:empresaSelecionada="adicionarEmpresaSelecionada"></zoomEmpresas>
                    </v-col>
                </v-row>
                <br/>
                <v-row justify="center">
                    <v-dialog v-model="dialogOperacao" persistent max-width="900">
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" @click="" dark v-on="on">
                                Adicionar Operação
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span v-if="!editar">Cadastro de Operação</span>
                                <span v-if="editar">Editar Operação</span>
                            </v-card-title>
                            <v-divider></v-divider>
                            <br/>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="12" sm="3" md="3">
                                        <v-text-field v-model="operacao.quantidadeOperadores"
                                                      v-mask="['#', '##']"
                                                      label="Operadores"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field v-model="operacao.nome"
                                                      label="Operação"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-textarea
                                                v-model="operacao.descricao"
                                                class="mx-3"
                                                label="Descrição da Operação"
                                                rows="2"
                                        ></v-textarea>
                                    </v-col>
                                </v-row>
                                <br/>
                                <validacoes :success="false" :info="false" :warning="validacoes"
                                            :error="false"></validacoes>
                            </v-card-text>
                            <v-card-actions>
                                <div class="flex-grow-1"></div>
                                <v-btn color="grey darken-1" @click="closeDialogOperacao()">Voltar</v-btn>
                                <v-btn color="green darken-1" @click="adicionarOperação()">Adicionar
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-row>
                <br/>
                <v-simple-table :dense="dense" :fixed-header="fixedHeader" :height="height">
                    <thead>
                    <tr>
                        <th style="width:120px;" class="text-center">Operadores</th>
                        <th style="width:200px;" class="text-left">Operação</th>
                        <th style="width:500px;" class="text-left">Descrição</th>
                        <th style="width:80px;" class="text-center">Editar</th>
                        <th style="width:80px;" class="text-center">Remover</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item ,index) in operacoes" :key="item.oid">
                        <td class="text-center">{{item.quantidadeOperadores}}</td>
                        <td class="text-left">{{item.nome}}</td>
                        <td class="text-left">{{ item.descricao }}</td>
                        <td class="text-center">
                            <v-icon small color="blue" @click="editarOperacao(index,item.oid)">
                                {{icons.mdiPencil}}
                            </v-icon>
                        </td>
                        <td class="text-center">
                            <v-icon small color="red" @click="removerOperacao(index,item.oid)">
                                {{icons.mdiDelete}}
                            </v-icon>
                        </td>
                    </tr>
                    </tbody>
                </v-simple-table>
                <br/>
                <validacoes :success="false" :info="false" :warning="validacoes"
                            :error="false"></validacoes>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="grey darken-1" @click="close">Voltar</v-btn>
            <v-btn color="green darken-1" @click="save">Salvar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import Router from '../../../router';
    import Produto from "../produto.service";
    import Validacoes from "../../../components/Validacoes";
    import ZoomEmpresas from "../../../components/Zoom/ZoomEmpresas/ZoomEmpresas";
    import {mdiPlusBoxOutline, mdiDelete, mdiPencil} from '@mdi/js';

    export default {
        name: "Produto",
        Router,
        data: () => ({
            dialogOperacao: false,
            dense: false,
            fixedHeader: false,
            height: 260,
            editar: false,
            icons: {
                mdiPlusBoxOutline,
                mdiDelete,
                mdiPencil
            },
            operacoes: [],
            operacao: {
                oid: null,
                quantidadeOperadores: '',
                nome: '',
                descricao: '',
                observacoes: [],
                index: 0,
            },
            empresaOid: '',
            msgDeAlertas: {
                success: '',
                error: '',
                info: '',
                warning: '',
            },
            produto: {
                nome: '',
                codigo: '',
                oid: '',
                operacoes: [],
            },
            validacoes: [],
            valid: true,
        }),
        computed: {
            formTitle() {
                return this.$route.params.oid === 'new' ? 'Novo Produto' : 'Editar Produto';
            },
        },
        created() {
            if (this.$route.params.oid && this.$route.params.oid !== 'new') {
                this.buscaProduto()
            } else {
                this.produto.empresa = {oid: ''};
            }
        },
        methods: {
            adicionarOperação() {
                this.checkFormModalOperacao();
                if (!this.editar) {
                    this.operacao.observacoes = [];
                    this.operacoes.push(this.operacao);
                    this.operacao = {};
                    this.dialogOperacao = false;
                } else {
                    this.operacaoEditada();
                }
            },
            operacaoEditada() {
                this.operacoes[this.operacao.index].oid = this.operacao.oid;
                this.operacoes[this.operacao.index].quantidadeOperadores = this.operacao.quantidadeOperadores;
                this.operacoes[this.operacao.index].nome = this.operacao.nome;
                this.operacoes[this.operacao.index].descricao = this.operacao.descricao;
                this.operacao = {};
                this.editar = false;
                this.dialogOperacao = false;
            },
            editarOperacao(index, oid) {
                this.operacao = this.operacoes[index];
                this.operacao.index = index;
                this.editar = true;
                this.dialogOperacao = true;
            },
            removerOperacao(index, oid) {
                this.$swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger'
                    },
                    buttonsStyling: false
                });
                this.$swal.fire({
                    position: 'top',
                    title: 'Deseja remover essa operação?',
                    type: 'question',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sim, remover!',
                    cancelButtonText: 'Não, cancelar!',
                    confirmButtonColor: 'hsl(119, 37%, 50%)',
                    cancelButtonColor: '#d33',
                    reverseButtons: true
                }).then(resposta => {
                    if (resposta.value) {
                        if (index > -1) {
                            this.operacoes.splice(index, 1);
                        }
                    } else {
                        this.onCancelado();
                    }
                });
            },
            closeDialogOperacao() {
                this.validacoes = [];
                this.dialogOperacao = false;
            },
            checkFormModalOperacao: function (e) {
                this.validacoes = [];

                if (!this.operacao.quantidadeOperadores) {
                    this.validacoes.push('A quantidade de operadores é obrigatório.');
                } else if (!this.operacao.quantidadeOperadores > 0) {
                    this.validacoes.push('Digite uma quantidade minima de 1 operador.');
                }
                if (!this.operacao.nome) {
                    this.validacoes.push('Operação é obrigatório.');
                }
                if (!this.validacoes.length) {
                    return true;
                }
                e.preventDefault();
            },
            buscaProduto() {
                Produto.buscaProduto(this.$route.params.oid).then(resposta => {
                    this.produto = resposta.data;
                    this.operacoes = this.produto.operacoes;
                }).catch(onError => {
                    if (onError.response && onError.response.data) {
                        this.msgDeAlertas.error = onError.response.data.message;
                    } else {
                        this.msgDeAlertas.error = onError;
                    }
                });
            },
            adicionarEmpresaSelecionada(valor) {
                if (valor != null && valor.oid != null) {
                    this.produto.empresa = {};
                    this.produto.empresa.oid = valor.oid;
                }
            },
            save() {
                this.checkForm();
                this.produto.operacoes = this.operacoes;
                if (this.produto.oid) {
                    Produto.post(this.produto).then(resposta => {
                        this.onSuccess(resposta.data);
                        this.close();
                    }).catch(onError => {
                        if (onError.response && onError.response.data) {
                            this.onError(onError.response.data.message);
                        } else {
                            this.onError(onError);
                        }
                    });
                } else {
                    Produto.post(this.produto).then(resposta => {
                        this.onSuccess(resposta.data);
                        this.close();
                    }).catch(onError => {
                        if (onError.response && onError.response.data) {
                            this.onError(onError.response.data.message);
                        } else {
                            this.onError(onError);
                        }
                    });
                }
            },
            checkForm: function (e) {
                this.validacoes = [];

                if (!this.produto.nome) {
                    this.validacoes.push('O nome é obrigatório.');
                }
                if (!this.produto.codigo) {
                    this.validacoes.push('O código é obrigatório.');
                }

                if (this.produto.empresa && !this.produto.empresa.oid) {
                    this.validacoes.push('A empresa é obrigatória.');
                }

                if (!this.operacoes || this.operacoes.length <= 0) {
                    this.validacoes.push('Adicione pelo menos uma operação.');
                }

                if (!this.validacoes.length) {
                    return true;
                }

                e.preventDefault();
            },

            close() {
                this.validacoes = [];
                this.$router.push('/produtos');
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
        components: {Validacoes, ZoomEmpresas},
    };
</script>

<style scoped>

</style>