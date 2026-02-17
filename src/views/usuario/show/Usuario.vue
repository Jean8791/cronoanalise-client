<template>
    <v-card>
        <v-card-title>
            <span>{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
            <v-container>
                <v-row>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="usuario.nome" label="Nome" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="usuario.email" label="E-mail" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="usuario.login" label="Login" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="usuario.senha"
                                      type="password"
                                      maxlength="6"
                                      counter="6"
                                      label="Senha" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="usuario.confirmarSenha"
                                      type="password"
                                      maxlength="6"
                                      counter="6"
                                      label="Confirmar Senha" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-select v-model="usuario.tipoUsuario" :items="opcoesTipoUsuario"
                                  label="Tipo Usuário" required></v-select>
                    </v-col>
                </v-row>
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
    import Usuario from "../usuario.service";
    import Validacoes from "../../../components/Validacoes";
    import ZoomMaquinas from "../../../components/Zoom/ZoomMaquinas/ZoomMaquinas";

    export default {
        name: "Usuario",
        Router,
        data: () => ({
            msgDeAlertas: {
                success: '',
                error: '',
                info: '',
                warning: '',
            },
            usuario: {
                nome: '',
                email: '',
                login: '',
                senha: '',
                confirmarSenha: '',
                tipoUsuario: '',
                oid: '',
            },
            opcoesTipoUsuario: [
                'Professor',
                'Aluno'
            ],
            validacoes: [],
            valid: true,
        }),
        computed: {
            formTitle() {
                return this.$route.params.oid === 'new' ? 'Novo Usuário' : 'Editar Usuário';
            },
        },
        created() {
            if (this.$route.params.oid && this.$route.params.oid !== 'new') {
                this.buscaUsuario()
            }
        },
        methods: {
            buscaUsuario() {
                Usuario.buscaUsuario(this.$route.params.oid).then(resposta => {
                    this.usuario = resposta.data;
                }).catch(onError => {
                    if (onError.response && onError.response.data) {
                        this.msgDeAlertas.error = onError.response.data.message;
                    } else {
                        this.msgDeAlertas.error = onError;
                    }
                });
            },
            adicionarMaquinaSelecionada(valor) {

            },
            save() {
                this.checkForm();
                if (this.usuario.oid) {
                    Usuario.post(this.usuario).then(resposta => {
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
                    Usuario.post(this.usuario).then(resposta => {
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
                }
            },
            checkForm: function (e) {
                this.validacoes = [];

                if (!this.usuario.nome) {
                    this.validacoes.push('O nome é obrigatório.');
                }
                if (!this.usuario.email) {
                    this.validacoes.push('O e-mail é obrigatório.');
                } else if (!this.validEmail(this.usuario.email)) {
                    this.validacoes.push('Utilize um e-mail válido.');
                }
                if (!this.usuario.login) {
                    this.validacoes.push('O login é obrigatório.');
                }
                if (!this.usuario.senha) {
                    this.validacoes.push('A senha é obrigatória.');
                }
                if (!this.usuario.confirmarSenha) {
                    this.validacoes.push('Confirmar senha é obrigatório.');
                }
                if (this.usuario.confirmarSenha !== this.usuario.senha) {
                    this.validacoes.push('As senhas não conferem.');
                }
                if (!this.usuario.tipoUsuario) {
                    this.validacoes.push('Selecione um tipo de Usuário.')
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
                this.$router.push('/usuarios');
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
        components: {Validacoes, ZoomMaquinas},
    };
</script>

<style scoped>

</style>