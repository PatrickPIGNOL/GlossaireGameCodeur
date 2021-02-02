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
						<FORM action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/" method="post">
							<input type="hidden" id="Login" name="Login" value=${JSON.stringify(pLogin)}>
							<input type="submit" title="Recommencer" value="🏠"></input>
						</FORM>
					</TD>
					<TD>
						<form action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/managewords" method="post"><input type="hidden" id="Login" name="Login" value=${JSON.stringify(pLogin)}>
							<input class="admin" type="submit" title="Administrer les mots clés" value="📝Mots clés"></input>
						</form>
					</TD>
					<TD>
						<form action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/managelinks" method="post">
							<input type="hidden" id="Login" name="Login" value=${JSON.stringify(pLogin)}>
							<input class="admin" type="submit" title="Gérer les documents" value="📝Documents"></input>
						</form>
					</TD>
					<TD>
						<form action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/managewordslinks" method="post">
							<input type="hidden" id="Login" name="Login" value=${JSON.stringify(pLogin)}>
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
			<form id="Word${pWord.rowid}" action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/word" method="post">
				<input id="Login" name="Login" type="hidden" value=${JSON.stringify(pLogin)}>
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
			const vWord = this.Database.Words.SelectWord(pWord.toLowerCase());
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

	mCrudWordLinks(pLogin, pWord)
	{
		let vHTML = `
			<H2>${pWord.Word}</H2>
			${pWord.Word} est présent dans les documents suivants :<BR/><UL>`;
		const vLinksWords = this.Database.LinksWords.SelectWords(pWord.rowid);
		let vLinks = new Array();
		vLinksWords.forEach
		(
			vLinkWordFound=>
			{
				const vLink = this.Database.Links.SelectID(vLinkWordFound.LinksID);
				if(vLink)
				{
					vLinks.push(vLink);					
				}
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
				vHTML += `<li>
							<a target="_blank" href="${vLinkFound.URL}">${vLinkFound.Name}</a>
						</li>`;
			}
		);
		vHTML += "</UL>"
		return vHTML;
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
			let vWords = new Array();
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
								<FORM id="Word${vWordFound.rowid}" action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/word" method="post"><input id="Login" name="Login" type="hidden" value=${JSON.stringify(vLogin)}>
									<input id="Word" name="Word" type="hidden" value="${vWordFound.Word}">
									<a href="javascript:{}" onclick="document.getElementById('Word${vWordFound.rowid}').submit();">${vWordFound.Word}</a>
								</FORM>
							</li>`;
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
								WordID: pRequest.Add.Word.toLowerCase(),
								Word: pRequest.Add.Word
							}
						);
						try
						{
								this.Database.Words.Insert(vInsertWord);
								vAddStatus = `Le mot ${pRequest.Add.Word} à bien été ajouté.`;
						}
						catch(e)
						{
							vAddStatus = e.message
						}
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
			if(this.Database.Words.SelectCount().Count > 0)
			{
				vHTML += this.mCrudUpdateWordForm(vLogin, vUpdateStatus);
				vHTML += this.mCrudDeleteWordForm(vLogin, vDeleteStatus);
			}
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
			Mot clé <input type="text" size="40" list="WordsList" id="AddWord" name="AddWord" placeholder="Tapez ici un nouveau mot clé..." required>
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
				<TD><select id="UpdateID" style="width: 344px;" name="UpdateID" required>`
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
				<TD><input type="text" size="40" list="WordsList" id="UpdateWord" name="UpdateWord" placeholder="Tapez ici la modification" required></TD>
				<TD><input type="submit" value="Modifier"></TD>
			</TR>
		</TABLE>
			</FORM>
			<script type="text/javascript">
			let vSelect = document.getElementById('UpdateID');
			vSelect.onchange=mOnSelect;
			window.onload=mOnSelect;
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
				if(pRequest.Add && pRequest.Add.Name && pRequest.Add.URL)
				{
					let vLink = this.Database.Links.SelectURL(pRequest.Add.URL);
					if(!vLink)
					{
						const vInsertWord = Object.freeze(
							{
								NameID: pRequest.Add.Name.toLowerCase(),
								Name: pRequest.Add.Name,
								URL: pRequest.Add.URL
							}
						);
						try
						{
							this.Database.Links.Insert(vInsertWord);
							vAddStatus = `Le document "${pRequest.Add.Name}" à bien été ajouté.`;
						}
						catch(e)
						{
							vAddStatus = e.message;
						}
					}
					else
					{
						vAddStatus = `Le document "${vLink.Name}" existe déjà.`;
					}
				}
				else if(pRequest.Update && pRequest.Update.ID && pRequest.Update.Name && pRequest.Update.URL)
				{
					let vLink = this.Database.Links.SelectID(pRequest.Update.ID);
					if(vLink)
					{
						vLink.NameID = pRequest.Update.Name.toLowerCase();
						vLink.Name = pRequest.Update.Name;
						vLink.URL = pRequest.Update.URL;
						try
						{
							this.Database.Links.Update(vLink);
							vUpdateStatus = "Le document à bien été modifié.";
						}
						catch(e)
						{
							vUpdateStatus = e.message;
						}
					}
					else
					{
						vUpdateStatus = "Le document n'existe pas/plus."
					}
				}
				else if(pRequest.Delete && pRequest.Delete.ID)
				{
					if(this.Database.Links.SelectID(pRequest.Delete.ID))
					{
						this.Database.Links.Delete(pRequest.Delete.ID);
						vUpdateStatus = "Le document à bien été supprimé."
					}
					else
					{
						vDeleteStatus = "Le document n'existe pas/plus."
					}
				}
			}
			let vHTML = this.HTMLHeader;
			vHTML += this.mCrudForm(vLogin);
			vHTML += `<H2>Gérer les documents</H2>`;
			vHTML += this.mCrudAddLinkForm(vLogin, vAddStatus);
			if(this.Database.Links.SelectCount().Count > 0)
			{
				vHTML += this.mCrudUpdateLinkForm(vLogin, vUpdateStatus);
				vHTML += this.mCrudDeleteLinkForm(vLogin, vDeleteStatus);
			}
			vHTML += this.mDataLists();
			this.aDatabase.Links.SelectAll().forEach
			(
				vLinkFound =>
				{
					if(vLinkFound && vLinkFound.rowid && vLinkFound.NameID && vLinkFound.Name && vLinkFound.URL)
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
		vHTML += `<FORM action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/managelinks" method="post"><input id="Login" name="Login" type="hidden" value=${JSON.stringify(pLogin)}>
			<LABEL>Nom du document 
			<input type="text" size="40" list="LinkList" id="AddName" name="AddName" placeholder="Tapez ici le nom du document..." required><BR/></LABEL>
			<LABEL>URL du document
			<input type="text" size="40" list="URLList" id="AddURL" name="AddURL" placeholder="Tapez ici l'URL du documment..." required></LABEL>
			<input type="submit" value="Ajouter">
			</FORM><HR/>`;
		return vHTML;
	}

	mCrudUpdateLinkForm(pLogin, pUpdateStatus)
	{
		let vHTML = `<H2>Modifier</H2>`
		vHTML += pUpdateStatus;
		vHTML += `<FORM action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/managelinks" method="post"><input id="Login" name="Login" type="hidden" value=${JSON.stringify(pLogin)}>
		<TABLE>
			<TR>
				<TD>Document à modifier </TD>
				<TD><select id="UpdateID" style="width: 344px;" name="UpdateID" required>`
		this.Database.Links.SelectAll().forEach
		(
			vLinkFound =>
			{	
				vHTML += `<option label="${vLinkFound.URL}" value="${vLinkFound.rowid}">${vLinkFound.Name}</option>`
			}
		);	
		vHTML += `</select></TD>
				<TD>
				</TD>
			</TR>
			<TR>
				<TD>Nom du document </TD><TD><input type="text" size="40" list="LinksList" id="UpdateName" name="UpdateName" placeholder="Tapez ici la modification" required></TD>
				<TD></TD>
			</TR>
			<TR>
				<TD>URL du document</TD>
				<TD><input type="text" size="40" list="URLList" id="UpdateURL" name="UpdateURL" placeholder="Tapez ici la modification" required></TD>
				<TD><input type="submit" value="Modifier"></TD>
			</TR>
		</TABLE>
			</FORM>
			<script type="text/javascript">
				let Select = document.getElementById('UpdateID');
				window.onload = mUpdateChange;
				Select.onchange = mUpdateChange;
				function mUpdateChange(event)
				{
					const vSelect = document.getElementById('UpdateID');
					const vName = document.getElementById('UpdateName');
					const vURL = document.getElementById('UpdateURL');
					vName.value = vSelect.options[vSelect.selectedIndex].text;
					vURL.value = vSelect.options[vSelect.selectedIndex].label;
				}
		</script>
			<HR/>`;
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
		const form = document.getElementById('DeleteForm');
		form.addEventListener("submit", function (event) 
		{
			const form = document.getElementById('DeleteForm');
			const button = document.getElementById('SubmitDeleteForm');
			const error = document.getElementById('error');
			if (! window.confirm("Cette action n'est pas annulable. Êtes vous sûr de vouloir supprimer ce document et tous les liens s'y raportant ? ")) 
			{
				error.innerHTML = "Opération annulé par l'utilisateur";   
				event.preventDefault();
			}
		}, false);
		</script>`;
		return vHTML;
	}
	
	mManageWordsLinks(pLogin, pRequest)
	{
		let vAddStatus = "";
		let vDeleteStatus = "";
		const vLogin = this.mVerify(JSON.parse(pLogin));
		if(vLogin)
		{
			if(pRequest)
			{
				if(pRequest.Add && pRequest.Add.WordID && pRequest.Add.LinkID)
				{
					const vWord = this.Database.Words.SelectID(pRequest.Add.WordID)
					if(!vWord)
					{
						vAddStatus += "Le mot clé n'existe pas.\n"
					}
					const vLink = this.Database.Links.SelectID(pRequest.Add.LinkID)
					if(!vLink)
					{
						vAddStatus += "Le document n'existe pas."
					}
					if(vWord && vLink)
					{
						if(!this.Database.LinksWords.SelectID(vWord.rowid, vLink.rowid))
						{
							const vRow = Object.freeze
							(
								{ 
									WordsID: vWord.rowid, 
									LinksID: vLink.rowid
								}
							);
							this.Database.LinksWords.Insert(vRow);
							vAddStatus += `Le lien entre le mot clé "${vWord.Word}" et le document "${vLink.Name}" à bien été ajouté.`
						}
						else
						{
							vAddStatus += `Le lien entre le mot clé "${vWord.Word}" et le document "${vLink.Name}" existe déjà.`
						}
					}
				}
				else if(pRequest.Delete && pRequest.Delete.ID)
				{
					if(this.Database.LinksWords.SelectRowID(pRequest.Delete.ID))
					{
						this.Database.LinksWords.Delete(pRequest.Delete.ID)
						vDeleteStatus = "Le lien à bien été supprimé."
					}
					else
					{
						vDeleteStatus = "Le lien n'existe pas/plus."
					}
				}
			}
			let vHTML = this.HTMLHeader;
			vHTML += this.mCrudForm(vLogin);
			vHTML += `<H2>Gérer les liens mots clés🔗documents</H2>`;
			if((this.Database.Words.SelectCount().Count > 0) && (this.Database.Links.SelectCount().Count > 0))
			{
				vHTML += this.mCrudAddLinkWordForm(vLogin, vAddStatus);
				if(this.Database.LinksWords.SelectCount().Count > 0)
				{
					vHTML += this.mCrudDeleteLinkWordForm(vLogin, vDeleteStatus);
				}
			}
			else
			{
				vHTML += `Aucune association possible... Veuillez créer des mots clés et des documents...`
			}
			vHTML += this.mDataLists();
			vHTML += `<TABLE>`;
			vHTML += this.mCrudLinksWord(vLogin);
			vHTML += `</TABLE>`;
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

	mCrudAddLinkWordForm(pLogin, pAddStatus)
	{
		let vHTML = `<H2>Ajouter</H2>${pAddStatus}<BR/>
			<FORM id="AddForm" action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/managewordslinks" method="post">
				<input id="Login" name="Login" type="hidden" value=${JSON.stringify(pLogin)}>
				<select id="AddWordID" name="AddWordID" required>`
				this.Database.Words.SelectAll().forEach
				(
					vWordFound =>
					{	
						vHTML += `<option value="${vWordFound.rowid}">${vWordFound.Word}</option>`
					}
				);	
				vHTML += `</select>🔗<select id="AddLinkID" name="AddLinkID" required>`
				this.Database.Links.SelectAll().forEach
				(
					vLinkFound =>
					{	
						vHTML += `<option value="${vLinkFound.rowid}">${vLinkFound.Name}</option>`
					}
				);	
				vHTML += `</select>
				<input id="SubmitAddForm" type="submit" value="Ajouter">
			</FORM> 
			<HR/>`;
		return vHTML;
	}

	mCrudDeleteLinkWordForm(pLogin, pDeleteStatus)
	{
		let vHTML = `<H2>Supprimer</H2>${pDeleteStatus}<BR/>
			<FORM id="DeleteForm" action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/managewordslinks" method="post">
				<input id="Login" name="Login" type="hidden" value=${JSON.stringify(pLogin)}>
				<select id="DeleteID" name="DeleteID" required>`
				this.Database.LinksWords.SelectAll().forEach
				(
					vLinkWordFound =>
					{	
						const vWord = this.Database.Words.SelectID(vLinkWordFound.WordsID);
						const vLink = this.Database.Links.SelectID(vLinkWordFound.LinksID);
						vHTML += `<option value="${vLinkWordFound.rowid}">${vWord.Word}🔗${vLink.Name}</option>`
					}
				);	
				vHTML += `</select>
				<input id="SubmitDeleteForm" type="submit" value="Supprimer">
			</FORM>
			<HR/>`;
		return vHTML;
	}

	mCrudLinksWord(pLogin)
	{
		let vHTML = "";
		let vRows = new Array();
		this.aDatabase.LinksWords.SelectAll().forEach
		(
			vLinkWordFound=>
			{
				const vWord = this.Database.Words.SelectID(vLinkWordFound.WordsID);
				const vLink = this.Database.Links.SelectID(vLinkWordFound.LinksID);
				if(vWord && vLink)
				{
					vRows.push
					(
						{
							Word: vWord,
							Link: vLink
						}
					);
				}
			}
		)
		vRows.sort
		(
			(a, b)=> 
			{
				if (a.Word.Word < b.Word.Word)
				{
					return -1;
				}
				else if (a.Word.Word > b.Word.Word)
				{
					return 1;
				}
				else
				{
					if(a.Link.Name < b.Link.Name)
					{
						return -1;
					}
					else if(a.Link.Name > b.Link.Name)
					{
						return 1;
					}
					else
					{
						return 0;
					}
				}
			}
		);
		vRows.forEach
		(
			vRowFound=>
			{
				vHTML += `
					<TR>
						<TD>${this.mCrudWordsSearchResults(pLogin, vRowFound.Word)}</TD>
						<TD>🔗</TD>
						<TD>${this.mCrudLinksSearchResults(pLogin, vRowFound.Link)}</TD>
					</TR>`;
			}
		);
		return vHTML;
	}
	mBase()
	{
		
		let vHTML = "Words:<BR/><HR/>";
		const vWords = this.Database.Words.SelectAll();
		vWords.forEach
		(
			vWordFound=>
			{
				vHTML += `RowID: ${vWordFound.rowid}<BR/>
				WordID: ${vWordFound.WordID}<BR/>
				Word: ${vWordFound.Word}<HR>`
			}
		)
		vHTML += "<HR>Links:<BR/><HR/>";
		const vLinks = this.Database.Links.SelectAll();
		vLinks.forEach
		(
			vLinkFound=>
			{
				vHTML += `RowID: ${vLinkFound.rowid}<BR/>
				NameID: ${vLinkFound.NameID}<BR/>
				Name: ${vLinkFound.Name}<BR/>
				URL: ${vLinkFound.URL}<HR>`
			}
		)
		return vHTML;
	}
}

module.exports = Crud;