$(document).ready(function() {
	$("button").button().removeClass("ui-corner-all").click(createNotes);
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
			data: {profiles: JSON.stringify(profiles)},
			success: function(data) {
				$('div.deployment-markup xmp').html(data);
				$('div.deployment-preview').html(data);
			}
		});
	}
};