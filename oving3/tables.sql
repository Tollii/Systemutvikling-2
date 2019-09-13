DROP TABLE IF EXISTS article, tags;

CREATE TABLE article(
    article_id INT UNSIGNED AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    article_text MEDIUMTEXT,
	  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image BLOB,
    importance TINYINT,
    PRIMARY KEY (article_id)
    );

CREATE TABLE tags(
    tag_id INT UNSIGNED AUTO_INCREMENT,
    tag VARCHAR(20) NOT NULL,
    article_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (tag_id),
    FOREIGN KEY (article_id) REFERENCES article(article_id)
  );


# DELETE FROM article WHERE article_id = x;
