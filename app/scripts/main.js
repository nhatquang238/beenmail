'use strict';

(function ($) {
	var $controlButton = $('.control-btn');

	var deleteMail = function() {
		var $message = $(this).parents('.message');

		// fade the message out and move other messages up
		$message.animo({animation: 'fadeOut', duration: 0.3}, function () {
			$message.nextAll('.message').animo({animation: 'moveUp', duration: 0.3});
			$message.remove();
		});
	};

	var sendMail = function () {
		var $newMessage = $(this).parents('.new-message');

		// scale new message to the size of normal message and modify its look
		// move other messages up
		$newMessage.animo({animation: 'scaleDown'}, function () {
			var $message = $('.message');
			var messageVal = $('.message-content').val();

			$newMessage.removeClass('new-message');
			$newMessage.find('.message-content, .send-mail').remove();

			$newMessage.find('.content').append('<p>'+messageVal+'</p>');
			$newMessage.find('.content').after('<div class="mail-action"><span class="icon2-reply reply"></span><span class="icon2-reply-all reply-all"></span><span class="icon2-forward forward"></span></div>');

			$message.nextAll().animo({animation: 'moveUp', duration: 0.3});
		});
	};

	var replyMail = function () {
		// generate a list of receivers
		var receivers = [$(this).parents('.message').find('.sender').text()];
		if ($(this).attr('class').indexOf('reply-all') !== -1) {
			var temp = $(this).parents('.message').find('.receiver');
			for (var i = temp.length - 1; i >= 0; i--) {
				var current = $(temp[i]).text();
				if (current !== 'You') {
					receivers.push(current);
				}
			}
		}

		// Put receivers in to DOM
		var list = '<p><span class="sender">You</span> to  <% _.each(receivers, function (receiver) { %><span class="receiver"><%= receiver %></span> <%});%></p><span class="icon2-cross delete-message"></span>';
		var messageHead = _.template(list, {receivers: receivers});
		var newMail = '<div class="new-message message"><div class="mail-head">'+ messageHead + '</div><div class="content"><textarea class="message-content" name="" id="" cols="30" rows="6"></textarea></div><div class="send"><p class="btn btn-primary send-mail">Send</p></div></div>';

		// move existing messages down
		// then pop open the new message for writing
		$('.message').animo({animation: 'moveDown'}, function () {
			if ($('.new-message').length === 0) {
				$controlButton.after(newMail);
			}
			$('.new-message').animo({animation: 'scaleUp', duration: 0.3});
		});
	};

	var newMailTemplate = '<p>New Mail form to be placed here. Users can choose whom to send to.</p>';

	$('.new-mail, .forward').avgrund({
		showClose: true,
		template: newMailTemplate
	});

	// bind events
	$('.messages').on('click', '.reply, .reply-all' , replyMail);
	$('.messages').on('click', '.send-mail', sendMail);
	$('.messages').on('click', '.delete-message', deleteMail);
	// $('.messages').on('click', '.new-mail', newMail)
})(jQuery);