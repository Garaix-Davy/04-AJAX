var resultList = document.getElementById('foodResults');
var nutRes = document.getElementById('nutrientsResults');
var debug = document.getElementById('debug');

function lookupFood() {
  var searchedFood = document.getElementById('food').value;
  if (searchedFood === "") {
    window.alert("Please enter the name of a food.");
    return;
  }
  searchFood(searchedFood);
}

function searchFood(searchedFood){


  var xhr = new XMLHttpRequest();
  nutRes.innerHTML = "";
  xhr.open('GET', 'https://api.nal.usda.gov/ndb/search/?format=json&q='+searchedFood+'&ds=Standard%20Reference&sort=n&offset=0&api_key=SFogF1z0mW1NPIzFfGS8HnxJmQEzVYVgGXx3LJrS');
  xhr.send(null);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var resp = JSON.parse(xhr.responseText);
      var results = resp.list.item;
      var foodsList = "";
      for (i = 0; i < results.length; i++) {
          var ndbno = results[i].ndbno;
          foodsList += "<button type=\"button\" onclick=\"getNutrients('" + ndbno + "')\">"
                        + results[i].name
                        + "</button>";
      }

      resultList.innerHTML = "<h2>Select a food to view its nutrients</h2>" + foodsList;
    } else {
      resultList.innerHTML = "Error: " + xhr.status + "<br>"
      + "Possible reason: No foods in the database matched your search terms. Please try different terms.";
    }
  }
}


function getNutrients(ndbno) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.nal.usda.gov/ndb/reports/?ndbno='+ndbno+'&type=f&format=json&api_key=SFogF1z0mW1NPIzFfGS8HnxJmQEzVYVgGXx3LJrS');
  xhr.send(null);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        var food = data.report.food;
        var nutrients = data.report.food.nutrients;
        var nutrientsList = "<ul>";
        for (i = 0; i < nutrients.length; i++) {
            nutrientsList += "<li>"
                          + nutrients[i].name
                          + " (" + nutrients[i].group + "): "
                          + nutrients[i].value
                          + nutrients[i].unit
                          + "</li>";
        }
        nutrientsList += "</ul>";
        nutRes.innerHTML = "<h2>Nutrients in " + food.name + " (100g portion)</h2>"
                         + nutrientsList
                         + "<h2>Stringified JSON received from USDA database</h2>" + JSON.stringify(data, null, 4);
      } else {
        nutRes.innerHTML = "Error: " + xhr.status;
      }
    }
  }

var input = document.getElementById("food");
input.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("searchButton").click();
    }
});
