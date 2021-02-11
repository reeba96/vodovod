// Check where the script run
var host = "";

if( location.hostname == "localhost" ) { host = "http://localhost:65535"; }
else if( location.hostname == "vodovodbezdan.rs" ) { host = "http://vodovodbezdan.rs"; }
else if( location.hostname == "vodovodbezdan.a2hosted.com" ) { host = "http://vodovodbezdan.a2hosted.com"; }

$( document ).ready(function() {
  
  // Konto search
  $('input#konto').typeahead({
    name: 'konto',
    remote: host + '/knjigovodja/Kontosearch?key=%QUERY',
    limit: 5
  }); 

  // User data fill form on click
  $("#kontoButton").click(function() {
    var input = $("input.inputData").val();
    $("#tableBody").empty();

    if (input.length < 4) { swal("Greška!", "Unesite celo ime!", "error"); } 
    else if (/^\d+$/.test(input)) {
      var type = 1;
      $.ajax({
        type: 'POST',
        url: host + '/knjigovodja/index',
        data: { input: input, type: type },
        success: function(data) {
          if( data == "500" ) { swal("Greška!", "Konto ne postoji!", "error"); }
          else if (data == "400") { swal("Greška!", "Unesite celo ime!", "warning"); }
          else {
            $("input.ime").val(data.ime);
            $("input.sifra").val(data.sifra);
            $("input.mesto").val(data.mesto);
            $("input.adresa").val(data.adresa);
            $("input.konto").val(input);
            $("input.dug").val(data.dug);
  
            if ( data.ime != "Nepostoji" )  {
              var arr = JSON.parse(data.nalsta);
              $.each(arr, function (index, arr) {
                var vodomer = parseFloat(arr.sada) - parseFloat(arr.prethodno) - parseFloat(arr.subvencija);
                $("#location tbody").append(
                  "<tr>"
                      +"<td align='center'>" + arr.vrsta + "</td>"
                      +"<td align='center'>" + arr.nalog + "</td>"
                      +"<td align='center'>" + arr.racun + "</td>"
                      +"<td align='center'>" + arr.datum + "</td>"
                      +"<td align='center'>" + arr.knjizen + "</td>"
                      +"<td align='right'>" + arr.duguje + "</td>"
                      +"<td align='right'>" + arr.potrazuje + "</td>"
                      +"<td align='right'>" + arr.saldo + "</td>"
                      +"<td align='right'>" + arr.sada + " - " + arr.prethodno + " - " + arr.subvencija + " = " + vodomer + "</td>"
                      +"<td align='right'>" + arr.cena + "</td>"
                      +"<td align='right'>" + arr.trobracuna + "</td>"
                      +"<td align='right'>" + arr.pdvopsta + "</td>"
                      +"<td align='right'>" + arr.pdvposebna + "</td>"
                  +"</tr>" )
              });
  
              $("button#showKarticaButton").css("display", "block");
              $("input.ime").attr("class", "ime form-control");
              $("input.sifra").attr("class", "sifra form-control");
              $("input.mesto").attr("class", "mesto form-control");
              $("input.adresa").attr("class", "adresa form-control");
              $("input.konto").attr("class", "konto form-control");
            }
            else { 
              $("button#showKarticaButton").css("display", "none"); 
              $("input.ime").attr("class", "ime form-control is-invalid");
              $("input.sifra").attr("class", "sifra form-control is-invalid");
              $("input.mesto").attr("class", "mesto form-control is-invalid");
              $("input.adresa").attr("class", "adresa form-control is-invalid");
              $("input.konto").attr("class", "konto form-control is-invalid");
            }
          }
        }
      }).fail(function(){ swal('Greška..', '', 'error'); }) 

    } else {
      var type = 2;
      $.ajax({
        type: 'POST',
        url: host + '/knjigovodja/index',
        data: { input: input, type: type },
        success: function(data) {
          if( data == "500" ) { swal("Greška!", "Konto ne postoji!", "error"); }
          else {
            $("input.ime").val(data.ime);
            $("input.sifra").val(data.sifra);
            $("input.mesto").val(data.mesto);
            $("input.adresa").val(data.adresa);
            $("input.konto").val(data.konto);
            $("input.dug").val(data.dug);
  
            if ( data.ime != "Nepostoji" )  {
              var arr = JSON.parse(data.nalsta);
  
              $.each(arr, function (index, arr) {
                var vodomer = parseFloat(arr.sada) - parseFloat(arr.prethodno) - parseFloat(arr.subvencija);
                $("#location tbody").append(
                  "<tr>"
                      +"<td align='center'>" + arr.vrsta + "</td>"
                      +"<td align='center'>" + arr.nalog + "</td>"
                      +"<td align='center'>" + arr.racun + "</td>"
                      +"<td align='center'>" + arr.datum + "</td>"
                      +"<td align='center'>" + arr.knjizen + "</td>"
                      +"<td align='right'>" + arr.duguje + "</td>"
                      +"<td align='right'>" + arr.potrazuje + "</td>"
                      +"<td align='right'>" + arr.saldo + "</td>"
                      +"<td align='right'>" + arr.sada + " - " + arr.prethodno + " - " + arr.subvencija + " = " + vodomer + "</td>"
                      +"<td align='right'>" + arr.cena + "</td>"
                      +"<td align='right'>" + arr.trobracuna + "</td>"
                      +"<td align='right'>" + arr.pdvopsta + "</td>"
                      +"<td align='right'>" + arr.pdvposebna + "</td>"
                  +"</tr>" )
              });
  
              $("button#showKarticaButton").css("display", "block");
              $("input.ime").attr("class", "ime form-control");
              $("input.sifra").attr("class", "sifra form-control");
              $("input.mesto").attr("class", "mesto form-control");
              $("input.adresa").attr("class", "adresa form-control");
              $("input.konto").attr("class", "konto form-control");
            }
            else { 
              $("button#showKarticaButton").css("display", "none"); 
              $("input.ime").attr("class", "ime form-control is-invalid");
              $("input.sifra").attr("class", "sifra form-control is-invalid");
              $("input.mesto").attr("class", "mesto form-control is-invalid");
              $("input.adresa").attr("class", "adresa form-control is-invalid");
              $("input.konto").attr("class", "konto form-control is-invalid");
            }
          }
        }
      }).fail(function(){ swal('Greška..', '', 'error'); }) 
    }
  }); 

  // User datas fill form on enter
  $("input.inputData").keyup(function(e){
    if (e.keyCode === 13) { 
      var input = $("input.inputData").val();
      $("#tableBody").empty();
      
      if (input.length < 4) { swal("Greška!", "Unesite celo ime!", "error"); } 
      else if (/^\d+$/.test(input)) {
        var type = 1;
        $.ajax({
          type: 'POST',
          url: host + '/knjigovodja/index',
          data: { input: input, type: type },
          success: function(data) {
            if( data == "500" ) { swal("Greška!", "Konto ne postoji!", "error"); }
            else if (data == "400") { swal("Greška!", "Unesite celo ime!", "warning"); }
            else {
              $("input.ime").val(data.ime);
              $("input.sifra").val(data.sifra);
              $("input.mesto").val(data.mesto);
              $("input.adresa").val(data.adresa);
              $("input.konto").val(input);
              $("input.dug").val(data.dug);
    
              if ( data.ime != "Nepostoji" )  {
                var arr = JSON.parse(data.nalsta);
                
                $.each(arr, function (index, arr) {
                  var vodomer = parseFloat(arr.sada) - parseFloat(arr.prethodno) - parseFloat(arr.subvencija);
                  $("#location tbody").append(
                    "<tr>"
                        +"<td align='center'>" + arr.vrsta + "</td>"
                        +"<td align='center'>" + arr.nalog + "</td>"
                        +"<td align='center'>" + arr.racun + "</td>"
                        +"<td align='center'>" + arr.datum + "</td>"
                        +"<td align='center'>" + arr.knjizen + "</td>"
                        +"<td align='right'>" + arr.duguje + "</td>"
                        +"<td align='right'>" + arr.potrazuje + "</td>"
                        +"<td align='right'>" + arr.saldo + "</td>"
                        +"<td align='right'>" + arr.sada + " - " + arr.prethodno + " - " + arr.subvencija + " = " + vodomer + "</td>"
                        +"<td align='right'>" + arr.cena + "</td>"
                        +"<td align='right'>" + arr.trobracuna + "</td>"
                        +"<td align='right'>" + arr.pdvopsta + "</td>"
                        +"<td align='right'>" + arr.pdvposebna + "</td>"
                    +"</tr>" )
                });
    
                $("button#showKarticaButton").css("display", "block");
                $("input.ime").attr("class", "ime form-control");
                $("input.sifra").attr("class", "sifra form-control");
                $("input.mesto").attr("class", "mesto form-control");
                $("input.adresa").attr("class", "adresa form-control");
                $("input.konto").attr("class", "konto form-control");
              }
              else { 
                $("button#showKarticaButton").css("display", "none"); 
                $("input.ime").attr("class", "ime form-control is-invalid");
                $("input.sifra").attr("class", "sifra form-control is-invalid");
                $("input.mesto").attr("class", "mesto form-control is-invalid");
                $("input.adresa").attr("class", "adresa form-control is-invalid");
                $("input.konto").attr("class", "konto form-control is-invalid");
              }
            }
          }
        }).fail(function(){ swal('Greška..', '', 'error'); }) 
      }
      else {
        var type = 2;
        $.ajax({
          type: 'POST',
          url: host + '/knjigovodja/index',
          data: { input: input, type: type },
          success: function(data) {
            if( data == "500" ) { swal("Greška!", "Konto ne postoji!", "info"); }
            else {
              $("input.ime").val(data.ime);
              $("input.sifra").val(data.sifra);
              $("input.mesto").val(data.mesto);
              $("input.adresa").val(data.adresa);
              $("input.konto").val(data.konto);
              $("input.dug").val(data.dug);
    
              if ( data.ime != "Nepostoji" )  {
                var arr = JSON.parse(data.nalsta);
    
                $.each(arr, function (index, arr) {
                  var vodomer = parseFloat(arr.sada) - parseFloat(arr.prethodno) - parseFloat(arr.subvencija);
                  $("#location tbody").append(
                    "<tr>"
                        +"<td align='center'>" + arr.vrsta + "</td>"
                        +"<td align='center'>" + arr.nalog + "</td>"
                        +"<td align='center'>" + arr.racun + "</td>"
                        +"<td align='center'>" + arr.datum + "</td>"
                        +"<td align='center'>" + arr.knjizen + "</td>"
                        +"<td align='right'>" + arr.duguje + "</td>"
                        +"<td align='right'>" + arr.potrazuje + "</td>"
                        +"<td align='right'>" + arr.saldo + "</td>"
                        +"<td align='right'>" + arr.sada + " - " + arr.prethodno + " - " + arr.subvencija + " = " + vodomer + "</td>"
                        +"<td align='right'>" + arr.cena + "</td>"
                        +"<td align='right'>" + arr.trobracuna + "</td>"
                        +"<td align='right'>" + arr.pdvopsta + "</td>"
                        +"<td align='right'>" + arr.pdvposebna + "</td>"
                    +"</tr>" )
                });
    
                $("button#showKarticaButton").css("display", "block");
                $("input.ime").attr("class", "ime form-control");
                $("input.sifra").attr("class", "sifra form-control");
                $("input.mesto").attr("class", "mesto form-control");
                $("input.adresa").attr("class", "adresa form-control");
                $("input.konto").attr("class", "konto form-control");
              }
              else { 
                $("button#showKarticaButton").css("display", "none"); 
                $("input.ime").attr("class", "ime form-control is-invalid");
                $("input.sifra").attr("class", "sifra form-control is-invalid");
                $("input.mesto").attr("class", "mesto form-control is-invalid");
                $("input.adresa").attr("class", "adresa form-control is-invalid");
                $("input.konto").attr("class", "konto form-control is-invalid");
              }
            }
          }
        }).fail(function(){ swal('Greška..', '', 'error'); }) 
      }
    }
  });

  // Show kartica
  $("#showKarticaButton").click(function() {
    $(".kTable").css("display", "block");
  }); 

  // Clear konto field
  $("input#konto").click(function() {
    $("input#konto").val('');
    $("input#konto").attr("placeholder", "");
    $(".kTable").css("display", "none");
  });

  // Naziv validation
  $("#naziv").keyup(function() {
    if(validation_name($("#naziv").val()).code == 0) {
      $("#naziv").attr("class", "form-control is-invalid");
      $("#naziv_feedback").html(validation_name($("#naziv").val()).message);
    } else {
      $("#naziv").attr("class", "form-control is-valid");
      $("#naziv_feedback").html(validation_name($("#naziv").val()));
    }
  });

  // Proknjizi button
  $("#proknjiziButton").click(function() {
    if( $("input.dug").val() == "" ) { swal("Greška!", "Popunite dug polje!", "info"); }
    else if ( $("input.konto").val() == "") { swal("Greška!", "Popunite konto polje!", "info"); }
    else {
      var konto = $("input.konto").val();
      var dug = $("input.dug").val();
      var datum = $("input.datum").val();

      $.ajax({
        type: 'POST',
        url: host + '/knjigovodja/index/dug',
        data: { konto: konto, dug: dug, datum: datum },
        success: function(data) {
          if( data == "500" ) { swal("Uspešna uplata!", '', "success"); setTimeout(function(){ location.reload(); }, 1700); }
          else { swal('Greška!', data, 'error'); }
        }
      }).fail(function(){ swal('Greška..', '', 'error'); }) 
    }
  });

  $('#tip').on('change', function() {  
    var x = document.getElementById("hideJavnaNabavka");
    var y = document.getElementById("hideIzvestaj");
    var z = document.getElementById("hideOsnovniDokument");
    var v = document.getElementById("hideRadnaBiografija");

    if (this.value === 'Javna nabavka') { x.style.display = "block"; y.style.display = "none"; z.style.display = "none"; v.style.display = "none"; } 
    else if (this.value === 'Izveštaj') { x.style.display = "none"; y.style.display = "block"; z.style.display = "none"; v.style.display = "none"; }
    else if (this.value === 'Osnovni dokument') { x.style.display = "none"; y.style.display = "none"; z.style.display = "block"; v.style.display = "none"; }
    else if (this.value === 'Radna biografija') { x.style.display = "none"; y.style.display = "none"; z.style.display = "none"; v.style.display = "block"; }
    else { x.style.display = "none"; y.style.display = "none"; z.style.display = "none"; v.style.display = "none"; }
  });

});

