// Check where the script run
var host = "";

if( location.hostname == "localhost" ) { host = "http://localhost:65535"; }
else if( location.hostname == "vodovodbezdan.rs" ) { host = "http://vodovodbezdan.rs"; }
else if( location.hostname == "vodovodbezdan.a2hosted.com" ) { host = "http://vodovodbezdan.a2hosted.com"; }

$( document ).ready(function() {

    // Add message
    $( "#addButton" ).button().on( "click", function() { 
      swal({
        title: "Detalji poruke",
        text: "",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#0097CF",
        confirmButtonText: "Sačuvaj",
        cancelButtonText: "Izađi",
        showLoaderOnConfirm: true,
        html: '<center><table>' +
          '<tr> <td> <input class="form-control", id="lang_id", placeholder="LANG_ID", maxlength="3"></td> </tr>' + 
          '<tr> <td> <input class="form-control", id="help_id", placeholder="HELP_ID", maxlength="25"></td> </tr>' +
          '<tr> <td> <input class="form-control", id="hint", placeholder="HINT", maxlength="200"></td> </tr>' +
          '<tr> <td> <input class="form-control", id="description", placeholder="DESCRIPTION"></td> </tr>' +
        '</table></center>',
            
        preConfirm: function() {
          return new Promise(function(resolve) {
            if($("#hint").val() == "") { swal('Greška!', 'HINT polja je obavezna!', 'error'); }
            else {
              $.ajax({
                url: host + '/admin/poruke/addPoruka',
                type: 'POST',
                dataType: 'json',
                data: { lang_id: $("#lang_id").val(), help_id: $("#help_id").val(), hint: $("#hint").val(), description: $("#description").val() },
                success: function(data){
                  if(data == "100"){ setTimeout(function(){ swal('Uspešna modifikacija!', '', 'success'); location.reload(); }); }
                  else { swal('Greška!', data, 'error'); }
                }
              }).fail(function(){ swal('Greška..', '', 'error'); }) 
            }
          });
        },
        allowOutsideClick: false	
      }).catch(swal.noop);
    });

    // IMPORTS

    // Import nalsta.csv
    $('#submitImport1').click(function() { 
      $.ajax({
        type: 'POST',
        url: host + '/admin/backup/importNalsta',
        success: function(data) { if( data == 100) { swal("Podaci brisani i tabela uspešno učitana!", "", "success"); } else { swal('Greška: ', data, 'error'); } }
      }).fail(function(){ swal('Greška!', data, 'error'); }) 
    });

    // Import nsnalsta.csv
    $('#submitImport2').click(function() { 
      $.ajax({
        type: 'POST',
        url: host + '/admin/backup/importNsNalsta',
        success: function(data) { if( data == 100) { swal("Podaci brisani i tabela uspešno učitana!", "", "success"); } else { swal('Greška: ', data, 'error'); } }
      }).fail(function(){ swal('Greška!', data, 'error'); }) 
    });

    // Import komitent.csv
    $('#submitImport3').click(function() { 
      $.ajax({
        type: 'POST',
        url: host + '/admin/backup/importKomitent',
        success: function(data) { if( data == 100) { swal("Podaci brisani i tabela uspešno učitana!", "", "success"); } else { swal('Greška: ', data, 'error'); } }
      }).fail(function(){ swal('Greška!', data, 'error'); }) 
    });

    // Import konto.csv
    $('#submitImport4').click(function() { 
      $.ajax({
        type: 'POST',
        url: host + '/admin/backup/importKonto',
        success: function(data) { if( data == 100) { swal("Podaci brisani i tabela uspešno učitana!", "", "success"); } else { swal('Greška: ', data, 'error'); } }
      }).fail(function(){ swal('Greška!', data, 'error'); }) 
    });

});