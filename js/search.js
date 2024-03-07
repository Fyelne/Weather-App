
const proposalLimit = 4;
var cities = [];
fetch("cities.json")
.then(function(response) {
    return response.json();
}).then(function(data) {
    cities = data.cities;
});

$("#searchTerm").on("input", function(e) {
    val = this.value;
    if (!val) { 
      $(".result-block").hide();
      return false;
    } else {
      $(".result-block").show();
    }
    closeAllLists();
    var proposalCount = 0;
    var i = 0;
    while (i < cities.length && proposalCount < proposalLimit) {

      if (proposalCount < proposalLimit && cities[i].label.length >= val.length && removeAccents(cities[i].label.substr(0, val.length).toUpperCase()) == removeAccents(val.toUpperCase())) {
        var li = $("<li></li>");
        li.html(cities[i].label);
        li.attr("class", "result-item");
        $("#result-list").append(li);
        
        li.on("click", function(e) {
            $("#searchTerm").val(this.innerText);
            closeAllLists();
            $(".result-block").hide();
        });
        proposalCount++;
      }
      i++;
    }

    if(proposalCount == 0) {
        var li = $("<li></li>");
        li.html("Aucun résultat");
        li.attr("class", "result-item");
        $("#result-list").append(li);
    }
}
);
$('#searchTerm').on('focusout', function(e) {
  $(".result-block").delay(200).fadeOut(200, function() {
    closeAllLists();
  });
  
});

function closeAllLists() {
    $("#result-list").empty();
}

/**
 * Remove accents from a string
 * @param {String} str 
 * @returns  {String} str without accents
 */
function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}