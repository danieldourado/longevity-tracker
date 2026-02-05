# Longevity Tracker

Aplicativo de tracking de exames de saúde para longevidade, baseado no Plano de Exames de 2026.

## Stack

- Next.js 15 + TypeScript
- Tailwind CSS
- Convex (local development)
- shadcn/ui

## Como usar

### 1. Iniciar Convex (backend)

```bash
npx convex dev
```

Isso vai:
- Criar um projeto local Convex
- Fazer deploy automático das funções
- Gerar tipos TypeScript

### 2. Iniciar Next.js (frontend)

Em outro terminal:

```bash
npm run dev
```

### 3. Popular o banco de dados

Acesse o dashboard do Convex e execute a função `exams:seedExams` para popular o banco com os exames do plano.

## Funcionalidades

✅ **Dashboard** - Visão geral de exames, realizados, vencidos  
✅ **Lista de Exames** - Todos os 46+ exames do plano, filtráveis por categoria  
✅ **Registro de Resultados** - Adicionar resultados manualmente com data e valores  
✅ **Acompanhamento** - Cálculo automático de próximos vencimentos baseado na frequência  

## Estrutura de Dados

### Categorias
- Checkup Base Anual
- Checkup Bienal
- Checkup 3-5 Anos
- Rastreamento de Câncer
- Longevidade Avançado
- Longevidade Opcional
- Metabólico
- Ocular
- Bucal

### Frequências
- Semi-anual (6 meses)
- Anual
- Bienal (2 anos)
- Trienal (3 anos)
- Quinquenal (5 anos)
- Uma vez na vida
