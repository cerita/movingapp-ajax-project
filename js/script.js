
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    var street = $("#street").val();
    var city = $("#city").val();
    var address = street + ", " + city;
    
    $greeting.text("So, you wanna live at " + address + "?");
    
    var strViewUrl = "https://maps.googleapis.com/maps/api/streetview?size=600x400&location=" + address + "";
    strViewUrl = strViewUrl.replace(/\s/g, '');
    $body.append("<img class='bgimg' src='" + strViewUrl + "'>");
    
    
    //NYTimes AJAX Request
    
    var nyTimesUrl = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + city + "&glocations:('" + city + "')&type_of_material:('News')&api-key=d301ee9cb21c51ec5ab540a8da2ec4b0:4:74553195";
    
    $.getJSON(nyTimesUrl, function(data) { 
        //console.log(data);
        
        $nytHeaderElem.text('New York Times Articles About ' + city);
        
        var articles = data.response.docs;
        for (var i=0; i <articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' + 
                            '<a href="' + article.web_url + '">' + article.headline.main + '</a>' +
                            '<p>' + article.snippet + '</p>' +
                            '</li>'
                            );
        };        
    }).error(function() {
        $nytHeaderElem.text("New York Times articles could not be loaded. Try again later?")
    });
    
    
    
    //Wikipedia
    var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + city + '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function() {
       $wikiElem.text("Failed to get Wikipedia resources"); 
    }, 8000);
                                        
    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function(response) {
            var wikiArticles = response[1];
            for (var i=0; i<wikiArticles.length; i++) {
                var wikiArticle = wikiArticles[i];
                var wikiArticleUrl = 'http://en.wikipedia.org/wiki/' + wikiArticle;
                $wikiElem.append('<li> <a href="' + wikiArticleUrl + '">' + wikiArticle + '</a></li>')
            }
            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);
