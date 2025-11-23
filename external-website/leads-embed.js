/*
  leads-embed.js - Dynamic Lead Capture (formName + fields)
  Usage example:
  <script src="https://your-cdn/leads-embed.js"></script>
  <script>
    LeadTracker.init({
      endpoint: 'http://localhost:3000/api/leads/collect',
      websiteId: 'WEBSITE_ID',
      secretKey: 'SECRET_KEY',
      // optional fallbacks
      formName: 'contact', // used if a form doesn't have data-form-name
      trackAllForms: true, // set false to use only selector below
      formSelector: 'form[data-lead-form]',
      debug: false,
      onSuccess: function (resp) { console.log('Lead OK', resp) },
      onError: function (err) { console.error('Lead ERR', err) }
    })
  </script>
*/
;(function (window, document) {
  var _cfg = null
  var _bound = false

  function log() {
    if (_cfg && _cfg.debug) {
      var args = Array.prototype.slice.call(arguments)
      args.unshift('[LeadTracker]')
      console.log.apply(console, args)
    }
  }

  function collect(form) {
    var fd = new FormData(form)
    var fields = {}
    fd.forEach(function (v, k) {
      // if multiple fields share name, last wins
      fields[k] = v
    })

    var payload = {
      websiteId: _cfg.websiteId,
      secretKey: _cfg.secretKey,
      formName:
        form.getAttribute('data-form-name') ||
        _cfg.formName ||
        form.getAttribute('name') ||
        form.id ||
        'default',
      fields: fields,
      meta: {
        url: window.location.href,
        title: document.title,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }
    }

    console.log(payload, 'payload')
    return payload
  }

  function isValid(p) {
    if (!p.websiteId || !p.secretKey || !p.formName) return false
    // Ensure we at least have one field
    if (
      !p.fields ||
      typeof p.fields !== 'object' ||
      Object.keys(p.fields).length === 0
    )
      return false
    return true
  }

  function send(payload) {
    console.log(payload, 'vdfbkjb')
    return fetch(
      _cfg.endpoint || 'http://localhost:3001/api/v1/leads/collect',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'omit'
      }
    ).then(function (res) {
      console.log(res, 'res')
      if (!res.ok)
        return res
          .json()
          .catch(function () {
            return {}
          })
          .then(function (j) {
            throw j
          })
      return res.json().catch(function () {
        return {}
      })
    })
  }

  function bindToForm(form) {
    if (!form || form._leadBound) return
    form._leadBound = true
    form.addEventListener(
      'submit',
      function (e) {
        try {
          var payload = collect(form)
          log('payload', payload)
          if (!isValid(payload)) {
            log('invalid payload')
            return
          }
          send(payload)
            .then(function (resp) {
              if (typeof _cfg.onSuccess === 'function') _cfg.onSuccess(resp)
            })
            .catch(function (err) {
              if (typeof _cfg.onError === 'function') _cfg.onError(err)
            })
        } catch (err) {
          log('unexpected', err)
        }
      },
      true
    )
  }

  function bindAll() {
    if (_bound) return
    _bound = true
    var sel = _cfg.trackAllForms
      ? 'form'
      : _cfg.formSelector || 'form[data-lead-form]'
    var forms = document.querySelectorAll(sel)
    for (var i = 0; i < forms.length; i++) bindToForm(forms[i])

    // Observe dynamically added forms
    var mo = new MutationObserver(function (mut) {
      mut.forEach(function (m) {
        for (var i = 0; i < m.addedNodes.length; i++) {
          var n = m.addedNodes[i]
          if (!(n instanceof HTMLElement)) continue
          if (
            n.tagName === 'FORM' &&
            (_cfg.trackAllForms ||
              n.matches(_cfg.formSelector || 'form[data-lead-form]'))
          )
            bindToForm(n)
          var nested = n.querySelectorAll ? n.querySelectorAll('form') : []
          for (var j = 0; j < nested.length; j++) {
            var f = nested[j]
            if (
              _cfg.trackAllForms ||
              f.matches(_cfg.formSelector || 'form[data-lead-form]')
            )
              bindToForm(f)
          }
        }
      })
    })
    mo.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true
    })
  }

  window.LeadTracker = {
    init: function (config) {
      _cfg = config || {}
      bindAll()
      log('initialized', _cfg)
    }
  }
})(window, document)
