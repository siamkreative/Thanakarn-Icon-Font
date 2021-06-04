$(function () {

	$.ajaxSetup({
		cache: true
	});

	/**
	 * Generate CSS and HTML
	 */
	$.getJSON('/banks.json', function (json, textStatus) {
		var css = '';
		var classname;
		var prefix = 'thbanks-';
		var html = '';
		var count = 0;

		// Loop through JSON
		$.each(json.th, function (index, val) {
			count++;
			classname = prefix + index;
			html += '<li class="hint--top" aria-label="' + val.nice_name + '"><i class="thbanks ' + classname + '" aria-hidden="true"></i></li>';
		});

		// Add CSS & HTML
		$('#demo').html(html);

		// Update count
		$('#count').text(count);

		// Add code sample
		$('#demo').on('click', '.thbanks', function (event) {
			event.preventDefault();
			$('#code').val(this.outerHTML).focus().select();
			$(this).parent('li').addClass('active').siblings().removeClass('active');

			// Copy to clipboard
			try {
				var successful = document.execCommand('copy');
				$('#status').addClass('success');
				setTimeout(function () {
					$('#status').removeClass('success');
				}, 1500);
			} catch (err) {
				console.log('Oops, unable to copy');
			}
		});
	});
});
