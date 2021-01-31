const Research = require("./Research.js");
const crypto = require('crypto');

class Admin extends Research
{
	constructor(pTitle)
	{
		super(pTitle)
	}

	get Admin()
	{
		let vHTML = this.HTMLHeader;
		vHTML += `<H2>Connexion</H2>`;
		vHTML += `
				<FORM action="https://glossairegamecodeur.patrickpignol.repl.co/admin/" method="post">
				<TABLE>
					<TR>
						<TD>EMail</TD>
						<TD><INPUT type="email" size="40" name="EMail" id="EMail"pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required></TD>
					</TR>
					<TR>
						<TD>Password</TD>
						<TD><input type="password" size="40" id="Password" name="Password" required></TD>
					</TR>
					<TR>
						<TD colspan="2"><input type="submit" id="submit"></FORM></TD>
					</TR>`
		if
		(
			this.Database.Passwords.SelectCount()[0].Count
			<
			this.Config.MaxAdmins
		)
		{
			vHTML += `<TR>
						<TD>
							<a href="https://glossairegamecodeur.patrickpignol.repl.co/admin/signin">
								S'inscrire
							</a>
						</TD>
					</TR>`
		}
		vHTML += `</TABLE></FORM>`
		return vHTML;
	}

	mAdmin(pLogin)
	{
		let vHTML = this.HTMLHeader;
		const vLogin = this.mVerify(pLogin)
		if(vLogin)
		{
			vHTML += `<FORM id="autoredirect" action="https://glossairegamecodeur.patrickpignol.repl.co/admin/crud/" method="post">
			<input type="hidden" id="Login" name="Login" value=${JSON.stringify(vLogin)}></FORM>
			<script type="text/javascript">
				document.getElementById("autoredirect").submit();
			</script>"
			`
		}
		else
		{
			vHTML += `<H2>Connexion</H2>`;
			vHTML += `EMail ou Mot de passe incorrect.`
			vHTML += `
					<FORM action="https://glossairegamecodeur.patrickpignol.repl.co/admin/" method="post">
					<TABLE>
						<TR>
							<TD>EMail</TD>
							<TD><INPUT type="email" size="40" name="EMail" id="EMail"pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required></TD>
						</TR>
						<TR>
							<TD>Password</TD>
							<TD><input type="password" size="40" id="Password" name="Password" required></TD>
						</TR>
						<TR>
							<TD colspan="2"><input type="submit" id="submit"></FORM></TD>
						</TR>`
			if
			(
				this.Database.Passwords.SelectCount()[0].Count
				<
				this.Config.MaxAdmins
			)
			{
				vHTML += `<TR>
							<TD>
								<a href="https://glossairegamecodeur.patrickpignol.repl.co/admin/signin">
									S'inscrire
								</a>
							</TD>
						</TR>`
			}
			vHTML += `</TABLE></FORM>`
		}
		vHTML += this.HTMLFooter;
		return vHTML;
	}

	mVerify(pLogin)
	{
		if(pLogin)
		{
			if(pLogin.EMail)
			{
				const vLogin = this.Database.Passwords.SelectEMail(pLogin.EMail);
				if(vLogin)
				{
					if(pLogin.Password)
					{
						const vHash = crypto.createHash('sha256');
						vHash.update(pLogin.Password);
						const vPasswordHash = vHash.digest('hex');
						const vHash2 = crypto.createHash('sha256');
						vHash2.update(pLogin.EMail);
						const vMailHash = vHash2.digest('hex');
						if(vPasswordHash === vLogin.Hash)
						{
							const vResultLogin = Object.freeze
							(
								{
									MailHash: vMailHash,
									Hash: vPasswordHash
								}
							);
							return vResultLogin;
						}
					}
				}
			}
			else if(pLogin.MailHash)
			{
				let vResultLogin;
				this.Database.Passwords.SelectAll().forEach
				(
					vPasswordFound=>
					{
						const vHash = crypto.createHash('sha256');
						vHash.update(vPasswordFound.EMail);
						const vMailHash = vHash.digest('hex');
						if(vMailHash === pLogin.MailHash)
						{
							if(pLogin.Hash)
							{
								if(pLogin.Hash === vPasswordFound.Hash)
								{
									vResultLogin = Object.freeze
									(
										{
											MailHash: vMailHash,
											Hash: vPasswordFound.Hash
										}
									);
									return vResultLogin;
								}
							}							
						}
					}
				)
				return vResultLogin;
			}
		}	
	}

	get Signin()
	{
		let vHTML = this.HTMLHeader;
		if
		(
			this.Database.Passwords.SelectCount()[0].Count 
			<
			this.Config.MaxAdmins
		)
		{
			vHTML += `<H2>Inscription</H2>`;
			vHTML += this.mAdminSigninForm();
		}
		else
		{
			vHTML += "Nice Try !"
		}
		vHTML += this.HTMLFooter;
		return vHTML;
	}

