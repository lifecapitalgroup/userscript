// ==UserScript==
// @name			wecure_ext
// @namespace		http://lifecapital.eg
// @version			1.0
// @description		weCure HIS extensions.
// @author			Mustafa Elmalah
// @match			http://his.lifeintl.net/ords/f?p=200:309*
// @icon			https://lifecapital-assets.s3.eu-west-1.amazonaws.com/logo/lifecapital_logo_sq.png
// @grant			none
// @run-at			document-idle
// @downloadURL		https://raw.githubusercontent.com/lifecapitalgroup/userscript/refs/heads/master/wecure_ext.user.js
// @updateURL		https://raw.githubusercontent.com/lifecapitalgroup/userscript/refs/heads/master/wecure_ext.user.js
// ==/UserScript==

/*
	This script adds links to integrte with external systems. Encoding patient
	data and sending them as arguments through lifecapital:// protocol handled
	by the win_dispatcher program.
*/
(function () {
	'use strict';

	document.body.onload = () => {
		let username = $(".t-NavigationBar-item.has-username ").text().trim();
		if (!username) {
			console.warn("Not logged in.");
			return;
		}

		let container = $(".t-HeroRegion-top .t-HeroRegion-col.t-HeroRegion-col--content");
		let patient_h1 = container.find("h1")[0];
		let patient_heading = patient_h1.textContent.trim();
		let patient_data = {
				wecure_code: patient_heading.split(" - ")[1],
				name: patient_heading.split(" - ")[0],
				phone: container.text().match(/\d{11}/g)?.[0]
			};
		
		console.debug(patient_h1);

		function patientfile_edit_uri() {
			// Convert to base64 string
			let jstr = JSON.stringify(patient_data);
			let b = new TextEncoder().encode(jstr);
			let bstr = String.fromCharCode(...b);
			let b64 = btoa(bstr);
			let uri = `lifecapital://patientfile/open/${b64}/${username}`
			return uri;
		}

		function patientfile_view_uri() {
			let uri = `lifecapital://patientfile/patientfile/${patient_data.wecure_code}`;
			return uri;
		}

		// let b_row = $("table:first tr:first");
		// let td = document.createElement("td");
		let edit_ln = document.createElement("a");
		edit_ln.innerText = "Edit Patient File";
		edit_ln.href = patientfile_edit_uri();
		edit_ln.style.fontSize = "12px";
		edit_ln.style.paddingLeft = "21px";
		patient_h1.appendChild(edit_ln);

		let view_ln = document.createElement("a");
		view_ln.innerText = "View Patient File";
		view_ln.href = patientfile_view_uri();
		view_ln.style.fontSize = "12px";
		view_ln.style.paddingLeft = "11px";
		patient_h1.appendChild(view_ln);
	}
})();