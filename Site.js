const Database = require("./tables/Database.js")

class Site
{
	constructor(pTitle)
	{
		this.aDatabase = new Database();
		this.aTitle = pTitle;
		this.aConfig = require("./config.json");
	}

	get Title()
	{
		return this.aTitle;
	}

	get Database()
	{
		return this.aDatabase;
	}

	get Config()
	{
		return this.aConfig;
	}
}

module.exports = Site;