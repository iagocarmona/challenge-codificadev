# 🚀 Desafio Técnico - CRUD de Clientes

> Projeto desenvolvido para o processo seletivo da **Codifica Dev** (Tapejara-PR)

---

## 📋 Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Instalação](#-instalação)
- [Como Executar](#-como-executar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Autor](#-autor)
- [Licença](#-licença)

---

## 🔍 Sobre o Projeto

Este projeto consiste em um **sistema de gerenciamento de clientes** (CRUD), desenvolvido como desafio técnico para a equipe da Codifica Dev, em Tapejara-PR.

A aplicação permite:

- Listar clientes cadastrados
- Adicionar novos clientes
- Editar informações existentes
- Remover clientes

Todo o fluxo de autenticação (login, logout e controle de acesso) garante que apenas usuários autenticados possam interagir com o CRUD.

---

## ✨ Funcionalidades

- **Autenticação híbrida**: login via Google OAuth e login manual com e-mail e senha (Firebase Auth)
- **CRUD completo de clientes**: criação, leitura, atualização e exclusão
- **Validação robusta de formulários**: Zod + React Hook Form
- **Middleware de RBAC**: proteção de rotas e procedimentos com controle de permissões
- **UI moderna e responsiva**: componentes do Shadcn UI estilizados com Tailwind CSS
- **Feedback instantâneo**: toasts e loaders para experiência de usuário fluida

---

## 🛠️ Tecnologias Utilizadas

| Camada        | Ferramenta / Biblioteca     |
| ------------- | --------------------------- |
| **Frontend**  | Next.js (App Router)        |
| **API**       | tRPC (t3 Stack)             |
| **Autenticação** | Firebase Auth (Google & Manual) |
| **Validação** | Zod & React Hook Form       |
| **UI**        | Shadcn UI Components        |
| **Estilos**   | Tailwind CSS                |
| **Middleware**| tRPC Middlewares (RBAC)     |

---

## 🚀 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/codifica-dev-desafio.git
   cd codifica-dev-desafio
   npm i
   ```
2. Configure as variáveis de ambiente:
   ```bash
    AUTH_SECRET=
    NEXTAUTH_SECRET=
    
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    
    GOOGLE_APPLICATION_CREDENTIALS={}
    
    
    FIREBASE_API_KEY=
    FIREBASE_AUTH_DOMAIN=
    FIREBASE_PROJECT_ID=
    FIREBASE_STORAGE_BUCKET=
    FIREBASE_MESSAGING_SENDER_ID=
    FIREBASE_APP_ID=
    FIREBASE_MEASUREMENT_ID=
```
