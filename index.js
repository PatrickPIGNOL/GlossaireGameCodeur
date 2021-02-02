const Crud = require("./Crud.js")
const express = require('express');

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded());

app.listen
(
	process.env.PORT,
	() => 
	{
  		console.log('server started');
	}
);

const vSite = new Crud("Glossaire GameCodeur");

app.get
(
	'/',
	(request, response) => 
	{
		const vHTML = vSite.Welcome;
		response.send(vHTML);
	}
);

app.post
(
	'/',
	function(request, response, next)  
	{
		const vHTML = vSite.mWelcome(request.body.Word);
  		response.send(vHTML);
	}
);

app.post
(
	'/word',
	function(request, response, next)  
	{
		const vHTML = vSite.mWord(request.body.Word);
  		response.send(vHTML);
	}
);

app.post
(
	'/link',
	function(request, response, next)  
	{
		const vHTML = vSite.mLink(request.body.Link);
  		response.send(vHTML);
	}
);

app.get
(
	'/admin/',
	(request, response) => 
	{
		const vHTML = vSite.Admin;
		response.send(vHTML);
	}
);

app.post
(
	'/admin/',
	(request, response) => 
	{
		const vHTML = vSite.mAdmin({EMail: request.body.EMail, Password: request.body.Password});
		response.send(vHTML);
	}
);

app.get
(
	'/admin/signin',
	(request, response) => 
	{
		const vHTML = vSite.Signin;
		response.send(vHTML);
	}
);

app.post
(
	'/admin/signin',
	(request, response) => 
	{
		const vHTML = vSite.mSignin(request.body.EMail, request.body.Password, request.body.ConfirmPassword);
		response.send(vHTML);
	}
);

app.post
(
	'/admin/crud/',
	(request, response) => 
	{
		const vHTML = vSite.mCrud(request.body.Login, request.body.Word);
		response.send(vHTML);
	}
);

app.post
(
	'/admin/crud/word',
	(request, response) => 
	{
		const vHTML = vSite.mCrudWord(request.body.Login, request.body.Word);
		response.send(vHTML);
	}
);

app.post
(
	'/admin/crud/link',
	(request, response) => 
	{
		const vHTML = vSite.mCrudLink(request.body.Login, request.body.Link);
		response.send(vHTML);
	}
);


app.post
(
	'/admin/crud/managewords',
	function(request, response, next)  
	{
		const vRequest = Object.freeze
		(
			{
				Add: {
					Word: request.body.AddWord
				},
				Update: {
					ID: request.body.UpdateID,
					Word: request.body.UpdateWord
				},
				Delete:{
					ID: request.body.DeleteID
				}
			}
		);
		const vHTML = vSite.mCrudManageWords(request.body.Login, vRequest);
  		response.send(vHTML);
	}
);

app.post
(
	'/admin/crud/managelinks',
	function(request, response, next)  
	{
		const vRequest = Object.freeze
		(
			{
				Add: {
					Name: request.body.AddName,
					URL: request.body.AddURL
				},
				Update: {
					ID: request.body.UpdateID,
					Name: request.body.UpdateName,
					URL: request.body.UpdateURL,
				},
				Delete: {
					ID: request.body.DeleteID
				}
			}
		);
		const vHTML = vSite.mCrudManageLinks(request.body.Login, vRequest);
  		response.send(vHTML);
	}
);

app.post
(
	'/admin/crud/managewordslinks',
	function(request, response, next)  
	{
		const vRequest = Object.freeze
		(
			{
				Add: {
					WordID: request.body.AddWordID,
					LinkID: request.body.AddLinkID
				},
				Delete: {
					ID: request.body.DeleteID 
				}
			}
		);
		const vHTML = vSite.mManageWordsLinks(request.body.Login, vRequest);
  		response.send(vHTML);
	}
);
/*
app.get
(
	'/admin/crud/base',
	function(request, response, next)  
	{
		const vHTML = vSite.mBase();
  		response.send(vHTML);
	}
);
*/