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
				Name TEXT UNIQUE,
				URL TEXT UNIQUE,
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
		this.SQL.prepare
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
	SelectName(pName)
	{
		return this.SQL.prepare
		(
			`SELECT rowid, * FROM Links WHERE Name = ?`
		).get(pName)
	}
	SelectAll()
	{
		return this.SQL.prepare
		(
			`SELECT rowid, * FROM Links ORDER BY Name`
		).all()
	}
	SelectAllName(pName)
	{
		return this.SQL.prepare
		(
			`SELECT rowid, * FROM Links WHERE Name IS LIKE ? ORDER BY Name`
		).all("%" + pName + "%")
	}
	Insert(pValues)
	{
		this.SQL.prepare
		(
			`INSERT INTO Links 
			(
				Name, 
				URL
			) 
			VALUES 
			(
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
				Name, 
				URL
			) 
			= 
			(
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