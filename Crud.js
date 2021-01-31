const Admin = require("./Admin.js");

class Crud extends Admin
{
	constructor(pTitle)
	{
		super(pTitle)
	}

	mCrud(pLogin, pText)
	{
		if(!pText)
		{
			pText = "";
		}
		const vLogin = this.mVerify(JSON.parse(pLogin));
		if(vLogin)
		{
			let vHTML = this.HTMLHeader;
			vHTML += this.mCrudForm(vLogin)
			vHTML += this.mCrudSearchForm(vLogin, pText)
			this.aDatabase.Words.SelectAllWords(pText).forEach
			(
				vWordFound=>
				{
					vHTML += this.mCrudWordsSearchResults(vLogin, vWordFound);
				}
			);
			this.aDatabase.Links.SelectAllNameID(pText).forEach
			(
				vLinkFound=>
				{
					vHTML += this.mCrudLinksSearchResults(vLogin, vLinkFound);
				}
			);
			vHTML += this.HTMLFooter;
			return vHTML;
		}
		else
		{
			return `<script type="text/javascript">
					window.location.replace("https://glossairegamecodeur.patrickpignol.repl.co/admin/");
			</script>`
		}
	}

	mCrudForm(pLogin, pText)
	{		
		let vHTML = `
			<H2>Administration</H2>
			<TABLE width="100%">
				<TR width="100%">
					<TD>
						<form action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/managewords" method="post"><input type="hidden" id="Login" name="Login" value=${JSON.stringify(pLogin)}>
							<input class="admin" type="submit" title="Administrer les mots clés" value="📝Mots clés"></input>
						</form>
					</TD>
					<TD>
						<form action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/managelinks" method="post"><input type="hidden" id="Login" name="Login" value=${JSON.stringify(pLogin)}>
							<input class="admin" type="submit" title="Gérer les documents" value="📝Documents"></input>
						</form>
					</TD>
					<TD>
						<form action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/managewordslinks" method="post"><input type="hidden" id="Login" name="Login" value=${JSON.stringify(pLogin)}>
							<input class="admin" type="submit" title="Gerer les liens Mots clés🔗Documents" value="📝Liens Mots clés🔗Documents"></input>
						</form>
					</TD>
					<TD width="100%">
					</TD>
				</TR>
			</TABLE>
			<HR>`
		return vHTML;
	}

	mCrudSearchForm(pLogin, pText)
	{
		if(!pText)
		{
			pText = "";
		}
		let vHTML = `
			<H2>Rechercher:</H2>
			<TABLE width="100%">				
				<TR width="100%">
					<FORM action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/" method="post">
						
					
					<TD>
							<input type="hidden" id="Login" name="Login" value=${JSON.stringify(pLogin)}>
							<input type="submit" title="Recommencer" value="🔁"></input>
					</TD>
					</FORM>
					<FORM action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/" method="post"><input type="hidden" id="Login" name="Login" value=${JSON.stringify(pLogin)}>
					<TD>						
							<input size="40" type="text" list="WordsList" id="Word" name="Word" value="${pText}" placeholder="Tapez votre recherche ici..." required>
					</TD>
					<TD>
							<input type="submit" title="Lancer la recherche" value="Rechercher"></input>
					</TD>	
					</FORM>
					<TD width="100%">
					</TD>
				</TR>
			</TABLE>
			<HR>
			<datalist id="WordsList">`;
			this.aDatabase.Words.SelectAllWords(pText).forEach
			(
				vWordFound =>
				{	
					vHTML += `<option value="${vWordFound.Word}">`;
				}
			)
			this.aDatabase.aLinks.SelectAllNameID(pText).forEach
			(
				vLinkFound=>
				{
					vHTML += `<option value="${vLinkFound.Name}">`;
				}
			)
		vHTML += `</datalist>`;
		return vHTML;
	}

	mCrudWordsSearchResults(pLogin, pWord)
	{
		const vWordLinks = this.aDatabase.LinksWords.SelectWords(pWord.rowid);
		if(vWordLinks && vWordLinks.length)
		{
			return `
			<form id="Word${pWord.rowid}" action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/word" method="post"><input id="Login" name="Login" type="hidden" value=${JSON.stringify(pLogin)}>
				<input id="Word" name="Word" type="hidden" value="${pWord.WordID}">
            	<a href="javascript:{}" onclick="document.getElementById('Word${pWord.rowid}').submit();">${pWord.Word}</a>
			</form>`
		}
		else
		{
			return `${pWord.Word}<BR/>`
		}
	}

