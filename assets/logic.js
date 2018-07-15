// EDAMAM KEYS
var appKey = "01aa93d3b53976a284096fb203762782";
var appId = "5c81a78e"
var queryItem = "";

// SET UP GLOBAL VARIABLES
var recipe = "";
var title = "";
var image_url = "";
var ingredientLines = "";
var ingredientList = "";
var ingredient = "";
var ingredientName = "";
var price = "";
var totalPrice = [0, 0, 0];
var arrayPrice = [];
var waitForPrice;


// =========================
// CALLING RECIPES
// ========================
$(".recipe").on("click", function () {
    // using term 'this' to identify specific buttons
    var x = $(this).data("search");
    console.log(x);

    // SET UP VARIABLES FOR AJAX CALL 
    var queryURL = "https://api.edamam.com/search?q=" + x + "&app_id=" + appId + "&app_key=" + appKey;
    //testing
    console.log(queryURL);

    // AJAX CALL 
    $.ajax({
        url: queryURL,
        method: "GET",
    }).done(function (results) {
        console.log(results);
        console.log("Recipe Button Clicked!")
        //recipes is results.hits which is an array of recipes
        var recipes = results.hits;


        for (var i = 0; i < 3; i++) {

            getTotalPrice(recipes[i]);
            waiting();
            // console.log('STATEMENT:' + getTotalPrice(recipes[i]));
            console.log(typeof totalPrice[i]);

            // ==============================================
            // PUT TIMEOUT FUNCTION HERE
            // REMEMBER TO CLEAR TIMEOUT 
            // ===============================================

            console.log("=============================================================");
            console.log("This is the Total Price For One Recipe: " + totalPrice[i]);
            console.log("=============================================================");

        }
        stopWaiting();
        console.log(queryURL);
    });
});

// ======================
// TIMER FUNCTIONS
// ======================

function waiting() {
    //waits 3 seconds before quering price 
    waitForPrice = setTimeout(5000);
    alert("Waited!");
}

function stopWaiting() {
    clearTimeout(waitForPrice);
}


// =========================================================
// QUERY THE WALMART API TO GET PRICES OF INGREDIENTS
// =========================================================

function getTotalPrice(hitObj) {
    totalPrice = 0;
    //recipes[i] (each recipe) is an object
    var recipe = hitObj.recipe;
    var title = recipe.label;
    var image_url = recipe.image;

    //ingredients is an array
    var ingredients = recipe.ingredientLines;
    var ingredientList = $('<ul>');
    console.log("This is the ingredient List " + JSON.stringify(ingredients));

    // ====================================
    // ITERATING THROUGH INGREDIENTS ARRAY  
    // ====================================
    //iterating through ingredients array
    for (var j = 0; j < ingredients.length; j++) {

        // =======================================================================
        // PREPARING INGREDIENT LIST TO SEARCH FOR PRICES ON WALMART API 
        // =======================================================================
        ingredient = ingredients[j];
        var ingredientName = ingredient.toLowerCase();

        // console.log(ingredientName);
        // console.log(ingredientName.length);

        // use regular expression to remove measurement details from ingredient list
        var ingredientName = ingredientName.replace(/\d/g, '').replace(/cup/g, '').replace(/\//g, '').replace(/\(ml\)/g, '').replace(/tablespoons/g, '').replace(/-/g, '').replace(/inch/g, '').replace(/pounds/g, '').replace(/\(cm\)/g, '').replace(/\(g\)/g, '').replace(/thawed/g, '').replace(/peeled and grated/g, '').replace(/water/g, '');

        ingredientName = ingredientName.trim();
        console.log("Trimed Ingredients " + ingredientName);


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
            var items = results.items;

            // fetching first item from the items array
            var name = items[0].name;
            var price = items[0].salePrice;
            console.log("Ingrident Name: " + name);
            console.log("Price: " + price);
            console.log("URL: " + queryURL);

            // fetching price of each item and pushing it into an array 

            if (price !== undefined) {
                totalPrice += price;
            }
            console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
            console.log("Local Variable Total Price is: " + totalPrice);
            console.log(typeof totalPrice);
            console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

            return totalPrice;

        });

        var li = $('<li>').html(ingredient + " " + price);
        ingredientList.append(li);
    }

    // ==================================
    // DISPLAY ITEMS ONTO HTML PAGE 
    // ==================================
    var recipe_title = $('<h3 class="card-title">').html(title);
    var recipe_image = $('<img>').attr('src', image_url);
    var label = $('<h4>').html('Ingredients');
    //appending those elements to our container div with id of recipes
    $("#post").append(recipe_title, recipe_image, label, ingredientList);
}