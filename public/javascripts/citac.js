// Check where the script run
var host = "";

if( location.hostname == "localhost" ) { host = "http://localhost:65535"; }
else if( location.hostname == "vodovodbezdan.rs" ) { host = "http://vodovodbezdan.rs"; }
else if( location.hostname == "vodovodbezdan.a2hosted.com" ) { host = "http://vodovodbezdan.a2hosted.com"; }

$( document ).ready(function() {

  // Ulica search
  $('input.ulica').typeahead({
    name: 'ulica',
    remote: host + '/citac/index/Ulicasearch?key=%QUERY',
    limit: 10
  });
  
  // Naziv search
  $('input.naziv').typeahead({
    name: 'naziv',
    remote: host + '/citac/index/Nazivsearch?key=%QUERY',
    limit: 10
  });

  // Clear ulica field
  $("input.ulica").click(function() {
    $("input.ulica").val('');
    $("input.ulica").attr("placeholder", "");
  });

  // Clear naziv field
  $("input.naziv").click(function() {
    $("input.naziv").val('');
    $("input.naziv").attr("placeholder", "");
  });

  // Search komitenti
  $('.button').click(function() {
    $("#tableBody").empty();
    $(".pages").empty();

    // Table header clearing
    $(".tsifra").empty(); $(".tnaziv").empty(); $(".tadresa").empty(); $(".tmesto").empty(); $(".ttelefon").empty(); $(".tstanje").empty();

    // Adding table header titles
    $(".tsifra").append("Šifra"); $(".tnaziv").append("Naziv"); $(".tadresa").append("Adresa"); $(".tmesto").append("Mesto");
    $(".ttelefon").append("Telefon"); $(".tstanje").append("Stanje vodomera");

    var ulica = "";
    var naziv = "";
    var mesto = $("select.mesto").val();
    ulica = $("input.ulica").val();
    naziv = $("input.naziv").val();
    
    $.ajax({
      type: 'POST',
      url: host + '/citac/index',
      data: { pNumber: 1, mesto: mesto, ulica: ulica, naziv: naziv, orderBy: "adresa" },
      success: function(data) {
        if( data == "500" ) { swal("Greška!", "Komitent ne postoji!", "info"); }
        else {
          $(".cTable").css("display", "block");

          var arr = JSON.parse(data.komitent);
          
          // Adding arrows to table header
          if(data.orderBy == "adresa") { 
            $(".tsifra").append(" "); $(".tsifra").append("<i class='fa fa-angle-double-up fa-lg'></i> ");
            $(".tnaziv").append(" "); $(".tnaziv").append("<i class='fa fa-angle-double-up fa-lg'></i> ");
            $(".tadresa").append(" "); $(".tadresa").append("<i class='fa fa-angle-double-down fa-lg'></i> ");
            $(".tmesto").append(" "); $(".tmesto").append("<i class='fa fa-angle-double-up fa-lg'></i> ");
            $(".tstanje").append(" "); $(".tstanje").append("<i class='fa fa-angle-double-up fa-lg'></i> ");
          }
    
          $.each(arr, function (index, arr) {
            $("#citacTable tbody").append(
            "<tr>"
              +"<td>" + arr.sifra + "</td>"
              +"<td>" + arr.naziv + "</td>"
              +"<td>" + arr.adresa + "</td>"
              +"<td>" + arr.mesto + "</td>"
              +"<td>" + arr.tel + "</td>"
              +"<td>" +
                "<div class='row'>" +
                    "<div class='col-md-7'> <input class='form-control' type='Number' name='stanje' maxlength='10'/> </div>" +
                    "<div class='col-md-1'> <button class='btn btn-primary btn-lg' type='submit'> <font size='2'>Pošalji</font> </button> </div>" +
                "</row>" 
              + "</td>"
            +"</tr>" )
          });

          // Paginating
          if(data.pageNumber <= 10) { var pn = 1; } else { var pn = Math.ceil(data.pageNumber / 10); }
          if(data.os == 0) { var active = 1; } else { var active = (data.os / 10) + 1; }
          for(var i=1; i <= pn; i++) { 
            if(i == active){ $(".pages").append("<button style='font-size: 20px; color: #1f386e;' onClick='pagination("+ i +",\""+ mesto +"\",\""+ ulica +"\",\""+ naziv + "\")' class='bttn info' id='"+ i +"'>"+ i +"</button>"); }
            else { $(".pages").append("<button onClick='pagination("+ i +",\""+ mesto +"\",\""+ ulica +"\",\""+ naziv + "\")' class='bttn info' id='"+ i +"'>"+ i +"</button>"); }
          }
        }
      }
    }).fail(function(){ swal('Greška..', '', 'error'); }) 
  });

  // Search komitenti from ulica enter
  $("input.ulica").keyup(function(e){
    if (e.keyCode === 13) { 
      $("#tableBody").empty();
      $(".pages").empty();
      
      // Table header clearing
      $(".tsifra").empty(); $(".tnaziv").empty(); $(".tadresa").empty(); $(".tmesto").empty(); $(".ttelefon").empty(); $(".tstanje").empty();

      // Adding table header titles
      $(".tsifra").append("Šifra"); $(".tnaziv").append("Naziv"); $(".tadresa").append("Adresa"); $(".tmesto").append("Mesto");
      $(".ttelefon").append("Telefon"); $(".tstanje").append("Stanje vodomera");

      var ulica = "";
      var naziv = "";
      var mesto = $("select.mesto").val();
      ulica = $("input.ulica").val();
      naziv = $("input.naziv").val();
    
      $.ajax({
        type: 'POST',
        url: host + '/citac/index',
        data: { pNumber: 1, mesto: mesto, ulica: ulica, naziv: naziv, orderBy: "adresa" },
        success: function(data) {
          if( data == "500" ) { swal("Greška!", "Komitent ne postoji!", "info"); }
          else {
            $(".cTable").css("display", "block");

            if(data.orderBy == "adresa") { $(".adresa").append(" "); $(".adresa").append("<i class='fa fa-angle-double-down fa-lg'></i> "); }

            var arr = JSON.parse(data.komitent);

            // Adding arrows to table header
            if(data.orderBy == "adresa") { 
              $(".tsifra").append(" "); $(".tsifra").append("<i class='fa fa-angle-double-up fa-lg'></i> ");
              $(".tnaziv").append(" "); $(".tnaziv").append("<i class='fa fa-angle-double-up fa-lg'></i> ");
              $(".tadresa").append(" "); $(".tadresa").append("<i class='fa fa-angle-double-down fa-lg'></i> ");
              $(".tmesto").append(" "); $(".tmesto").append("<i class='fa fa-angle-double-up fa-lg'></i> ");
              $(".tstanje").append(" "); $(".tstanje").append("<i class='fa fa-angle-double-up fa-lg'></i> ");
            }

            $.each(arr, function (index, arr) {
                $("#citacTable tbody").append(
                "<tr>"
                  +"<td>" + arr.sifra + "</td>"
                  +"<td>" + arr.naziv + "</td>"
                  +"<td>" + arr.adresa + "</td>"
                  +"<td>" + arr.mesto + "</td>"
                  +"<td>" + arr.tel + "</td>"
                  +"<td>" +
                    "<div class='row'>" +
                        "<div class='col-md-7'> <input class='form-control' type='Number' name='stanje' maxlength='10'/> </div>" +
                        "<div class='col-md-1'> <button class='btn btn-primary btn-lg' type='submit'> <font size='2'>Pošalji</font> </button> </div>" +
                    "</row>" 
                  + "</td>"
                +"</tr>" )
            });

            // Paginating
            if(data.pageNumber <= 10) { var pn = 1; } else { var pn = Math.ceil(data.pageNumber / 10); }
            if(data.os == 0) { var active = 1; } else { var active = (data.os / 10) + 1; }
            for(var i=1; i <= pn; i++) { 
              if(i == active){ $(".pages").append("<button style='font-size: 20px; color: #1f386e;' onClick='pagination("+ i +",\""+ mesto +"\",\""+ ulica +"\",\""+ naziv + "\")' class='bttn info' id='"+ i +"'>"+ i +"</button>"); }
              else { $(".pages").append("<button onClick='pagination("+ i +",\""+ mesto +"\",\""+ ulica +"\",\""+ naziv + "\")' class='bttn info' id='"+ i +"'>"+ i +"</button>"); }
            }
          }
        }
      })
      .fail(function(){ swal('Greška..', '', 'error'); }) 
    }
  }); 
  
  // Search komitenti from naziv enter
  $("input.naziv").keyup(function(e){
    if (e.keyCode === 13) { 
      $("#tableBody").empty();
      $(".pages").empty();
      
      // Table header clearing
      $(".tsifra").empty(); $(".tnaziv").empty(); $(".tadresa").empty(); $(".tmesto").empty(); $(".ttelefon").empty(); $(".tstanje").empty();

      // Adding table header titles
      $(".tsifra").append("Šifra"); $(".tnaziv").append("Naziv"); $(".tadresa").append("Adresa"); $(".tmesto").append("Mesto");
      $(".ttelefon").append("Telefon"); $(".tstanje").append("Stanje vodomera");

      var ulica = "";
      var naziv = "";
      var mesto = $("select.mesto").val();
      ulica = $("input.ulica").val();
      naziv = $("input.naziv").val();
    
      $.ajax({
        type: 'POST',
        url: host + '/citac/index',
        data: { pNumber: 1, mesto: mesto, ulica: ulica, naziv: naziv, orderBy: "adresa" },
        success: function(data) {
          if( data == "500" ) { swal("Greška!", "Komitent ne postoji!", "info"); }
          else {
            $(".cTable").css("display", "block");

            if(data.orderBy == "adresa") { $(".adresa").append(" "); $(".adresa").append("<i class='fa fa-angle-double-down fa-lg'></i> "); }

            var arr = JSON.parse(data.komitent);

            // Adding arrows to table header
            if(data.orderBy == "adresa") { 
              $(".tsifra").append(" "); $(".tsifra").append("<i class='fa fa-angle-double-up fa-lg'></i> ");
              $(".tnaziv").append(" "); $(".tnaziv").append("<i class='fa fa-angle-double-up fa-lg'></i> ");
              $(".tadresa").append(" "); $(".tadresa").append("<i class='fa fa-angle-double-down fa-lg'></i> ");
              $(".tmesto").append(" "); $(".tmesto").append("<i class='fa fa-angle-double-up fa-lg'></i> ");
              $(".tstanje").append(" "); $(".tstanje").append("<i class='fa fa-angle-double-up fa-lg'></i> ");
            }

            $.each(arr, function (index, arr) {
                $("#citacTable tbody").append(
                "<tr>"
                  +"<td>" + arr.sifra + "</td>"
                  +"<td>" + arr.naziv + "</td>"
                  +"<td>" + arr.adresa + "</td>"
                  +"<td>" + arr.mesto + "</td>"
                  +"<td>" + arr.tel + "</td>"
                  +"<td>" +
                    "<div class='row'>" +
                        "<div class='col-md-7'> <input class='form-control' type='Number' name='stanje' maxlength='10'/> </div>" +
                        "<div class='col-md-1'> <button class='btn btn-primary btn-lg' type='submit'> <font size='2'>Pošalji</font> </button> </div>" +
                    "</row>" 
                  + "</td>"
                +"</tr>" )
            });

            // Paginating
            if(data.pageNumber <= 10) { var pn = 1; } else { var pn = Math.ceil(data.pageNumber / 10); }
            if(data.os == 0) { var active = 1; } else { var active = (data.os / 10) + 1; }
            for(var i=1; i <= pn; i++) { 
              if(i == active){ $(".pages").append("<button style='font-size: 20px; color: #1f386e;' onClick='pagination("+ i +",\""+ mesto +"\",\""+ ulica +"\",\""+ naziv + "\")' class='bttn info' id='"+ i +"'>"+ i +"</button>"); }
              else { $(".pages").append("<button onClick='pagination("+ i +",\""+ mesto +"\",\""+ ulica +"\",\""+ naziv + "\")' class='bttn info' id='"+ i +"'>"+ i +"</button>"); }
            }
          }
        }
      })
      .fail(function(){ swal('Greška..', '', 'error'); }) 
    }
  });  
  
});  

