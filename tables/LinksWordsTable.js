const Table = require("./Table.js")

class LinksWordsTable extends Table
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
			`CREATE TABLE IF NOT EXISTS LinksWords
			(
				WordsID BIGINT NOT NULL,
				LinksID BIGINT NOT NULL,
				PRIMARY KEY (WordsID, LinksID)
			);`
		).run()
	}
	Drop() 
	{
		this.SQL.prepare
		(
			`DROP TABLE IF EXISTS LinksWords;`
		).run()
	}
	SelectCount()
	{
		return this.SQL.prepare
		(
			`SELECT  COUNT(*) as Count
			FROM
        	(
            	SELECT  DISTINCT WordsID, LinksID
            	FROM    LinksWords
        	)`
		).get();
	}
	SelectLinks(pLinks) 
	{
		return this.SQL.prepare
		(
			`SELECT rowid, * FROM LinksWords WHERE LinksID = ?`
		).all(pLinks)
	}
	
	SelectWords(pWord) 
	{
		return this.SQL.prepare
		(
			`SELECT rowid, * FROM LinksWords WHERE WordsID = ?`
		).all(pWord)
	}

	SelectRowID(pRowID)
	{
		return this.SQL.prepare
		(
			`SELECT rowid, * FROM LinksWords WHERE rowid = ?`
		).get(pRowID)
	}

	SelectID(pWordID, pLinkID) 
	{
		return this.SQL.prepare
		(
			`SELECT rowid, * FROM LinksWords WHERE WordsID = ? AND LinksID = ?`
		).get(pWordID, pLinkID)
	}

	SelectAll() 
	{
		return this.SQL.prepare
		(
			`SELECT rowid, * FROM LinksWords`
		).all()
	}
	Insert(pValues) 
	{
		this.SQL.prepare
		(
			`INSERT INTO LinksWords 
			(
				WordsID,
				LinksID
			) 
			VALUES 
			(
				@WordsID,
				@LinksID
			)`
		).run(pValues)
	}
	Delete(pID) 
	{
		this.SQL.prepare
		(
			`DELETE FROM LinksWords WHERE rowid = ?`
		).run(pID)
	}
}

module.exports = LinksWordsTable;