<template>
    <div id="home">
        <v-app id="inspire">
            <template>
                <div v-if="autenticado">
                    <home v-on:sair="sair"></home>
                </div>
            </template>
            <template>
                <div v-if="!autenticado">
                    <login v-on:autenticador="autentica"></login>
                </div>
            </template>
        </v-app>
    </div>
</template>

<script>
    import axios from 'axios';
    import Home from "./views/Home";
    import Login from "./views/Login";
    import Vuetify from 'vuetify/lib';

    export default {
        name: 'App',
        vuetify: new Vuetify({
            theme: {dark: true},
        }),
        data: () => ({
            autenticado: false,
            usuario: {
                username: '',
                password: '',
            },
        }),
        created() {
            if (localStorage.getItem("autenticado")) {
                this.autenticado = true;
            }
        },
        methods: {
            autentica(usuario) {
                if (usuario.login && usuario.senha) {
                    this.usuario.username = usuario.login;
                    this.usuario.password = usuario.senha;
                    axios.post('http://localhost:8080/authenticate', this.usuario).then(resposta => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('permissoes');
                        localStorage.removeItem('nome');
                        localStorage.token = resposta.data.token.token;
                        localStorage.permissoes = resposta.data.token.permissao;
                        localStorage.nome = resposta.data.token.nome;
                        this.usuario = {};
                        localStorage.autenticado = true;
                        this.autenticado = true;
                        this.$router.push('/');
                    }).catch(onError => {
                        this.onError("Usuário não autenticado");
                    });
                } else {
                    this.onError("Digite o Login e a Senha");
                }
            },
            sair(sair) {
                this.autenticado = sair;
                this.usuario = {};
                this.$router.push('/login');
                localStorage.removeItem('autenticado');
                window.location.reload(true);
            },
            wait(ms) {
                var start = new Date().getTime();
                var end = start;
                while (end < start + ms) {
                    end = new Date().getTime();
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
        components: {
            Home,
            Login
        },
    };
</script>

<style>

</style>
