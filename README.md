# J&P Serviços Médicos — Recrutamento Médico

Projeto organizado para publicação no GitHub Pages.

## Estrutura

- `index.html` — login e painel administrativo
- `pages/candidatura.html` — página pública de candidatura médica
- `css/styles.css` — identidade visual e responsividade
- `js/script.js` — funcionalidades do painel e candidatura
- `assets/jp-logo.png` — logo original tratada para web
- `assets/jp-logo-horizontal.png` — versão horizontal da logo
- `assets/login-clinic-bg-blue.jpg` — fundo do login em azul/bege
- `assets/leaves-overlay-blue.webm` — vídeo das folhas em azul
- `assets/favicon.png` — ícone do navegador
- `.nojekyll` — compatibilidade com GitHub Pages

## Publicar no GitHub Pages

1. Extraia o ZIP.
2. Envie todos os arquivos e pastas para a raiz do repositório.
3. No GitHub, abra **Settings > Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione `main` e `/ (root)`.
6. Salve.

## Importante

Esta versão é front-end. Candidaturas e PDFs são armazenados no navegador para demonstração. Para sincronizar dados entre o médico e o painel administrativo em dispositivos diferentes, será necessário conectar a um backend/banco de dados.


## Atualização de recrutamento

- Candidatos organizados por data (mais recentes primeiro).
- Status administrativos: Em análise, Aprovado e Reprovado.
- Upload de currículo e documentos profissionais (PDF/JPG/PNG).
- Diploma e certificados aceitam múltiplos arquivos.
- Documentos ficam disponíveis no modal do candidato.

> GitHub Pages é hospedagem estática. Nesta demonstração os dados ficam no navegador (localStorage/IndexedDB). Para receber documentos enviados por médicos em outros dispositivos, será necessário backend/storage compartilhado.


## Atualização visual e funcional
- Sidebar recolhível e compacta.
- Indicadores com gráfico de especialidades.
- Configurações transformadas em Meu Perfil.
- Todos os documentos da candidatura são obrigatórios e aceitam múltiplos arquivos.
- Modal otimizado para zoom 100% sem barra de rolagem interna.
