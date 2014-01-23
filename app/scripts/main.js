'use strict';

(function ($) {
	var $controlButton = $('.control-btn');

	var	deleteAllMessages = function () {
		$('.message').animo({animation: 'fadeOut', duration: 0.3}, function () {
			$('.message').remove();
		});
	};

	var deleteMail = function() {
		var parent;
		var $this = $(this);
		console.log($this);
		if ($this.attr('class').indexOf('delete-message') !== -1) {
			parent = '.message';
		} else if ($this.attr('class').indexOf('delete-conversation') !== -1) {
			parent = '.message-preview';
			deleteAllMessages();
		}
		var $parents = $this.parents(parent);
		// fade the message out and move other messages up
		$parents.animo({animation: 'fadeOut', duration: 0.3}, function () {
			$parents.nextAll(parent).animo({animation: 'moveUp', duration: 0.3});
			$parents.remove();
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

	// update read status behavior when clicked on conversations
	var changePreview = function (e) {
		$('.message-preview').removeClass('active');
		var $this = $(this);
		$this.addClass('active');
		if ($this.attr('class').indexOf('new') !== -1) {
			$this.removeClass('new');
		}
		$this = null;
	};

	// update stage when choosing a person to talk
	var choosePerson = function () {
		var $this = $(this);
		if ($this.hasClass('active')) {
			$this.removeClass('active');
		} else {
			$this.addClass('active');
		}
		$this = null;
	}

	var newMailTemplate = _.template($('#new-mail-template').html());

	// change view to new email form view
	var createNewMail = function () {
		$('.preview').animo({animation: 'fadeOutLeft', duration: 0.3}, function () {
			$('.preview').addClass('hide');
		});
		$('.messages').animo({animation: 'fadeOutRight', duration: 0.3}, function () {
			$('.messages').addClass('hide');
		});

		_.delay(function () {
			$('.beenmail').prepend(newMailTemplate);
			$('.new-email-form').animo({animation: 'bounceInUp', duration: 0.5})
		}, 300);
	}

	// get receivers, change back to normal conversation view and initiate a blank message
	var startConversation = function () {
		// get receivers
		var receivers = [];
		$('.people .active figcaption').each(function () {
			receivers.push($(this).text());
		});

		// Only use 1st name
		// for (var i = receivers.length - 1; i >= 0; i--) {
		// 	receivers[i] = receivers[i].split(' ')[0];
		// };

		// bounce new email form out
		$('.new-email-form').animo({animation: 'bounceOutDown', duration: 0.5}, function () {
			$('.new-email-form').remove();
		});

		// return to normal conversation view
		_.delay(function () {
			var messagePreviewTemplate = _.template($('#message-preview-template').html());
			$('.message-preview').removeClass('active');
			$('.search-mail').after(messagePreviewTemplate({receivers: receivers}));

			var list = '<p><span class="sender">You</span> to  <% _.each(receivers, function (receiver) { %><span class="receiver"><%= receiver %></span> <%});%></p><span class="icon2-cross delete-message"></span>';
			var messageHead = _.template(list, {receivers: receivers});
			var newMail = '<div class="new-message message"><div class="mail-head">'+ messageHead + '</div><div class="content"><textarea class="message-content" name="" id="" cols="30" rows="6"></textarea></div><div class="send"><p class="btn btn-primary send-mail">Send</p></div></div>';

			$('.message').addClass('hide');
			$('.control-btn').after(newMail);

			$('.preview').removeClass('hide');
			$('.messages').removeClass('hide');
			$('.preview').animo({animation: 'fadeInLeft', duration: 0.3});
			$('.messages').animo({animation: 'fadeInRight', duration: 0.3});

			receivers = null;
		}, 500);
	}

	// bind events
	$('.messages').on('click', '.reply, .reply-all' , replyMail);
	$('.messages').on('click', '.send-mail', sendMail);
	$('.messages').on('click', '.delete-message', deleteMail);
	$('.preview').on('click', '.delete-conversation', deleteMail);
	$('.beenmail').on('click', 'figure', choosePerson);
	$('.messages').on('click', '.new-mail', createNewMail);
	$('.beenmail').on('click', '.start-conversation', startConversation);
	$('.preview').on('click', '.message-preview', changePreview);
})(jQuery);