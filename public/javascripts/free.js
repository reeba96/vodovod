// Check where the script run
var host = "";

if( location.hostname == "localhost" ) { host = "http://localhost:65535"; }
else if( location.hostname == "vodovodbezdan.rs" ) { host = "http://vodovodbezdan.rs"; }
else if( location.hostname == "vodovodbezdan.a2hosted.com" ) { host = "http://vodovodbezdan.a2hosted.com"; }

$( document ).ready(function() {
  // Call carousel manually
  $('#myCarouselCustom').carousel();

  // Go to the previous item
  $("#prevBtn").click(function(){
    $("#myCarouselCustom").carousel("prev");
  });
  
  // Go to the previous item
  $("#nextBtn").click(function(){
    $("#myCarouselCustom").carousel("next");
  });

  // Registration
  $("#registrujButton").click(function() {
    
    var ime = $("input.ime").val();
    var email = $("input.email").val();
    var sifra = $("input.sifra").val();
    var lozinka1 = $("input.lozinka1").val();
    var lozinka2 = $("input.lozinka2").val();
    var telefon = $("input.telefon").val();

    if ( ime == "" ){
      $("input.ime").css("border-color", "red");
      $("#ime_feedback").text("Popunite polje!");
      return false;
    } else {
      $("input.ime").css("border-color", "green");
      $("#ime_feedback").text("");
      if ( email == "" ) {
        $("input.email").css("border-color", "red");
        $("#email_feedback").text("Popunite polje!");
        return false;
      } else {
        $("input.email").css("border-color", "green");
        $("#email_feedback").text("");
        if ( sifra == "") {
          $("input.sifra").css("border-color", "red");
          $("#sifra_feedback").text("Popunite polje!");
          return false;
        } else {
          $("input.sifra").css("border-color", "green");
          $("#sifra_feedback").text("");
          if ( lozinka1 == "") {
            $("input.lozinka1").css("border-color", "red");
            $("#lozinka1_feedback").text("Popunite polje!");
            return false;
          } else {
            $("input.lozinka1").css("border-color", "green");
            $("#lozinka1_feedback").text("");
            if ( lozinka2 == "") {
              $("input.lozinka2").css("border-color", "red");
              $("#lozinka2_feedback").text("Popunite polje!");
              return false;
            } else {
              $("input.lozinka2").css("border-color", "green");
              $("#lozinka2_feedback").text("");
              if ( lozinka1 != lozinka2) {
                $("input.lozinka1").css("border-color", "red");
                $("input.lozinka2").css("border-color", "red");
                $("#lozinka2_feedback").text("Lozinke nisu iste!");
                return false;
              } else {
                $("input.lozinka1").css("border-color", "green");
                $("input.lozinka2").css("border-color", "green");
                $("#lozinka_feedback").text("");
                $("#lozinka2_feedback").text("");
                if ( telefon == "") {
                  $("input.telefon").css("border-color", "red");
                  $("#telefon_feedback").text("Popunite polje!");
                  return false;
                } else {
                  $("input.telefon").css("border-color", "green");
                  $("#telefon_feedback").text("");

                  $.ajax({
                    type: 'POST',
                    url: host,
                    data: { 
                      ime: ime,
                      email: email, 
                      sifra: sifra,
                      lozinka1: lozinka1,
                      lozinka2: lozinka2,
                      telefon: telefon
                    },
                    success: function(data) {
                      if ( data == "400" ) { swal("Greška!", "Ne postoji ni jedan komitent!", "info"); }
                      else if ( data == "500" ) { swal("Greška!", "Poruka nije poslata!", "info"); }
                      else if ( data == "600" ) { 
                        $("input.ime").val('');
                        $("input.email").val('');
                        $("input.sifra").val('');
                        $("input.lozinka1").val('');
                        $("input.lozinka2").val('');
                        $("input.telefon").val('');

                        swal("Poruka poslata!", "Aktivirajte nalog preko poslatog emaila!", "success"); 
                      }
                      else if ( data == "700" ) { swal("Greška!", "Greška baze podataka! Pozovite administratora!", "info"); }
                      else {  swal("Greška!", data, "info"); }
                    }
                  })
                  .fail(function(){ swal('Greška..', '', 'error'); });
                }
              }
            }
          }
        }
      }
    }
  }); 

  // Kontak
  $("#kontaktButton").click(function() {
    var ime = $("input.ime").val();
    var email = $("input.email").val();
    var poruka = $("textarea.poruka").val();

    if ( ime == "" ){
      $("input.ime").css("border-color", "red");
      $("#ime_feedback").text("Popunite polje!");
      return false;
    } else {
      $("input.ime").css("border-color", "green");
      $("#ime_feedback").text("");
      if ( email == "" ) {
        $("input.email").css("border-color", "red");
        $("#email_feedback").text("Popunite polje!");
        return false;
      } else {
        $("input.email").css("border-color", "green");
        $("#email_feedback").text("");
        if ( poruka == "" ){
          $("textarea.poruka").css("border-color", "red");
          $("#poruka_feedback").text("Popunite polje!");
          return false;
        } else {
          $("textarea.poruka").css("border-color", "green");
          $("#poruka_feedback").text("");

          $.ajax({
            type: 'POST', 
            url: host + '/oNama',
            data: { 
              ime: ime,
              email: email, 
              poruka: poruka,
            },
            success: function(data) {
              if ( data == "600" ) { 
                $("input.ime").val('');
                $("input.email").val('');
                $("textarea.poruka").val('');
                
                swal("Poslata!", "Poruka je uspešno poslata!", "success"); 
              }
              else { swal("Greška!", fata, "info"); }
            }
          })
          .fail(function(){ swal('Greška..', '', 'error'); });
        }
      }
    }
  }); 

  // Login
  $("#loginButton").click(function() {
    var email = $("input.email").val();
    var password = $("input.password").val();
    
    if ( email == "" ){
      $("input.email").css("border-color", "red");
      $("#email_feedback").text("Popunite polje!");
      return false;
    } else {
      $("input.email").css("border-color", "green");
      $("#email_feedback").text("");
      if ( password == "" ) {
        $("input.password").css("border-color", "red");
        $("#password_feedback").text("Popunite polje!");
        return false;
      } else {
        $("input.password").css("border-color", "green");
        $("#password_feedback").text("");
      }
    }
  }); 

});