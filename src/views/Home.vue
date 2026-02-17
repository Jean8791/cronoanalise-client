<template>
    <div id="home">
        <v-app id="inspire">
            <v-navigation-drawer v-model="drawer" app clipped>
                <v-list dense>

                    <router-link v-if="usuario.permissoes == 'Professor'" to='/usuarios'>
                        <v-list-item @click="">
                            <v-list-item-action>
                                <v-icon>{{ icons.mdiAccount }}</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Usuários</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </router-link>

                    <router-link v-if="usuario.permissoes == 'Professor'" class="link-menu" to='/empresas'>
                        <v-list-item @click="">
                            <v-list-item-action>
                                <v-icon>{{ icons.mdiDomain }}</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Empresas</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </router-link>

                    <router-link v-if="usuario.permissoes == 'Professor' || usuario.permissoes == 'Aluno'"
                                 class="link-menu" to='/produtos'>
                        <v-list-item @click="">
                            <v-list-item-action>
                                <v-icon>{{ icons.mdiCubeScan }}</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Produtos</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </router-link>

                    <router-link v-if="usuario.permissoes == 'Professor' || usuario.permissoes == 'Aluno'"
                                 class="link-menu" to='/cronoanalises'>
                        <v-list-item @click="">
                            <v-list-item-action>
                                <v-icon>{{ icons.mdiQuicktime }}</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Cronoanálise</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </router-link>

                </v-list>
            </v-navigation-drawer>

            <v-app-bar app clipped-left>
                <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                <router-link class="link-home" to='/'>
                    <v-toolbar-title>Cronoanálise</v-toolbar-title>
                </router-link>
                <div class="flex-grow-1"></div>
                <span>{{usuario.nome}}</span>
                <v-menu>
                    <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on">
                            <v-icon>{{ icons.mdiAccount }}</v-icon>
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-item>
                            <v-list-item-title>
                                <v-btn text @click="sair">Sair</v-btn>
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>

            </v-app-bar>

            <v-content>
                <!--                <v-container grid-list-xl text-xs-center>-->
                <v-layout row wrap>
                    <v-flex xs10 offset-xs1>
                        <br/>
                        <br/>
                        <router-view/>
                    </v-flex>
                </v-layout>
                <!--                </v-container>-->
            </v-content>


            <v-footer app>
                <span>&copy; 2019</span>
            </v-footer>
        </v-app>
    </div>
    <!--    <HelloWorld/>-->
</template>

<script>
    import {
        mdiAccount,
        mdiDomain,
        mdiTimer,
        mdiCubeScan,
        mdiSettingsOutline,
        mdiCalculatorVariant,
        mdiQuicktime
    } from '@mdi/js'

    export default {
        data: () => ({
            drawer: null,
            icons: {
                mdiAccount,
                mdiDomain,
                mdiTimer,
                mdiCubeScan,
                mdiSettingsOutline,
                mdiCalculatorVariant,
                mdiQuicktime
            },
            usuario: {
                nome: '',
                permissoes: ''
            }
        }),
        created() {
            this.usuario.nome = localStorage.getItem("nome");
            this.usuario.permissoes = localStorage.getItem("permissoes");
        },
        methods: {
            sair() {
                this.$emit('sair', false);
            }
        },
    };
</script>
<style>
    .v-toolbar__title {
        color: #FFFFFF !important;
    }

    a {
        text-decoration: none !important;
    }

    nav a {
        text-decoration: none !important;
    }

    a:hover {
        text-decoration: underline;
    }
</style>