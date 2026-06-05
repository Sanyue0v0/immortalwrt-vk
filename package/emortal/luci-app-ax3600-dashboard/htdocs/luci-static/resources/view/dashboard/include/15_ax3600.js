'use strict';
'require baseclass';
'require fs';
'require rpc';

var callSystemBoard = rpc.declare({
	object: 'system',
	method: 'board'
});

var callDeviceStatus = rpc.declare({
	object: 'network.device',
	method: 'status',
	params: [ 'name' ]
});

if (!document.querySelector('link[data-ax3600-dashboard]')) {
	document.querySelector('head').appendChild(E('link', {
		'rel': 'stylesheet',
		'type': 'text/css',
		'href': L.resource('view/dashboard/css/ax3600.css'),
		'data-ax3600-dashboard': '1'
	}));
}

function isAx3600(board) {
	var model = String(board.model || '');
	var compat = board.compatible || [];

	if (!Array.isArray(compat))
		compat = [ compat ];

	return /AX3600/i.test(model) || compat.indexOf('xiaomi,ax3600') > -1 || compat.indexOf('xiaomi,ax3600-stock') > -1;
}

function statusClass(ok) {
	return ok ? 'is-good' : 'is-muted';
}

function renderMetric(label, value, state) {
	return E('div', { 'class': 'ax3600-metric ' + (state || '') }, [
		E('span', { 'class': 'ax3600-metric-label' }, label),
		E('strong', { 'class': 'ax3600-metric-value' }, value)
	]);
}

function renderPort(port) {
	var speed = port.status && port.status.speed ? port.status.speed + 'M' : '-';
	var up = !!(port.status && port.status.link);

	return E('div', { 'class': 'ax3600-port ' + (up ? 'is-up' : 'is-down') }, [
		E('span', { 'class': 'ax3600-port-dot' }),
		E('span', { 'class': 'ax3600-port-name' }, port.label),
		E('span', { 'class': 'ax3600-port-role' }, port.role),
		E('span', { 'class': 'ax3600-port-speed' }, speed)
	]);
}

return baseclass.extend({
	load() {
		var ports = [ 'wan', 'lan1', 'lan2', 'lan3' ];

		return Promise.all([
			L.resolveDefault(callSystemBoard(), {}),
			Promise.all(ports.map(function(name) {
				return L.resolveDefault(callDeviceStatus(name), null);
			})),
			L.resolveDefault(fs.stat('/sys/module/qca_nss_drv'), null),
			Promise.all([
				L.resolveDefault(fs.stat('/sys/module/ecm'), null),
				L.resolveDefault(fs.stat('/sys/module/qca_nss_ecm'), null)
			])
		]);
	},

	render(data) {
		var board = data[0] || {};
		var statuses = data[1] || [];
		var nssLoaded = !!data[2];
		var ecmLoaded = !!(data[3] && (data[3][0] || data[3][1]));
		var ports = [
			{ name: 'wan', label: 'WAN', role: _('Uplink'), status: statuses[0] },
			{ name: 'lan1', label: 'LAN1', role: _('LAN'), status: statuses[1] },
			{ name: 'lan2', label: 'LAN2', role: _('LAN'), status: statuses[2] },
			{ name: 'lan3', label: 'LAN3', role: _('LAN'), status: statuses[3] }
		];

		if (!isAx3600(board))
			return null;

		return E('div', { 'class': 'ax3600-dashboard-grid fade-in' }, [
			E('section', { 'class': 'dashboard-bg box-s1 ax3600-card ax3600-card-wide' }, [
				E('div', { 'class': 'ax3600-card-head' }, [
					E('div', {}, [
						E('p', { 'class': 'ax3600-eyebrow' }, _('AX3600 topology')),
						E('h3', {}, _('Physical ports'))
					]),
					E('span', { 'class': 'ax3600-status-pill is-good' }, _('WAN first'))
				]),
				E('div', { 'class': 'ax3600-ports' }, ports.map(renderPort))
			]),

			E('section', { 'class': 'dashboard-bg box-s1 ax3600-card' }, [
				E('div', { 'class': 'ax3600-card-head' }, [
					E('div', {}, [
						E('p', { 'class': 'ax3600-eyebrow' }, _('Acceleration')),
						E('h3', {}, _('NSS datapath'))
					])
				]),
				E('div', { 'class': 'ax3600-metrics' }, [
					renderMetric(_('NSS driver'), nssLoaded ? _('Available') : _('Unavailable'), statusClass(nssLoaded)),
					renderMetric(_('ECM'), ecmLoaded ? _('Available') : _('Unavailable'), statusClass(ecmLoaded))
				])
			])
		]);
	}
});
