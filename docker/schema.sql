
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
            ALTER TABLE test_table2
            ADD COLUMN test_table_id INT,
            ADD CONSTRAINT fk_test_table
            FOREIGN KEY(test_table_id)
            REFERENCES test_table(id)
            ON DELETE SET NULL;   
          
