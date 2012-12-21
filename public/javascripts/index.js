$(document).ready(function() {
	$(".create-notes-button").click(createNotes);
	$(".sortable").sortable();
	$(".sortable").disableSelection();
	$("input[type='checkbox'].profile-activator").click(function() {
		var checked = $(this).is(':checked');
		if (checked) {
			$(this).closest("li.profile").addClass("active");
		} else {
			$(this).closest("li.profile").removeClass("active");
		}
	});
});

var createNotes = function() {
	var profiles = [];

	var stgenv = $('.stage-env-select').val();

	$('.select-input').each(function() {
		var value = $(this).val();
		$(this).next('input[type=hidden]').val(value);
	});


	$('li.profile.active').each(function() {
		var profile = new Profile($(this).attr('id'));
		profiles.push(profile);
		$(this).find('p.parameters input').each(function() {
			var name = $(this).attr('name');
			var value = $(this).val();
			var param = new Param(name, value);
			profile.addParam(param);
		});
	});

	if (profiles) {
		$.ajax({
			type: 'POST',
			url: '/deploy',
			data: {profiles: JSON.stringify(profiles), stgenv: stgenv},
			success: function(data) {
				$('div.deployment-markup xmp').html(data);
				$('div.deployment-preview').html(data);
			}
		});
	}
};