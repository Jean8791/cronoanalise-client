<template>
    <v-card>
        <v-card-title>
            <span>{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
            <v-container>
                <v-row>
                    <v-col cols="12" sm="3" md="3">
                        <v-text-field v-model="empresa.cnpj"
                                      label="CNPJ/CPF" v-mask="['###.###.###-##', '##.###.###/####-##']"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="empresa.nome"
                                      label="Nome" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                        <v-text-field v-model="empresa.turno" suffix="Horas"
                                      label="Turno" v-mask="['##:##','#:##']"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" sm="3" md="3">
                        <v-text-field v-model="empresa.fatorVelocidade"
                                      v-mask="['#.####']"
                                      label="Fator de Velocidade"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                        <v-select v-model="parada.descricao" :items="opcoesParadas"
                                  label="Parada" required></v-select>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                        <v-text-field v-model="parada.tempo"
                                      label="Tempo em Minutos" v-mask="['##','###']"
                                      @click:append="adicionarParada()"
                                      :append-icon="icons.mdiPlusBoxOutline"></v-text-field>
                    </v-col>
                </v-row>
                <v-simple-table :dense="dense" :fixed-header="fixedHeader" :height="height">
                    <thead>
                    <tr>
                        <th class="text-left">Parada</th>
                        <th class="text-left">Tempo em Minutos</th>
                        <th class="text-center">Remover</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item ,index) in empresa.paradas" :key="item.descricao">
                        <td>{{ item.descricao }}</td>
                        <td>{{ item.tempo }} Minutos</td>
                        <td class="text-center">
                            <v-icon small color="red" @click="remover(index,item.oid)">{{icons.mdiDelete}}</v-icon>
                        </td>
                    </tr>
                    </tbody>
                </v-simple-table>
                <br>
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
    import Empresa from "../empresa.service";
    import Validacoes from "../../../components/Validacoes";
    import ZoomMaquinas from "../../../components/Zoom/ZoomMaquinas/ZoomMaquinas";
    import {mdiPlusBoxOutline, mdiDelete, mdiPencil} from '@mdi/js';

    export default {
        name: "Empresa",
        Router,
        data: () => ({
            dense: false,
            fixedHeader: false,
            height: 250,
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
            empresa: {
                oid: '',
                cnpj: '',
                nome: '',
                turno: '',
                fatorVelocidade: '',
                fatorTolerancia: '',
                paradas: [],
            },
            parada: {
                descricao: '',
                tempo: ''
            },
            opcoesParadas: [
                'Almoço',
                'Ginastica',
                'Banheiro',
                'Outros'
            ],
            validacoes: [],
            valid: true,
        }),
        computed: {
            formTitle() {
                return this.$route.params.oid === 'new' ? 'Nova Empresa' : 'Editar Empresa';
            },
        },
        created() {
            if (this.$route.params.oid && this.$route.params.oid !== 'new') {
                this.buscaEmpresa()
            }
        },
        methods: {
            buscaEmpresa() {
                Empresa.buscaEmpresa(this.$route.params.oid).then(resposta => {
                    this.empresa = resposta.data;
                }).catch(onError => {
                    if (onError.response && onError.response.data) {
                        this.msgDeAlertas.error = onError.response.data.message;
                    } else {
                        this.msgDeAlertas.error = onError;
                    }
                });
            },
            adicionarParada() {
                this.validaParada();
                this.empresa.paradas.push(this.parada);
                this.parada = {};
            },
            remover(index, oid) {
                this.$swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger'
                    },
                    buttonsStyling: false
                });
                this.$swal.fire({
                    position: 'top',
                    title: 'Deseja remover essa parada?',
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
                            this.empresa.paradas.splice(index, 1);
                        }
                    } else {
                        this.onCancelado();
                    }
                });
            },
            validaParada(e) {
                this.validacoes = [];

                if (!this.parada.descricao) {
                    this.validacoes.push('Digite uma descrição para Parada.');
                }
                if (!this.parada.tempo) {
                    this.validacoes.push('Digite um tempo de Parada.');
                }
                if (!this.validacoes.length) {
                    return true;
                }
                e.preventDefault();
            },
            save() {
                this.checkForm();
                if (this.empresa.oid) {
                    Empresa.post(this.empresa).then(resposta => {
                        this.empresas = resposta.data;
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
                    Empresa.post(this.empresa).then(resposta => {
                        this.empresas = resposta.data;
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
                
                if (!this.empresa.nome) {
                    this.validacoes.push('O nome é obrigatório.');
                }

                if (!this.empresa.turno) {
                    this.validacoes.push('O turno é obrigatório.');
                }

                if (!this.empresa.fatorVelocidade) {
                    this.validacoes.push('O fator de velocidade é obrigatório.');
                }

                if (!this.validacoes.length) {
                    return true;
                }

                e.preventDefault();
            },

            validEmail: function (email) {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },
            close() {
                this.validacoes = [];
                this.$router.push('/empresas');
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
        components: {Validacoes, ZoomMaquinas},
    };
</script>

<style scoped>

</style>