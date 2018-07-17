$(document).ready(function () {

    for (i=0; i < 5; i++) {
        var newRow = $('<div class="row"></div>');
        var newCol1 = $('<div class="col-2 dish-image"></div>');
        var newCol2 = $('<div class="col-7 ingredients"></div>');
        var newCol3 = $('<div class="col-3 dish-price"></div>');

        // PRICE HAS ITS OWN ROW
        var priceRow = $('<div class="row price-row"><div class="col"></div></div>');
        var buttonRow = $('<div class="row button-row"><div class="col"></div></div>');
        var imagePathHTML = `<img src="${recipe.image}" alt="" height="100%" width="100%">`;
        var buttonHTML = `<button class="detail-button">Show Details</button>`;
        newCol1.html(imagePathHTML);
        newRow.append(newCol1);
        var listHTML = generateListHTL(recipe.ingredients, recipe.name);
        newCol2.html(listHTML);
        newRow.append(newCol2);
        var costHTML = `<h1>$ ${recipe.cost}</h1>`;
        priceRow.html(costHTML);
        buttonRow.html(buttonHTML);
        newCol3.append(priceRow);
        newCol3.append(buttonRow);
        newRow.append(newCol3);
        $(".container").append(newRow);
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
    listHTML += ('<li><h1>' + name + '<h1></li>');
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