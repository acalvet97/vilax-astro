/**
 * Header de VILAX: mega menú (escritorio) y menú móvil por niveles.
 * Se carga con defer en el footer y está excluido de «Retrasar JavaScript» de WP Rocket.
 */
(function() {
	var h = document.querySelector('[data-vx-header]');
	if (!h) return;
	var t = h.querySelector('.vx-nav__toggle'),
		m = document.getElementById('vx-mega');
	if (t && m) {
		var li = t.parentNode,
			timer, fine = window.matchMedia('(hover:hover) and (pointer:fine)');
		var open = function() {
			clearTimeout(timer);
			if (!m.hidden) return;
			m.hidden = false;
			t.setAttribute('aria-expanded', 'true');
		};
		var close = function() {
			clearTimeout(timer);
			m.hidden = true;
			t.setAttribute('aria-expanded', 'false');
		};
		t.addEventListener('click', function() {
			m.hidden ? open() : close();
		});
		li.addEventListener('mouseenter', function() {
			if (fine.matches) open();
		});
		li.addEventListener('mouseleave', function() {
			if (fine.matches) timer = setTimeout(close, 200);
		});
		li.addEventListener('focusout', function(e) {
			if (!li.contains(e.relatedTarget)) close();
		});
		document.addEventListener('keydown', function(e) {
			if (e.key === 'Escape' && !m.hidden) {
				close();
				t.focus();
			}
		});
		document.addEventListener('click', function(e) {
			if (!m.hidden && !li.contains(e.target)) close();
		});
		var tabs = Array.prototype.slice.call(m.querySelectorAll('[role="tab"]'));
		var act = function(tab) {
			tabs.forEach(function(x) {
				var on = x === tab;
				x.setAttribute('aria-selected', on ? 'true' : 'false');
				x.tabIndex = on ? 0 : -1;
				document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
			});
		};
		tabs.forEach(function(tab, i) {
			tab.addEventListener('click', function() {
				act(tab);
			});
			tab.addEventListener('mouseenter', function() {
				if (fine.matches) act(tab);
			});
			tab.addEventListener('keydown', function(e) {
				var n = null;
				if (e.key === 'ArrowDown') n = tabs[(i + 1) % tabs.length];
				if (e.key === 'ArrowUp') n = tabs[(i - 1 + tabs.length) % tabs.length];
				if (n) {
					e.preventDefault();
					act(n);
					n.focus();
				}
			});
		});
	}
	var b = h.querySelector('.vx-burger'),
		d = document.getElementById('vx-drawer');
	if (b && d) {
		var back = d.querySelector('.vx-drawer__back'),
			x = d.querySelector('.vx-drawer__close'),
			stack = ['main'];
		var show = function(name) {
			Array.prototype.forEach.call(d.querySelectorAll('.vx-panel'), function(p) {
				p.classList.toggle('is-active', p.getAttribute('data-panel') === name);
			});
			back.hidden = stack.length < 2;
		};
		var openD = function() {
			stack = ['main'];
			show('main');
			d.hidden = false;
			b.setAttribute('aria-expanded', 'true');
			document.documentElement.classList.add('vx-lock');
			d.focus({
				preventScroll: true
			});
		};
		var closeD = function() {
			if (d.hidden) return;
			d.hidden = true;
			b.setAttribute('aria-expanded', 'false');
			document.documentElement.classList.remove('vx-lock');
		};
		b.addEventListener('click', function() {
			d.hidden ? openD() : closeD();
		});
		x.addEventListener('click', function() {
			closeD();
			b.focus({
				preventScroll: true
			});
		});
		back.addEventListener('click', function() {
			if (stack.length > 1) {
				stack.pop();
				show(stack[stack.length - 1]);
			}
		});
		d.addEventListener('click', function(e) {
			var n = e.target.closest('[data-target]');
			if (n) {
				stack.push(n.getAttribute('data-target'));
				show(stack[stack.length - 1]);
			}
		});
		document.addEventListener('click', function(e) {
			if (!d.hidden && !d.contains(e.target) && !b.contains(e.target)) closeD();
		});
		document.addEventListener('keydown', function(e) {
			if (e.key === 'Escape' && !d.hidden) closeD();
		});
	}
})();
