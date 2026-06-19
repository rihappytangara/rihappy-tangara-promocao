const SUPABASE_URL = "https://ksltubnnpphxqhjycdau.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzbHR1Ym5ucHBoeHFoanljZGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MDExMjcsImV4cCI6MjA5NzI3NzEyN30.0BxnZ-4GGdEgeC3SyX0kbVZdV_Y4L9TAFCg6xvTJlM8";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const CONFIG = {

  PROMOCAO_ATIVA: true,

  DATA_INICIO: "2026-07-01",

  DATA_FIM: "2027-01-01",

  VALOR_MINIMO_COMPRA: 1,

  EMPRESAS_PERMITIDAS: [
    "TANGARA LUDIQUE LTDA"
  ]

};
