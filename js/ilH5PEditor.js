(function ($) {
	H5PEditor.init = function () {
		H5PEditor.$ = H5P.jQuery;

		H5PEditor.apiVersion = H5PIntegration.editor.apiVersion;

		H5PEditor.baseUrl = "";
		H5PEditor.basePath = H5PIntegration.editor.libraryUrl;
		H5PEditor.fileIcon = H5PIntegration.editor.fileIcon;
		H5PEditor.ajaxPath = H5PIntegration.editor.ajaxPath;
		H5PEditor.filesPath = H5PIntegration.editor.filesPath;

		H5PEditor.copyrightSemantics = H5PIntegration.editor.copyrightSemantics;

		H5PEditor.assets = H5PIntegration.editor.assets;

		H5PEditor.contentId = H5PIntegration.editor.contentId;

		var $library = $('input[name="xhfp_library"]');
		var $params = $('input[name="xhfp_params"]');
		var $editor = $("#xhfp_editor");
		var $form = $("#form_xhfp_edit_form");

		var library = $library.val();
		var params = $params.val();

		// prevent remove id edtor
		var $tmp = $("<div></div>").appendTo($editor);

		var h5peditor = new ns.Editor(library, params, $tmp);

		var $frame = $("iframe", $editor);
		var frame = $frame[0];

		// TODO Show tutorial and example button
		if (library !== "") {
			// Library already selected
			$frame.on("load", function () {
				var frameWindow = frame.contentWindow;

				var appendTo = frameWindow.H5PEditor.LibrarySelector.prototype.appendTo;
				frameWindow.H5PEditor.LibrarySelector.prototype.appendTo = function () {
					// Original appendTo()
					appendTo.apply(this, arguments);

					// Force disable selector
					var attr = this.$selector.attr;
					this.$selector.attr = function (name) {
						if (name === "disabled") {
							attr.call(this, "disabled", true);
						} else {
							// Original attr()
							attr.apply(this, arguments);
						}
					}
				}
			});
		}

		$form.submit(function () {
			var $button = $form.find('input[type="submit"]:focus, input[type="SUBMIT"]:focus');

			// Only submit button, no cancel button
			if ($button.attr("id") === "xhfp_edit_form_submit" || $button.attr("id") === "xhfp_edit_form_submit_top") {
				var library = h5peditor.getLibrary();
				var params = h5peditor.getParams();

				// Prevent submit when errors
				var errors = $(".h5p-errors", frame.contentDocument).filter(function (i, el) {
					return ($(el).html() !== "");
				});
				if (errors.length > 0) {
					// Scroll to error message
					$("html").scrollTop($(errors[0]).offset().top);

					return false;
				}

				if (typeof library === "string" && library !== "" && library !== "-" && typeof params === "object") {
					$library.val(library);

					$params.val(JSON.stringify(params));
				}
			}

			return true;
		});
	};

	H5PEditor.getAjaxUrl = function (action, parameters) {
		var url = H5PIntegration.editor.ajaxPath + action;

		if (parameters !== undefined) {
			for (var property in parameters) {
				if (parameters.hasOwnProperty(property)) {
					url += "&" + property + "=" + parameters[property];
				}
			}
		}

		return url;
	};

	$(document).ready(H5PEditor.init);
})(H5P.jQuery);