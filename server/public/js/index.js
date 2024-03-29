/**
 * Created by jadac_000 on 13/02/2017.
 */
 const {ipcRenderer} = require('electron')

var movies = [];
var page = 1;
var address = "http://localhost:8888";
// var address = "http://jacopo.westeurope.cloudapp.azure.com:8888";

$.getJSON(address+"/movies/" + page, function (data) {
    var items = [];
    movies = data.results;
    page++;
    var i = 0;
    $.each(data.results, function (key, val) {
        items.push("<div class='wrapperImage  col-sm-3 col-md-3 col-lg-2'  id='i" + key + "' > <a class='link' href='"+address+"/movie_info/" + val.id + "'> <img width='190' height='280'  src='http://image.tmdb.org/t/p/w185//" + val.poster_path + "' class='image'> </a> <h2 class='title' width='150'> <a href=''>" + setTitle(val.title) + "</a> <h2 class='rate'>" + val.vote_average + "</h2> </h2></div>");
    });
    $("<div>", {
        "class": "row",
        html: items.join("")
    }).appendTo(".box");
    $(window).scroll(load);

});

$.getJSON(address+"/genres", function (data) {
    var items = [];
    $.each(data.genres, function (key, val) {
        items.push("<li> <a id = '" + val.id + "' onClick = 'filter(this.id);'>" + val.name + " </a></li>");
    });
    $("#genres").append(items.join(""));
});

function filter(g) {
    console.log(g);
    $.getJSON(address+"/movies/1?g=" + g, function (data) {
        page = 0;
        var items = [];
        movies = data.results;
        var i = 0;
        $.each(data.results, function (key, val) {
            items.push("<div class='wrapperImage  col-sm-3 col-md-3 col-lg-2'  id='i" + key + "' > <a class='link' href='"+address+"/movie_info/" + val.id + "'> <img width='190' height='280'  src='http://image.tmdb.org/t/p/w185//" + val.poster_path + "' class='image'> </a> <h2 class='title' width='150'> <a href=''>" + setTitle(val.title) + "</a> <h2 class='rate'>" + val.vote_average + "</h2> </h2></div>");
        });
        $(".row").remove();
        $("<div>", {
            "class": "row",
            html: items.join("")
        }).appendTo(".box");
        $(window).scroll(load);
    });
}
function setTitle(title) {
    if (title.length > 20) {
        title = title.substring(0, 20) + "...";
    }
    return title
}


function load() {
    // console.log('load');
    if ($(window).scrollTop() + $(window).height() > $(document).height() - 300) {
        $(window).unbind('scroll');
        // console.log("near bottom!");
        // console.log(movies.length);
        $.getJSON(address+"/movies/" + page, function (data) {
            // console.log("data");
            var items = [];
            var i = movies.length;
            movies = movies.concat(data.results);
            page++;
            $.each(data.results, function (key, val) {
                items.push("<div class='wrapperImage  col-sm-3 col-md-3 col-lg-2'  id='i" + (key+i) + "' > <a class='link' href='"+address+"/movie_info/" + val.id + "'> <img width='190' height='280'  src='http://image.tmdb.org/t/p/w185//" + val.poster_path + "' class='image'> </a> <h2 class='title' width='150'> <a href=''>" + setTitle(val.title) + "</a> <h2 class='rate'>" + val.vote_average + "</h2> </h2></div>");
            });
            $('.row').append(items.join(""));
            $(window).scroll(load);
            // console.log("movies.length ", movies.length)

        });


    }
}



var screenWidht = 6;
var selected = null;
var drop = false;

