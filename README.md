# cronoanalise-client

Front-end web do sistema de **cronoanálise industrial**, desenvolvido no curso de Análise e Desenvolvimento de Sistemas do SENAI. Consome a API [cronoanalise](https://github.com/Jean8791/cronoanalise).

## Funcionalidades

- **Login** com token JWT.
- Cadastro e edição de **empresas**, **produtos** e **usuários**.
- Registro de **cronoanálises** e tela de **detalhamento** com os resultados do cálculo (tempo normal, tempo padrão, ciclos ideais, peças por hora e por turno).
- Componentes de busca rápida ("zoom") de empresas, máquinas e produtos nos formulários.
- Alertas e validações de formulário.

## Stack

- Vue.js 2 e Vue Router
- Vuetify 2 (Material Design)
- Axios
- SweetAlert2, vue-the-mask e vue-moment

## Estrutura

```
src/
├── views/        telas: login, home, empresas, produtos, usuários e cronoanálises
├── components/   zoom de empresas, máquinas e produtos, alertas e validações
├── service/      configuração do Axios (URL da API)
├── plugins/      Vuetify
└── router.js     rotas
```

Cada tela tem um arquivo `*.service.js` com as chamadas à API.

## Como rodar

Pré-requisitos: Node.js e a [API](https://github.com/Jean8791/cronoanalise) rodando em `http://localhost:8080`.

```bash
npm install
npm run serve
```

Para gerar a versão de produção: `npm run build`.
