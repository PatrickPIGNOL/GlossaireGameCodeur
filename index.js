const Site = require("./Site.js")
const express = require('express');
const vSite = new Site("Glossaire GameCodeur");

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
app.get
(
	'/addwords',
	(request, response) => 
	{
		const vHTML = vSite.AddWords;
		response.send(vHTML);
	}
);

app.post
(
	'/addwords',
	function(request, response, next)  
	{
		const vHTML = vSite.mAddWords(request.body.Word);
  		response.send(vHTML);
	}
);