	mCrudLinksSearchResults(pLogin, pLink)
	{
		return `<form id="Link${pLink.rowid}" action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/link" method="post"><input id="Login" name="Login" type="hidden" value=${JSON.stringify(pLogin)}>
			<input id="Link" name="Link" type="hidden" value="${pLink.NameID}">
            <a href="javascript:{}" onclick="document.getElementById('Link${pLink.rowid}').submit();">${pLink.Name}</a>
        </form>`
	}

	mCrudWord(pLogin, pWord)
	{
		const vLogin = this.mVerify(JSON.parse(pLogin));
		if(vLogin)
		{
			let vHTML = this.HTMLHeader;
			const vWord = this.Database.Words.SelectWord(pWord);
			vHTML += this.mCrudForm(vLogin);
			vHTML += this.mCrudSearchForm(vLogin, vWord.Word);
			vHTML += this.mCrudWordLinks(vLogin, vWord)
			vHTML += this.HTMLFooter;
			return vHTML;
		}
		else
		{
			return `<script type="text/javascript">
					window.location.replace("https://glossairegamecodeur.patrickpignol.repl.co/admin/");
			</script>`
		}
	}

	mCrudLink(pLogin, pLink)
	{
		const vLogin = this.mVerify(JSON.parse(pLogin));
		if(vLogin)
		{
			const vLink = this.Database.Links.SelectNameID(pLink);
			let vHTML = this.HTMLHeader;
			vHTML += `<H2>Rechercher</H2>`;
			vHTML += this.mCrudForm(vLogin);
			vHTML += this.mCrudSearchForm(vLogin, vLink.Name);
			vHTML += `<H2>${vLink.Name}</H2>`
			vHTML += `<a target="_blank" href="${vLink.URL}">${vLink.Name}</a> est présent pour les mots clé suivants :<BR/><ul>`;
			const vLinksWords = this.Database.LinksWords.SelectLinks(vLink.rowid);
			vLinksWords.forEach
			(
				vLinkWord=>
				{
					const vWord = this.Database.Words.SelectID(vLinkWord.WordsID);
					if(vWord)
					{
						vHTML  += `
							<li>
								<FORM id="Word${vWord.rowid}" action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/word" method="post"><input id="Login" name="Login" type="hidden" value=${JSON.stringify(vLogin)}>
									<input id="Word" name="Word" type="hidden" value="${vWord.Word}">
									<a href="javascript:{}" onclick="document.getElementById('Word${vWord.rowid}').submit();">${vWord.Word}</a>
								</FORM>
							</li>`;
					}
				}
			);
			vHTML += `</ul>`;
			vHTML += this.HTMLFooter;
			return vHTML;
		}
		else
		{
			return `<script type="text/javascript">
					window.location.replace("https://glossairegamecodeur.patrickpignol.repl.co/admin/");
			</script>`
		}
	}
	