// FUNCTIONS

// Paginating
function pagination(page, mesto, ulica, naziv) {
  $("#tableBody").empty();
  $(".pages").empty();
  
  // Table header clearing
  $(".tsifra").empty(); $(".tnaziv").empty(); $(".tadresa").empty(); $(".tmesto").empty(); $(".ttelefon").empty(); $(".tstanje").empty();

  // Adding table header titles
  $(".tsifra").append("Šifra"); $(".tnaziv").append("Naziv"); $(".tadresa").append("Adresa"); $(".tmesto").append("Mesto");
  $(".ttelefon").append("Telefon"); $(".tstanje").append("Stanje vodomera");

  $.ajax({
    type: 'POST',
    url: host + '/citac/index',
    data: { pNumber: page, mesto: mesto, ulica: ulica, naziv: naziv, orderBy: "adresa" },
    success: function(data) {
      if( data == "500" ) { swal("Greška!", "Komitent ne postoji!", "info"); }
      else {
        $(".cTable").css("display", "block");

        if(data.orderBy == "adresa") { $(".adresa").append(" "); $(".adresa").append("<i class='fa fa-angle-double-down fa-lg'></i> "); }

        var arr = JSON.parse(data.komitent);

        // Adding arrows to table header
        if(data.orderBy == "adresa") { 
          $(".tsifra").append(" "); $(".tsifra").append("<i class='fa fa-angle-double-up fa-lg'></i> ");
          $(".tnaziv").append(" "); $(".tnaziv").append("<i class='fa fa-angle-double-up fa-lg'></i> ");
          $(".tadresa").append(" "); $(".tadresa").append("<i class='fa fa-angle-double-down fa-lg'></i> ");
          $(".tmesto").append(" "); $(".tmesto").append("<i class='fa fa-angle-double-up fa-lg'></i> ");
          $(".tstanje").append(" "); $(".tstanje").append("<i class='fa fa-angle-double-up fa-lg'></i> ");
        }

        $.each(arr, function (index, arr) {
            $("#citacTable tbody").append(
            "<tr>"
              +"<td>" + arr.sifra + "</td>"
              +"<td>" + arr.naziv + "</td>"
              +"<td>" + arr.adresa + "</td>"
              +"<td>" + arr.mesto + "</td>"
              +"<td>" + arr.tel + "</td>"
              +"<td>" +
                "<div class='row'>" +
                    "<div class='col-md-7'> <input class='form-control' type='Number' name='stanje' maxlength='10'/> </div>" +
                    "<div class='col-md-1'> <button class='btn btn-primary btn-lg' type='submit'> <font size='2'>Pošalji</font> </button> </div>" +
                "</row>" 
              + "</td>"
            +"</tr>" )
        });

        // Paginating
        if(data.pageNumber <= 10) { var pn = 1; } else { var pn = Math.ceil(data.pageNumber / 10); }
        if(data.os == 0) { var active = 1; } else { var active = (data.os / 10) + 1; }
        for(var i=1; i <= pn; i++) { 
          if(i == active){ $(".pages").append("<button style='font-size: 20px; color: #1f386e;' onClick='pagination("+ i +",\""+ mesto +"\",\""+ ulica +"\",\""+ naziv + "\")' class='bttn info' id='"+ i +"'>"+ i +"</button>"); }
          else { $(".pages").append("<button onClick='pagination("+ i +",\""+ mesto +"\",\""+ ulica +"\",\""+ naziv + "\")' class='bttn info' id='"+ i +"'>"+ i +"</button>"); }
        }
      }
    }
  })
  .fail(function(){ swal('Greška..', '', 'error'); }) 
}