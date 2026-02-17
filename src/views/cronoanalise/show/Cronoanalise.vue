<template>
    <v-card>
        <v-card-title>
            <span>{{ formTitle }}</span>
        </v-card-title>
        <v-container>
            <v-stepper v-model="e1">
                <v-stepper-header>
                    <v-stepper-step :complete="e1 > 1" step="1"><h3>Dados Gerais</h3></v-stepper-step>
                    <v-divider></v-divider>
                    <v-stepper-step :complete="e1 > 2" step="2"><h3>Operações</h3></v-stepper-step>
                    <v-divider></v-divider>
                    <v-stepper-step step="3"><h3>Observações</h3></v-stepper-step>
                </v-stepper-header>
                <!--Primeira Aba-->
                <v-stepper-items>
                    <v-stepper-content step="1">
                        <v-card-text class="mb-12" color="lighten-1">
                            <v-row>
                                <!--                                    v-on:blur="verificaCheckBox"-->
                                <v-col cols="12" sm="4" md="4">
                                    <div v-if="!checkbox">
                                        <v-text-field v-model="cronoanalise.produto.nome" label="Produto"
                                                      required></v-text-field>
                                    </div>
                                    <div v-if="checkbox">
                                        <zoom-produto
                                                v-on:produtoSelecionado="adicionarProdutoSelecionado"></zoom-produto>
                                    </div>
                                </v-col>
                                <v-col cols="12" sm="3" md="3">
                                    <div v-if="checkbox">
                                        <v-text-field v-model="cronoanalise.produto.codigo" label="Código" required
                                                      v-bind:disabled="true"></v-text-field>
                                    </div>
                                    <div v-if="!checkbox">
                                        <v-text-field v-model="cronoanalise.produto.codigo" label="Código" required
                                        ></v-text-field>
                                    </div>
                                </v-col>
                                <v-col cols="12" sm="3" md="3">
                                    <v-text-field v-model="cronoanalise.cronoanalista" label="Cronoanalista"
                                                  required></v-text-field>
                                </v-col>
                            </v-row>
                            <br/>
                            <v-row>
                                <v-col cols="12" sm="5" md="5">
                                    <div v-if="checkbox">
                                        <v-text-field v-model="cronoanalise.produto.empresa.nome"
                                                      label="Empresa" v-bind:disabled="true"></v-text-field>
                                    </div>
                                    <div v-if="!checkbox">
                                        <zoomEmpresas :oidEmpresa="cronoanalise.produto.empresa.oid"
                                                      v-on:empresaSelecionada="adicionarEmpresaSelecionada"></zoomEmpresas>
                                    </div>
                                </v-col>
                                <v-col cols="12" sm="2" md="2">
                                    <v-text-field v-model="cronoanalise.produto.empresa.turno" label="Turno"
                                                  v-mask="['#:##', '##:##']" required></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="2" md="2">
                                    <v-text-field v-model="cronoanalise.erroRelativo" label="Erro Relativo"
                                                  v-mask="['#.####']" required></v-text-field>
                                </v-col>
                            </v-row>
                            <br/>
                            <validacoes :success="false" :info="false" :warning="validacoes"
                                        :error="false"></validacoes>
                        </v-card-text>
                        <div align="right">
                            <v-btn class="ma-2" color="red darken-1" @click="close">Cancelar</v-btn>
                            <v-btn class="ma-2" color="green darken-1" @click="proximoPasso()">Continuar</v-btn>
                        </div>
                    </v-stepper-content>

                    <!-- Segunda Aba-->

                    <v-stepper-content step="2">
                        <v-card-text class="mb-12" color="lighten-1">
                            <v-row>
                                <v-col cols="12" sm="3" md="3">
                                    <v-text-field v-model="cronoanalise.produto.codigo"
                                                  v-bind:disabled="true" label="Codigo do Produto"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="3" md="3">
                                    <v-text-field v-model="cronoanalise.produto.nome"
                                                  v-bind:disabled="true" label="Produto"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="3" md="3">
                                    <v-text-field v-model="cronoanalise.produto.empresa.nome"
                                                  v-bind:disabled="true" label="Empresa"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="3" md="3">
                                    <v-text-field v-model="cronoanalise.cronoanalista"
                                                  v-bind:disabled="true" label="Cronoanalista"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row justify="center">
                                <v-dialog v-model="dialogOperacao" persistent max-width="900">
                                    <template v-if="!checkbox" v-slot:activator="{ on }">
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
                                        <div align="right">
                                            <v-btn class="ma-2" color="grey darken-1" @click="closeDialogOperacao()">
                                                Voltar
                                            </v-btn>
                                            <v-btn class="ma-2" color="green darken-1" @click="adicionarOperação()">
                                                Adicionar
                                            </v-btn>
                                        </div>
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
                                    <th v-if="!checkbox" style="width:80px;" class="text-center">Editar</th>
                                    <th v-if="!checkbox" style="width:80px;" class="text-center">Remover</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item ,index) in operacoes" :key="item.oid">
                                    <td class="text-center">{{ item.quantidadeOperadores }}</td>
                                    <td class="text-left">{{ item.nome }}</td>
                                    <td class="text-left">{{ item.descricao }}</td>
                                    <td v-if="!checkbox" class="text-center">
                                        <v-icon small color="blue" @click="editarOperacao(index,item.oid)">
                                            {{icons.mdiPencil}}
                                        </v-icon>
                                    </td>
                                    <td v-if="!checkbox" class="text-center">
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
                        </v-card-text>
                        <div align="right">
                            <v-btn class="ma-2" color="red darken-1" @click="close">Cancelar</v-btn>
                            <v-btn class="ma-2" color="grey darken-1" @click="e1 = 1">Voltar</v-btn>
                            <v-btn class="ma-2" color="green" @click="proximoPasso()">Continuar</v-btn>
                        </div>
                    </v-stepper-content>

                    <!--Terceira Aba-->

                    <v-stepper-content step="3">
                        <v-card-text class="mb-12" color="lighten-1" height="400px">
                            <v-row>
                                <v-col cols="12" sm="3" md="3">
                                    <v-text-field v-model="cronoanalise.produto.codigo"
                                                  v-bind:disabled="true" label="Codigo do Produto"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="3" md="3">
                                    <v-text-field v-model="cronoanalise.produto.nome"
                                                  v-bind:disabled="true" label="Produto"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="3" md="3">
                                    <v-text-field v-model="cronoanalise.produto.empresa.nome"
                                                  v-bind:disabled="true" label="Empresa"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="3" md="3">
                                    <v-text-field v-model="cronoanalise.cronoanalista"
                                                  v-bind:disabled="true" label="Cronoanalista"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row justify="center">
                                <v-dialog v-model="dialogObservacao" persistent max-width="1000">
                                    <template v-slot:activator="{ on }">
                                        <v-btn color="primary" @click="adicionarObservacao()" dark v-on="on">
                                            Adicionar Observação
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-card-title>
                                            <span>{{numeroObservacao}}ª Observação</span>
                                        </v-card-title>
                                        <v-stepper v-model="passo">
                                            <br/>
                                            <v-card-text>
                                                <v-row>
                                                    <v-col cols="12" sm="6" md="6">
                                                        <v-text-field class="color-input" :disabled="true"
                                                                      v-model="observacao.operacao"
                                                                      label="Operação"></v-text-field>

                                                    </v-col>
                                                    <v-col cols="12" sm="3" md="3">
                                                        <v-text-field v-model="observacao.tempo"
                                                                      v-mask="['#,##','##,##','###,##']"
                                                                      label="Tempo em Segundos"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <br/>
                                                <validacoes :success="false" :info="false" :warning="validacoes"
                                                            :error="false"></validacoes>
                                            </v-card-text>
                                            <div align="right">
                                                <v-btn class="ma-2" color="grey darken-1"
                                                       @click="closeObservacao(passo)">
                                                    Voltar
                                                </v-btn>
                                                <v-btn class="ma-2" color="green" @click="salvaObservacao(passo)">
                                                    Adicionar
                                                </v-btn>
                                            </div>
                                        </v-stepper>
                                    </v-card>
                                </v-dialog>
                            </v-row>
                            <br/>
                            <v-simple-table :dense="dense" :fixed-header="fixedHeader" :height="height">
                                <table class="TFtable table-observacoes">
                                    <tbody>
                                    <tr>
                                        <th style="font-size: 24px;">Operações</th>
                                        <td v-for="(item,index) in observacoes"><b>{{item.posicao}}ª Observação</b></td>
                                    </tr>
                                    <tr v-for="(item ,index) in operacoes" :key="item.oid">
                                        <th>{{item.nome}}:</th>
                                        <td class="text-center" v-for="(obs ,i) in item.observacoes">
                                            {{trocarPontoPorVirgula(obs.tempo)}} -
                                            {{obs.porcentagem}}%
                                            <v-icon small color="blue" @click="editarObservacao(index,i)">
                                                {{icons.mdiPencil}}
                                            </v-icon>
                                        </td>
                                    </tr>
                                    </tbody>
                                    <tfoot>
                                    <tr>
                                        <td><b>Totais:</b></td>
                                        <td class="text-center" v-for="(item ,index) in listaTotais">
                                            {{item}} - 100%
                                        </td>
                                    </tr>
                                    </tfoot>
                                </table>
                            </v-simple-table>
                            <v-dialog v-model="dialogEdicaoObservacao" max-width="500">
                                <template v-slot:activator="{ on }">
                                    <span color="primary" dark v-on="on"></span>
                                </template>
                                <v-card>
                                    <v-card-title>
                                        <span>Edição da Observação</span>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field v-model="edicaoObservacao.tempo"
                                                              v-mask="['#,##','##,##','###,##']"
                                                              label="Tempo em Segundos"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-btn class="ma-2" color="green" @click="salvarEdicaoObservacao">
                                                    Substituir
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-dialog>
                        </v-card-text>
                        <div align="right">
                            <div v-if="!calculando">
                                <v-btn class="ma-2" color="red darken-1" @click="close">Cancelar</v-btn>
                                <v-btn class="ma-2" color="green darken-1" @click="salvarCronoanalise()">Calcular
                                </v-btn>
                            </div>
                            <div v-if="calculando">
                                <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
                            </div>
                        </div>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </v-container>
    </v-card>
