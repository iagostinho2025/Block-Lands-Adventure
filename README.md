# 🎮 Block Lands - Adventure

> Um jogo de puzzle mobile premium que combina mecânicas clássicas de blocos com aventura fantástica

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Platform](https://img.shields.io/badge/platform-Mobile%20%7C%20Web-brightgreen)
![License](https://img.shields.io/badge/license-Proprietary-red)

---

## 📖 Sobre o Jogo

**Block Lands** é um jogo de puzzle mobile que reimagina o clássico conceito de blocos deslizantes, adicionando uma camada de aventura RPG com mundos temáticos, chefões épicos e progressão de níveis.

### 🎯 Conceito Principal

- **Modo Clássico**: Experiência tradicional de puzzle com sistema de pontuação, combos e missões aleatórias
- **Modo Aventura**: Jornada através de 6 mundos temáticos com 72+ níveis únicos e batalhas contra chefões
- **Modo Blitz**: Desafio rápido contra o tempo *(em desenvolvimento)*

---

## 🌍 Mundos e Níveis

### Mundo 0: O Portão (Tutorial)
- **Tema**: Portal místico, introdução
- **Fases**: 3 níveis tutoriais
- **Dificuldade**: Iniciante
- **Chefão**: Guardião do Portão 🛡️

### Mundo 1: Terras do Fogo 🔥
- **Tema**: Vulcões, lava, deserto ardente
- **Fases**: 15 níveis + 1 chefão
- **Mecânicas Especiais**: Blocos de lava (destroem peças ao contato)
- **Chefão**: Titã de Fogo 🔥 (300 HP)
- **Visual**: Tons de vermelho/laranja, efeitos de brasas

### Mundo 2: Floresta Encantada 🌳
- **Tema**: Floresta mágica, natureza selvagem
- **Fases**: 15 níveis + 1 chefão
- **Chefão**: Treant Ancião 🌲 (350 HP)
- **Visual**: Tons de verde, névoa natural

### Mundo 3: Montanhas Eternas ⛰️
- **Tema**: Picos nevados, templos nas alturas
- **Fases**: 15 níveis + 1 chefão
- **Chefão**: Dragão de Gelo 🐉 (400 HP)
- **Visual**: Azul/branco, efeitos de neve

### Mundo 4: Deserto Dourado 🏜️
- **Tema**: Dunas infinitas, ruínas antigas
- **Fases**: 15 níveis + 1 chefão
- **Chefão**: Faraó das Areias 👑 (450 HP)
- **Visual**: Dourado/amarelo, tempestades de areia

### Mundo 5: Castelo Sombrio 🏰
- **Tema**: Fortaleza escura, mundo final
- **Fases**: 15 níveis + 1 chefão
- **Chefão**: Rei das Sombras 👹 (500 HP)
- **Visual**: Roxo escuro, atmosfera gótica

**Total**: 78 fases (3 tutorial + 75 aventura)

---

## 🎮 Mecânicas de Jogo

### Sistema de Blocos

#### Blocos Básicos
- **Normal** (Cinza): Bloco padrão
- **Bee** (Verde): Objetivo especial
- **Ghost** (Rosa): Objetivo especial
- **Cop** (Azul): Objetivo especial

#### Blocos Especiais
- **Lava** (Vermelho): Destrói peças ao contato (Mundo do Fogo)
- **Inamovível** (Pedra): Não pode ser movido
- **Explosivo**: Limpa área ao redor *(planejado)*

### Sistema de Combate (Chefões)

1. **Dano por Linhas**: Cada linha completa causa dano ao chefão
2. **Barra de HP Visual**: Mostra vida restante do boss
3. **Animação de Dano**: Números flutuantes mostram dano causado
4. **Vitória**: Derrotar o boss desbloqueia o próximo mundo

### Sistema de Pontuação (Modo Clássico)

- **Linha Simples**: 100 pontos
- **Linha Dupla**: 250 pontos
- **Linha Tripla**: 400 pontos
- **Linha Quádrupla**: 600 pontos
- **Combo**: Multiplicador crescente (até 3x)
- **Missões**: Bônus especial ao completar objetivos

### Progressão

- **Cristais**: Moeda do jogo (coletados ao completar níveis)
- **Estrelas**: Sistema de avaliação por nível (1-3 estrelas)
- **Desbloqueio**: Mundos são desbloqueados sequencialmente
- **Save Automático**: Progresso salvo no localStorage

---

## 🎨 Design Visual

### Identidade Visual

**Tom**: Fantasia moderna, limpa, profissional
**Referências**: Monument Valley, Alto's Adventure, Clash Royale

### Sistema de Temas

Cada mundo tem sua própria paleta visual:

```css
Modo Clássico    → Azul profundo (#1e3a8a)
Mundo Fogo       → Vermelho/Laranja (#7f1d1d)
Mundo Floresta   → Verde natural (#14532d)
Mundo Montanha   → Azul gélido (#1e3a8a)
Mundo Deserto    → Dourado (#78350f)
Mundo Castelo    → Roxo escuro (#581c87)
```

### Polish Premium

- Gradientes multicamadas para profundidade atmosférica
- Sombras realistas (projeção + contato)
- Bordas internas (bevel) em todos os elementos
- Iluminação direcional natural (luz de cima)
- Animações sutis e profissionais

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológica

- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Renderização**: Canvas API (tabuleiro) + DOM (UI)
- **Animações**: CSS Transitions + RequestAnimationFrame
- **Persistência**: localStorage
- **Assets**: WebP (imagens), Web Fonts (Poppins, Inter)

### Estrutura de Pastas

```
Block Lands - Adventure/
├── assets/
│   ├── css/
│   │   ├── base/
│   │   │   ├── _variables.css      # Variáveis globais
│   │   │   ├── _reset.css          # Reset CSS
│   │   │   └── _world-themes.css   # Temas por mundo
│   │   ├── components/
│   │   │   ├── _buttons.css        # Estilos de botões
│   │   │   ├── _game-board.css     # Tabuleiro
│   │   │   └── _ui-elements.css    # Elementos UI
│   │   ├── screens/
│   │   │   ├── _main-menu.css      # Menu principal
│   │   │   ├── _game-screen.css    # Tela de jogo
│   │   │   └── _world-select.css   # Seleção de mundos
│   │   └── main.css                # Arquivo principal
│   ├── img/
│   │   ├── logo.webp               # Logo do jogo
│   │   └── bg_world_select.webp    # Fundo seleção mundos
│   └── fonts/                      # Web fonts
├── js/
│   ├── game.js                     # Lógica principal
│   ├── levels.js                   # Configuração de níveis
│   └── canvas-renderer.js          # Renderização Canvas
├── index.html                      # Ponto de entrada
└── README.md                       # Este arquivo
```

### Sistema de Classes de Estado

O jogo usa um sistema de classes CSS no elemento `#app` para gerenciar estados:

```javascript
// Exemplos de estados
#app.is-screen-home              // Tela inicial
#app.is-screen-classic           // Modo clássico
#app.is-screen-adventure         // Modo aventura
#app.is-screen-adventure.world-fire     // Mundo do Fogo
#app.is-screen-adventure.world-forest   // Mundo da Floresta
```

Isso permite temas visuais diferentes por contexto sem manipulação de DOM excessiva.

---

## 🎯 Missões e Objetivos

### Tipos de Objetivos (Modo Aventura)

1. **Coletar Blocos Específicos**
   - Exemplo: "Colete 10 blocos Bee 🐝"
   - Progresso mostrado em tempo real

2. **Alcançar Pontuação**
   - Exemplo: "Alcance 500 pontos"
   - Sistema de estrelas baseado em score

3. **Limpar Linhas**
   - Exemplo: "Limpe 2 linhas de uma vez (2x)"
   - Contador visual de progresso

4. **Derrotar Chefão**
   - Exemplo: "Derrote o Titã de Fogo"
   - Barra de HP do boss

### Missões Aleatórias (Modo Clássico)

3 missões geradas a cada partida:
- Fazer combos consecutivos
- Alcançar pontuação específica
- Limpar múltiplas linhas
- Multiplicador de recompensa ao completar

---

## 🎨 Assets e Recursos

### Imagens

- **Logo**: 800x400px WebP (otimizado para mobile)
- **Background**: 1920x1080px WebP (comprimido)
- **Ícones**: Emoji Unicode (zero assets extras)

### Fontes

- **Poppins**: Títulos e headings (700, 800)
- **Inter**: Corpo de texto (400, 500, 600)

### Performance

- CSS minificado (produção)
- Imagens WebP (70% menor que PNG)
- Zero dependências externas
- Lazy loading de assets
- RequestAnimationFrame para animações suaves

---

## 📱 Compatibilidade

### Suportado

✅ **Mobile**
- iOS Safari 12+
- Chrome Android 80+
- Samsung Internet 12+

✅ **Desktop** (desenvolvimento)
- Chrome 80+
- Firefox 75+
- Edge 80+
- Safari 12+

### Otimizações Mobile

- Touch events otimizados
- Viewport fixo (sem zoom)
- Orientação portrait (recomendada)
- Safe area para notch/ilha dinâmica
- Sem scroll inercial

---

## 🚀 Roadmap

### ✅ Implementado

- [x] Sistema de blocos core
- [x] Modo Clássico completo
- [x] Modo Aventura com 6 mundos
- [x] Sistema de combate contra chefões
- [x] 78 níveis únicos
- [x] Sistema de save/load
- [x] Temas visuais por mundo
- [x] Missões aleatórias (Clássico)
- [x] Sistema de estrelas
- [x] Menu principal premium

### 🔨 Em Desenvolvimento

- [ ] Modo Blitz (contra o tempo)
- [ ] Sistema de power-ups
- [ ] Loja de cristais
- [ ] Conquistas/Achievements
- [ ] Leaderboards
- [ ] Tutorial interativo melhorado

### 💡 Planejado

- [ ] Multiplayer local
- [ ] Eventos especiais
- [ ] Skins de blocos
- [ ] Música e SFX
- [ ] Integração com redes sociais
- [ ] Sistema de daily rewards

---

## 🛠️ Como Executar

### Desenvolvimento Local

1. Clone o repositório
2. Abra `index.html` em um servidor local:

```bash
# Com Python 3
python -m http.server 8000

# Com Node.js (http-server)
npx http-server -p 8000

# Com PHP
php -S localhost:8000
```

3. Acesse `http://localhost:8000`

### Build de Produção

```bash
# Minificar CSS
npx csso main.css -o main.min.css

# Otimizar imagens
npx imagemin assets/img/* --out-dir=assets/img/optimized

# Compactar assets
# (Configurar build pipeline conforme necessidade)
```

---

## 🎮 Controles

### Mobile (Touch)

- **Arrastar peça**: Toque + arraste
- **Girar peça**: Toque no botão de rotação
- **Descartar peça**: Toque no botão lixeira
- **Menu**: Toque no ícone hambúrguer

### Desktop (Mouse/Teclado)

- **Mover peça**: Click + arrastar
- **Girar**: Botão rotação ou tecla **R**
- **Descartar**: Botão lixeira ou tecla **D**
- **Menu**: Click no ícone ou **ESC**

---

## 📊 Sistema de Dados

### LocalStorage Schema

```javascript
{
  "blockLands_save": {
    "classic": {
      "bestScore": 15420,
      "bestLevel": 12,
      "gamesPlayed": 48
    },
    "adventure": {
      "unlockedWorlds": ["tutorial_world", "fire_world"],
      "levelProgress": {
        "fire_1": { "stars": 3, "completed": true },
        "fire_2": { "stars": 2, "completed": true }
      },
      "currentWorld": "fire_world",
      "currentLevel": "fire_3"
    },
    "crystals": 2450,
    "achievements": [],
    "settings": {
      "music": true,
      "sfx": true
    }
  }
}
```

---

## 🤝 Contribuição

Este é um projeto proprietário em desenvolvimento ativo. Contribuições externas não estão sendo aceitas no momento.

---

## 📄 Licença

Copyright © 2025. Todos os direitos reservados.

Este software é proprietário e confidencial. Não é permitido:
- Redistribuir o código
- Modificar sem autorização
- Usar comercialmente sem licença

---

## 📞 Contato

Para dúvidas sobre licenciamento ou parcerias:
- **Email**: [seu-email@exemplo.com]
- **Website**: [www.blocklands.game]

---

## 🙏 Agradecimentos

- Design inspirado por Monument Valley, Alto's Adventure e Clash Royale
- Ícones: Unicode Emoji
- Fontes: Google Fonts (Poppins, Inter)

---

**Feito com 💙 para mobile**

*Block Lands - Where Puzzles Meet Adventure*
