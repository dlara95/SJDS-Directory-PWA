

if (!('fetch' in window)) {
    console.log('Fetch API not found, try including the polyfill');
}



fetch('https://sjdsdirectoryapp.senorcoders.com/sjdsdirectory-new/wp-json/wp/v2/types')
    .then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response.json();
    })
    .then(function(responseAsJson) {
        console.log(responseAsJson);
        $.each(responseAsJson, function(i, post) {
            $('ul#monsters-list').append('<li style="background: url(img/icon-196.png);     background-repeat: no-repeat; background-size: contain;" id="' + responseAsJson[i].slug + '"><button type="button" class="monster-sprite sprite-' + responseAsJson[i].slug + '"></button><span>' + responseAsJson[i].name + '</span></li>');
            console.log(responseAsJson[i].name);
        });

    })
    .catch(function(error) {
        console.log('Looks like there was a problem: \n', error);
    });

$(document).on('click', '#monsters-list li', function() {
    $('#detail-view-container').removeClass('hidden');
    $('.mui-panel.detail-panel > h1').html('Latest ' + this.id + ' in town');
    $('#detail-view-container ul#product-list').empty();

    fetch('https://sjdsdirectoryapp.senorcoders.com/sjdsdirectory-new/wp-json/wp/v2/' + this.id + '?per_page=12')
        .then(function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(function(categories) {
            console.log(categories);
            $.each(categories, function(i, post) {
                $('#detail-view-container ul#product-list').append('<li style="background: url(' + post.post_meta_fields['listing_featured_image'] + ');     background-repeat: no-repeat; background-size: cover; backgorund-position: center;"  id="' + post.id + '" type="' + post.type + '"><button type="button" class="monster-sprite sprite-' + post.id + '"></button><span>' + post.title['rendered'] + '</span></li>');
            });

        })
        .catch(function(error) {
            console.log('Looks like there was a problem: \n', error);
        });
});


$(document).on('click', '#product-list li', function() {
    $('#detail-view-container').removeClass('hidden');
    $('.detail-header').removeClass('hidden');
    $('.detail-below-header').removeClass('hidden');
    $('#product-list').addClass('hidden');
    $('#contact-box').empty();

    $.getJSON('https://sjdsdirectoryapp.senorcoders.com/sjdsdirectory-new/wp-json/wp/v2/' + this.type + '/' + this.id, function(data) {



        $('.mui-panel.detail-panel > h1').html(data.title['rendered']);
        $('.detail-national-id > span').html('#' + data.id);
        $('.monster-species').html(data.title);
        $('.monster-description').html(data.content['rendered']);
        $('#products-box').html(data.post_meta_fields['products']);
        $('#contact-box').append('<div><strong>Phone: </strong> <span>' + data.post_meta_fields['listing_phone'] + '</span><br></div>');
        $('#contact-box').append('<strong>Email: </strong> <span>' + data.post_meta_fields['listing_email'] + '</span><br>');
        $('#contact-box').append('<strong>Address: </strong> <span>' + data.post_meta_fields['listing_address'] + '</span><br>');
        $('#contact-box').append('<strong>Website: </strong> <span>' + data.post_meta_fields['listing_website'] + '</span><br>');
        $('#contact-box').append('<strong>Facebook: </strong> <span><a href="' + data.post_meta_fields['listing_facebook'] + '">FB</a></span><br>');


    });


});

$(document).on('click', '.detail-back-button', function() {
    $('#detail-view-container').addClass('hidden');
    $('.detail-header').addClass('hidden');
    $('.detail-below-header').addClass('hidden');
    $('#product-list').removeClass('hidden');

});


function search() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("monsters-search-bar");
    filter = input.value.toUpperCase();
    ul = document.getElementById("monsters-list");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("span")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";

        }
    }
}
