$(document).ready(function () {
    

    var modal = document.getElementById('myModal');
    var btnDetail = document.getElementById('.detail-button');
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    $(document).on('click','.detail-button',function(event){
        console.log(event.taget);
        console.log(event.currentTarget);
        modal.style.display = "block";
        modalImg.src = recipe.image;
        captionText.innerHTML = this.alt;
    });

    var span = document.getElementsByClassName("close")[0];

    span.onclick = function() { 
        modal.style.display = "none";
    }

});

////  variable declaration
var query = localStorage.getItem('dishQuery');
var appKey = "01aa93d3b53976a284096fb203762782";
var appId = "5c81a78e"
var recipe1 = {}, recipe2 = {}, recipe3 = {};
var totalPrice1 = 0, totalPrice2 = 0, totalPrice3 = 0;
var config = {
    apiKey: "AIzaSyC1TD5PkYLvYxVKPmtDbes9uoxphQ20UwE",
    authDomain: "test1-27ccb.firebaseapp.com",
    databaseURL: "https://test1-27ccb.firebaseio.com",
    projectId: "test1-27ccb",
    storageBucket: "test1-27ccb.appspot.com",
    messagingSenderId: "168990791769"
};
firebase.initializeApp(config);
var database = firebase.database();


//// method declaration
function generateListHTL(ingreList, name){
    var count = 0;
    var listHTML = '<ul>';
    listHTML += ('<li><h1>' + name + '<h1></li>');
    ingreList.forEach(ingre => {
        if(count < 5){
            listHTML += ('<li>' + ingre + '</li>');
        }
        count++;
    });

    listHTML += '</ul>'
    return listHTML;
}

function generateCards(recipe, id) {
    var newRow = $(`<div class="row " id="card-${id}"></div>`);
    var newCol1 = $(`<div class="col-2 dish-image"  id="dish-image-${id}"></div>`);
    var newCol2 = $(`<div class="col-7 ingredients"  id="ingredients-${id}"></div>`);
    var newCol3 = $(`<div class="col-3 dish-price"  id="dish-price-${id}"></div>`);
    var priceRow = $(`<div class="row price-row"  id="totalprice-${id}"><div class="col"></div></div>`);
    var buttonRow = $(`<div class="row button-row"  id="detail-button-${id}"><div class="col"></div></div>`);
    var imagePathHTML = `<img src="${recipe.image}"  id="img-${id}" alt="" height="100%" width="100%">`;
    var buttonHTML = `<button class="detail-button"  id="d-button-${id}">Show Details</button>`;
    newCol1.html(imagePathHTML);
    newRow.append(newCol1);
    var recipeTitle = recipe.label.split(" ")
    if(recipeTitle.length > 3){
        recipe.label = recipeTitle[0] + " " + recipeTitle[1] + ' ....';
    }
    var listHTML = generateListHTL(recipe.ingredientLines, recipe.label);
    newCol2.html(listHTML);
    newRow.append(newCol2);
    if(id === 1){
        var costHTML = `<h1>${totalPrice1}</h1>`;
    } else if(id === 2){
        var costHTML = `<h1>${totalPrice2}</h1>`;
    } else if(id === 3){
        var costHTML = `<h1>${totalPrice3}</h1>`;
    } else {
        var costHTML = `<h1>N/A</h1>`;
    }
    priceRow.html(costHTML);
    buttonRow.html(buttonHTML);
    newCol3.append(priceRow);
    newCol3.append(buttonRow);
    newRow.append(newCol3);
    $(".container").append(newRow);
}

function fetchRecipes(){
    var queryURL = "https://api.edamam.com/search?q=" + query + "&app_id=" + appId + "&app_key=" + appKey;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).done(function (results) {
        var recipes = results.hits;
        //recipes[i] (each recipe) is an object
        recipe1 = jQuery.extend(true, {}, recipes[0].recipe);
        recipe2 = jQuery.extend(true, {}, recipes[1].recipe);
        recipe3 = jQuery.extend(true, {}, recipes[2].recipe);
        generateCards(recipe1, 1);
        generateCards(recipe2, 2);
        generateCards(recipe3, 3);
        addBackButton();
        calculateTotalPrice(recipe1, 1);
        calculateTotalPrice(recipe2, 3);
        calculateTotalPrice(recipe3, 3);
    });
}

