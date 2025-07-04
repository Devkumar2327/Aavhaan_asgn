const tasks = [
  { id: 1, title: "Promote Event on Instagram", desc: "Share our event poster on your Instagram story.", points: 20, method: "link" },
  { id: 2, title: "Campus Orientation", desc: "Host a campus orientation session for new students.", points: 30, method: "file" },
  { id: 3, title: "Feedback Survey", desc: "Collect feedback from at least 20 students.", points: 15, method: "file" },
  { id: 4, title: "Blog Post", desc: "Write a blog post about your ambassador experience.", points: 25, method: "link" },
  { id: 5, title: "Workshop Organization", desc: "Organize a workshop on behalf of our brand.", points: 40, method: "file" },
  { id: 6, title: "Referral", desc: "Refer a friend to the program.", points: 10, method: "text" }
];
function getAmbassadors() {
  return JSON.parse(localStorage.getItem('ambassadors') || '[]');
}
function getSubmissions() {
  return JSON.parse(localStorage.getItem('submissions') || '{}');
}
function setSubmissions(obj) {
  localStorage.setItem('submissions', JSON.stringify(obj));
}
function getUserEmail() {
  let email = localStorage.getItem('loggedInAmbassador');
  if (!email) {
    email = prompt("Enter your registered email:");
    if (!email) window.location = "index.html";
    localStorage.setItem('loggedInAmbassador', email);
  }
  return email;
}
function logout() {
  localStorage.removeItem('loggedInAmbassador');
  window.location = "index.html";
}
function renderDashboard() {
  const email = getUserEmail();
  const ambassadors = getAmbassadors();
  const ambassador = ambassadors.find(a => a.email === email);
  if (!ambassador) { alert("No ambassador found for this email."); logout(); return; }
  document.getElementById('dashboard-user-name').textContent = `Welcome, ${ambassador.name}!`;
  const submissions = getSubmissions();
  let userSubs = submissions[email] || {};
  let totalPoints = 0, completedTasks = 0;
  let html = '';
  tasks.forEach(task => {
    const sub = userSubs[task.id] || {};
    let status = sub.status || 'Not Submitted';
    let statusClass = 'pending';
    if (status === 'Approved') { statusClass = 'completed'; totalPoints += task.points; completedTasks++; }
    if (status === 'Rejected') statusClass = 'rejected';
    html += `<div class="card task-card ${status === 'Approved' ? 'completed' : ''}" style="margin-bottom:24px;">
      <div><strong>${task.title}</strong> <span class="points">${task.points} pts</span></div>
      <div>${task.desc}</div>
      <div>
        <span class="status ${statusClass}">Status: ${status}</span>
        ${sub.feedback ? `<span style="color:#e67e22;"> | Feedback: ${sub.feedback}</span>` : ''}
      </div>
      ${status !== 'Approved' ? `
      <form onsubmit="submitTask(event, '${email}', ${task.id})">
        <label>Submit Proof (${task.method}):</label>
        ${task.method === 'file' ? `<input type="file" name="proof" required>` : ''}
        ${task.method === 'link' ? `<input type="url" name="proof" placeholder="https://..." required>` : ''}
        ${task.method === 'text' ? `<input type="text" name="proof" required>` : ''}
        <button type="submit">Submit</button>
      </form>
      ` : ''}
    </div>`;
  });
  document.getElementById('tasks-list').innerHTML = html;
  document.getElementById('total-points').textContent = totalPoints;
  document.getElementById('tasks-completed').textContent = completedTasks;
  document.getElementById('user-rank').textContent = Math.max(1, 10 - completedTasks);

  // Animate task cards
  revealTasksOnScroll();
}
function submitTask(e, email, taskId) {
  e.preventDefault();
  const proof = e.target.proof.value;
  if (!proof) return;
  let submissions = getSubmissions();
  if (!submissions[email]) submissions[email] = {};
  submissions[email][taskId] = { proof, status: "Pending", feedback: "" };
  setSubmissions(submissions);
  renderDashboard();
}
window.submitTask = submitTask;
function revealTasksOnScroll() {
  document.querySelectorAll('.task-card').forEach(card => {
    const rect = card.getBoundingClientRect();
    if(rect.top < window.innerHeight - 60) card.classList.add('visible');
  });
}
window.addEventListener('scroll', revealTasksOnScroll);
window.addEventListener('DOMContentLoaded', renderDashboard);