	mCrudManageWords(pLogin, pRequest)
	{
		let vAddStatus = "";
		let vUpdateStatus = "";
		let vDeleteStatus = "";
		const vLogin = this.mVerify(JSON.parse(pLogin));		
		if(vLogin)
		{
			if(pRequest)
			{
				if(pRequest.Add && pRequest.Add.Word)
				{
					if(!this.Database.Words.SelectWord(pRequest.Add.Word))
					{
						const vInsertWord = Object.freeze(
							{
								WordID: pRequest.Add.Word,
								Word: pRequest.Add.Word
							}
						);
						this.Database.Words.Insert(vInsertWord);
						vAddStatus = `Le mot ${pRequest.Add.Word} à bien été ajouté.`;
					}
					else
					{
						vAddStatus = `Le mot ${pRequest.Add.Word} existe déjà.`;
					}
				}
				else if(pRequest.Update && pRequest.Update.ID && pRequest.Update.Word)
				{
					let vWord = this.Database.Words.SelectID(pRequest.Update.ID);					
					if(vWord)
					{
						vWord.WordID = pRequest.Update.Word.toLowerCase();
						vWord.Word = pRequest.Update.Word;
						try
						{
							this.Database.Words.Update(vWord);
							vUpdateStatus = `Le mot clé selectioné à bien été modifié en "${pRequest.Update.Word}".`
						}
						catch(e)
						{
							vUpdateStatus = e.message;
						}
					}
					else
					{
						vUpdateStatus = `Le mot clé selectioné n'existe pas/plus.`
					}
				}
				else if(pRequest.Delete && pRequest.Delete.ID)
				{
					let vWord = this.Database.Words.SelectID(pRequest.Delete.ID);
					if(vWord)
					{
						this.Database.LinksWords.SelectWords(vWord.rowid).forEach
						(
							vWordLinkFound=>
							{
								this.Database.LinksWords.Delete(vWordLinkFound.rowid);
							}
						); 
						this.Database.Words.Delete(pRequest.Delete.ID);
						vDeleteStatus = `Le mot clé selectioné et tous les liens associés ont bien été supprimés.`
					}
					else
					{
						vDeleteStatus = `Le mot clé selectioné n'existe pas/plus.`
					}
				}
			}
			let vHTML = this.HTMLHeader;
			vHTML += this.mCrudForm(vLogin);
			vHTML += `<H2>Gérer les mot clé</H2>`;
			vHTML += this.mCrudAddWordForm(vLogin, vAddStatus);
			vHTML += this.mCrudUpdateWordForm(vLogin, vUpdateStatus);
			vHTML += this.mCrudDeleteWordForm(vLogin, vDeleteStatus);
			vHTML += this.mDataLists();
			this.aDatabase.Words.SelectAll().forEach
			(
				vWordFound =>
				{
					if(vWordFound && vWordFound.rowid && vWordFound.WordID && vWordFound.Word)
					{
						vHTML += this.mCrudWordsSearchResults(vLogin, vWordFound);
					}
				}
			)
			vHTML += this.HTMLFooter;
			return vHTML;	
		}
		else
		{
			return `<script type="text/javascript">
					window.location.replace("https://glossairegamecodeur.patrickpignol.repl.co/admin/");
			</script>`
		}
	}

	mDataLists()
	{
		let vHTML = `<datalist id="WordsList">`
		this.Database.Words.SelectAll().forEach
		(
			vWordFound =>
			{	
				vHTML += `<option value="${vWordFound.Word}">`;
			}
		);
		vHTML += `</datalist>`;
		return vHTML;
	}

	mCrudAddWordForm(pLogin, pAddStatus)
	{
		let vHTML = `<H2>Ajouter</H2>`
		vHTML += pAddStatus;
		vHTML += `<FORM action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/managewords" method="post"><input id="Login" name="Login" type="hidden" value=${JSON.stringify(pLogin)}>
			Mot clé <input type="text" size="40" list="WordsList" id="AddWord" name="AddWord" placeholder="Tapez ici un nouveau mot clé...">
			<input type="submit" value="Ajouter">			
			</FORM><HR/>`;
		return vHTML;
	}

	mCrudUpdateWordForm(pLogin, pUpdateStatus)
	{
		let vHTML = `<H2>Modifier</H2>`
		vHTML += pUpdateStatus;
		vHTML += `<FORM action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/managewords" method="post"><input id="Login" name="Login" type="hidden" value=${JSON.stringify(pLogin)}>
		<TABLE>
			<TR>
				<TD>
					Mot clé à modifier </TD>
				<TD><select id="UpdateID" style="width: 26em;" name="UpdateID" required>`
		this.Database.Words.SelectAll().forEach
		(
			vWordFound =>
			{	
				vHTML += `<option value="${vWordFound.rowid}">${vWordFound.Word}</option>`
			}
		);	
		vHTML += `</select></TD>
				<TD></TD>
			</TR>
			<TR>
				<TD>Nouvelle valeur </TD>
				<TD><input type="text" size="40" list="WordsList" id="UpdateWord" name="UpdateWord" placeholder="Tapez ici la modification"></TD>
				<TD><input type="submit" value="Modifier"></TD>
			</TR>
		</TABLE>
			</FORM>
			<script type="text/javascript">
			let vSelect = document.getElementById('UpdateID');
			vSelect.addEventListener("change", function (event) 
			{
				mOnSelect(event);
			});
			window.addEventListener("load",function()
			{
    			mOnSelect(event);
			},false);
			function mOnSelect(event)
			{
				const vSelect = document.getElementById('UpdateID');
				const vUpdateWord = document.getElementById('UpdateWord');
				vUpdateWord.value = vSelect.options[vSelect.selectedIndex].label
			}
			</script>
			<HR/>`;
		return vHTML;
	}

