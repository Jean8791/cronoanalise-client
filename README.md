# cronoanalise-client

Front-end web do sistema de **cronoanálise industrial**, criado no curso de Análise e Desenvolvimento de Sistemas do SENAI e modernizado depois. Consome a API [cronoanalise](https://github.com/Jean8791/cronoanalise).

> Projeto acadêmico, para fins de estudo. A versão 2.0 reescreve o front original (Vue 2 + Vuetify 2) em Vue 3 + Vuetify 3, mantendo as telas e o fluxo.

## Funcionalidades

- **Login** com JWT e botão **"Entrar como visitante"** quando a conta de demonstração está configurada.
- **Cronoanálises:**
  - registro em grade (operações × ciclos), com média por operação e tempo de cada ciclo calculados enquanto se digita;
  - resultado com **tempo padrão**, **peças por hora e por turno** e aviso de **amostra suficiente** ou de quantos ciclos faltam;
  - cada fórmula mostrada com os valores substituídos (z, R, Er, d2, x̄, TN, FT, TP), como material de estudo;
  - correção dos tempos e exclusão pelo autor ou por um professor.
- **Empresas** com turno, paradas, fator de velocidade e nível de confiança.
- **Produtos** com as operações em ordem (reordenáveis).
- **Usuários** com perfis Administrador, Professor e Aluno (só para administradores).
- Telas e botões conforme o perfil; a API continua sendo quem garante as permissões.

## Stack

- **Vue 3** (Composition API, `<script setup>`) e **Vue Router 4**
- **Vuetify 3** (Material Design) com ícones MDI
- **Vite 6**
- Axios

## Estrutura

```
src/
├── views/        login, início, cronoanálises (lista, registro e resultado), empresas, produtos e usuários
├── components/   aviso de projeto acadêmico
├── services/     cliente HTTP com o token e sessão do usuário
├── utils/        formatação de números, CNPJ, datas e turno
├── plugins/      Vuetify (tema e padrões)
└── router.js     rotas com proteção por login e perfil
```

## Como rodar

Pré-requisitos: Node.js 20+ e a [API](https://github.com/Jean8791/cronoanalise) rodando.

```bash
cp .env.example .env.local   # ajuste a URL da API e a conta demo, se houver
npm install
npm run dev
```

Acesse `http://localhost:5173`.

| Variável | Uso |
|---|---|
| `VITE_API_URL` | Endereço da API (padrão `http://localhost:8080`) |
| `VITE_DEMO_LOGIN`, `VITE_DEMO_SENHA` | Conta de demonstração exibida no login (opcional) |

### Build

```bash
npm run build
```

O `vercel.json` redireciona todas as rotas para o `index.html`, necessário para o histórico do Vue Router em hospedagem estática.

## O que mudou na versão 2.0

- Vue 2 + Vuetify 2 + Vue CLI → Vue 3 + Vuetify 3 + Vite.
- O token passou a ser lido a cada requisição (antes era fixado quando o Axios era criado e exigia recarregar a página depois do login) e a sessão expirada leva de volta ao login.
- O `node_modules` e um projeto de exemplo (`appname/`) que estavam versionados saíram do repositório.
- Grade de tempos com cálculo ao vivo e tela de resultado com as fórmulas.