	mSigninForm(pEmail, pPassword, pConfirmPassword)
	{
		if(!pEmail)
		{
			pEmail = "";
		}
		if(!pPassword)
		{
			pPassword = "";
		}
		if(!pConfirmPassword)
		{
			pConfirmPassword = "";
		}
		const vHTML = `
			<FORM action="https://glossairegamecodeur.patrickpignol.repl.co/admin/signin" method="post">
			<TABLE>
				<TR>
					<TD>
							EMail
					</TD>
					<TD>
							<INPUT
							type="email" 
							size="40" 
							name="EMail"
							pattern='^(([^<>()[].,;:s@"]+(.[^<>()[].,;:s@"]+)*)|(".+"))@(([^<>()[].,;:s@"]+.)+[^<>()[].,;:s@"]{2,})$'
							id="EMail" 
							placeholder="Entrez votre E-Mail ici"
							value="${pEmail}"
							required>
					</TD>
				</TR>
				<TR>
					<TD>Mot de passe</TD>
					<TD>
						<input 
							type="password" 
							id="Password" 
							name="Password" 
							size="40" 
							title="minimum 8 caractères dont 1 majuscule, 1 minuscule un chiffre et 1 caractère spécial"
							pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])^.{8,}$" 
							placeholder="Tapez ici votre mot de passe" 
							value="${pPassword}"
							required>
					</TD>
				</TR>
				<TR>
					<TD>Confirmez le mot de passe</TD>
					<TD>
						<input 
							type="password" 
							id="ConfirmPassword"  
							name="ConfirmPassword"
							title="Les mots de passes doivent êtres identiques"
							size="40" 
							pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])^.{8,}$" 
							placeholder="Confirmer votre mot de passe"
							value="${pConfirmPassword}"
							required>
					</TD>
				</TR>
				<TR>
					<TD colspan="2"><input type="submit" id="submit" value="S'inscrire"></FORM></TD>
				</TR>					
			</TABLE>
			</FORM>
			<script type="text/javascript">
				let vPassword = document.getElementById("Password");
				let vConfirmPassword = document.getElementById("ConfirmPassword");
				let vEmail = document.getElementById("EMail");
				vConfirmPassword.addEventListener
				(
					"keyup",
					function (event) 
					{
						let vMyPassword = document.getElementById("Password");
						let vMyConfirmPassword = document.getElementById("ConfirmPassword");
						if(vMyPassword.value !== vMyConfirmPassword.value) 
						{
							vMyPassword.setCustomValidity("Les mots de passes doivent êtres identiques !");
							vMyConfirmPassword.setCustomValidity("Les mots de passes doivent êtres identiques !");
						}
						else
						{
							vMyPassword.setCustomValidity("");
							vMyConfirmPassword.setCustomValidity("");
						}
					}
				);
				vPassword.addEventListener
				(
					"keyup",
					function (event) 
					{
						let vMyPassword = document.getElementById("Password");
						let vMyConfirmPassword = document.getElementById("ConfirmPassword");
						if(vMyPassword.value !== vMyConfirmPassword.value) 
						{
							vMyPassword.setCustomValidity("Les mots de passes doivent êtres identiques !");
							vMyConfirmPassword.setCustomValidity("Les mots de passes doivent êtres identiques !");
						}
						else
						{
							vMyPassword.setCustomValidity("");
							vMyConfirmPassword.setCustomValidity("");
						}
					}
				);
			</script>`
		return vHTML;
	}

	mSignin(pEmail, pPassword, pConfirmPassword)
	{
		const vEmailRegexp = new RegExp(`^(([^<>()[\\\].,;:s@"]+(.[^<>()[\\\].,;:s@"]+)*)|(".+"))@(([^<>()[\\\].,;:s@"]+.)+[^<>()[\\\].,;:s@"]{2,})$`, "g");
		const vPasswordRegexp = new RegExp(`(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])^.{8,}$`, "g");
		let vHTML = "";
		vHTML += this.HTMLHeader;
		if
		(
			this.Database.Passwords.SelectCount()[0].Count 
			<
			this.Config.MaxAdmins
		)
		{
			vHTML += `<H2>Inscription</H2>`;
			
			if(vEmailRegexp.test(pEmail) && vPasswordRegexp.test(pPassword) && (pPassword === pConfirmPassword))
			{
				const vHash = crypto.createHash('sha256');
				vHash.update(pPassword);
				const vPasswordHash = vHash.digest('hex');
				console.log(vPasswordHash)
				this.Database.Passwords.Insert
				(
					{
						EMail: pEmail,
						Hash: vPasswordHash
					}
				);
				vHTML += `<script type="text/javascript">
					window.location.replace("https://glossairegamecodeur.patrickpignol.repl.co/admin/");
				</script>`;
			}
			else
			{
				vHTML += `Les données des champs sont erronées.`
				vHTML += this.mAdminSigninForm(pEmail, pPassword, pConfirmPassword);
			}
		}
		else
		{
			vHTML += "Nice try !";
		}
		vHTML += this.HTMLFooter;
		return vHTML;
	}
}

module.exports = Admin;