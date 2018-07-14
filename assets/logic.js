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
            var ingredients = recipe.ingredients;
            var ingredientList = $('<ul>');



            // ========================
            // ITERATING THROUGH INGREDIENTS ARRAY  
            // ========================
            //iterating through ingredients array
            for (var j = 0; j < ingredients.length; j++) {
                var ingredient = ingredients[j].text;
                var li = $('<li>').html(ingredient);
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

    var queryURL = "https://cors-anywhere.herokuapp.com/https://api.walmartlabs.com/v1/search?query=" + queryItem + "&apiKey=" + apiKey;

    var searchURL = "https://api.walmartlabs.com/v1/search?query=" + queryItem + "&apiKey=" + apiKey;




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
        //array of excluded strings
        var exclusionList = ['1', '2', '3', '5', '6', '7', '8', '9', '0', 'of', 'cup', 'teaspoons']
        ingredients = ingredients.toLowerCase();
        //removing
        for (var i = 0; i < ingredients.length; i++) {
            //just to show what is in the initial arrays
            console.log(ingredients[i]);
            //Do something
            for (var j = 0; j < exclusionList.length; j++) {

                if (ingredients[i].includes(exclusionList[j])) {
                    var string = ingredients[i].replace(exclusionList[j], '');
                    ingredients[i] = string.trim()
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