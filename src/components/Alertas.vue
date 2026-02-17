<template>

</template>

<script>
    export default {
        name: "Alertas",
        props: ['msgDeAlertas'],
        methods: {
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
        }
    }
</script>

<style scoped>

</style>