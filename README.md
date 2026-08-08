# Recrutamento Médico

Projeto organizado para publicação no GitHub Pages.

## Estrutura

- `index.html` — página principal / login / painel
- `pages/candidatura.html` — formulário público de candidatura médica
- `css/styles.css` — estilos
- `js/script.js` — funcionalidades
- `assets/` — imagem e vídeo do login
- `.nojekyll` — evita processamento desnecessário do GitHub Pages

## Como publicar no GitHub Pages

1. Crie ou abra um repositório no GitHub.
2. Envie TODO o conteúdo desta pasta para a raiz do repositório.
3. Abra **Settings** → **Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione a branch `main` e a pasta `/ (root)`.
6. Clique em **Save**.

O GitHub Pages usará automaticamente o `index.html` da raiz.

## Observação sobre dados

O projeto atual usa `localStorage` e `IndexedDB` no navegador para demonstração.
Isso significa que candidaturas e PDFs não são sincronizados entre dispositivos.
Para uso real com médicos acessando por links externos, será necessário um backend/banco de dados.
