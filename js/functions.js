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
  xhr.open('GET', 'https://api.nal.usda.gov/ndb/search/?format=json&q='+searchedFood+'&ds=Standard%20Reference&sort=n&offset=0&api_key=SFogF1z0mW1NPIzFfGS8HnxJmQEzVYVgGXx3LJrS');
  xhr.send(null);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var resp = JSON.parse(xhr.responseText);
      var results = resp.list.item;
      var foodsList = "";
      for (i = 0; i < results.length; i++) {
          foodsList += "<button type=\"button\" onclick=\"getNutrients(" + results[i].ndbno + ")\">"
                        + results[i].name
                        + "</button>";
      }

      var resultList = document.getElementById('foodResults');
      resultList.innerHTML = foodsList;

    } else {
      var resultList = document.getElementById('foodResults');
      resultList.innerHTML = "Error: " + xhr.status;
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

        //var foods = JSON.parse(lyrics);
        var nutRes = document.getElementById('nutrientsResults');
        nutRes.innerHTML = "Name: " + food.name + "<br>"
                         + "Nutrients in 100g: "
                         + nutrientsList;
      } else {
        var nutRes = document.getElementById('nutrientsResults');
        nutRes.innerHTML = "Error: " + xhr.status;
      }
    }
  }
