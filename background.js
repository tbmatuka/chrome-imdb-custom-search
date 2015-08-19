var suggestions = [];

chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {
    var cleantext = text.replace(' ', '');
	var url = "http://sg.media-imdb.com/suggests/" + cleantext.substr(0,1) + "/" + cleantext + ".json";
	//console.log(url);

	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	
	request.onreadystatechange = function()
		{
		if (request.readyState != 4) return;
		
		if (request.status === 200)
			{
			var offset = 6 + cleantext.length;
			var responseText = request.responseText.replace('&', '&amp;');
			//console.log(responseText.substr(offset, responseText.length - offset - 1));
			var res = JSON.parse(responseText.substr(offset, responseText.length - offset - 1));
			suggestions = [];
			for(var i = 0; i < res.d.length; i++)
				{
				var content, description;
				if('y' in res.d[i])
					{
					description = res.d[i].l + ' (' + res.d[i].y + ') - ' + res.d[i].s;
					}
				else
					{
					description = res.d[i].l + ' - ' + res.d[i].s;
					}
				
				content = res.d[i].id;
				
				suggestions[i] = { "content": content, "description": description };
				}
			suggest(suggestions);
			}
		else
			{
			// console.log(request.status);
			suggest(suggestions);
			}
		};
	
	request.send(null);
  });

// This event is fired when the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function(text, disposition) {
    var url = "http://www.imdb.com/find?s=all&q=" + text;
    chrome.tabs.update({ "url": url });
  });
