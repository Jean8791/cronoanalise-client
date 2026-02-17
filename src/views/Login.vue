<template>
    <div id="app">
        <v-app id="inspire">
            <v-content>
                <v-container fluid fill-height>
                    <v-layout align-center justify-center>
                        <v-flex xs12 sm8 md4>
                            <v-card class="elevation-12">
                                <v-toolbar color="#006634" dark flat>
                                    <v-toolbar-title>Autenticação de Usuário</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                </v-toolbar>
                                <v-card-text>
                                    <v-form>
                                        <v-text-field label="Login" name="login" :prepend-icon="icons.mdiAccount"
                                                      type="text" v-model="usuario.login"></v-text-field>
                                        <v-text-field id="password" label="Password" name="password"
                                                      :prepend-icon="icons.mdiLock"
                                                      type="password" v-model="usuario.senha"></v-text-field>
                                    </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="green" @click="autenticarUsuario">Entrar</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-content>
        </v-app>
    </div>
</template>

<script>
    import {
        mdiAccount, mdiLock,
    } from '@mdi/js'

    export default {
        name: "login",
        data: () => ({
            drawer: null,
            icons: {
                mdiAccount,
                mdiLock,
            },
            usuario: {
                login: '',
                senha: '',
            },
            autenticado: false,
        }),
        methods: {
            autenticarUsuario() {
                this.wait(1000);
                this.$emit('autenticador', this.usuario);
            },
            wait(ms) {
                var start = new Date().getTime();
                var end = start;
                while (end < start + ms) {
                    end = new Date().getTime();
                }
            },
        }
    }
</script>

<style scoped>

</style>