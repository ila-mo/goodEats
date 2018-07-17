$(document).ready(function () {

    for (i=0; i < 3; i++) {
        var newRow = $('#recipeTable');
      
        // IMAGE OF RECIPE
        var dishImage = $('<td class="dish-image col-lg-4 "></td>');
        var imagePathHTML = `<img src="${recipe.image}" class="img-thumbnail class-lg-3" alt="image of recipe" >`;
        dishImage.html(imagePathHTML);
        newRow.append(dishImage);

        // INGREDIENT LIST
        var ingredientList = $('<td class="ingredients col-lg-5"></td>');
        var listHTML = generateListHTL(recipe.ingredients, recipe.name);
        ingredientList.html(listHTML);

        newRow.append(ingredientList);

        // PRICE OF RECIPE
        var dishPrice = $('<td class="col-s-12 col-lg-4 dish-price"></td>');
        var priceRow = $('<div class="row price-row"><div class="h2"></div></div>');
        var costHTML = `<h1>$ ${recipe.cost}</h1>`;
        priceRow.html(costHTML);

        // BUTTONS
        var buttonRow = $('<div class="row button-row"><div class="col"></div></div>');
        var buttonHTML = `<button class="detail-button">Show Details</button>`;
        buttonRow.html(buttonHTML);


        dishPrice.append(priceRow);
        dishPrice.append(buttonRow);
        newRow.append(dishImage, ingredientList, dishPrice);
        // $(".container").append(newRow);
        $("#recipeTable").append("<tr>" + dishImage  + ingredientList  + dishPrice + "</tr>");

    }

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
    $(document).on('click','.detail-button',function(){
        modal.style.display = "block";
        modalImg.src = recipe.image;
        captionText.innerHTML = this.alt;
    });

    var span = document.getElementsByClassName("close")[0];

    span.onclick = function() { 
        modal.style.display = "none";
    }

});

var recipe = {
    image : 'https://images.pexels.com/photos/247685/pexels-photo-247685.png?cs=srgb&dl=food-plate-healthy-247685.jpg&fm=jpg',
    ingredients : ['ingredients1','ingredients2','ingredients3','ingredients4','ingredients5','ingredients6'],
    name : 'dish name',
    cost : 150
};

function generateListHTL(ingreList, name){
    var count = 0;
    var listHTML = '<ul>';
    listHTML += ('<li><h2>' + name + '<h2></li>');
    ingreList.forEach(ingre => {
        if(count < 5){
            listHTML += ('<li>' + ingre + '</li>');
        }
        count++;
    });

    listHTML += '</ul>'
    console.log(listHTML);
    return listHTML;
}