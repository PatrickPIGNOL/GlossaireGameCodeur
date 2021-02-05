const Site = require("./Site.js");

class Research extends Site
{
	constructor(pTitle)
	{
		super(pTitle);
	}

	get HTMLHeader()
	{
		return `<HTML><HEAD><TITLE>${this.Title}</TITLE><link rel="stylesheet" href="/css.css"></HEAD><BODY><H1>${this.Title}</H1><div class="credits">créé par patrick pignol</div>`;
	}

	get HTMLFooter()
	{
		return "</BODY></HTML>";
	}	

	get Welcome()
	{
		let vHTML = this.HTMLHeader;
		vHTML += `<H2>Rechercher</H2>`;
		vHTML += this.mWelcomeForm();
		let vWords = new Array();
		this.Database.Words.SelectAll().forEach
		(
			vWordFound=>
			{
				vHTML += this.mWordsSearchResults(vWordFound);
			}
		);
		this.Database.Links.SelectAll().forEach
		(
			vLinkFound=>
			{
				vHTML += this.mLinksSearchResults(vLinkFound);
			}
		);
		vHTML += this.HTMLFooter;
		return vHTML;		
	}

	mWelcomeForm(pText)
	{
		if(!pText)
		{
			pText = "";
		}		
		let vHTML = `
			<TABLE width="100%">
				<TR width="100%">
					<TD>
						<form action="https://glossairegamecodeur.patrickpignol.repl.co">
							<input type="submit" title="Recommencer" value="🔁"></input>
						</form>
					</TD>
					<TD>
						<form action="https://glossairegamecodeur.patrickpignol.repl.co" method="post">
							<input size="40" type="text" list="WordsList" id="Word" name="Word" value="${pText}" placeholder="Tapez votre recherche ici..." required>
					</TD>
					<TD>
							<input type="submit" title="Lancer la recherche" value="Rechercher"></input>
						</form>
					</TD>
					<TD width="100%">
					</TD>
				</TR>
			</TABLE>
			<HR>
			<datalist id="WordsList">`;
			this.Database.Words.SelectAllWords(pText).forEach
			(
				vWordFound =>
				{	
					vHTML += `<option value="${vWordFound.Word}">`;
				}
			)
			this.Database.aLinks.SelectAllNameID(pText).forEach
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
		vHTML += "<H2>Rechercher</H2>"
		vHTML += this.mWelcomeForm(pWord);
		this.Database.Words.SelectAllWords(pWord).forEach
		(
			vWordFound=>
			{
				vHTML += this.mWordsSearchResults(vWordFound);
			}
		);		
		this.Database.Links.SelectAllNameID(pWord).forEach
		(
			vLinkFound=>
			{
				vHTML += this.mLinksSearchResults(vLinkFound);
			}
		);
		vHTML += this.HTMLFooter;
		return vHTML
	}

	mWordsSearchResults(pWord)
	{
		const vWordLinks = this.Database.LinksWords.SelectWords(pWord.rowid);
		if(vWordLinks && vWordLinks.length)
		{
			return `
			<form id="Word${pWord.rowid}" action="https://glossairegamecodeur.patrickpignol.repl.co/word" method="post">
				<input id="Word" name="Word" type="hidden" value="${pWord.WordID}">
            	<a href="javascript:{}" onclick="document.getElementById('Word${pWord.rowid}').submit();">${pWord.Word}</a>
			</form>`
		}
		else
		{
			return `${pWord.Word}<BR/>`
		}
	}

	mLinksSearchResults(pLink)
	{
		return `<form id="Link${pLink.rowid}" action="https://glossairegamecodeur.patrickpignol.repl.co/link" method="post">
					<input id="Link" name="Link" type="hidden" value="${pLink.NameID}">
            		<a href="javascript:{}" onclick="document.getElementById('Link${pLink.rowid}').submit();">${pLink.Name}</a>
        		</form>`
	}

