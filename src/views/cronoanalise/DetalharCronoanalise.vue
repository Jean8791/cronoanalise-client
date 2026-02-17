<template>
    <div id="app">
        <v-app id="inspire">
            <h1 class="text-center"><span>{{ tituloDescricao }}</span></h1>
            <v-container v-if="load" class="text-center">
                <v-progress-circular :size="100" color="primary" indeterminate></v-progress-circular>
            </v-container>
            <v-container v-if="!load">
                <v-row>
                    <v-col cols="12" sm="3" md="3">
                        <v-card :color="calculoMedia.color" dark>
                            <v-card-title class="font-weight-black">{{calculoMedia.cardTitulo}}</v-card-title>
                            <v-card-text class="text-center">
                                <span class="display-2 font-weight-black">{{calculoTotalPeca.total1Hora}}</span>
                            </v-card-text>
                        </v-card>
                        <v-card align="center">
                            <v-btn text color=" accent-4" @click="cardMaisDetalhes = 1">
                                {{maisDetalhes}}
                            </v-btn>
                        </v-card>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                        <v-card :color="calculoCicloIdeal.color" dark>
                            <v-card-title class="font-weight-black">{{calculoCicloIdeal.cardTitulo}}</v-card-title>
                            <v-card-text class="text-center">
                                <span class="display-2 font-weight-black">{{calculoCicloIdeal.numeroCicloIdeal}}</span>
                            </v-card-text>
                        </v-card>
                        <v-card align="center">
                            <v-btn text color=" accent-4" @click="cardMaisDetalhes = 2">
                                {{maisDetalhes}}
                            </v-btn>
                        </v-card>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                        <v-card :color="calculoParadas.color" dark>
                            <v-card-title class="font-weight-black">{{calculoParadas.cardTitulo}}</v-card-title>
                            <v-card-text class="text-center">
                                <span class="display-2 font-weight-black">{{calculoParadas.totalParadas}}Min</span>
                            </v-card-text>
                        </v-card>
                        <v-card align="center">
                            <v-btn text color=" accent-4" @click="cardMaisDetalhes = 3">
                                {{maisDetalhes}}
                            </v-btn>
                        </v-card>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                        <v-card :color="calculoTempo.color" dark>
                            <v-card-title class="font-weight-black">{{calculoTempo.cardTitulo}}</v-card-title>
                            <v-card-text class="text-center">
                                <span class="display-2 font-weight-black">{{calculoTempo.tempoPadrao}}</span>
                            </v-card-text>
                        </v-card>
                        <v-card align="center">
                            <v-btn text color=" accent-4" @click="cardMaisDetalhes = 4">
                                {{maisDetalhes}}
                            </v-btn>
                        </v-card>
                    </v-col>
                </v-row>


                <v-row v-if="cardMaisDetalhes == 1">
                    <v-col cols="12" sm="12" md="12">
                        <v-card :color="calculoMedia.color" dark>
                            <v-card-title class="title font-weight-black">{{calculoMedia.titulo}}</v-card-title>
                            <v-card-text class="card-linha text--primary">
                                <v-row>
                                    <v-col cols="9" sm="9">
                                        <v-simple-table>
                                            <thead>
                                            <tr>
                                                <th style="width:300px;" class="text-left font-weight-black body-2">
                                                    <v-tooltip v-model="show" top>
                                                        <template v-slot:activator="{ on }">
                                                            <span v-on="on">
                                                                {{calculoMedia.colunaOperacao}}
                                                            </span>
                                                        </template>
                                                        <span>{{dicas.mediaObs}}</span>
                                                    </v-tooltip>
                                                </th>
                                                <th class="text-center font-weight-black body-2">
                                                    <v-tooltip v-model="show" top>
                                                        <template v-slot:activator="{ on }">
                                                            <span v-on="on">
                                                                {{calculoMedia.colunaMedia}}
                                                            </span>
                                                        </template>
                                                        <span>{{dicas.mediaObs}}</span>
                                                    </v-tooltip>
                                                </th>
                                                <th class="text-center font-weight-black body-2">
                                                    <v-tooltip v-model="show" top>
                                                        <template v-slot:activator="{ on }">
                                                            <span v-on="on">
                                                                {{calculoMedia.colunaQuantidade}}
                                                            </span>
                                                        </template>
                                                        <span>{{dicas.qntProducaoOperacao}}</span>
                                                    </v-tooltip>
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="(item ,index) in calculoMedia.calculoMedia" :key="item.oid">
                                                <td class="text-left">{{item.operacao}}</td>
                                                <td class="text-center">{{item.media}}</td>
                                                <td class="text-center">{{item.quantidade}}</td>
                                            </tr>
                                            <tr>
                                                <td class="font-weight-black body-2 text-left">Totais:</td>
                                                <td class="font-weight-black body-2 text-center">
                                                    {{calculoMedia.mediaTotal}}
                                                </td>
                                                <td class="font-weight-black body-2 text-center">
                                                    {{calculoMedia.quantidadeTotalOperacao}}
                                                </td>
                                            </tr>
                                            </tbody>
                                        </v-simple-table>
                                    </v-col>
                                    <v-col cols="3" sm="3">
                                        <v-simple-table>
                                            <table class="TFtable">
                                                <tbody>
                                                <tr>
                                                    <th class="font-weight-black body-2" style="width:110px;">
                                                        <v-tooltip v-model="show" top>
                                                            <template v-slot:activator="{ on }">
                                                                <span v-on="on">{{calculoTotalPeca.colunaTotalTurno}} {{calculoParadas.turnoEmpresa}}</span>
                                                            </template>
                                                            <span>{{dicas.totalTurno}}</span>
                                                        </v-tooltip>
                                                    </th>
                                                    <td style="width:110px;">{{calculoTotalPeca.totalTurno}}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </v-simple-table>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>


                <v-row v-if="cardMaisDetalhes == 2">
                    <v-col cols="12" sm="12" md="12">
                        <v-card :color="calculoCicloIdeal.color" dark>
                            <v-card-title class="title font-weight-black">{{calculoCicloIdeal.titulo}}
                            </v-card-title>
                            <v-card-text class="card-linha text--primary">
                                <v-row>
                                    <v-col cols="12" sm="12">
                                        <v-simple-table>
                                            <thead>
                                            <tr>
                                                <th class="font-weight-black body-2 text-center">
                                                    <v-tooltip v-model="show" top>
                                                        <template v-slot:activator="{ on }">
                                                            <span v-on="on">
                                                                 {{calculoCicloIdeal.colunaCalculo}}
                                                            </span>
                                                        </template>
                                                        <span>{{dicas.formulaCalculo}}</span>
                                                    </v-tooltip>
                                                </th>
                                                <th class="font-weight-black body-2 text-center">
                                                    <v-tooltip v-model="show" top>
                                                        <template v-slot:activator="{ on }">
                                                            <span v-on="on">
                                                                 {{calculoCicloIdeal.colunaValores}}
                                                            </span>
                                                        </template>
                                                        <span>{{dicas.valoresCalculo}}</span>
                                                    </v-tooltip>
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="(item ,index) in calculoCicloIdeal.listCiclo"
                                                :key="item.nome">
                                                <td class="text-center">{{item.nome}}</td>
                                                <td class="text-center">{{item.valor}}</td>
                                            </tr>
                                            </tbody>
                                        </v-simple-table>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row v-if="cardMaisDetalhes == 3">
                    <v-col cols="12" sm="12" md="12">
                        <v-card :color="calculoParadas.color" dark>
                            <v-card-title class="title font-weight-black">{{calculoParadas.titulo}}</v-card-title>
                            <v-card-text class="card-linha text--primary">
                                <v-row>
                                    <v-col cols="12" sm="12">
                                        <v-simple-table>
                                            <thead>
                                            <tr>
                                                <th class="font-weight-black body-2 text-left">
                                                    <v-tooltip v-model="show" top>
                                                        <template v-slot:activator="{ on }">
                                                            <span v-on="on">
                                                                {{calculoParadas.colunaDescricao}}
                                                            </span>
                                                        </template>
                                                        <span>{{dicas.descricaoParada}}</span>
                                                    </v-tooltip>
                                                </th>
                                                <th class="font-weight-black body-2 text-left">
                                                    <v-tooltip v-model="show" top>
                                                        <template v-slot:activator="{ on }">
                                                            <span v-on="on">
                                                                 {{calculoParadas.colunaTempo}}
                                                            </span>
                                                        </template>
                                                        <span>{{dicas.tempoParadas}}</span>
                                                    </v-tooltip>
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="(item ,index) in calculoParadas.paradasTurnos"
                                                :key="item.oid">
                                                <td>{{item.descricao}}</td>
                                                <td>{{item.tempo}}</td>
                                            </tr>
                                            </tbody>
                                        </v-simple-table>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row v-if="cardMaisDetalhes == 4">
                    <v-col cols="12" sm="12" md="12">
                        <v-card :color="calculoTempo.color" dark>
                            <v-card-title class="title font-weight-black">{{calculoTempo.titulo}}</v-card-title>
                            <v-card-text class="card-linha text--primary">
                                <br/>
                                <v-row>
                                    <v-textarea label="Fator de Velocidade" auto-grow outlined rows="1"
                                                v-model="calculoTempo.fatorVelocidade" v-bind:disabled="true"
                                                row-height="15"></v-textarea>
                                    <v-textarea label="Total Produção Turno - " :id="calculoParadas.turnoEmpresa"
                                                auto-grow outlined
                                                rows="1"
                                                v-model="calculoTempo.fatorTolerancia" v-bind:disabled="true"
                                                row-height="15"></v-textarea>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" sm="12">
                                        <v-simple-table>
                                            <thead>
                                            <tr>
                                                <th class="font-weight-black body-2 text-center">
                                                    <v-tooltip v-model="show" top>
                                                        <template v-slot:activator="{ on }">
                                                            <span v-on="on">
                                                                 {{calculoTempo.colunaTempoNormal}}
                                                            </span>
                                                        </template>
                                                        <span>{{dicas.tn}}</span>
                                                    </v-tooltip>
                                                </th>
                                                <th class="font-weight-black body-2 text-center">
                                                    <v-tooltip v-model="show" top>
                                                        <template v-slot:activator="{ on }">
                                                            <span v-on="on">
                                                                 {{calculoTempo.colunaFatorTolerancia}}
                                                            </span>
                                                        </template>
                                                        <span>{{dicas.ft}}</span>
                                                    </v-tooltip>
                                                </th>
                                                <th class="font-weight-black body-2 text-center">
                                                    <v-tooltip v-model="show" top>
                                                        <template v-slot:activator="{ on }">
                                                            <span v-on="on">
                                                                  {{calculoTempo.colunaTempoPadrao}}
                                                            </span>
                                                        </template>
                                                        <span>{{dicas.tp}}</span>
                                                    </v-tooltip>
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td class="text-center">{{calculoTempo.tempoNormal}}</td>
                                                <td class="text-center">{{calculoTempo.fatorTolerancia}}</td>
                                                <td class="text-center">{{calculoTempo.tempoPadrao}}</td>
                                            </tr>
                                            </tbody>
                                        </v-simple-table>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <br/>
                <div align="right">
                    <v-btn class="ma-2" color="grey darken-1" @click="close">Sair</v-btn>
                    <v-btn class="ma-2" color="green darken-1" @click="adiconarObservacao">Editar Observação</v-btn>
                </div>
            </v-container>
        </v-app>
    </div>
