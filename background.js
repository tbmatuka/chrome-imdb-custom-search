chrome.omnibox.onInputChanged.addListener(
  async function(text, suggest) {
      if (text === '') {
          suggest([]);

          return;
      }
      
    var cleantext = text.replace(' ', '');
    var url = "http://sg.media-imdb.com/suggests/" + cleantext.substr(0,1) + "/" + cleantext + ".json";

    const response = await fetch(url);
    const responseText = await response.text();
    
    const offset = responseText.indexOf('({') + 1;
    const responseJson = responseText.substring(offset, responseText.length - 1).replaceAll('&', '&amp;');
    
    const res = JSON.parse(responseJson);
    
    const suggestions = res.d.filter((result) => {
        return !result.id.includes('/');
    }).map((result) => {
        const content = result.id;
        let description = `${result.l} - ${result.s}`;
        if (result.y) {
            description = `${result.l} (${result.y}) - ${result.s}`;
        }
        
        return {
            content,
            description,
        };
    });
    
    suggest(suggestions);
  });

// This event is fired when the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function(text, disposition) {
    var url = "http://www.imdb.com/find?s=all&q=" + text;
    chrome.tabs.update({ "url": url });
  });
