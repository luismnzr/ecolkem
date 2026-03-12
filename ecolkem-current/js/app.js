$(function() {

    // Get the form.
    var form = $('#ajax-contact');

    // Get the messages div.
    var formMessages = $('#form-messages');

    // Set up an event listener for the contact form.
    $(form).submit(function(e) {
        // Stop the browser from submitting the form.
        e.preventDefault();

        // Serialize the form data.
        var formData = $(form).serialize();

        // Submit the form using AJAX.
        $.ajax({
            type: 'POST',
            url: $(form).attr('action'),
            data: formData
        })
		.done(function(response) {
		    // Make sure that the formMessages div has the 'success' class.
		    $(formMessages).removeClass('alert-danger');
		    $(formMessages).addClass('alert-success');
		    $(formMessages).removeClass('hidden');

		    // Set the message text.
		    $(formMessages).text(response);

		    // Clear the form.
		    //$('#name').val('');
		    $('#email').val('');
		    $('#message').val('');
		})
		.fail(function(data) {
		    // Make sure that the formMessages div has the 'error' class.
		    $(formMessages).removeClass('alert-success');
		    $(formMessages).addClass('alert-danger');
		    $(formMessages).removeClass('hidden');

		    // Set the message text.
		    if(data.responseText !== '') {
		        $(formMessages).text(data.responseText);
		    } else {
		        $(formMessages).text('Oops! Ocurrió un error y su mensaje no pudo ser enviado.');
		    }
		});
        $(form).addClass('hidden');
    });

});
