
create table clientes(
 id bigint generated always as identity primary key,
 cpf text unique not null,
 nome text not null,
 telefone text,
 created_at timestamp default now()
);

create table cupons(
 id bigint generated always as identity primary key,
 cliente_id bigint references clientes(id),
 valor_compra numeric(10,2),
 numero_cupom text not null,
 pdv text not null,
 numero_sorte_inicial bigint not null,
 numero_sorte_final bigint not null,
 created_at timestamp default now(),
 unique(numero_cupom,pdv)
);
