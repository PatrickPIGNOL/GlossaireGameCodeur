const Table = require("./Table.js")

class LinksTable extends Table
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
			`CREATE TABLE IF NOT EXISTS Links
			(
				NameID TEXT UNIQUE NOT NULL,
				Name TEXT NOT NULL,
				URL TEXT UNIQUE NOT NULL,
				PRIMARY KEY (URL)
			);`
		).run()
	}
	Drop()
	{
		this.SQL.prepare
		(
			`DROP TABLE IF EXISTS Links;`
		).run()
	}
	SelectID(pID)
	{
		return this.SQL.prepare
		(
			"SELECT rowid, * FROM Links WHERE rowid = ?"
		).get(pID);
	}
	SelectURL(pURL)
	{
		return this.SQL.prepare
		(
			`SELECT rowid, * FROM Links WHERE URL = ?`
		).get(pURL)
	}
	SelectNameID(pNameID)
	{
		return this.SQL.prepare
		(
			`SELECT rowid, * FROM Links WHERE NameID = ?`
		).get(pNameID.toLowerCase())
	}
	SelectAll()
	{
		return this.SQL.prepare
		(
			`SELECT rowid, * FROM Links ORDER BY Name`
		).all()
	}
	SelectAllNameID(pName)
	{
		return this.SQL.prepare
		(
			`SELECT rowid, * FROM Links WHERE NameID LIKE ? ORDER BY Name`
		).all("%" + pName.toLowerCase() + "%")
	}
	Insert(pValues)
	{
		this.SQL.prepare
		(
			`INSERT INTO Links 
			(
				NameID,
				Name, 
				URL
			) 
			VALUES 
			(
				@NameID,
				@Name, 
				@URL
			)`
		).run(pValues)
	}
	Update(pValues)
	{
		this.SQL.prepare
		(
			`UPDATE Links 
			SET 
			(
				NameID,
				Name, 
				URL
			) 
			= 
			(
				@NameID,
				@Name,
				@URL
			) 
			WHERE rowid = @rowid`
		).run(pValues)
	}
	Delete(pID)
	{
		this.SQL.prepare
		(
			`DELETE FROM Links WHERE rowid = ?`
		).run(pID)
	}
}

module.exports = LinksTable;