function calculateTotalPrice(recipe, id){
    for (var j = 0; j < recipe.ingredients.length; j++) {
        console.log(recipe.ingredients[j].text);
        var ingredient = recipe.ingredients[j].text.toLowerCase();
        var ingredientName = ingredient.replace(/\d/g, '').replace(/cup/g, '').replace(/\//g, '').replace(/\(ml\)/g, '').replace(/tablespoons/g, '').replace(/-/g, '').replace(/inch/g, '').replace(/pounds/g, '').replace(/\(cm\)/g, '').replace(/\(g\)/g, '').replace(/thawed/g, '').replace(/peeled and grated/g, '').replace(/water/g, '');

        ingredientName = ingredientName.trim();
        console.log("Trimmed Ingredients: " + ingredientName);

        // ============
        // WALMART API 
        // ============
        var apiKey = "gw9az82quh9v3geuvydmm2p6";
        var queryItem = ingredientName;
        var queryURL = "https://cors-anywhere.herokuapp.com/https://api.walmartlabs.com/v1/search?query=" + queryItem + "&apiKey=" + apiKey;

        // AJAX CALL
        $.ajax({
            url: queryURL,
            method: "GET",
        }).done(function (results) {
            console.log(results);
            // items is results.items
            var item = results.items[0];

            // fetching first item from the items array
            var name = item.name;
            var price = item.salePrice;
            var addToCartUrl = item.addToCartUrl; 
            console.log("URL:" + addToCartUrl); 
            console.log("Ingrident Name: " + name);
            console.log("Price: " + price);

            // fetching price of each item and pushing it into an array 

            if (price !== undefined) {
                if(id === 1){
                    totalPrice1 += price;
                } else if(id === 2){
                    totalPrice2 += price;
                } else if(id === 3){
                    totalPrice3 += price;
                }
            }
            console.log("Local Variable Total Price is: " + totalPrice1 + "price :" + price);
            database.ref().set({
                totalPrice1 : totalPrice1,
                totalPrice2 : totalPrice2,
                totalPrice3 : totalPrice3
            });
        });
    }
}

function addBackButton(){
    var backButtonRow = $('<div class="row" id="back-button-row"></div>');
    var backButtonCol = $('<div class="col" id="back-button-col"></div>');
    var backButtonHTML = `<button class="back-button" onclick="location.href = 'index.html';">Search Again</button>`;
    backButtonCol.html(backButtonHTML);
    backButtonRow.append(backButtonCol);
    $(".container").append(backButtonRow);
}

database.ref().on("value", function(snapshot) {

    // If Firebase has a highPrice and highBidder stored (first case)
    if (snapshot.child("totalPrice1").exists() && snapshot.child("totalPrice2").exists() && snapshot.child("totalPrice3").exists()) {
  
      // Set the variables for highBidder/highPrice equal to the stored values in firebase.
      // highPrice = ...
      // highBidder = ...
        var totalPrice1 = snapshot.child("totalPrice1").val();
        var totalPrice2 = snapshot.child("totalPrice2").val();
        var totalPrice3 = snapshot.child("totalPrice3").val();
  
      // Change the HTML to reflect the stored values
        $("#totalprice-1").html(`<h1>$ ${Math.round(totalPrice1)}</h1>`);
        $("#totalprice-2").html(`<h1>$ ${Math.round(totalPrice2)}</h1>`);
        $("#totalprice-3").html(`<h1>$ ${Math.round(totalPrice3)}</h1>`);
    }

  // If any errors are experienced, log them to console.
}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

//// code execution
database.ref().set({
    totalPrice1 : 0,
    totalPrice2 : 0,
    totalPrice3 : 0
});
fetchRecipes();