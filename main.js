var url = document.location.href;
var comments = [];
var articleIds = [];

function getRedditArticleIds(url){
	$.get(
	    "http://www.reddit.com/submit.json?url=" + url,
	    {},
	    function(data) {
	    	//If length is undefined, there are multiple articles that match the url
	    	if (data.length === undefined){
	    		//Loop through all relevant reddit posts
		       for(var i = 0; i < data.data.children.length;i++){
		           var article = data.data.children[i].data;
		           if (isGoodArticle(article)){
		           	articleIds.push(article.id);
		           	getRedditComments(article.id);
		           }
		       }
	    	} else{
	    		//only 1 article matching the url
	    		var article = data[0].data.children[0].data
	    		if (isGoodArticle(article)){
	    			articleIds.push(article.id);
	    			getRedditComments(article.id);
	    		}
	    	}
	    	
	    }
	);
}

function isGoodArticle(article){
	if (article.num_comments > 0 && article.score > 20){
		return true;
	}
	return false;
}

function getRedditComments(id){
	$.get(
		"http://www.reddit.com/r/all/comments/" + id + ".json",
	    {},
	    function(data) {
	       for(var i = 0; i < data[1].data.children.length; i++ ){
	       	comments.push(data[1].data.children[i]);
	       	$("#comments").append("<div class='comment'>" + data[1].data.children[i].data.body + "</div>");
	       }
	    }
	);
}



$(document).ready(function(){	
	$("#getComments").click(function(){
		$("#comments").html("");
		url = $("#url").val();
		getRedditArticleIds(url);
	})
	// getRedditArticleIds(url);
	// getRedditComments("21m4hj");
});