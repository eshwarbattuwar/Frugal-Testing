(function () {
  'use strict';

  const form = document.getElementById('registration-form');
  const alertEl = document.getElementById('form-alert');
  const submitBtn = document.getElementById('submit-btn');

  const requiredFields = [
    'firstName', 'lastName', 'email', 'phone', 'gender',
    'country', 'state', 'city', 'password', 'confirmPassword', 'terms'
  ];

  const countrySelect = document.getElementById('country');
  const stateSelect = document.getElementById('state');
  const citySelect = document.getElementById('city');

  function populateCountries() {
    const countries = Object.keys(LOCATION_DATA);
    countries.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      countrySelect.appendChild(opt);
    });
  }

  function populateStates(country) {
    stateSelect.innerHTML = '<option value="">Select state</option>';
    citySelect.innerHTML = '<option value="">Select city</option>';
    stateSelect.disabled = true;
    citySelect.disabled = true;
    if (!country || !LOCATION_DATA[country]) return;
    stateSelect.disabled = false;
    const states = Object.keys(LOCATION_DATA[country]);
    states.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      stateSelect.appendChild(opt);
    });
  }

  function populateCities(country, state) {
    citySelect.innerHTML = '<option value="">Select city</option>';
    citySelect.disabled = true;
    if (!country || !state || !LOCATION_DATA[country]?.[state]) return;
    citySelect.disabled = false;
    LOCATION_DATA[country][state].forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      citySelect.appendChild(opt);
    });
  }

  countrySelect.addEventListener('change', function () {
    const country = this.value;
    populateStates(country);
    validateField('country');
    validateField('state');
    validateField('city');
    updateSubmitButton();
  });

  stateSelect.addEventListener('change', function () {
    const country = countrySelect.value;
    const state = this.value;
    populateCities(country, state);
    validateField('state');
    validateField('city');
    updateSubmitButton();
  });

  citySelect.addEventListener('change', function () {
    validateField('city');
    updateSubmitButton();
  });

  populateCountries();

  function isDisposableEmail(email) {
    if (!email) return false;
    const domain = email.split('@')[1]?.toLowerCase();
    return domain && DISPOSABLE_EMAIL_DOMAINS.some(d => domain === d || domain.endsWith('.' + d));
  }

  const COUNTRY_PHONE_CODES = {
    'United States': '+1',
    'India': '+91',
    'United Kingdom': '+44',
    'Canada': '+1',
    'Australia': '+61'
  };

  function getExpectedPhonePrefix() {
    const country = countrySelect.value;
    return COUNTRY_PHONE_CODES[country] || null;
  }

  function isPhoneValid(phone, country) {
    if (!phone || !phone.trim()) return false;
    const cleaned = phone.replace(/\s/g, '');
    const prefix = COUNTRY_PHONE_CODES[country];
    if (prefix) {
      return cleaned.startsWith(prefix) && /^\+?\d{10,15}$/.test(cleaned.replace(/^\+/, ''));
    }
    return /^\+?\d{10,15}$/.test(cleaned.replace(/\s/g, ''));
  }

  const strengthBar = document.getElementById('strength-bar');
  const strengthLabel = document.getElementById('strength-label');

  function getPasswordStrength(pwd) {
    if (!pwd || pwd.length === 0) return { level: 'none', label: 'Password strength' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    if (score <= 2) return { level: 'weak', label: 'Weak' };
    if (score <= 4) return { level: 'medium', label: 'Medium' };
    return { level: 'strong', label: 'Strong' };
  }

  document.getElementById('password').addEventListener('input', function () {
    const { level, label } = getPasswordStrength(this.value);
    strengthBar.className = 'strength-bar ' + (level === 'none' ? '' : level);
    strengthLabel.textContent = label;
    validateField('password');
    validateField('confirmPassword');
    updateSubmitButton();
  });

  function setError(fieldId, message) {
    const isGender = fieldId === 'gender';
    const el = isGender ? document.querySelector('fieldset .gender-options') : document.getElementById(fieldId);
    const errEl = document.getElementById(isGender ? 'gender-error' : fieldId + '-error');
    const fieldset = el?.closest('fieldset');
    if (el && !isGender) el.classList.add('invalid');
    if (fieldset) fieldset.classList.add('invalid');
    if (errEl) errEl.textContent = message || '';
  }

  function clearError(fieldId) {
    const isGender = fieldId === 'gender';
    const el = isGender ? null : document.getElementById(fieldId);
    const errEl = document.getElementById(isGender ? 'gender-error' : fieldId + '-error');
    const fieldset = document.querySelector('fieldset');
    if (el) el.classList.remove('invalid');
    if (fieldset) fieldset.classList.remove('invalid');
    if (errEl) errEl.textContent = '';
  }

  function validateField(name) {
    let valid = true;
    let message = '';

    if (name === 'firstName') {
      const v = document.getElementById('firstName').value.trim();
      if (!v) { valid = false; message = 'First name is required.'; }
    } else if (name === 'lastName') {
      const v = document.getElementById('lastName').value.trim();
      if (!v) { valid = false; message = 'Last name is required.'; }
    } else if (name === 'email') {
      const v = document.getElementById('email').value.trim();
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!v) { valid = false; message = 'Email is required.'; }
      else if (!emailRe.test(v)) { valid = false; message = 'Please enter a valid email.'; }
      else if (isDisposableEmail(v)) { valid = false; message = 'Disposable email addresses are not allowed.'; }
    } else if (name === 'phone') {
      const v = document.getElementById('phone').value.trim();
      const country = countrySelect.value;
      if (!v) { valid = false; message = 'Phone number is required.'; }
      else if (!isPhoneValid(v, country)) {
        valid = false;
        message = country && COUNTRY_PHONE_CODES[country]
          ? `Phone must start with ${COUNTRY_PHONE_CODES[country]} for selected country.`
          : 'Please enter a valid phone number with country code.';
      }
    } else if (name === 'gender') {
      const checked = document.querySelectorAll('input[name="gender"]:checked').length;
      if (checked === 0) { valid = false; message = 'Please select at least one gender.'; }
    } else if (name === 'country') {
      if (!countrySelect.value) { valid = false; message = 'Please select a country.'; }
    } else if (name === 'state') {
      if (!stateSelect.value) { valid = false; message = 'Please select a state.'; }
    } else if (name === 'city') {
      if (!citySelect.value) { valid = false; message = 'Please select a city.'; }
    } else if (name === 'password') {
      const v = document.getElementById('password').value;
      if (!v) { valid = false; message = 'Password is required.'; }
      else if (v.length < 8) { valid = false; message = 'Password must be at least 8 characters.'; }
    } else if (name === 'confirmPassword') {
      const pwd = document.getElementById('password').value;
      const conf = document.getElementById('confirmPassword').value;
      if (!conf) { valid = false; message = 'Please confirm your password.'; }
      else if (pwd !== conf) { valid = false; message = 'Passwords do not match.'; }
    } else if (name === 'terms') {
      if (!document.getElementById('terms').checked) { valid = false; message = 'You must accept the Terms & Conditions.'; }
    }

    if (valid) {
      clearError(name === 'gender' ? 'gender' : name);
    } else {
      setError(name === 'gender' ? 'gender' : name, message);
    }
    return valid;
  }

  function validateAll() {
    let allValid = true;
    requiredFields.forEach(f => {
      if (!validateField(f)) allValid = false;
    });
    return allValid;
  }

  function updateSubmitButton() {
    const valid = validateAll();
    submitBtn.disabled = !valid;
  }

  ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('blur', () => { validateField(id); updateSubmitButton(); });
  });

  document.getElementById('terms').addEventListener('change', () => { validateField('terms'); updateSubmitButton(); });

  document.querySelectorAll('input[name="gender"]').forEach(cb => {
    cb.addEventListener('change', () => { validateField('gender'); updateSubmitButton(); });
  });

  function showAlert(type, text) {
    alertEl.hidden = false;
    alertEl.className = 'form-alert ' + type;
    alertEl.textContent = text;
  }

  function hideAlert() {
    alertEl.hidden = true;
    alertEl.textContent = '';
  }

  function resetForm() {
    form.reset();
    alertEl.hidden = true;
    stateSelect.innerHTML = '<option value="">Select state</option>';
    citySelect.innerHTML = '<option value="">Select city</option>';
    stateSelect.disabled = true;
    citySelect.disabled = true;
    document.querySelectorAll('.error-msg').forEach(el => { el.textContent = ''; });
    document.querySelectorAll('.invalid').forEach(el => { el.classList.remove('invalid'); });
    document.querySelectorAll('input, select, textarea').forEach(el => { el.classList.remove('invalid'); });
    strengthBar.className = 'strength-bar';
    strengthLabel.textContent = 'Password strength';
    submitBtn.disabled = true;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    hideAlert();

    if (!validateAll()) {
      showAlert('error', 'Please fix the errors below before submitting.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    const payload = {
      firstName: document.getElementById('firstName').value.trim(),
      lastName: document.getElementById('lastName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      age: document.getElementById('age').value || null,
      gender: Array.from(document.querySelectorAll('input[name="gender"]:checked')).map(c => c.value),
      address: document.getElementById('address').value.trim() || null,
      country: countrySelect.value,
      state: stateSelect.value,
      city: citySelect.value,
      password: document.getElementById('password').value
    };

    const simulateBackend = () => {
      return new Promise(resolve => setTimeout(resolve, 800));
    };

    simulateBackend()
      .then(() => {
        showAlert('success', 'Registration Successful! Your profile has been submitted successfully.');
        resetForm();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submit Registration';
      })
      .catch(() => {
        showAlert('error', 'Something went wrong. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Registration';
      });
  });

  updateSubmitButton();
})();