	mCrudDeleteWordForm(pLogin, pDeleteStatus)
	{
		let vHTML = `<H2>Supprimer</H2><div id="error">`
		vHTML += pDeleteStatus;
		vHTML += `</div><FORM id="DeleteForm" action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/managewords" method="post"><input id="Login" name="Login" type="hidden" value=${JSON.stringify(pLogin)}>
			<select id="DeleteID" name="DeleteID" required>`
		this.Database.Words.SelectAll().forEach
		(
			vWordFound =>
			{	
				vHTML += `<option value="${vWordFound.rowid}">${vWordFound.Word}</option>`
			}
		);	
		vHTML += `</select><input id="SubmitDeleteForm" type="submit" value="Supprimer"></FORM><HR/>
		<script type="text/javascript">		
		let form = document.getElementById('DeleteForm');
		form.addEventListener("submit", function (event) 
		{
			const form = document.getElementById('DeleteForm');
			const button = document.getElementById('SubmitDeleteForm');
			const error = document.getElementById('error');
			if (! window.confirm("Cette action n'est pas annulable. Êtes vous sûr de vouloir supprimer ce mot clé et tous les liens s'y raportant ? ")) 
			{
				error.innerHTML = "Opération annulé par l'utilisateur";
				error.className = "error active";    
				event.preventDefault();
			}
		}, false);
		</script>`;
		return vHTML;
	}

	mCrudManageLinks(pLogin, pRequest)
	{
		let vAddStatus = "";
		let vUpdateStatus = "";
		let vDeleteStatus = "";
		const vLogin = this.mVerify(JSON.parse(pLogin));
		if(vLogin)
		{
			if(pRequest)
			{

			}
			let vHTML = this.HTMLHeader;
			vHTML += this.mCrudForm(vLogin);
			vHTML += `<H2>Gérer les documents</H2>`;
			vHTML += this.mCrudAddLinkForm(vLogin, vAddStatus);
			vHTML += this.mCrudUpdateLinkForm(vLogin, vUpdateStatus);
			vHTML += this.mCrudDeleteLinkForm(vLogin, vDeleteStatus);
			vHTML += this.mDataLists();
			this.aDatabase.Links.SelectAll().forEach
			(
				vLinkFound =>
				{
					if(vLinkFound && vLinkFound.rowid && !(vLinkFound.Name))
					{
						this.Database.Links.Delete(vLinkFound.rowid);
					}
					else if(vLinkFound && vLinkFound.rowid && vLinkFound.NameID && vLinkFound.Name && vLinkFound.URL)
					{
						vHTML += this.mCrudLinksSearchResults(vLogin, vLinkFound);
					}
				}
			)
			vHTML += this.HTMLFooter;
			return vHTML;	
		}
		else
		{
			return `<script type="text/javascript">
					window.location.replace("https://glossairegamecodeur.patrickpignol.repl.co/admin/");
			</script>`
		}		
	}

	mCrudAddLinkForm(pLogin, pAddStatus)
	{
		let vHTML = `<H2>Ajouter</H2>`
		vHTML += pAddStatus;
		vHTML += `<FORM action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/managewords" method="post"><input id="Login" name="Login" type="hidden" value=${JSON.stringify(pLogin)}>
			<LABEL>Nom du document 
			<input type="text" size="40" list="WordsList" id="AddName" name="AddWord" placeholder="Tapez ici un nouveau mot clé..."><BR/></LABEL>
			<LABEL>URL du document
			<input type="text" size="40" list="WordsList" id="AddName" name="AddWord" placeholder="Tapez ici un nouveau mot clé..."></LABEL>
			<input type="submit" value="Ajouter">			
			</FORM><HR/>`;
		return vHTML;
	}

