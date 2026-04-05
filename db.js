/**
 * db.js — Camada de acesso ao Supabase
 *
 * CONFIGURAÇÃO:
 *   Substitua SUPABASE_URL e SUPABASE_ANON_KEY pelos valores do seu projeto.
 *   Painel Supabase → Settings → API
 *
 * TABELA NECESSÁRIA (rode no Supabase → SQL Editor):
 *
 *   create table vagas (
 *     id          bigint primary key generated always as identity,
 *     causa       text not null,
 *     tag_class   text not null,
 *     filter      text not null,
 *     titulo      text not null,
 *     descricao   text not null,
 *     endereco    text not null,
 *     map_url     text not null,
 *     data        text not null,
 *     distancia   text not null default '—',
 *     criado_em   timestamptz default now()
 *   );
 *
 *   -- Leitura pública (qualquer visitante pode ver as vagas)
 *   alter table vagas enable row level security;
 *   create policy "leitura publica" on vagas for select using (true);
 *   create policy "insercao publica" on vagas for insert with check (true);
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── ⚠️ Substitua aqui ────────────────────────────────────────────────────────
const SUPABASE_URL = "https://khofgvwpgxyfaahhisxo.supabase.co"; // ← cole aqui
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtob2ZndndwZ3h5ZmFhaGhpc3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MTY2MjUsImV4cCI6MjA5MDk5MjYyNX0.RPmzQObB4mzsXmPaU6ZfaHz2jrroLqVKEG17LkDa2Qk";
// ─────────────────────────────────────────────────────────────────────────────

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DB = {
  // Retorna todas as vagas ordenadas da mais recente para a mais antiga
  async listar() {
    const { data, error } = await supabase
      .from("vagas")
      .select("*")
      .order("criado_em", { ascending: false });

    if (error) {
      console.error("[DB] Erro ao listar vagas:", error.message);
      return [];
    }
    return data;
  },

  // Insere uma nova vaga e retorna o registro criado (com id gerado pelo banco)
  async inserir(vaga) {
    const { data, error } = await supabase
      .from("vagas")
      .insert([
        {
          causa: vaga.causa,
          tag_class: vaga.tagClass,
          filter: vaga.filter,
          titulo: vaga.titulo,
          descricao: vaga.descricao,
          endereco: vaga.endereco,
          map_url: vaga.mapUrl,
          data: vaga.data,
          distancia: vaga.distancia,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("[DB] Erro ao inserir vaga:", error.message);
      throw error;
    }

    // Normaliza os nomes de coluna (snake_case → camelCase) para o restante do app
    return normalizarVaga(data);
  },

  // Busca uma vaga pelo id
  async buscarPorId(id) {
    const { data, error } = await supabase
      .from("vagas")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("[DB] Erro ao buscar vaga:", error.message);
      return null;
    }
    return normalizarVaga(data);
  },
};

// Converte snake_case do Postgres para camelCase usado no app
function normalizarVaga(v) {
  return {
    id: v.id,
    causa: v.causa,
    tagClass: v.tag_class,
    filter: v.filter,
    titulo: v.titulo,
    descricao: v.descricao,
    endereco: v.endereco,
    mapUrl: v.map_url,
    data: v.data,
    distancia: v.distancia,
    criadoEm: v.criado_em,
  };
}

// Exporta como global para uso nos outros scripts (sem bundler)
window.DB = DB;
