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
var ingredient = "";
var ingredientName = ""; 
var price = ""; 


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

            // ====================================
            // ITERATING THROUGH INGREDIENTS ARRAY  
            // ====================================
            //iterating through ingredients array
            for (var j = 0; j < ingredients.length; j++) {
               
            

                // =======================================================================
                // PREPARING INGREDIENT LIST TO SEARCH FOR PRICES ON WALMART API 
                // =======================================================================
                var ingredientName = ingredient.toLocaleLowerCase();


                // console.log(ingredientName);
                // console.log(ingredientName.length);

                // use regular expression to remove measurement details from ingredient list
                var ingredientName = ingredientName.replace(/\d/g, '').replace(/cup/g, '').replace(/\//g, '').replace(/\(ml\)/g, '').replace(/tablespoons/g, '').replace(/-/g, '').replace(/inch/g, '').replace(/pounds/g, '').replace(/\(cm\)/g, '').replace(/\(g\)/g, '').replace(/thawed/g, '').replace(/peeled and grated/g, '').replace(/water/g, '');

                ingredientName = ingredientName.trim();
                console.log(ingredientName);
            

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

                    // for loop to iterate through items array 
                    for (var i = 0; i < 2; i++) {
                        // items[i] (each item) is an object 
                        var name = items[i].name;
                        var price = items[i].salePrice; 
                        console.log("Ingrident Name: " + name); 
                        console.log("Price: " + price); 
                        console.log("URL: " + queryURL); 

                    }
                });

                ingredient = ingredients[j];
                var li = $('<li>').html(ingredient + " " + price);
                ingredientList.append(li);
            }
                // post items onto HTML page
                var recipe_title = $('<h3 class="card-title">').html(title);
                var recipe_image = $('<img>').attr('src', image_url);
                var label = $('<h4>').html('Ingredients');
                //appending those elements to our container div with id of recipes
                $("#post").append(recipe_title, recipe_image, label, ingredientList);

                console.log(queryURL);
            
        }
    });
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