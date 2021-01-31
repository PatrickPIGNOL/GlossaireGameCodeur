const Table = require("./Table.js")

class PasswordsTable extends Table
{
	constructor(pSQL)
	{
		super(pSQL);
		//this.Drop();
		this.Create();
	}
	
	Create()
	{
		this.SQL.prepare
		(
			`CREATE TABLE IF NOT EXISTS Passwords
			(
				EMail TEXT UNIQUE NOT NULL,
				Hash TEXT NOT NULL,
				PRIMARY KEY (EMail)
			);`
		).run();
	}
	
	Drop()
	{
		this.SQL.prepare
		(
			`DROP TABLE IF EXISTS Passwords;`
		).run()
	}

	SelectCount()
	{
		return this.SQL.prepare
		(
			`SELECT COUNT(DISTINCT EMail) AS "Count" FROM Passwords`
		).all();
	}

	SelectEMail(pEMail)
	{
		return this.SQL.prepare
		(
			`SELECT rowid, * FROM Passwords WHERE EMail = ?`
		).get(pEMail);
	}

	SelectAll()
	{
		return this.SQL.prepare
		(
			`SELECT rowid, * FROM Passwords`
		).all();
	}

	Insert(pLogin)
	{
		this.SQL.prepare
		(
			`INSERT INTO Passwords 
			(
				EMail, 
				Hash
			) 
			VALUES 
			(
				@EMail,
				@Hash
			)`
		).run(pLogin);
	}
}

module.exports = PasswordsTable;