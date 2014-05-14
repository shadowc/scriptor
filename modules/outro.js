
	return Scriptor;
})(document);

if (!window.Scriptor)
    window.Scriptor = {};

Scriptor.mixin(window.Scriptor, window.__tmpScriptor);
delete window.__tmpScriptor;
