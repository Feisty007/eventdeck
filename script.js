// Wait for the page to load before executing our code
$(document).ready(function() {
  $('#loader').hide('slow');

  // Initialize the month to the current month
  var currentMonth = new Date().getMonth() + 1;

  // const currentMonth = new Date().getMonth() + 1;
  document.getElementById("month-select").value = currentMonth;


  // Get the JWT from the API and store it in a variable
  $.ajax({
    url: 'https://api.arenaracingcompany.co.uk/auth',
    type: 'POST',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer 264c77f740cc1f02cac8f0a7e30ccdcd2f20dcf5');
    },
    success: function(response) {
      var jwt = response;
      // Load the events for the current month and display them on the page
      loadEvents(jwt, currentMonth);
      // When the user selects a different month, reload the events for that month
      $('#month-select').change(function() {
        $('#loader').show('slow');
        var month = $(this).val();
        setTimeout(function() {
          loadEvents(jwt, month);
        }, 2000);
      });
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    }
  });
});

function loadEvents(jwt, month) {

  // Get the events for the specified month from the API
  $.ajax({
    url: 'https://api.arenaracingcompany.co.uk/event/month/1318/' + month,
    type: 'GET',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + jwt);
    },

    // Loop through each event and append it to the container
    success: function(response) {
      console.log(response.length)
      if (response.length > 0) {
        $.each(response, function(index, event) {
          var id = event.id;
          var date = new Date(event.date).toLocaleDateString();
          var slug = event.slug;
          var title = event.title;
          var description = event.description;
          var images = event.images;
          var card = '<div class="col-lg-4 col-md-6 mb-5"><div class="card event-card p-2">';
          if (images) {
            card += '<div class="card-img"><img src="' + images.desktop + '" class="card-img-top" alt="' + slug + '"></div>';
          }
          card += '<div class="card-header"><h6>' + title + '</h6></div>'
          card += '<div class="card-body"><p>' + description + '</p></div>'
          card += '<div class="card-footer"><small class="text-muted">ID: ' + id + ' | Date: ' + date + '</small></div></div></div>';
          $('#events-container').append(card);
        });
      }
      // No Event Message
      else{
          $('#events-container').html('<div class="col-md-10 error-msg"><h5>Sorry!</h5><p>No events this month</p></div>');
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    }
  });


  // Clear any existing events from the container
  $('#events-container').empty();
  $('#loader').hide('slow');
}
