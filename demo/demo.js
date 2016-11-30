$(function () {

	$.ajaxSetup({
		cache: true
	});

	/**
	 * Generate CSS and HTML
	 */
	$.getJSON('/src/banks.json', function (json, textStatus) {
		var css = '';
		var classname;
		var prefix = 'thbanks-';
		var html = '';
		var count = 0;

		// Loop through JSON
		$.each(json.th, function (index, val) {
			count++;
			classname = prefix + index;
			html += '<i class="thbanks ' + classname + '" aria-hidden="true"></i>';
		});

		// Add CSS & HTML
		$('#demo').html(html);

		// Update count
		$('#count').text(count);

		// Add stylesheet URL for download
		$('#download_btn').attr('href', $('#stylesheet').attr('href'));

		// Update usage code
		$('#stylesheet_code code').text($('#stylesheet')[0].outerHTML);

		// Add code sample
		$('#demo').on('click', '.thbanks', function (event) {
			event.preventDefault();
			$('#code').val(this.outerHTML).focus().select();

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