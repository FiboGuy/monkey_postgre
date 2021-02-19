CREATE TABLE test_table(
            id serial PRIMARY KEY,
            title VARCHAR(255) UNIQUE NOT NULL,
            arrs  integer [] NOT NULL,
            jsons JSON NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
CREATE TABLE test_table2(
            id serial PRIMARY KEY,
            title VARCHAR(255) UNIQUE NOT NULL
        );
