const adminPassword = "admin123";
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
function logoutAdmin() {
  localStorage.removeItem('adminLoggedIn');
  window.location = "index.html";
}
function renderAdminTable() {
  const ambassadors = getAmbassadors();
  document.getElementById('total-ambassadors').textContent = ambassadors.length;
  let html = "<tr><th>Name</th><th>Email</th><th>College</th><th>Actions</th></tr>";
  ambassadors.forEach(a => {
    html += `<tr>
      <td>${a.name}</td>
      <td>${a.email}</td>
      <td>${a.college}</td>
      <td><button onclick="viewProfile('${a.email}')">View Profile</button></td>
    </tr>`;
  });
  document.getElementById('ambassador-table').innerHTML = html;
  document.getElementById('admin-profile-view').innerHTML = '';
  // Count total submissions
  let totalSubs = 0;
  const submissions = getSubmissions();
  for(let email in submissions) totalSubs += Object.keys(submissions[email]).length;
  document.getElementById('total-submissions').textContent = totalSubs;

  // Animate table rows
  revealTasksOnScroll();
}
function viewProfile(email) {
  const ambassadors = getAmbassadors();
  const a = ambassadors.find(x => x.email === email);
  if (!a) return;
  let html = `<div class="card admin-profile" style="margin-top:24px;">
    <strong>${a.name}</strong> (${a.email})<br>
    <strong>Phone:</strong> ${a.phone}<br>
    <strong>College:</strong> ${a.college}<br>
    <strong>Year:</strong> ${a.year}<br>
    <strong>Instagram:</strong> ${a.instagram}<br>
    <strong>LinkedIn:</strong> ${a.linkedin}<br>
    <strong>Additional:</strong> ${a.additional || "-"}
  </div>`;
  const submissions = getSubmissions();
  const userSubs = submissions[email] || {};
  html += `<h4>Task Submissions</h4>`;
  tasks.forEach(task => {
    const sub = userSubs[task.id] || {};
    html += `<div class="card task-card" style="margin-bottom:18px;">
      <div><strong>${task.title}</strong> (${task.points} pts)</div>
      <div>${task.desc}</div>
      <div>Status: <span class="status ${sub.status === 'Approved' ? 'completed' : (sub.status === 'Rejected' ? 'rejected' : 'pending')}">${sub.status || 'Not Submitted'}</span></div>
      ${sub.proof ? `<div>Proof: ${task.method === 'link' ? `<a href="${sub.proof}" target="_blank">${sub.proof}</a>` : sub.proof}</div>` : ''}
      ${sub.status === 'Pending' ? `
        <div class="admin-actions">
          <button onclick="approveTask('${email}', ${task.id})">Approve</button>
          <button onclick="rejectTask('${email}', ${task.id})">Reject</button>
          <input type="text" id="feedback_${email}_${task.id}" placeholder="Feedback (optional)" style="width:40%;">
        </div>
      ` : ''}
      ${sub.feedback ? `<div>Feedback: ${sub.feedback}</div>` : ''}
    </div>`;
  });
  document.getElementById('admin-profile-view').innerHTML = html;
  revealTasksOnScroll();
}
function approveTask(email, taskId) {
  let submissions = getSubmissions();
  if (!submissions[email] || !submissions[email][taskId]) return;
  let feedback = document.getElementById(`feedback_${email}_${taskId}`).value;
  submissions[email][taskId].status = "Approved";
  submissions[email][taskId].feedback = feedback || "";
  setSubmissions(submissions);
  viewProfile(email);
}
function rejectTask(email, taskId) {
  let submissions = getSubmissions();
  if (!submissions[email] || !submissions[email][taskId]) return;
  let feedback = document.getElementById(`feedback_${email}_${taskId}`).value;
  submissions[email][taskId].status = "Rejected";
  submissions[email][taskId].feedback = feedback || "";
  setSubmissions(submissions);
  viewProfile(email);
}
window.viewProfile = viewProfile;
window.approveTask = approveTask;
window.rejectTask = rejectTask;
// Simple admin login
if (!localStorage.getItem('adminLoggedIn')) {
  let pass = prompt("Enter admin password:");
  if (pass !== "admin123") { alert("Incorrect password."); window.location = "index.html"; }
  localStorage.setItem('adminLoggedIn', "yes");
}
function revealTasksOnScroll() {
  document.querySelectorAll('.task-card').forEach(card => {
    const rect = card.getBoundingClientRect();
    if(rect.top < window.innerHeight - 60) card.classList.add('visible');
  });
}
window.addEventListener('scroll', revealTasksOnScroll);
window.addEventListener('DOMContentLoaded', renderAdminTable);
