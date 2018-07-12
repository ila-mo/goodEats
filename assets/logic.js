// SET UP VARIABLES
var appKey = "01aa93d3b53976a284096fb203762782";
var appId = "5c81a78e"
var queryItem = "";

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
        //recipes is results.hits which is an array of recipes
        var recipes = results.hits;
        //for loop to iterate through recipes array
        for (var i = 0; i < recipes.length; i++) {
            //recipes[i] (each recipe) is an object
            var recipe = recipes[i].recipe;
            var title = recipe.label;
            var image_url = recipe.image;

            //ingredients is an array
            var ingredients = recipe.ingredients;
            var ingredientList = $('<ul>');

            //iterating through ingredients array
            for (var j = 0; j < ingredients.length; j++) {
                var ingredient = ingredients[j].text;
                var li = $('<li>').html(ingredient);
                ingredientList.append(li);
            }

            // post items onto HTML page
            var recipe_title = $('<h3>').html(title);
            var recipe_image = $('<img>').attr('src', image_url);
            var label = $('<h4>').html('Ingredients');
            //appending those elements to our container div with id of recipes
            $("#post").append(recipe_title, recipe_image, label, ingredientList);

        }

    })

});

// =========================
// SET UP METHODS: WALMART
// =========================
$(".walmartBtn").on("click", function () {
    console.log("Button Clicked!");
    var x = $(this).data("search");

    // set up api keys 
    var apiKey = "gw9az82quh9v3geuvydmm2p6";
    var queryItem = "chicken";

    var queryURL = "http://api.walmartlabs.com/v1/search?query=" + queryItem + "&apiKey=" + apiKey;


    // AJAX CALL
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function (query) {
        console.log(query);
        console.log(queryURL);
    })

});