	mWord(pWord)
	{
		let vHTML = this.HTMLHeader;
		console.log(pWord)
		const vWord = this.Database.Words.SelectWord(pWord);
		vHTML += `<H2>Rechercher</H2>`;
		vHTML += this.mWelcomeForm(vWord.Word);
		vHTML += `<H2>${vWord.Word}</H2>`
		//vHTML += this.mWordForm();
		vHTML += `${vWord.Word} est présent dans les documents suivants :<BR/><ul>`;
		const vLinks = new Array();
		const vLinksWords = this.Database.LinksWords.SelectWords(vWord.rowid);
		vLinksWords.forEach
		(
			vLinkWord=>
			{
				const vLink = this.Database.Links.SelectID(vLinkWord.LinksID);
				vLinks.push(vLink);				
			}
		);
		vLinks.sort
		(
			(a, b)=> 
			{
				if (a.Name < b.Name)
				{
     				return -1;
				}
				else if (a.Name > b.Name)
				{
					return 1;
				}
				else
				{
					return 0;
				}
			}
		);
		vLinks.forEach
		(
			vLinkFound=>
			{
				vHTML += `<li><a target="_blank" href="${vLinkFound.URL}">${vLinkFound.Name}</a></li>`;
			}
		);
		vHTML += `</ul>`;
		vHTML += this.HTMLFooter;
		return vHTML;
	}

	mWordForm()
	{
		let vHTML = `
			<TABLE width="100%">
				<TR width="100%">
					<TD>
						<form action="https://glossairegamecodeur.patrickpignol.repl.co" method="get">
							<input type="submit" value="🏠"></input>
						</form>
					</TD>
					<TD width="100%">
					</TD>
				</TR>
			</TABLE>`;
		return vHTML;
	}

	mLink(pLink)
	{
		const vLink = this.Database.Links.SelectNameID(pLink);
		let vHTML = this.HTMLHeader;
		vHTML += `<H2>Rechercher</H2>`;
		vHTML += this.mWelcomeForm(vLink.Name);
		vHTML += `<H2>${vLink.Name}</H2>`
		//vHTML += this.mLinkForm();
		vHTML += `<a target="_blank" href="${vLink.URL}">${vLink.Name}</a> est présent pour les mots clé suivants :<BR/><ul>`;
		let vWords = new Array();
		const vLinksWords = this.Database.LinksWords.SelectLinks(vLink.rowid);
		vLinksWords.forEach
		(
			vLinkWord=>
			{
				const vWord = this.Database.Words.SelectID(vLinkWord.WordsID);
				if(vWord)
				{
					vWords.push(vWord);
				}
			}
		);
		vWords.sort
		(
			(a, b)=> 
			{
				if (a.Word < b.Word)
				{
     				return -1;
				}
				else if (a.Word > b.Word)
				{
					return 1;
				}
				else
				{
					return 0;
				}
			}
		);
		vWords.forEach
		(		
			vWordFound=>
			{
				vHTML  += `
					<li>
						<form id="Word${vWordFound.rowid}" action="https://glossairegamecodeur.patrickpignol.repl.co/Word" method="post">
							<input id="Word" name="Word" type="hidden" value="${vWordFound.Word}">
							<a href="javascript:{}" onclick="document.getElementById('Word${vWordFound.rowid}').submit();">${vWordFound.Word}</a>
						</form>
					</li>`;
			}
		);


		vHTML += `</ul>`;
		vHTML += this.HTMLFooter;
		return vHTML;
	}

	mLinkForm()
	{
		let vHTML = `
			<TABLE width="100%">
				<TR width="100%">
					<TD>
						<form action="https://glossairegamecodeur.patrickpignol.repl.co" method="get">
							<input type="submit" value="🏠"></input>
						</form>
					</TD>
					<TD width="100%">
					</TD>
				</TR>
			</TABLE>`;
		return vHTML;
	}
}

module.exports = Research;