	mCrudUpdateLinkForm(pLogin, pUpdateStatus)
	{
		let vHTML = `<H2>Modifier</H2>`
		vHTML += pUpdateStatus;
		vHTML += `<FORM action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/managelinkss" method="post"><input id="Login" name="Login" type="hidden" value=${JSON.stringify(pLogin)}>
		<TABLE>
			<TR>
				<TD>Document à modifier </TD>
				<TD><select id="UpdateID" style="width: 344px;" name="UpdateID" required>`
		this.Database.Links.SelectAll().forEach
		(
			vLinkFound =>
			{	
				vHTML += `<option value="${vLinkFound.rowid}">${vLinkFound.Name}</option>`
			}
		);	
		vHTML += `</select></TD>
				<TD>
				</TD>
			</TR>
			<TR>
				<TD>Nom du document </TD><TD><input type="text" size="40" list="LinksList" id="UpdateName" name="UpdateName" placeholder="Tapez ici la modification"></TD>
				<TD></TD>
			</TR>
			<TR>
				<TD>URL du document</TD>
				<TD><input type="text" size="40" list="URLList" id="UpdateName" name="UpdateName" placeholder="Tapez ici la modification"></TD>
				<TD><input type="submit" value="Modifier"></TD>
			</TR>
		</TABLE>
			</FORM><HR/>`;
		return vHTML;
	}

	mCrudDeleteLinkForm(pLogin, pDeleteStatus)
	{
		let vHTML = `<H2>Supprimer</H2><div id="error">`
		vHTML += pDeleteStatus;
		vHTML += `</div><FORM id="DeleteForm" action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/managelinks" method="post"><input id="Login" name="Login" type="hidden" value=${JSON.stringify(pLogin)}>
			<select id="DeleteID" name="DeleteID" required>`
		this.Database.Links.SelectAll().forEach
		(
			vLinkFound =>
			{	
				vHTML += `<option value="${vLinkFound.rowid}">${vLinkFound.Name}</option>`
			}
		);	
		vHTML += `</select><input id="SubmitDeleteForm" type="submit" value="Supprimer"></FORM><HR/>
		<script type="text/javascript">
		let form = document.getElementById('DeleteForm');
		form.addEventListener("submit", function (event) 
		{
			const form = document.getElementById('DeleteForm');
			const button = document.getElementById('SubmitDeleteForm');
			const error = document.getElementById('error');
			if (! window.confirm("Cette action n'est pas annulable. Êtes vous sûr de vouloir supprimer ce document et tous les liens s'y raportant ? ")) 
			{
				error.innerHTML = "Opération annulé par l'utilisateur";
				error.className = "error active";    
				event.preventDefault();
			}
		}, false);
		</script>`;
		return vHTML;
	}

	mCrudWordsLinks()
	{
		let vHTML = this.HTMLHeader;
		vHTML += `<H2>Lier un document à un mot clé</H2>`;
		vHTML += this.mCrudForm();
		this.aDatabase.LinksWords.SelectAll().forEach
		(
			vLinkWordFound =>
			{
				vHTML += this.mAddWordsLinksResearch(vLinkWordFound)
			}
		)
		vHTML += this.HTMLFooter;
		return vHTML;		
	}

	mCrudWordsLinksResearch(pLinkWordFound)
	{
		let vHTML = "";
		const vWord = this.aDatabase.Words.SelectID(pLinkWordFound.WordsID);
		const vLink = this.aDatabase.Links.SelectID(pLinkWordFound.LinksID);
		if(vWord && vLink)
		{
			vHTML += `
			<TR>
				<TD>
					<form id="Word${vWord.rowid}" action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/word" method="post">
						<input id="Login" name="Login" type="hidden" value=${JSON.stringify(pLogin)}>
						<input id="Word" name="Word" type="hidden" value="${vWord.WordID}">
						<a href="javascript:{}" onclick="document.getElementById('Word${vWord.rowid}').submit();">
							${vWord.Word}
						</a>
					</form>
				</TD>
				<TD>🔗</TD>
				<TD>
					<form id="Link${vLink.rowid}" action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/link" method="post">
						<input id="Login" name="Login" type="hidden" value=${JSON.stringify(pLogin)}>
						<input id="Link" name="Link" type="hidden" value="${vLink.NameID}">
						<a href="javascript:{}" onclick="document.getElementById('Link${vLink.rowid}').submit();">
							${vLink.Name}
						</a>
					</form>
				</TD>
			</TR>`;
		}
		return vHTML;
	}

