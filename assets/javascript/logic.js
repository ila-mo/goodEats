// EDAMAM KEYS
var appKey = "01aa93d3b53976a284096fb203762782";
var appId = "5c81a78e"
var queryItem = "";

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

// SET UP GLOBAL VARIABLES
var recipe = "";
var title = "";
var image_url = "";
var ingredientLines = "";
var ingredientList = "";
var ingredient = "";
var ingredientName = "";
var price = "";
var totalPrice1, totalPrice2, totalPrice3;
var arrayPrice = [];
var waitForPrice;
var price_post;
var li;
var price;
var p;

$(document).ready(function () {

    // =========================
    // CALLING RECIPES
    // ========================
    database.ref().set({
        totalPrice1: 0,
        totalPrice2: 0,
        totalPrice3: 0,
    });


    $(document).on("click", "#submitBtn", function (event) {
        event.preventDefault(); 
        var query = $('#search').val();
    
        console.log(query);
        totalPrice1 = 0, totalPrice2 = 0, totalPrice3 = 0;

        // SET UP VARIABLES FOR AJAX CALL 
        var queryURL = "https://api.edamam.com/search?q=" + query + "&app_id=" + appId + "&app_key=" + appKey;
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
            //recipes[i] (each recipe) is an object
            recipe = recipes[0].recipe;
            var link = recipe.url;
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
                console.log("Trimed Ingredients: " + ingredientName);

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
                    var addToCartUrl = items[0].addToCartUrl;
                    console.log("URL:" + addToCartUrl);
                    console.log("Ingrident Name: " + name);

                    console.log("Price: " + price);
                    console.log("URL: " + queryURL);

                    // fetching price of each item and pushing it into an array 

                    if (price !== undefined) {
                        totalPrice1 += price;
                    }
                    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
                    console.log("Local Variable Total Price is: " + totalPrice1 + "price :" + price);
                    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
                    var p = $("<div>").html("Price: " + price);
                    database.ref().set({
                        totalPrice1: totalPrice1,
                        totalPrice2: totalPrice2,
                        totalPrice3: totalPrice3
                    });
                });
                waiting();
                var li = $('<li>').html(ingredient + "<br> Add To Cart:" + name);
                ingredientList.append(li);

            }
            // price_post = $('<h4>').html(price);

            // ==================================
            // DISPLAY ITEMS ONTO HTML PAGE 
            // ==================================

            // ==================================
            // DISPLAY ITEMS ONTO HTML PAGE 
            // ==================================
            var newRow = $('#recipeTable');

            // IMAGE OF RECIPE
            var dishImage = $('<td class="dish-image col-lg-4 "></td>');
            var imagePathHTML = $('<img class="img-thumbnail col-lg-3" alt-"image of recipe">').attr('src', image_url);
            dishImage.html(imagePathHTML);
            newRow.append(dishImage);

            // INGREDIENT LIST
            newRow.append(ingredientList);

            // PRICE OF RECIPE
            var dishPrice = $('<td class="col-s-12 col-lg-4 dish-price"></td>');
            var priceRow = $('<div class="row price-row"><div class="h2"></div></div>');
            var costHTML ='<h1> $' + (Math.floor(totalPrice1 * 100) / 100) + '</h1>';
            priceRow.html(costHTML);

            // BUTTONS
            var buttonRow = $('<div class="row button-row"><div class="col"></div></div>');
            var buttonHTML = `<button class="detail-button">Show Details</button>`;
            buttonRow.html(buttonHTML);

            dishPrice.append(priceRow);
            dishPrice.append(buttonRow);
            newRow.append(dishImage, ingredientList, dishPrice);
            // $(".container").append(newRow);
            $("#recipeTable").append("<tr>" + dishImage + ingredientList + dishPrice + "</tr>");


            var backButtonRow = $('<div class="row" id="back-button-row"></div>');
            var backButtonCol = $('<div class="col" id="back-button-col"></div>');
            var backButtonHTML = `<button class="back-button" onclick="location.href = 'index.html';">Search Again</button>`;
            backButtonCol.html(backButtonHTML);
            backButtonRow.append(backButtonCol);
            $(".container").append(backButtonRow);

            // Modal 
            var modal = document.getElementById('myModal');
            var btnDetail = document.getElementById('.detail-button');
            var modalImg = document.getElementById("img01");
            var captionText = document.getElementById("caption");
            $(document).on('click', '.detail-button', function () {
                modal.style.display = "block";
                modalImg.src = recipe.image;
                captionText.innerHTML = this.alt;
            });

            var span = document.getElementsByClassName("close")[0];

            span.onclick = function () {
                modal.style.display = "none";
            }


























            // var recipe_title = $('<h3 class="card-title">').html(title);
            // var recipe_image = $('<img>').attr('src', image_url);
            // var label = $('<h4>').html('Ingredients');
            // //appending those elements to our container div with id of recipes
            // $("#post").append(recipe_title, recipe_image, label, ingredientList);
            // console.log(queryURL);
        });
        $.ajax({
            url: queryURL,
            method: "GET",
        }).done(function (results) {
            console.log(results);
            console.log("Recipe Button Clicked!")
            //recipes is results.hits which is an array of recipes
            var recipes = results.hits;
            //recipes[i] (each recipe) is an object
            recipe = recipes[1].recipe;
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
                console.log("Trimed Ingredients: " + ingredientName);

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
                    var addToCartUrl = items[0].addToCartUrl;
                    console.log("URL:" + addToCartUrl);
                    console.log("Ingrident Name: " + name);

                    console.log("Price: " + price);
                    console.log("URL: " + queryURL);

                    // fetching price of each item and pushing it into an array 

                    if (price !== undefined) {
                        totalPrice2 += price;
                    }
                    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
                    console.log("Local Variable Total Price is: " + totalPrice2 + "price :" + price);
                    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
                    var p = $("<div>").html("Price: " + price);
                    database.ref().set({
                        totalPrice1: totalPrice1,
                        totalPrice2: totalPrice2,
                        totalPrice3: totalPrice3
                    });
                });
                waiting();
                var li = $('<li>').html(ingredient + "<br> Add To Cart:" + name);
                ingredientList.append(li);

            }
            // ==================================
            // DISPLAY ITEMS ONTO HTML PAGE 
            // ==================================


            var newRow = $('#recipeTable');

            // IMAGE OF RECIPE
            var dishImage = $('<td class="dish-image col-lg-4 "></td>');
            var imagePathHTML = $('<img class="img-thumbnail col-lg-3" alt-"image of recipe">').attr('src', image_url);
            dishImage.html(imagePathHTML);
            newRow.append(dishImage);

            // INGREDIENT LIST
            newRow.append(ingredientList);

            // PRICE OF RECIPE
            var dishPrice = $('<td class="col-s-12 col-lg-4 dish-price"></td>');
            var priceRow = $('<div class="row price-row"><div class="h2"></div></div>');
            var costHTML ='<h1> $' + (Math.floor(totalPrice1 * 100) / 100) + '</h1>';
            priceRow.html(costHTML);

            // BUTTONS
            var buttonRow = $('<div class="row button-row"><div class="col"></div></div>');
            var buttonHTML = `<button class="detail-button">Show Details</button>`;
            buttonRow.html(buttonHTML);

            dishPrice.append(priceRow);
            dishPrice.append(buttonRow);
            newRow.append(dishImage, ingredientList, dishPrice);
            // $(".container").append(newRow);
            $("#recipeTable").append("<tr>" + dishImage + ingredientList + dishPrice + "</tr>");


            var backButtonRow = $('<div class="row" id="back-button-row"></div>');
            var backButtonCol = $('<div class="col" id="back-button-col"></div>');
            var backButtonHTML = `<button class="back-button" onclick="location.href = 'index.html';">Search Again</button>`;
            backButtonCol.html(backButtonHTML);
            backButtonRow.append(backButtonCol);
            $(".container").append(backButtonRow);

            // Modal 
            var modal = document.getElementById('myModal');
            var btnDetail = document.getElementById('.detail-button');
            var modalImg = document.getElementById("img01");
            var captionText = document.getElementById("caption");
            $(document).on('click', '.detail-button', function () {
                modal.style.display = "block";
                modalImg.src = recipe.image;
                captionText.innerHTML = this.alt;
            });

            var span = document.getElementsByClassName("close")[0];

            span.onclick = function () {
                modal.style.display = "none";
            }


            // var recipe_title = $('<h3 class="card-title">').html(title);
            // var recipe_image = $('<img>').attr('src', image_url);
            // var label = $('<h4>').html('Ingredients');
            // //appending those elements to our container div with id of recipes
            // $("#post").append(recipe_title, recipe_image, label, ingredientList);
            // console.log(queryURL);
        });
        $.ajax({
            url: queryURL,
            method: "GET",
        }).done(function (results) {
            console.log(results);
            console.log("Recipe Button Clicked!")
            //recipes is results.hits which is an array of recipes
            var recipes = results.hits;
            //recipes[i] (each recipe) is an object
            recipe = recipes[2].recipe;
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
                console.log("Trimed Ingredients: " + ingredientName);

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
                    var addToCartUrl = items[0].addToCartUrl;
                    console.log("URL:" + addToCartUrl);
                    console.log("Ingrident Name: " + name);

                    console.log("Price: " + price);
                    console.log("URL: " + queryURL);

                    // fetching price of each item and pushing it into an array 

                    if (price !== undefined) {
                        totalPrice3 += price;
                    }
                    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
                    console.log("Local Variable Total Price is: " + totalPrice3 + "price :" + price);
                    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
                    var p = $("<div>").html("Price: " + price);
                    database.ref().set({
                        totalPrice1: totalPrice1,
                        totalPrice2: totalPrice2,
                        totalPrice3: totalPrice3
                    });
                });
                waiting();
                var li = $('<li>').html(ingredient + "<br> Add To Cart:" + name);
                ingredientList.append(li);

            }

            // ==================================
            // DISPLAY ITEMS ONTO HTML PAGE 
            // ==================================
            var newRow = $('#recipeTable');

            // IMAGE OF RECIPE
            var dishImage = $('<td class="dish-image col-lg-4 "></td>');
            var imagePathHTML = $('<img class="img-thumbnail col-lg-3" alt-"image of recipe">').attr('src', image_url);
            dishImage.html(imagePathHTML);
            newRow.append(dishImage);

            // INGREDIENT LIST
            newRow.append(ingredientList);

            // PRICE OF RECIPE
            var dishPrice = $('<td class="col-s-12 col-lg-4 dish-price"></td>');
            var priceRow = $('<div class="row price-row"><div class="h2"></div></div>');
            var costHTML ='<h1> $' + (Math.floor(totalPrice1 * 100) / 100) + '</h1>';
            priceRow.html(costHTML);

            // BUTTONS
            var buttonRow = $('<div class="row button-row"><div class="col"></div></div>');
            var buttonHTML = `<button class="detail-button">Show Details</button>`;
            buttonRow.html(buttonHTML);

            dishPrice.append(priceRow);
            dishPrice.append(buttonRow);
            newRow.append(dishImage, ingredientList, dishPrice);
            // $(".container").append(newRow);
            $("#recipeTable").append("<tr>" + dishImage + ingredientList + dishPrice + "</tr>");



            var backButtonRow = $('<div class="row" id="back-button-row"></div>');
            var backButtonCol = $('<div class="col" id="back-button-col"></div>');
            var backButtonHTML = `<button class="back-button" onclick="location.href = 'index.html';">Search Again</button>`;
            backButtonCol.html(backButtonHTML);
            backButtonRow.append(backButtonCol);
            $(".container").append(backButtonRow);

            // Modal 
            var modal = document.getElementById('myModal');
            var btnDetail = document.getElementById('.detail-button');
            var modalImg = document.getElementById("img01");
            var captionText = document.getElementById("caption");
            $(document).on('click', '.detail-button', function () {
                modal.style.display = "block";
                modalImg.src = recipe.image;
                captionText.innerHTML = this.alt;
            });

            var span = document.getElementsByClassName("close")[0];

            span.onclick = function () {
                modal.style.display = "none";
            }











            // var recipe_title = $('<h3 class="card-title">').html(title);
            // var recipe_image = $('<img>').attr('src', image_url);
            // var label = $('<h4>').html('Ingredients');
            // //appending those elements to our container div with id of recipes
            // $("#post").append(recipe_title, recipe_image, label, ingredientList); console.log(queryURL);
        });
    });

    // ======================
    // TIMER FUNCTIONS
    // ======================

    function waiting() {
        //waits 3 seconds before quering price 
        waitForPrice = setTimeout(90000);
    }

    function stopWaiting() {
        clearTimeout(waitForPrice);
    }
});

database.ref().on("value", function (snapshot) {

    if (snapshot.child("totalPrice1").exists() && snapshot.child("totalPrice2").exists() && snapshot.child("totalPrice3").exists()) {

        var totalPrice1 = snapshot.child("totalPrice1").val();
        var totalPrice2 = snapshot.child("totalPrice2").val();
        var totalPrice3 = snapshot.child("totalPrice3").val();

        // Change the HTML to reflect the stored values
        $("#totalPrice1").html(`<h1>${totalPrice1}</h1>`);
        $("#totalPrice2").html(`<h1>${totalPrice2}</h1>`);
        $("#totalPrice3").html(`<h1>${totalPrice3}</h1>`);

    }

    // If any errors are experienced, log them to console.
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});