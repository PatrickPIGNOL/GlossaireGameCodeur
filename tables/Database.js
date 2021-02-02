const SQLite = require("better-sqlite3");

const LinksTable = require("./LinksTable.js");
const WordsTable = require("./WordsTable.js");
const LinksWordsTable = require("./LinksWordsTable.js");
const PasswordsTable = require("./PasswordsTable.js")

class Database
{
	constructor()
	{	
		this.aSQL = new SQLite("./GlossaireGameCodeur.sqlite");
		this.aSQLPasswords = new SQLite("./Passwords.sqlite");
		console.log("Database openned.")
		this.aSQL.pragma("synchronous = FULL");
    	this.aSQL.pragma("journal_mode = WAL");
		this.aSQL.pragma("auto_vacuum = FULL");
		process.removeAllListeners();
		process.on
		(
			'exit', () =>
			{ 
				this.Close()
			}
		);
		process.on('SIGHUP', () => process.exit(128 + 1));
		process.on('SIGINT', () => process.exit(128 + 2));
		process.on('SIGTERM', () => process.exit(128 + 15));	
		this.aLinks = new LinksTable(this.aSQL);
		this.aWords = new WordsTable(this.aSQL);
		this.aLinksWords = new LinksWordsTable(this.aSQL);
		this.aPasswords = new PasswordsTable(this.aSQLPasswords);
	}
	Close()
	{
		this.aSQL.close();
		this.aSQLPasswords.close();
		console.log("Database closed properly.")
	}
	get Links()
	{
		return this.aLinks;
	}
	get Words()
	{
		return this.aWords;
	}
	get LinksWords()
	{
		return this.aLinksWords;
	}
	get Passwords()
	{
		return this.aPasswords;
	}
}

module.exports = Database;