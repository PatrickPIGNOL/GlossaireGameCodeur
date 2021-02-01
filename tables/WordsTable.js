const Table = require("./Table.js")

class WordsTable extends Table
{
	constructor(pSQL)
	{
		super(pSQL);
		this.Create();
	}
	Create()
	{
		this.SQL.prepare
		(
			`CREATE TABLE IF NOT EXISTS Words
			(
				WordID TEXT UNIQUE NOT NULL,
				Word TEXT UNIQUE NOT NULL,				
				PRIMARY KEY (WordID)
			);`
		).run()
	}
	Drop()
	{
		this.SQL.prepare
		(
			`DROP TABLE IF EXISTS Words;`
		).run()
	}
	SelectCount()
	{
		return this.SQL.prepare
		(
			`SELECT COUNT(DISTINCT WordID) AS "Count" FROM Words`
		).get();
	}
	SelectID(pWordID)
	{
		return this.SQL.prepare
		(
			`SELECT rowid, * FROM Words WHERE rowid = ?`
		).get(pWordID)
	}
	SelectWord(pWord)
	{
		return this.SQL.prepare
		(
			`SELECT rowid, * FROM Words WHERE WordID = ?`
		).get(pWord.toLowerCase())
	}
	SelectAll()
	{
		return this.SQL.prepare
		(
			`SELECT rowid, * FROM Words ORDER BY WordID`
		).all()
	}
	SelectAllWords(pWord)
	{
		const vWord = "%" + pWord.toLowerCase() + "%";
		return this.SQL.prepare
		(
			`SELECT rowid, * FROM Words WHERE WordID LIKE ? ORDER BY WordID`
		).all(vWord);
	}
	Insert(pValues)
	{
		this.SQL.prepare
		(
			`INSERT INTO Words 
			(
				WordID,
				Word
			) 
			VALUES 
			(
				@WordID,
				@Word
			)`
		).run(pValues)
	}
	Update(pValues)
	{
		this.SQL.prepare
		(
			`UPDATE Words 
			SET 
			(
				WordID,
				Word
			) 
			= 
			(
				@WordID,
				@Word
			) 
			WHERE rowid = @rowid`
		).run(pValues)
	}
	Delete(pID)
	{
		this.SQL.prepare
		(
			`DELETE FROM Words WHERE rowid = ?`
		).run(pID)
	}
}

module.exports = WordsTable;