	mManageWordsLinks(pWord, pLink)
	{
		let vHTML = this.HTMLHeader;
		vHTML += `<H2>Lier un document à un mot clé</H2>`;
		vHTML += this.mManageWordsLinksForm();
		vHTML += `<TABLE>`
		if(!this.aDatabase.LinksWords.SelectID(pWord, pLink))
		{
			this.aDatabase.LinksWords.Insert
			(
				{
					WordsID: pWord,
					LinksID: pLink,
					Document: ""
				}
			);
			vHTML += "Le lien à été ajouté"
		}
		else
		{
			vHTML += "Le lien existe déjà"
		}
		this.aDatabase.LinksWords.SelectAll().forEach
		(
			vLinkWordFound =>
			{
				vHTML += this.mAddWordsLinksResearch(vLinkWordFound)
			}
		)
		vHTML += `<TABLE>`
		vHTML += this.HTMLFooter;
		return vHTML;		
	}

	mManageWordsLinksForm()
	{
		let vLinksNames = "";
		let vLinksURL = "";
		let vList = "";
		this.aDatabase.Links.SelectAll().forEach
		(
			vLinkFound =>
			{
				vLinksNames +=`<option value="${vLinkFound.Name}">`;
				vLinksURL += `<option value="${vLinkFound.URL}">`;
			}
		);
		let vHTML = `
			<TABLE width="100%">
				<TR width="100%">
					<TD>
						<form action="https://glossairegamecodeur.patrickpignol.repl.co" method="get">
							<input type="submit" value="🏠"></input>
						</form>
					</TD>
					<TD>
						<form action="https://glossairegamecodeur.patrickpignol.repl.co/addwordslinks" method="get">
							<input type="submit" value="🔁"></input>
						</form>
					</TD>
					<TD>
						Lier un mot clé à un document<BR/>
						<form action="https://glossairegamecodeur.patrickpignol.repl.co/addwordslinks" method="post">
							<label>Mot clé : <BR/>
							<select name="Word" id="Word">`;
							this.aDatabase.Words.SelectAll().forEach
								(
									vWordFound =>
									{
										vHTML += `<option value="${vWordFound.rowid}">${vWordFound.Word}</option>`
									}
								)
							vHTML += `</select></label></BR>
							<label>Nom du document : <BR/><select name="Link" id="Link">`;
							this.aDatabase.Links.SelectAll().forEach
								(
									vLinkFound =>
									{
										vHTML += `<option value="${vLinkFound.rowid}">${vLinkFound.Name}</option>`
									}
								)
							vHTML += `</select></label></BR>
							
							<input type="submit" value="Ajouter"></input>
						</form>
					</TD>
					<TD width="100%">
					</TD>
				</TR>
			</TABLE>
			<datalist id="LinksNameList">`;
		vHTML += vLinksNames;
		vHTML += `</datalist><datalist id="LinksURLList">`;
		vHTML += vLinksURL;
		vHTML += `</datalist>`;
		return vHTML
	}

	mAddWordsForm(pText)
	{
		if(!pText)
		{
			pText = "";
		}
		let vHTML = `
			<TABLE width="100%">
				<TR width="100%">
					<TD>
						<form action="https://glossairegamecodeur.patrickpignol.repl.co" method="get">
							<input type="submit" value="🏠"></input>
						</form>
					</TD>
					<TD>
						<form action="https://glossairegamecodeur.patrickpignol.repl.co/addwords" method="get">
							<input type="submit" value="🔁"></input>
						</form>
					</TD>
					<TD>
						<form action="https://glossairegamecodeur.patrickpignol.repl.co/addwords" method="post">
							<label>Ajouter un nouveau mot clé<BR/><input size="40" type="text" list="WordsList" name="Word" id="Word" value="${pText}" required></label><BR/>
							<input type="submit" value="Ajouter"></input>
						</form>
					</TD>
					<TD width="100%">
					<TD>
				</TR>
			</TABLE>
			<datalist id="WordsList">`;
		vHTML += `</datalist>`;		
		return vHTML;
	}