ipcRenderer.on('info' , function(event , data){
  console.log(data.key)
  if (selected == null) {
   $("#0").children().children(".image").addClass("imageSelected");
         selected = 0;
         return;
  }
  if(data.key=='left' && selected>0){
    if (selected >= 0) $("#" + selected).children().children(".image").removeClass("imageSelected");
    else $("#" + selected).removeClass("linkSelected");
    selected--;
    $("#" + selected).children().children(".image").addClass("imageSelected");
    var center = ($(window).height() / 2) - 200;
    var top = $("#" + selected).offset().top;
    if (top > center) {
        $(window).scrollTop(top - center);
    }
    else {
        location.href = "#";
    }
  }

  if(data.key=='right' && selected < $(".row").children().length - 1){
    if (selected >= 0) $("#" + selected).children().children(".image").removeClass("imageSelected");
    else $("#" + selected).removeClass("linkSelected");
    selected++;
    if (selected >= 0) $("#" + selected).children().children(".image").addClass("imageSelected");
    else $("#" + selected).addClass("linkSelected");
    var center = ($(window).height() / 2) - 200;
    var top = $("#" + selected).offset().top;
    if (top > center) {
        $(window).scrollTop(top - center);
    }
    else {
        location.href = "#";
    }
  }

  if (data.key=='up' && selected < screenWidht) {
      //navbar
      if (selected >= 0) {
          $("#" + selected).children().children(".image").removeClass("imageSelected");
          selected = -1;
          $("#" + selected).addClass("linkSelected");
      }
   else {
      $("#" + selected).children().children(".image").removeClass("imageSelected");
      selected = selected - screenWidht;
      $("#" + selected).children().children(".image").addClass("imageSelected");
      var center = ($(window).height() / 2) - 200;
      var top = $("#" + selected).offset().top;
      if (top > center) {
          $(window).scrollTop(top - center);
      }
      else {
          location.href = "#";
      }
    }
  }

  if(data.key=='down' ){
  $("#" + selected).children().children(".image").removeClass("imageSelected");
      if (selected + screenWidht < $(".row").children().length - 1) {
          if (selected < 0) {
              $("#" + selected).removeClass("linkSelected");
              selected = 0;
              $("#" + selected).children().children(".image").addClass("imageSelected");
          }
          else {
              selected = selected + screenWidht;
              $("#" + selected).children().children(".image").addClass("imageSelected");
              // location.href = "#";
              // location.href = "#"+selected;
              var center = ($(window).height() / 2) - 200;
              var top = $("#" + selected).offset().top;
              if (top > center) {
                  $(window).scrollTop(top - center);
              }
          }
      }
      else {
          selected = $(".row").children().length - 1;
          $("#" + selected).children().children(".image").addClass("imageSelected");
          var center = ($(window).height() / 2) - 200;
          var top = $("#" + selected).offset().top;
          if (top > center) {
              $(window).scrollTop(top - center);
          }
      }
    }



    if(data.key=='enter' ){
		console.log('ok');
      $("#" + selected)[0].click();

    }


});


function goto(s){
  var center = ($(window).height() / 2) - 200;
  var top = $("#i" + s).offset().top;
  if (top > center) {
      // $(window).scrollTop(top - center);
      location.href = "#i" + s;

  }
  else {
      location.href = "#";
  }
}

document.onkeydown = function (evt) {
    screenWidht = Math.floor($(window).width() / 200);
    evt = evt || window.event;
    if (selected == null) {
        $("#i0").children().children(".image").addClass("imageSelected");
        selected = 0;
        return;
    }
    // if (evt.keyCode == 13) {
    //     if (selected >= 0) $("#" + selected).children()[0].click();
    //     else {
    //         $("#" + selected)[0].click();
    //         drop = true;
    //     }
    //     return;
    // }
console.log(evt.keyCode);
    switch (evt.keyCode) {
        case 65: //left
            if (selected > 0) {
              console.log("left");
                $("#i" + selected).children().children(".image").removeClass("imageSelected");
                selected--;
                console.log(selected);
                $("#i" + selected).children().children(".image").addClass("imageSelected");
                goto(selected);
            }
            break;

        case 87: //up
            if (selected >= screenWidht) {
              console.log("up");
                $("#i" + selected).children().children(".image").removeClass("imageSelected");
                selected = selected - screenWidht;
                console.log(selected);
                $("#i" + selected).children().children(".image").addClass("imageSelected");
                goto(selected)
            }
            break;

        case 68: //right
            if (selected < $(".row").children().length - 1) {
              console.log($(".row").children().length - 1);
              console.log("right");
              $("#i" + selected).children().children(".image").removeClass("imageSelected");
              selected++;
              console.log(selected);
                console.log( $("#"+selected) );
              $("#i" + selected).children().children(".image").addClass("imageSelected");
              goto(selected);
            }
            break;

        case 83: //down
            if (selected + screenWidht < $(".row").children().length - 1) {
              console.log("down1");
              $("#i" + selected).children().children(".image").removeClass("imageSelected");
              selected = selected + screenWidht;
              $("#i" + selected).children().children(".image").addClass("imageSelected");
              goto(selected)
              console.log(selected);
            }
            else {
              // console.log("down2");
              //   $("#" + selected).children().children(".image").removeClass("imageSelected");
              //   selected = $(".row").children().length - 1;
              //   $("#" + selected).children().children(".image").addClass("imageSelected");
              //   goto(selected)
            }

            break;
    }

}
