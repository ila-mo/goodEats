$(document).on('click','#submitBtn',function(){
    var query = $('#inputQuery').val();
    localStorage.setItem('dishQuery', query);
    location.href = 'index2.html';
});