	mAddWords(pWord)
	{
		let vHTML = this.HTMLHeader;
		vHTML += `<H2>Ajouter un nouveau mot clé</H2>`;
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
		vHTML += this.mAddWordsForm(pWord);		
		this.aDatabase.Words.SelectAllWords(pWord).forEach
		(
			vWordFound=>
			{
				vHTML += this.mWordsSearchResults(vWordFound);
			}
		);
		vHTML += this.HTMLFooter;
		return vHTML;
	}

	get AddLinks()
	{
		let vHTML = this.HTMLHeader;
		vHTML += this.mAddLinksForm();
		this.aDatabase.Links.SelectAll().forEach
		(
			vLinkFound=>
			{
				vHTML += this.mLinksSearchResults(vLinkFound);
			}
		);
		vHTML += this.HTMLFooter;
		return vHTML;		
	}

	mAddLinksForm()
	{
		let vLinksNames = "";
		let vLinksURL = "";
		let vList = "";
		this.aDatabase.Links.SelectAll().forEach
		(
			vLinkFound =>
			{
				vLinksNames +=`<option value="${vLinkFound.Name}">`;
				vLinksURL += `<option value="${vLinkFound.URL}">`;
			}
		);
		let vHTML = `
			<TABLE width="100%">
				<TR width="100%">
					<TD>
						<form action="https://glossairegamecodeur.patrickpignol.repl.co" method="get">
							<input type="submit" value="🏠"></input>
						</form>
					</TD>
					<TD>
						<form action="https://glossairegamecodeur.patrickpignol.repl.co/addlinks" method="get">
							<input type="submit" value="🔁"></input>
						</form>
					</TD>
					<TD>
						Ajouter un nouveau document<BR/>
						<form action="https://glossairegamecodeur.patrickpignol.repl.co/addlinks" method="post">
							<label>Nom du document : <BR/><input type="text" size="40" list="LinksNameList" name="Name" id="Name" required></label></BR>
							<label>URL du document : <BR/><input type="text" size="40" list="LinksURLList" name="URL" id="URL" required></label></BR>
							<input type="submit" value="Ajouter"></input>
						</form>
					</TD>
					<TD width="100%">
					</TD>
				</TR>
			</TABLE>
			<datalist id="LinksNameList">`;
		vHTML += vLinksNames;
		vHTML += `</datalist><datalist id="LinksURLList">`;
		vHTML += vLinksURL;
		vHTML += `</datalist>`;
		return vHTML;
	}
	
	mAddLinks(pName, pURL)
	{
		let vHTML = this.HTMLHeader;
		vHTML += "<H2>Ajouter un nouveau document</H2>";
		const vNameID = pName.toLowerCase();
		if(!this.aDatabase.Links.SelectURL(pURL))
		{
			this.aDatabase.Links.Insert
			(
				{
					NameID: vNameID,
					Name: pName,
					URL: pURL
				}
			);
			vHTML += "Le document à été ajouté";
		}
		else
		{
			vHTML += "Le document existe déjà"
		}
		vHTML += this.mAddLinksForm();
		this.aDatabase.Links.SelectAllNameID(vNameID).forEach
		(
			vLinkFound=>
			{
				vHTML += this.mLinksSearchResults(vLinkFound);
			}
		);
		vHTML += this.HTMLFooter;
		return vHTML;
	}

	mCrudWordLinks(pLogin, pWord)
	{
		let vHTML = `
			<H2>${pWord.Word}</H2>
			${pWord.Word} est présent dans les documents suivants :<BR/><UL>`;
		const vLinksWords = this.Database.LinksWords.SelectWords(pWord.rowid);
		vLinksWords.forEach
		(
			vLinkWordFound=>
			{
				const vLink = this.Database.Links.SelectID(vLinkWordFound.LinksID);
				if(vLink)
				{
					vHTML += `<li>
							<a target="_blank" href="${vLink.URL}">${vLink.Name}</a>
						</li>`;
				}
			}
		);
		vHTML += "</UL>"
		return vHTML;
	}
}

module.exports = Crud;