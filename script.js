$(function() {
    showLoader();
    $("#github-projects").loadRepositories("nousernamerequired");
  });
jQuery.githubUser = function(username, callback) {
  jQuery.getJSON("https://api.github.com/search/repositories?q=stars:>=500&sort=stars&order=desc&callback=?", callback);
}
jQuery.getNextLog=function(valLink, callback) {
  jQuery.getJSON(valLink+"&callback=?", callback);
}
jQuery.searchLoad=function(searchString, callback) {
  var urlToCall=("https://api.github.com/search/repositories?q=language:"+encodeURIComponent(searchString)+"&sort=stars&order=desc&callback=?");
  jQuery.getJSON(urlToCall, callback);
}
jQuery.SearchWithThisStars=function(valueSelected, callback) {
  jQuery.getJSON("https://api.github.com/search/repositories?q=stars:>="+encodeURIComponent(valueSelected)+"&sort=stars&order=desc&callback=?", callback);
}
jQuery.fn.loadRepositories = function(username) {
  var target = this; 
  $.githubUser(username, function(data) {
    FormatAndDisplayData(data);
  });
  
};
 function loadRepositoriesNext(valLink)
 {showLoader();
      $.getNextLog(valLink, function(data) {
        FormatAndDisplayData(data);
      });
 }

function sortByNumberOfWatchers(repos) {
    repos.sort(function(a,b) {
      return b.watchers - a.watchers;
    });
  }

function FormatAndDisplayData(data)
{
    $('.pagination').html('');
    $('#resultList').html('');
    $.each(data.meta.Link,function(t,itemLink){

    $('.pagination').append('<li class="waves-effect"><a href="#" onclick="loadRepositoriesNext(\''+itemLink[0]+'\')">'+itemLink[1].rel+'</a></li>');
    })
    var repos = data.data.items;
    $('#searchCount').html('We have found '+data.data.total_count+' repositories result.');
    sortByNumberOfWatchers(repos);
    $(repos).each(function() {
        var shortDesc=this.description;
         if(shortDesc.length>30)
         {
            shortDesc= shortDesc.substring(0,30)+'...';
         }
         var lang=this.language==null?'Not Specified':this.language;
         if(this.language==null)
         {
 $('#resultList').append('<div class="card horizontal"><div class="card-stacked"><div class="card-content"><a href="'+this.url+'">'+this.name+'</a><span class="descText">'+shortDesc+'</span></div><div class="card-action"><a href="#" >Language: '+lang+'</a></div></div></div>')
         }
         else
         {
             $('#resultList').append('<div class="card horizontal"><div class="card-stacked"><div class="card-content"><a href="'+this.url+'">'+this.name+'</a><span class="descText">'+shortDesc+'</span></div><div class="card-action"><a href="#" onclick="getThisLanguageData(\''+lang+'\')">Language: '+lang+'</a></div></div></div>');
         }
    });
   hideLoader();
}
function showLoader()
{
$('body').addClass('loader');
}
function hideLoader()
{
$('body').removeClass('loader');
}
function DoSearch()
{
    showLoader();
    var searchString=$('#search').val();
    if(searchString!='')
    {
$.searchLoad(searchString, function(data) {
        FormatAndDisplayData(data);
      });
    }
}
$(document).ready(function(){
    showLoader();
$('#starsRange').on('change',function(){

$('#selectedStars').html(document.getElementById("starsRange").value);
valueSelected=document.getElementById("starsRange").value;
 $.SearchWithThisStars(valueSelected, function(data) {
    FormatAndDisplayData(data);
  });
});
});