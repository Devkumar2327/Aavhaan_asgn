document.getElementById('caForm').addEventListener('submit', function(e) {
  e.preventDefault();
  document.querySelectorAll('.error').forEach(el => el.textContent = '');
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const college = document.getElementById('college').value.trim();
  const year = document.getElementById('year').value;
  const instagram = document.getElementById('instagram').value.trim();
  const linkedin = document.getElementById('linkedin').value.trim();
  const additional = document.getElementById('additional').value.trim();
  let valid = true;
  if (!name) { valid = false; document.getElementById('nameError').textContent = "Name is required"; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { valid = false; document.getElementById('emailError').textContent = "Valid email is required"; }
  if (!phone || !/^\d{10}$/.test(phone)) { valid = false; document.getElementById('phoneError').textContent = "Valid phone number is required"; }
  if (!college) { valid = false; document.getElementById('collegeError').textContent = "College is required"; }
  if (!year) { valid = false; document.getElementById('yearError').textContent = "Year is required"; }
  if (!valid) return;
  let ambassadors = JSON.parse(localStorage.getItem('ambassadors') || '[]');
  if (ambassadors.find(a => a.email === email)) {
    document.getElementById('emailError').textContent = "Email already registered";
    return;
  }
  const ambassador = { id: Date.now(), name, email, phone, college, year, instagram, linkedin, additional };
  ambassadors.push(ambassador);
  localStorage.setItem('ambassadors', JSON.stringify(ambassadors));
  document.getElementById('confirmation').textContent = "Thank you for registering! You can now access the dashboard.";
  this.reset();
  setTimeout(() => document.getElementById('confirmation').textContent = '', 6000);
});
