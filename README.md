# Veio Marcenaria — projeto demonstrativo ClickFocus

Landing page de uma **marcenaria sob medida fictícia**, criada pela [ClickFocus](https://clickfocusbr.vercel.app/) para mostrar a potenciais clientes um modelo de site para o nicho.

> **Transparência:** a Veio não existe. Nomes, histórico, projetos e endereço são ilustrativos, e as imagens são ilustrações feitas em código. Os botões de WhatsApp **não enviam mensagens**: eles mostram a mensagem que um site real enviaria e oferecem contato com a ClickFocus.

## O que a página demonstra

- Hero com ilustração de cozinha planejada (SVG, veio de madeira gerado por filtro) e medidas indicadas
- Ambientes atendidos e processo de trabalho em 5 etapas
- Seletor de acabamento que muda o guarda-roupa em tempo real
- Galeria de projetos ilustrativos
- Pedido de orçamento com prévia da mensagem do WhatsApp
- Layout responsivo, navegação por teclado e respeito a `prefers-reduced-motion`

## Publicar no Vercel

Site estático, sem build:

1. Crie um repositório no GitHub e envie esta pasta (`git push`).
2. No Vercel, **Add New → Project**, importe o repositório e mantenha *Framework Preset: Other* (sem comando de build).
3. Depois de publicado, copie a URL e cole em `DEMO_URLS.veio` no início de `assets/app.js` do site da ClickFocus.

Para testar localmente: `python -m http.server 8000` dentro desta pasta.