</template>

<script>
    import Router from '../../../router';
    import Cronoanalise from "../cronoanalise.service";
    import Validacoes from "../../../components/Validacoes"
    import {mdiPlusBoxOutline, mdiDelete, mdiPencil} from '@mdi/js';
    import ZoomEmpresas from "../../../components/Zoom/ZoomEmpresas/ZoomEmpresas";
    import ZoomProduto from "../../../components/Zoom/ZoomProdutos/ZoomProduto";

    export default {
        name: "Cronoanalise",
        Router,
        data: () => ({
            dialogOperacao: false,
            dialogObservacao: false,
            dialogEdicaoObservacao: false,
            calculando: false,
            e1: 1,
            dense: false,
            fixedHeader: false,
            height: 300,
            editar: false,
            icons: {
                mdiPlusBoxOutline,
                mdiDelete,
                mdiPencil
            },
            msgDeAlertas: {
                success: '',
                error: '',
                info: '',
                warning: '',
            },
            checkbox: false,
            cronoanalise: {
                oid: null,
                cronoanalista: '',
                erroRelativo: '',
                produto: {
                    oid: null,
                    nome: '',
                    codigo: '',
                    operacoes: [],
                    empresa: {},
                },
            },
            listaTotais: [],
            operacoes: [],
            operacao: {
                oid: null,
                quantidadeOperadores: '',
                nome: '',
                descricao: '',
                observacoes: []
            },
            observacoes: [],
            observacao: {
                operacao: '',
                oid: null,
                tempo: '',
                porcentagem: '',
            },
            validacoes: [],
            valid: true,
            passo: 1,
            numeroObservacao: 0,
            posicao: 0,
            edicaoObservacao: {
                tempo: 0,
                operacao: 0,
                observao: 0
            },
        }),
        watch: {},
        computed: {
            formTitle() {
                return this.$route.params.oid === 'new' ? 'Nova Cronoanalise' : 'Editar Cronoanalise';
            },
        },
        created() {
            if (this.$route.params.oid != 'new') {
                this.adicionarMaisObservacoes(this.$route.params.oid)
            } else {
                this.escolherProdutoCadastradoSimNao();
            }
        },
        methods: {
            escolherProdutoCadastradoSimNao() {
                this.$swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger'
                    },
                    buttonsStyling: false
                });
                this.$swal.fire({
                    position: 'top',
                    title: 'Usar um produto já cadastrado?',
                    type: 'question',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sim!',
                    cancelButtonText: 'Não!',
                    reverseButtons: true
                }).then(resposta => {
                    if (resposta.value) {
                        this.checkbox = true;
                    } else {
                        this.checkbox = false;
                    }
                });
            },
            adicionarEmpresaSelecionada(empresa) {
                if (empresa) {
                    this.cronoanalise.produto.empresa = empresa;
                }
            },
            adicionarProdutoSelecionado(produto) {
                if (produto) {
                    this.cronoanalise.produto = produto;
                    if (produto.empresa) {
                        this.cronoanalise.produto.empresa = produto.empresa;
                    }
                    if (produto.operacoes) {
                        this.operacoes = produto.operacoes;
                        for (var i = 0; i < this.operacoes.length; i++) {
                            this.operacoes[i].observacoes = [];
                        }
                    }
                }
            },
            proximoPasso() {
                if (this.e1 === 1) {
                    this.checkFormPrimeiroPasso();
                    this.e1 = 2;
                } else if (this.e1 === 2) {
                    this.checkSegundoPasso();
                    this.e1 = 3;
                }
            },
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
            adicionarObservacao() {
                this.observacao.operacao = this.operacoes[0].nome;
                this.observacao.tempo = '';
                this.observacao.porcentagem = '';
                this.passo = 1;
                this.numeroObservacao = this.operacoes[0].observacoes.length + 1;
            },
            editarObservacao(operacao, observacao) {
                this.edicaoObservacao.tempo = this.operacoes[operacao].observacoes[observacao].tempo;
                this.edicaoObservacao.operacao = operacao;
                this.edicaoObservacao.observao = observacao;
                this.dialogEdicaoObservacao = true;
            },
            salvarEdicaoObservacao() {
                this.operacoes[this.edicaoObservacao.operacao].observacoes[this.edicaoObservacao.observao].tempo = this.converterValores(this.edicaoObservacao.tempo);
                this.dialogEdicaoObservacao = false;
            },
            salvaObservacao(index) {
                this.checkFormModalObservacao();
                var i = index - 1;
                this.observacao.tempo = this.converterValores(this.observacao.tempo);
                this.operacoes[i].observacoes.push(this.observacao);
                this.observacao = {};
                if (this.passo >= this.operacoes.length) {
                    this.posicao++;
                    this.dialogObservacao = false;
                    this.calcularTotais();
                    this.observacoes.push({posicao: this.posicao});
                    return;
                }
                this.observacao.operacao = this.operacoes[i + 1].nome;
                this.passo++;

            },
            salvarCronoanalise() {
                this.calculando = true;
                this.checkTerceiroPasso();
                this.cronoanalise.produto.operacoes = this.operacoes;
                Cronoanalise.post(this.cronoanalise).then(resposta => {
                    this.wait(1000);
                    this.calcular(resposta.data);
                }).catch(onError => {
                    if (onError.response && onError.response.data) {
                        this.onError(onError.response.data.message);
                    } else {
                        this.onError(onError);
                    }
                });
            },
            converterValores(valor) {
                return parseFloat(valor.toString().replace(",", "."));
            },
            trocarPontoPorVirgula(valor) {
                return valor.toString().replace(".", ",");
            },
            calcularTotais() {
                this.listaTotais = [];
                var obs = this.operacoes[0].observacoes.length;
                for (var i = 0; i < obs; i++) {
                    var valor = 0.0;
                    for (var c = 0; c < this.operacoes.length; c++) {
                        valor = valor + parseFloat(this.operacoes[c].observacoes[i].tempo);
                    }
                    this.listaTotais.push(parseFloat(valor.toFixed(2)));
                    this.calcularPorcentagem(valor, i);
                }
            },
            calcularPorcentagem(valor, i) {
                var porcentagem = 0.0;
                for (var c = 0; c < this.operacoes.length; c++) {
                    porcentagem = (parseFloat(this.operacoes[c].observacoes[i].tempo) / valor) * 100;
                    this.operacoes[c].observacoes[i].porcentagem = parseFloat(porcentagem.toFixed());
                }
            },
            closeObservacao() {
                this.observacao = {};
                for (var i = 0; i < this.operacoes.length; i++) {
                    var index = this.numeroObservacao - 1;
                    if (index > -1) {
                        this.operacoes[i].observacoes.splice(index, 1);
                    }
                }
                this.dialogObservacao = false;
            },
            close(index) {
                this.validacoes = [];
                this.$router.push('/cronoanalises');
            },
            calcular(oid) {
                this.validacoes = [];
                this.calculando = false;
                this.$router.push({path: `/detalhar-cronoanalise/${oid}`});
            },
            closeDialogOperacao() {
                this.validacoes = [];
                this.dialogOperacao = false;
            },
            adicionarMaisObservacoes(oid) {
                Cronoanalise.getCronoanalise(oid).then(resposta => {
                    this.cronoanalise = resposta.data;
                    this.montaOperacaoObservacao();
                }).catch(onError => {
                    if (onError.response && onError.response.data) {
                        this.onError(onError.response.data.message);
                    } else {
                        this.onError(onError);
                    }
                });
            },
            montaOperacaoObservacao() {
                if (this.cronoanalise.produto && this.cronoanalise.produto.operacoes) {
                    this.operacoes = this.cronoanalise.produto.operacoes;
                    this.e1 = 3;
                    this.calcularTotais();
                    this.montaPosicao();
                }
            },
            montaPosicao() {
                for (var i = 0; i < this.operacoes[0].observacoes.length; i++) {
                    this.observacoes.push({posicao: this.posicao + 1});
                    this.posicao++;
                }
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
            checkFormModalObservacao: function (e) {
                this.validacoes = [];
                var tempo = parseFloat(this.observacao.tempo);
                if (!this.observacao.tempo) {
                    this.validacoes.push('Digite um tempo valido para operação ' + this.observacao.operacao);
                } else if (tempo === 0) {
                    this.validacoes.push('Digite um tempo valido para operação ' + this.observacao.operacao);
                }
                if (!this.validacoes.length) {
                    return true;
                }

                e.preventDefault();
            },
            checkFormPrimeiroPasso: function (e) {
                this.validacoes = [];

                if (!this.cronoanalise.produto.nome) {
                    this.validacoes.push('O produto é obrigatório.');
                }
                if (!this.cronoanalise.produto.empresa) {
                    this.validacoes.push('A empresa é obrigatório.');
                }
                if (!this.cronoanalise.produto.codigo) {
                    this.validacoes.push('O produto é obrigatório.');
                }
                if (!this.cronoanalise.produto.empresa.turno) {
                    this.validacoes.push('A senha é obrigatória.');
                }
                if (!this.cronoanalise.cronoanalista) {
                    this.validacoes.push('Cronoanalista é obrigatório.');
                } else if (!this.validNomes(this.cronoanalise.cronoanalista)) {
                    this.validacoes.push('Cronoanalista não é um nome válido.');
                }
                if (!this.validacoes.length) {
                    return true;
                }

                e.preventDefault();
            },
            checkSegundoPasso: function (e) {
                this.validacoes = [];

                if (!this.operacoes || this.operacoes.length <= 0) {
                    this.validacoes.push('Adicione pelo menos uma operação.');
                }
                if (!this.validacoes.length) {
                    return true;
                }

                e.preventDefault();
            },
            checkTerceiroPasso: function (e) {
                this.validacoes = [];

                for (var i = 0; i < this.operacoes.length; i++) {
                    if (!this.operacoes[i].observacoes.length > 0) {
                        this.validacoes.push('Adicione uma observação para a operação ' + this.operacoes[i].nome);
                    }
                }
                if (!this.validacoes.length) {
                    return true;
                }

                e.preventDefault();
            },
            validNomes: function (nome) {
                var re = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;
                return re.test(nome);
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
            wait(ms) {
                var start = new Date().getTime();
                var end = start;
                while (end < start + ms) {
                    end = new Date().getTime();
                }
            },
        },
        components: {
            Validacoes, ZoomEmpresas, ZoomProduto
        },
    }
</script>

<style scoped>
    .TFtable tr:not(:first-child) td {
        height: 20px;
        border-bottom: 1px solid #D5D5D5;
    }

    .table-observacoes {
        display: block;
        overflow-x: auto;
        white-space: nowrap;
    }

    .color-input {
        color: red !important;
    }
</style>