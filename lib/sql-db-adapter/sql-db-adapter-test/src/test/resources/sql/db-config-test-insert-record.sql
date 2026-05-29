-- Record with ID=1 - will be updated in tests
INSERT INTO non_auto_inc_table (id, title_en, title_ar, code)
VALUES (1, 'Test Title', 'عنوان تجريبي', 'CODE001');
INSERT INTO auto_inc_table (id,title_en, title_ar, code)
VALUES (1,'Test Title', 'عنوان تجريبي', 'CODE001');