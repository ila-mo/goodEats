$(document).ready(function () {
    var recipe = {
        image : 'https://images.pexels.com/photos/247685/pexels-photo-247685.png?cs=srgb&dl=food-plate-healthy-247685.jpg&fm=jpg',
        ingredients : ['ingredients1','ingredients2'],
        cost : 150
    };

    for (i=0; i < 5; i++) {
        var newRow = $('<div class="row"></div>');
        var newCol1 = $('<div class="col-2 dish-image"></div>');
        var newCol2 = $('<div class="col-8"></div>');
        var newCol3 = $('<div class="col-2 dish-price"></div>');
        var imagePathHTML = `<img src="${recipe.image}" alt="" height="100%" width="100%" style="height: 90%;width: 90%;">`;
        newCol1.html(imagePathHTML);
        newRow.append(newCol1);
        var listHTML = generateListHTL(recipe.ingredients);
        newCol2.html(listHTML);
        newRow.append(newCol2);
        var costHTML = `<h1>${recipe.cost}</h1>`;
        newCol3.html(costHTML);
        newRow.append(newCol3);
        $(".container").append(newRow);
    }

});

function generateListHTL(ingreList){
    var listHTML = '<ul>';

    ingreList.forEach(ingre => {
        listHTML += ('<li>' + ingre + '</li>');
    });

    listHTML += '</ul>'
    console.log(listHTML);
    return listHTML;
}