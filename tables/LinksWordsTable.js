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
	Update(pValues) 
	{
		this.SQL.prepare
		(
			`UPDATE LinksWords 
			SET 
			(
				WordsID,
				LinksID
			) 
			= 
			(
				@WordsID,
				@LinksID
			) 
			WHERE rowid = @rowid`
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