</template>

<script>
    import Cronoanalise from './cronoanalise.service';

    export default {
        name: "DetalharCronoanalise",
        data: () => ({
            load: false,
            disabled: false,
            openDelay: '0',
            closeDelay: '0',
            value: false,
            tituloDescricao: 'Detalhes da Cronoanálise',
            maisDetalhes: 'Mais Detalhes',
            dicas: {
                mediaObs: 'Média das Observações por Operação',
                qntProducaoOperacao: 'Quantidade Produção por Operação',
                totalProducaoHora: 'Total Produção Hora',
                descricaoParada: 'Descrição das paradas',
                tempoParadas: 'Tempo das Paradas',
                tempoTotalParadas: 'Tempo Total Paradas',
                formulaCalculo: 'Formula do Calculo',
                valoresCalculo: 'Valores do Calculo',
                cicloIdeal: 'Quantidade de Ciclo Ideal',
                cicloFeito: 'Quantidade de Ciclo Feito',
                tn: 'Tempo Normal',
                ft: 'Fator de Tolerancia',
                tp: 'Tempo Padrão',
                totalHora: '',
                totalTurno: '',
            },
            calculoMedia: {
                item: '1',
                titulo: 'DETALHES DO CÁLCULO DA MÉDIA',
                cardTitulo: 'PRODUÇÃO HORA',
                colunaOperacao: 'Operação',
                colunaMedia: 'Média',
                colunaQuantidade: 'Quantidade',
                color: 'red',
                icon: 'mdi-star',
                calculoMedia: [],
                mediaTotal: 0.0,
                quantidadeTotalOperacao: 0.0,
                totalProducaoHora: 0.0,
            },
            calculoParadas: {
                item: '2',
                titulo: 'DETALHES PARADAS TURNO',
                cardTitulo: 'TOTAL PARADAS',
                colunaDescricao: 'Descrição',
                colunaTempo: 'Tempo',
                colunaTempoTotal: 'Tempo Total',
                color: 'orange',
                icon: 'mdi-book-variant',
                paradasTurnos: [],
                totalParadas: 0.0,
            },
            calculoTempo: {
                item: '3',
                titulo: ' DETALHES DO CÁLCULO DE TEMPO NORMAL, PADRÃO e FATOR TOLERANCIA ',
                cardTitulo: 'TEMPO PADRÃO',
                colunaTempoNormal: 'TN',
                colunaFatorTolerancia: 'FT',
                colunaTempoPadrao: 'TP',
                color: 'green lighten-1',
                icon: 'mdi-airballoon',
                fatorVelocidade: 0.0,
                fatorTolerancia: 0.0,
                tempoNormal: 0.0,
                tempoPadrao: 0.0,
            },
            calculoCicloIdeal: {
                item: '4',
                titulo: 'DETALHES DO CALCULO DE CICLOS IDEAIS',
                cardTitulo: 'Nº CICLOS IDEAIS',
                colunaCalculo: 'Calculo',
                colunaValores: 'Valores',
                colunaCiclosFeitos: 'Ciclo Feito',
                colunaClicloIdeal: 'Ciclo Ideal',
                color: 'indigo',
                icon: 'mdi-buffer',
                listCiclo: [],
                numeroCicloIdeal: 0,
                numeroCicloFeito: 0,
            },
            ciclo: {
                nome: '',
                valor: 0.0,
            },
            calculoTotalPeca: {
                item: '4',
                titulo: 'Nº CICLOS IDEAL A SER CRONOMETRADOS',
                colunaTotalHora: 'Total Hora',
                colunaTotalTurno: 'Total Produção Turno ',
                colunaCicloIdetal: 'Ciclo Ideal',
                color: 'green lighten-1',
                icon: 'mdi-buffer',
                total1Hora: 0.0,
                totalTurno: 0.0,
                totalObservacoes: 0,
            },
            cardMaisDetalhes: 1,
            calculo: {},
        }),
        created() {
            if (this.$route.params.oid && this.$route.params.oid !== 'new') {
                this.initialize(this.$route.params.oid)
            }
        },
        methods: {
            initialize(oid) {
                if (oid) {
                    this.load = true;
                    Cronoanalise.detalharCronoanalise(oid).then(response => {
                        this.wait(100);
                        this.calculo = response.data;
                        this.montarCalculoMedia();
                        this.montarCalculoParadas();
                        this.montarCalculoTempo();
                        this.montarCalculoCicloIdeal();
                        this.montarCalculoTotalPeca();
                        this.load = false;
                    }).catch(onError => {
                        if (onError.response && onError.response.data) {
                            this.onError(onError.response.data.message);
                        } else {
                            this.onError(onError);
                        }
                    });
                } else {
                    Cronoanalise.getUltimoRegistro().then(response => {
                        this.wait(100);
                        this.calculo = response.data;
                        this.montarCalculoMedia();
                        this.montarCalculoParadas();
                        this.montarCalculoTempo();
                        this.montarCalculoCicloIdeal();
                        this.montarCalculoTotalPeca();
                        this.load = false;
                    }).catch(onError => {
                        if (onError.response && onError.response.data) {
                            this.onError(onError.response.data.message);
                        } else {
                            this.onError(onError);
                        }
                    });
                }
            },
            wait(ms) {
                var start = new Date().getTime();
                var end = start;
                while (end < start + ms) {
                    end = new Date().getTime();
                }
            },
            montarCalculoMedia() {
                if (this.calculo) {
                    if (this.calculo.calculoMedia) {
                        this.calculoMedia.calculoMedia = this.calculo.calculoMedia;
                    }
                    if (this.calculo.mediaTotal) {
                        this.calculoMedia.mediaTotal = this.calculo.mediaTotal;
                    }
                    if (this.calculo.quantidadeTotalOperacao) {
                        this.calculoMedia.quantidadeTotalOperacao = this.calculo.quantidadeTotalOperacao;
                    }
                    if (this.calculo.totalProducaoHora) {
                        this.calculoMedia.totalProducaoHora = this.calculo.totalProducaoHora;
                    }
                }
            },
            montarCalculoParadas() {
                if (this.calculo) {
                    if (this.calculo.totalParadas) {
                        this.calculoParadas.totalParadas = this.calculo.totalParadas;
                    }
                    if (this.calculo.paradasTurnos) {
                        this.calculoParadas.paradasTurnos = this.calculo.paradasTurnos;
                    }
                    if (this.calculo.turnoEmpresa) {
                        this.calculoParadas.turnoEmpresa = this.calculo.turnoEmpresa;
                    }
                }
            },
            montarCalculoTempo() {
                if (this.calculo) {
                    if (this.calculo.fatorVelocidade) {
                        this.calculoTempo.fatorVelocidade = this.calculo.fatorVelocidade;
                    }
                    if (this.calculo.fatorTolerancia) {
                        this.calculoTempo.fatorTolerancia = this.calculo.fatorTolerancia;
                    }
                    if (this.calculo.tempoNormal) {
                        this.calculoTempo.tempoNormal = this.calculo.tempoNormal;
                    }
                    if (this.calculo.tempoPadrao) {
                        this.calculoTempo.tempoPadrao = this.calculo.tempoPadrao;
                    }
                }
            },
            montarCalculoCicloIdeal() {
                if (this.calculo) {
                    if (this.calculo.x) {
                        this.ciclo = {};
                        this.ciclo.valor = this.calculo.x;
                        this.ciclo.nome = 'x';
                        this.calculoCicloIdeal.listCiclo.push(this.ciclo);
                    }
                    if (this.calculo.r) {
                        this.ciclo = {};
                        this.ciclo.valor = this.calculo.r;
                        this.ciclo.nome = 'r';
                        this.calculoCicloIdeal.listCiclo.push(this.ciclo);
                    }
                    if (this.calculo.z) {
                        this.ciclo = {};
                        this.ciclo.valor = this.calculo.z;
                        this.ciclo.nome = 'z';
                        this.calculoCicloIdeal.listCiclo.push(this.ciclo);
                    }
                    if (this.calculo.d2) {
                        this.ciclo = {};
                        this.ciclo.valor = this.calculo.d2;
                        this.ciclo.nome = 'd2';
                        this.calculoCicloIdeal.listCiclo.push(this.ciclo);
                    }
                    if (this.calculo.er) {
                        this.ciclo = {};
                        this.ciclo.valor = this.calculo.er;
                        this.ciclo.nome = 'er';
                        this.calculoCicloIdeal.listCiclo.push(this.ciclo);
                    }
                    if (this.calculo.numeroCicloIdeal) {
                        this.calculoCicloIdeal.numeroCicloIdeal = this.calculo.numeroCicloIdeal;
                    }
                    if (this.calculoTotalPeca.totalObservacoes) {
                        this.calculoCicloIdeal.numeroCicloFeito = this.calculoTotalPeca.totalObservacoes;
                    }
                }
            },
            montarCalculoTotalPeca() {
                if (this.calculo.total1Hora) {
                    this.calculoTotalPeca.total1Hora = this.calculo.total1Hora;
                }
                if (this.calculo.totalTurno) {
                    this.calculoTotalPeca.totalTurno = parseFloat(this.calculo.totalTurno.toFixed(2));
                }
                if (this.calculo.totalObservacoes) {
                    this.calculoTotalPeca.totalObservacoes = this.calculo.totalObservacoes;
                }
            },
            adiconarObservacao() {
                this.$router.push({path: `/cronoanalise/${this.$route.params.oid}`});
            },
            close() {
                this.$router.push('/cronoanalises');
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
        }
    }
</script>

<style scoped>
    .tamanho-card {
        max-width: 1500px;
        height: 200px;
    }

    .card-linha {
        background-color: #424242;
    }

    .valor-unitario {
        font-size: 24px !important
    }

    .v-application .title {
        font-size: 1.1rem !important;
        /*color: aqua;*/
        color: #ece3ef;
    }

    .totais-cards {
        font-size: 24px !important;
    }

    .v-sheet--offset {
        top: -24px;
        position: relative;
    }

    .v-progress-circular {
        margin: 1rem;
    }
</style>