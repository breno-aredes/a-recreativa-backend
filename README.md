# Teste Técnico - A Recreativa (Back-end)

## Visão Geral

Este repositório contém o back-end do desafio técnico da Plataforma Studio MIA. Ele provê uma API REST para gerenciamento e extração de informações de planos de aula enviados por professores, permitindo upload de arquivos `.pdf` e `.docx`, extração automática de campos, armazenamento e consulta dos planos de aula.

---

## Funcionalidades

- **Upload de arquivos** (`.pdf` e `.docx`): Recebe documentos de planos de aula para análise e extração de informações.
- **Extração automática de dados**: Realiza o parsing do documento enviado, retornando campos organizados como título, objetivos, atividades, etc.
- **Cadastro de planos de aula**: Permite cadastrar um plano de aula completo, associando o arquivo original ao registro.
- **Listagem de planos de aula**: Permite consultar todos os planos cadastrados, com campos detalhados e link para download do arquivo original.
- **Serviço de arquivos estáticos**: Disponibiliza os arquivos enviados para download via rota específica.
- **Healthcheck**: Endpoint para verificar se o servidor está online.

---

## Rotas Disponíveis

### 1. Saúde da API

- **GET `/health`**
  - Retorna: `"OK!"`
  - Verifica se o servidor está rodando.

---

### 2. Planos de Aula

- **GET `/plans`**

  - Lista todos os planos cadastrados com todos os campos extraídos e link do arquivo original.

- **POST `/plans`**

  - Recebe um plano de aula completo para cadastro.
  - **Body (form-data):**
    - `file` (arquivo `.pdf` ou `.docx`)
    - Os campos obrigatórios: `title`, `subject`, `grade`, `duration`, `objectives`, `activities`, `resources`, `evaluation`
    - Campos opcionais: `homework`, `notes`
  - **Exemplo de resposta (sucesso):**
    ```json
    {
      "message": "Plano criado com sucesso"
    }
    ```
  - **Validação:** Todos os campos obrigatórios devem estar presentes (validação feita via Joi).

- **POST `/plans/upload`**
  - Recebe um arquivo (`file`), faz a extração automática dos campos do plano de aula e retorna um objeto JSON com os dados extraídos.
  - **Body (form-data):**
    - `file` (arquivo `.pdf` ou `.docx`)
  - **Exemplo de resposta:**
    ```json
    {
      "plan": {
        "title": "A vida",
        "subject": "Ciências",
        "grade": "4 Ano",
        "duration": "50 minutos",
        "objectives": "...",
        "activities": "...",
        "resources": "...",
        "evaluation": "...",
        "homework": "...",
        "notes": "..."
      }
    }
    ```

---

### 3. Arquivos enviados

- **GET `/uploads/:filename`**
  - Disponibiliza para download os arquivos enviados e associados aos planos de aula.

---

## Instalação e Execução

Siga os passos abaixo para rodar o back-end localmente:

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/breno-aredes/teste-a-recreativa-backend.git
   ```

2. **Acesse o diretório do projeto:**

   ```bash
   cd teste-a-recreativa-backend
   ```

3. **Instale as dependências:**

   ```bash
   npm install
   ```

4. **Configure as variáveis de ambiente:**

   - Crie um arquivo `.env` na raiz do projeto.

5. **Execute as migrações do banco de dados:**

   ```bash
   npm run migrate
   ```

6. **Inicie o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

   O servidor ficará disponível por padrão em `http://localhost:4000`.

---

## Integração com o Front-end

O front-end correspondente está disponível em:  
[breno-aredes/teste-a-recreativa-frontend](https://github.com/breno-aredes/teste-a-recreativa-frontend)

> **Importante:**  
> Certifique-se de que o front-end está configurado para apontar para a URL correta do back-end (ex: `http://localhost:4000`).  
> Consulte o README do front-end para detalhes sobre configuração do `.env`.

---

## Tecnologias Utilizadas

- **Node.js** & **Express:** Servidor HTTP e estrutura das rotas.
- **TypeScript:** Tipagem estática e organização do código.
- **Prisma ORM:** Modelagem e manipulação do banco de dados SQLite.
- **Joi:** Validação de schemas dos planos de aula.
- **cors:** Middleware para habilitar CORS.
- **dotenv:** Gerenciamento de variáveis de ambiente.
- **multer:** Upload de arquivos.
- **mammoth:** Extração de dados de arquivos `.docx`.
- **pdf-parse:** Extração de dados de arquivos `.pdf`.
- **Nodemon / TSX:** Para desenvolvimento com hot-reload.

---

## Observações

- Os arquivos enviados são armazenados na pasta `/uploads` e servidos pela rota `/uploads`.
- O banco de dados utilizado é SQLite, já pronto para uso local.

---
