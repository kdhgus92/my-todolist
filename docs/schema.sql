-- my-todolist DDL (PostgreSQL 17)
-- 근거: docs/7-erd.md, docs/1-domain-definition.md (EN-01~03, BR-04/05/08)

CREATE TABLE users (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email      varchar(255) NOT NULL UNIQUE,
    password   varchar(255) NOT NULL,
    name       varchar(100) NOT NULL,
    created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE categories (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name       varchar(100) NOT NULL,
    is_default boolean NOT NULL DEFAULT false,
    created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE todos (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id uuid NOT NULL REFERENCES categories(id),
    title       varchar(200) NOT NULL,
    start_date  date NOT NULL,
    end_date    date NOT NULL,
    is_done     boolean NOT NULL DEFAULT false,
    created_at  timestamp NOT NULL DEFAULT now(),
    CONSTRAINT chk_todos_date_range CHECK (end_date >= start_date)
);

-- 카테고리명 유일성: 사용자별, 대소문자 무시·앞뒤 공백 트림 후 비교 (EN-02, BR-08)
CREATE UNIQUE INDEX uq_categories_user_name
    ON categories (user_id, lower(trim(name)));

-- 사용자당 기본 카테고리는 정확히 1개 (EN-02)
CREATE UNIQUE INDEX uq_categories_one_default_per_user
    ON categories (user_id)
    WHERE is_default;

-- 조회 성능 인덱스 (구조 설계 원칙 6절)
CREATE INDEX idx_todos_user_id ON todos (user_id);
CREATE INDEX idx_todos_category_id ON todos (category_id);
