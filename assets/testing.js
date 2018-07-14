// SET UP VARIABLES
var appKey = "01aa93d3b53976a284096fb203762782";
var appId = "5c81a78e"
var queryItem = "";


//Edamam 
var recipe = "";
var title = "";
var image_url = "";
var ingredientLines = "";
var ingredientList = "";

// WALMART API
var exclusionList = ['1', '2', '3', '5', '6', '7', '8', '9', '0', 'of', 'cup', 'teaspoons', 'tablespoons'];


// =========================
// SET UP METHODS: EDAMAM
// ========================
$(".recipe").on("click", function () {
    // using term 'this' to identify specific buttons
    var x = $(this).data("search");
    console.log(x);

    // SET UP VARIABLES FOR AJAX CALL 
    queryItem = 'chicken';
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
        //for loop to iterate through recipes array
        for (var i = 0; i < 3; i++) {
            //recipes[i] (each recipe) is an object
            var recipe = recipes[i].recipe;
            var title = recipe.label;
            var image_url = recipe.image;

            //ingredients is an array
            var ingredients = recipe.ingredientLines;
            var ingredientList = $('<ul>');

            // ========================
            // ITERATING THROUGH INGREDIENTS ARRAY  
            // ========================
            //iterating through ingredients array
            for (var j = 0; j < ingredients.length; j++) {
                var ingredient = ingredients[j];
                var li = $('<li>').html(ingredient);
                ingredientList.append(li);

                // ============================
                // WALMART API: PULLING PRICES
                // ============================
                var ingredientName = ingredient;
                console.log(ingredientName);

                // for loop to remove measurement details from ingredient list
                // just to show what is in the initial arrays
                // remove measurement details from ingredient list
                for (var k = 0; k < ingredientName.length; k++) {
                    for (var p = 0; p < exclusionList.length; p++) {
                        if (ingredientName[k].includes(exclusionList[p])) {
                            var string = ingredientName[k].replace(exclusionList[p], '');
                            ingredientName[k] = string.trim()
                            console.log(ingredientName[i]);
                        }
                    }
                }
            }

            // }

            // post items onto HTML page
            var recipe_title = $('<h3 class="card-title">').html(title);
            var recipe_image = $('<img>').attr('src', image_url);
            var label = $('<h4>').html('ingredientLines');
            //appending those elements to our container div with id of recipes
            $("#post").append(recipe_title, recipe_image, label, ingredientList);

            console.log(queryURL);
        }
    })
});


// =========================
// SET UP METHODS: WALMART
// =========================
$(".walmartBtn").on("click", function () {
    console.log("Button Clicked!");

    // set up api keys 
    var apiKey = "gw9az82quh9v3geuvydmm2p6";

    var queryItem = "chicken";

    var queryURL = "https://cors-anywhere.herokuapp.com/https://api.walmartlabs.com/v1/search?query=" + queryItem + "&apiKey=" + apiKey;

    var searchURL = "https://api.walmartlabs.com/v1/search?query=" + queryItem + "&apiKey=" + apiKey;



    // THERE DOESN'T HAVE TO BE WALMART BUTTON  
    // The Walmart API can be part of the ajax call to Edaman --> or it could be it's separate call and only posted  
    // next to the ingredient list when module opens 
    // 
    // query item needs to come from Edamam API
    // var queryItem = $(#ingredient).val().trim(); 
    // need to iterate through each ingredient list for the ajax call 
    // have to keep scoping in mind: this function doesn't know about the variables in Edamam! 


    // AJAX CALL
    $.ajax({
        url: queryURL,
        method: "GET",
    }).done(function (results) {
        console.log(results);
        // items is results.items
        var items = results.items;


        // ================================
        // WORD REMOVAL : FOR WALMART API 
        // ================================
        // When a participant puts in a recipe name, the name is used to search the Edamam API
        // The Edamam API returns a list of ingredientLines 
        // We take that list of ingredientLines from the Edamam API --> //WORK ON//
        // Each ingredient item is the search query for Walmart 
        // 
        // ===========
        //array of excluded strings
        var exclusionList = ['1', '2', '3', '5', '6', '7', '8', '9', '0', 'of', 'cup', 'teaspoons']
        ingredientLines = ingredientLines.toLowerCase();
        //removing
        for (var i = 0; i < ingredientLines.length; i++) {
            //just to show what is in the initial arrays
            console.log(ingredientLines[i]);
            //Do something
            for (var j = 0; j < exclusionList.length; j++) {

                if (ingredientLines[i].includes(exclusionList[j])) {
                    var string = ingredientLines[i].replace(exclusionList[j], '');
                    ingredientLines[i] = string.trim()
                }
            }
        }


        // for loop to iterate through items array 
        for (var i = 0; i < 3; i++) {
            // items[i] (each item) is an object 
            var name = items[i].name;


            $("#post").append(name);
            console.log(results.items);
            console.log(searchURL);
        }
    })

});


// 5 Recipes 
// Display: link that opens module 
// 4 components: image of recipe, name of dish, total cost (WALMARTS)

// MODULE
// ingredient list, price of each ingredient, total price of ingredient, link to recipe, 

// ----------
// when click BUY --> takes you to FULL walmart