// FUNCTIONS

// Validation for Ulica and Naziv
function validation_name (val) {
  if (val.length < 2) { return {"code":0, "message":"The name is too short."}; }
  if (!val.match("^[a-zA-Z\- ]+$")) { return {"code":0, "message":"The name use non-alphabetics chars."}; }
  return {"code": 1};
}

// Hide javne nabavke list
function hideJavneNabavke() {
  var x = document.getElementById("hideDivJavneNabavke");
  if (x.style.display === "none") { x.style.display = "block"; }  
  else { x.style.display = "none"; }
}

// Archive vesti
function archiveVesti(hint) {
  $.ajax({
    type: 'POST',
    url: host + '/knjigovodja/vestiBrisanje/arhiv',
    data: { hint: hint },
    success: function(data) {
      if( data == "500" ) { swal("Uspešna promena!", '', "success"); setTimeout(function(){ location.reload(); }, 1700); }
      else { swal('Greška!', data, 'error'); }
    }
  }).fail(function(){ swal('Greška..', '', 'error'); }) 
}

// Delete vesti
function deleteVesti(hint) {
  $.ajax({
    type: 'POST',
    url: host + '/knjigovodja/vestiBrisanje/delete',
    data: { hint: hint },
    success: function(data) {
      if( data == "500" ) { swal("Uspešno brisanje!", '', "success"); setTimeout(function(){ location.reload(); }, 1700); }
      else { swal('Greška!', data, 'error'); }
    }
  }).fail(function(){ swal('Greška..', '', 'error'); }) 
}