/**
 * Ecolkem - Submit handler para formularios del sitio.
 *
 * Cualquier <form data-mail> que se encuentre en la página será interceptado:
 *  - Se envía por fetch() a su `action` (apunta a /mail.php).
 *  - Se muestra mensaje de estado en <div data-form-status></div>.
 *  - El usuario nunca sale de la página.
 */
(function () {
  'use strict';

  var lang = (document.documentElement.lang || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
  var t = {
    es: {
      sending: 'Enviando…',
      success: '¡Gracias! Tu mensaje fue enviado. Te contactaremos en breve.',
      error: 'Hubo un error al enviar. Intenta de nuevo o escríbenos a servicioalcliente@ecolkem.com.'
    },
    en: {
      sending: 'Sending…',
      success: 'Thank you! Your message has been sent. We will be in touch shortly.',
      error: 'There was an error sending your message. Please try again or email us at servicioalcliente@ecolkem.com.'
    }
  }[lang];

  function showStatus(el, kind, text) {
    if (!el) return;
    var classes = {
      info:    'mt-4 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded p-3',
      success: 'mt-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded p-3',
      error:   'mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3'
    };
    el.textContent = text;
    el.className = classes[kind] || '';
  }

  function init() {
    document.querySelectorAll('form[data-mail]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var status = form.querySelector('[data-form-status]');
        var btn = form.querySelector('button[type="submit"]');
        var originalHTML = btn ? btn.innerHTML : '';

        if (btn) { btn.disabled = true; btn.textContent = t.sending; }
        showStatus(status, 'info', t.sending);

        fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        }).then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok && data && data.ok };
          }).catch(function () {
            return { ok: res.ok };
          });
        }).then(function (result) {
          if (!result.ok) throw new Error('failed');
          form.reset();
          showStatus(status, 'success', t.success);
        }).catch(function () {
          showStatus(status, 'error', t.error);
        }).finally(function () {
          if (btn) { btn.disabled = false; btn.innerHTML = originalHTML; }
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
