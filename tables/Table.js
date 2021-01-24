class Table
{
	constructor(pSQL)
	{
		this.aSQL = pSQL;
	}
	get SQL()
	{
		return this.aSQL;
	}
}

module.exports = Table;