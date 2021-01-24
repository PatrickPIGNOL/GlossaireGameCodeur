const Database = require("./tables/Database.js")

class Site
{
	constructor(pTitle)
	{
		this.aDatabase = new Database();
		this.aTitle = pTitle;
	}
	get HTMLHeader()
	{
		return `<HTML><HEAD><TITLE>${this.aTitle}</TITLE></HEAD><BODY>`;
	}
	get HTMLFooter()
	{
		return "</BODY></HTML>";
	}	
	get Welcome()
	{
		let vHTML = this.HTMLHeader;
		vHTML += this.mWelcomeForm();
		vHTML += this.HTMLFooter;
		return vHTML;		
	}

	mWelcomeForm()
	{
		let vHTML = `<form action="https://glossairegamecodeur.patrickpignol.repl.co" method="post">
    			<label>Rechercher : <input type="text" list="WordsList" name="Word" id="Word" required></label>
				<input type="submit" value="Rechercher"></input>
			</form>
			<datalist id="WordsList">`;
		this.aDatabase.Words.SelectAll().forEach
		(
			vWordFound =>
			{				
				vHTML += `<option value="${vWordFound.Word}">`;
			}
		)
		this.aDatabase.aLinks.SelectAll().forEach
		(
			vLinkFound=>
			{
				vHTML += `<option value="${vLinkFound.Name}">`;
			}
		)
		vHTML += `</datalist>`;
		return vHTML;
	}

	mWelcome(pWord)
	{
		let vHTML = this.HTMLHeader;
		vHTML += this.mWelcomeForm();
		this.aDatabase.Words.SelectAllWords(pWord).forEach
		(
			vWordFound=>
			{
				`<form id="${vWordFound.WordID}" action="https://glossairegamecodeur.patrickpignol.repl.co/word" method="post">
					<input id="Word" name="Word" type="hidden" value="${vWordFound.WordID}">
            		<a href="javascript:{}" onclick="document.getElementById('${vWordFound.WordID}').submit();">${vWordFound.Word}</a>
        		</form>`
			}
		);		
		vHTML += this.HTMLFooter;
	}

	get AddWords()
	{
		let vHTML = this.HTMLHeader;
		vHTML += this.mAddWordsForm()
		vHTML += this.HTMLFooter;
		return vHTML;		
	}
	mAddWordsForm()
	{
		let vHTML = `<form action="https://glossairegamecodeur.patrickpignol.repl.co/addwords" method="post">
    			<label>Ajouter un nouveau mot <input type="text" list="WordsList" name="Word" id="Word" required></label>
				<input type="submit" value="Ajouter"></input>
			</form>
			<datalist id="WordsList">`;
		this.aDatabase.Words.SelectAll().forEach
		(
			vWordFound =>
			{
				console.log(vWordFound)
				vHTML += `<option value="${vWordFound.Word}">`;
			}
		)
			
		vHTML += `</datalist>`;
		return vHTML;
	}
	mAddWords(pWord)
	{
		let vHTML = this.HTMLHeader;
		if(!this.aDatabase.Words.SelectWord(pWord))
		{
			this.aDatabase.Words.Insert
			(
				{
					WordID: pWord.toLowerCase(),
					Word: pWord
				}
			);
			vHTML += "Le mot clé à été ajouté";
		}
		else
		{
			vHTML += "Le mot clé existe déjà"
		}
		vHTML += this.mAddWordsForm();
		vHTML += this.HTMLFooter;
		return vHTML;
	}
	get AddLinks()
	{
		let vHTML = this.HTMLHeader;
		vHTML += `Ajouter un nouveau document :\n <input type="text">`;
		vHTML += this.HTMLFooter;
		return vHTML;		
	}
}

module.exports = Site;