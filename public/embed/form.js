/**
 * Lead Intelligence Pipeline — Embeddable Form
 * Self-contained vanilla JS + CSS, shadow DOM isolated
 * 
 * Usage:
 * <div id="lead-intel-form"></div>
 * <script src="https://yourdomain.com/embed/form.js"
 *   data-webhook="https://yourdomain.com/api/workflows/webhook/onboarding"
 *   data-client-key="CLIENT_API_KEY"
 *   data-theme="light">
 * </script>
 */
(function () {
  'use strict';

  // Find the current script tag to read data attributes
  const scriptTag = document.currentScript || (function () {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  const webhookUrl = scriptTag.getAttribute('data-webhook') || '';
  const clientKey = scriptTag.getAttribute('data-client-key') || '';
  const theme = scriptTag.getAttribute('data-theme') || 'light';

  // Find or create container
  let container = document.getElementById('lead-intel-form');
  if (!container) {
    container = document.createElement('div');
    container.id = 'lead-intel-form';
    scriptTag.parentNode.insertBefore(container, scriptTag);
  }

  // Create shadow DOM
  const shadow = container.attachShadow({ mode: 'open' });

  const isDark = theme === 'dark';

  // Styles
  const styles = `
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.5;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }

    .lif-wrapper {
      max-width: 520px;
      margin: 0 auto;
      padding: 28px;
      border-radius: 16px;
      border: 1px solid ${isDark ? '#2a2a2a' : '#e2e8f0'};
      background: ${isDark ? '#0f1117' : '#ffffff'};
      color: ${isDark ? '#e2e8f0' : '#1a202c'};
      box-shadow: 0 4px 24px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.08)'};
    }

    .lif-header {
      margin-bottom: 24px;
      text-align: center;
    }
    .lif-header h2 {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 4px;
      background: linear-gradient(135deg, ${isDark ? '#818cf8' : '#4f46e5'}, ${isDark ? '#c084fc' : '#7c3aed'});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .lif-header p {
      font-size: 13px;
      color: ${isDark ? '#94a3b8' : '#64748b'};
    }

    .lif-row { margin-bottom: 16px; }
    .lif-row-half { display: flex; gap: 12px; }
    .lif-row-half .lif-row { flex: 1; margin-bottom: 0; }

    label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 5px;
      color: ${isDark ? '#cbd5e1' : '#374151'};
    }
    label .lif-req {
      color: ${isDark ? '#f87171' : '#ef4444'};
      margin-left: 2px;
    }

    input, select, textarea {
      width: 100%;
      padding: 10px 12px;
      font-size: 14px;
      border: 1px solid ${isDark ? '#334155' : '#d1d5db'};
      border-radius: 8px;
      background: ${isDark ? '#1e293b' : '#f8fafc'};
      color: ${isDark ? '#e2e8f0' : '#1a202c'};
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      font-family: inherit;
    }
    input:focus, select:focus, textarea:focus {
      border-color: ${isDark ? '#818cf8' : '#4f46e5'};
      box-shadow: 0 0 0 3px ${isDark ? 'rgba(129,140,248,0.15)' : 'rgba(79,70,229,0.1)'};
    }
    input::placeholder, textarea::placeholder {
      color: ${isDark ? '#64748b' : '#9ca3af'};
    }
    select {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='${isDark ? '%2394a3b8' : '%236b7280'}' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 5h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 32px;
    }
    textarea { resize: vertical; min-height: 72px; }

    .lif-btn {
      width: 100%;
      padding: 12px;
      font-size: 15px;
      font-weight: 600;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      color: #fff;
      background: linear-gradient(135deg, ${isDark ? '#6366f1' : '#4f46e5'}, ${isDark ? '#a855f7' : '#7c3aed'});
      transition: opacity 0.2s, transform 0.1s;
      margin-top: 8px;
      font-family: inherit;
    }
    .lif-btn:hover { opacity: 0.92; }
    .lif-btn:active { transform: scale(0.98); }
    .lif-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    .lif-btn .lif-spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: lif-spin 0.6s linear infinite;
      vertical-align: middle;
      margin-right: 8px;
    }
    @keyframes lif-spin { to { transform: rotate(360deg); } }

    .lif-msg {
      margin-top: 16px;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 13px;
      text-align: center;
      animation: lif-fade 0.3s ease;
    }
    @keyframes lif-fade { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
    .lif-msg.success {
      background: ${isDark ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.08)'};
      color: ${isDark ? '#34d399' : '#059669'};
      border: 1px solid ${isDark ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.15)'};
    }
    .lif-msg.error {
      background: ${isDark ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.08)'};
      color: ${isDark ? '#f87171' : '#dc2626'};
      border: 1px solid ${isDark ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.15)'};
    }

    .lif-footer {
      margin-top: 16px;
      text-align: center;
      font-size: 11px;
      color: ${isDark ? '#475569' : '#94a3b8'};
    }

    @media (max-width: 480px) {
      .lif-wrapper { padding: 20px; }
      .lif-row-half { flex-direction: column; gap: 0; }
      .lif-row-half .lif-row { margin-bottom: 16px; }
    }
  `;

  // HTML
  const html = `
    <style>${styles}</style>
    <div class="lif-wrapper">
      <div class="lif-header">
        <h2>Get Started</h2>
        <p>Tell us about your business and we'll get back to you</p>
      </div>
      <form id="lif-form" novalidate>
        <div class="lif-row">
          <label>Company / Business Name <span class="lif-req">*</span></label>
          <input type="text" name="companyName" required placeholder="Acme Corp" />
        </div>
        <div class="lif-row">
          <label>Website / Domain <span class="lif-req">*</span></label>
          <input type="text" name="domain" required placeholder="acmecorp.com" />
        </div>
        <div class="lif-row-half">
          <div class="lif-row">
            <label>Industry</label>
            <select name="industry">
              <option value="">Select...</option>
              <option value="Technology">Technology</option>
              <option value="Real Estate">Real Estate</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Retail">Retail</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="lif-row">
            <label>Company Size</label>
            <select name="companySize">
              <option value="">Select...</option>
              <option value="1–10">1–10</option>
              <option value="11–50">11–50</option>
              <option value="51–200">51–200</option>
              <option value="201–1000">201–1000</option>
              <option value="1000+">1000+</option>
            </select>
          </div>
        </div>
        <div class="lif-row">
          <label>City / Location</label>
          <input type="text" name="city" placeholder="Mumbai" />
        </div>
        <div class="lif-row-half">
          <div class="lif-row">
            <label>Contact Name <span class="lif-req">*</span></label>
            <input type="text" name="contactName" required placeholder="John Doe" />
          </div>
          <div class="lif-row">
            <label>Contact Email <span class="lif-req">*</span></label>
            <input type="email" name="contactEmail" required placeholder="john@acmecorp.com" />
          </div>
        </div>
        <div class="lif-row">
          <label>Phone</label>
          <input type="tel" name="phone" placeholder="+91-9999999999" />
        </div>
        <div class="lif-row">
          <label>What are you looking for?</label>
          <textarea name="intent" rows="3" placeholder="Tell us about your needs..."></textarea>
        </div>
        <button type="submit" class="lif-btn" id="lif-submit">Submit</button>
        <div id="lif-message" style="display:none;"></div>
      </form>
      <div class="lif-footer">Powered by Lead Intelligence Pipeline</div>
    </div>
  `;

  shadow.innerHTML = html;

  // Form handling
  const form = shadow.getElementById('lif-form');
  const submitBtn = shadow.getElementById('lif-submit');
  const msgDiv = shadow.getElementById('lif-message');

  function showMsg(type, text) {
    msgDiv.className = 'lif-msg ' + type;
    msgDiv.textContent = text;
    msgDiv.style.display = 'block';
  }

  function hideMsg() {
    msgDiv.style.display = 'none';
  }

  function stripDomain(raw) {
    if (!raw) return raw;
    return raw.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/+$/, '').trim();
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    hideMsg();

    // Basic validation
    const fd = new FormData(form);
    const companyName = (fd.get('companyName') || '').toString().trim();
    const domain = stripDomain((fd.get('domain') || '').toString().trim());
    const contactName = (fd.get('contactName') || '').toString().trim();
    const contactEmail = (fd.get('contactEmail') || '').toString().trim();

    if (!companyName || !domain || !contactName || !contactEmail) {
      showMsg('error', 'Please fill in all required fields.');
      return;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      showMsg('error', 'Please enter a valid email address.');
      return;
    }

    if (!webhookUrl) {
      showMsg('error', 'Configuration error: webhook URL is missing.');
      return;
    }

    // Build payload
    const payload = {
      client_key: clientKey,
      companyName: companyName,
      domain: domain,
      industry: (fd.get('industry') || '').toString(),
      companySize: (fd.get('companySize') || '').toString(),
      city: (fd.get('city') || '').toString().trim(),
      contactName: contactName,
      contactEmail: contactEmail,
      phone: (fd.get('phone') || '').toString().trim(),
      intent: (fd.get('intent') || '').toString().trim(),
      submittedAt: new Date().toISOString(),
      sourceUrl: window.location.href,
    };

    // Submit
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="lif-spinner"></span>Submitting...';

    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showMsg('success', '✓ Thank you! We\'ll be in touch shortly.');
        form.reset();
      } else {
        const data = await res.json().catch(function() { return {}; });
        showMsg('error', data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      showMsg('error', 'Network error. Please check your connection and try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Submit';
    }
  });
})();
