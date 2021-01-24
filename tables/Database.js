const SQLite = require("better-sqlite3");

const LinksTable = require("./LinksTable.js");
const WordsTable = require("./WordsTable.js");
const LinksWordsTable = require("./LinksWordsTable.js");

class Database
{
	constructor()
	{	
		this.aSQL = new SQLite("./GlossaireGameCodeur.sqlite");
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
	}
	Close()
	{
		this.aSQL.close();
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
}

module.exports = Database;