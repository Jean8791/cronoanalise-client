<template>
    <div id="Validacoes">
        <v-alert outlined type="success" prominent border="left" v-if="success.length">
            <b>Por favor, corrija o(s) seguinte(s) campo(s):</b>
            <ul>
                <li v-for="validacao in success">{{ validacao }}</li>
            </ul>
        </v-alert>
        <v-alert outlined type="info" prominent border="left" v-if="info.length">
            <b>Por favor, corrija o(s) seguinte(s) campo(s):</b>
            <ul>
                <li v-for="validacao in info">{{ validacao }}</li>
            </ul>
        </v-alert>
        <v-alert outlined type="warning" prominent border="left" v-if="warning.length">
            <b>Por favor, corrija o(s) seguinte(s) campo(s):</b>
            <ul>
                <li v-for="validacao in warning">{{ validacao }}</li>
            </ul>
        </v-alert>
        <v-alert outlined type="error" prominent border="left" v-if="error.length">
            <b>Por favor, corrija o(s) seguinte(s) campo(s):</b>
            <ul>
                <li v-for="validacao in error">{{ validacao }}</li>
            </ul>
        </v-alert>
    </div>
</template>

<script>
    export default {
        name: "Validacoes",
        props: ['success', 'info', 'warning', 'error'],
    }
</script>

<style scoped>

</style>