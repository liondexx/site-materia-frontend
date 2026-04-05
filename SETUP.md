# Mãos Próximas — Guia de Setup

## Estrutura do projeto

```
maos-proximas/
├── index.html       ← página principal
├── cadastro.html    ← formulário de nova vaga
├── db.js            ← camada de acesso ao Supabase
├── script.js        ← lógica da UI
├── style.css        ← estilos
└── reset.css        ← reset CSS
```

---

## 1. Criar o banco no Supabase

1. Acesse https://supabase.com e crie uma conta gratuita
2. Clique em **New Project** e dê um nome (ex: `maos-proximas`) senha:sitedexflore
3. No menu lateral, vá em **SQL Editor**
4. Cole e execute o SQL abaixo para criar a tabela:

```sql
create table vagas (
  id          bigint primary key generated always as identity,
  causa       text not null,
  tag_class   text not null,
  filter      text not null,
  titulo      text not null,
  descricao   text not null,
  endereco    text not null,
  map_url     text not null,
  data        text not null,
  distancia   text not null default '—',
  criado_em   timestamptz default now()
);

-- Permite leitura e inserção pública (sem login)
alter table vagas enable row level security;
create policy "leitura publica"  on vagas for select using (true);
create policy "insercao publica" on vagas for insert with check (true);
```

---

## 2. Pegar as credenciais

1. No painel do Supabase, vá em **Settings → API**
2. Copie:
   - **Project URL** → ex: `https://xyzabcdef.supabase.co`
   - **anon public key** → chave longa começando com `eyJ...`

---

## 3. Configurar o db.js

Abra `db.js` e substitua as duas linhas marcadas com ⚠️:

```js
const SUPABASE_URL = "https://SEU_PROJETO.supabase.co"; // ← cole aqui
const SUPABASE_ANON_KEY = "SUA_ANON_KEY_AQUI"; // ← cole aqui

const SUPABASE_URL = "https://khofgvwpgxyfaahhisxo.supabase.co"; // ← cole aqui
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtob2ZndndwZ3h5ZmFhaGhpc3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MTY2MjUsImV4cCI6MjA5MDk5MjYyNX0.RPmzQObB4mzsXmPaU6ZfaHz2jrroLqVKEG17LkDa2Qk"; // ← cole aqui\
```

---

## 4. Popular o banco com as vagas iniciais (opcional)

Se quiser inserir as 3 vagas de exemplo direto no banco, execute no SQL Editor:

```sql
insert into vagas (causa, tag_class, filter, titulo, descricao, endereco, map_url, data, distancia) values
(
  'Causa Animal', 'tag-animal', 'animal',
  'Passeio com Cães de Abrigo',
  'O abrigo Patas Amigas precisa de voluntários para exercitar os cães no período da manhã.',
  'R. Roraima, 277 - Cajuru, Curitiba - PR',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.468199748431!2d-49.220274800000006!3d-25.4560371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce5411a4f7ec9%3A0x7e0392ce6661eea8!2sR.%20Roraima%2C%20277%20-%20Cajuru%2C%20Curitiba%20-%20PR%2C%2082940-330!5e0!3m2!1spt-BR!2sbr!4v1775339363046!5m2!1spt-BR!2sbr',
  'Sábado e Domingo', '0.8 km'
),
(
  'Educação', 'tag-educacao', 'educacao',
  'Reforço Escolar para Crianças',
  'ONG Semente do Saber busca voluntários para oferecer reforço em matemática e português.',
  'Curitiba, PR',
  'https://maps.google.com/maps?q=Curitiba,PR&output=embed&hl=pt-BR',
  'Quartas e Sextas', '1.4 km'
),
(
  'Meio Ambiente', 'tag-ambiente', 'ambiente',
  'Limpeza do Parque Barigui',
  'Mutirão de limpeza e plantio de mudas no Parque Barigui. Traga luvas.',
  'Parque Barigui, Curitiba - PR',
  'https://maps.google.com/maps?q=Parque+Barigui+Curitiba&output=embed&hl=pt-BR',
  'Todo primeiro sábado do mês', '3.1 km'
);
```

---

## 5. Hospedar na Vercel

1. Suba os arquivos para um repositório no GitHub
2. Acesse https://vercel.com → **New Project** → importe o repositório
3. Clique em **Deploy** (sem nenhuma configuração extra — é HTML puro)
4. Pronto! A URL gerada pela Vercel já estará conectada ao Supabase

---

## Como funciona o fluxo completo

```
Visitante abre index.html (Vercel)
    ↓
db.js chama Supabase → SELECT * FROM vagas
    ↓
script.js renderiza os cards na tela

Visitante preenche cadastro.html
    ↓
db.js chama Supabase → INSERT INTO vagas
    ↓
Redireciona para index.html já com a nova vaga
```

A `anon key` do Supabase é segura para ficar no código frontend —
ela só permite as operações que você autorizou nas policies (select e insert).
