const videoGrid = document.getElementById("video-grid");
const projectGrid = document.getElementById("project-grid");
document.getElementById("year").textContent = new Date().getFullYear();

const menuButton = document.querySelector(".menu-toggle");
const nav = document.getElementById("nav");
menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}));

async function loadVideos() {
  try {
    const response = await fetch("videos.json", {cache:"no-store"});
    if (!response.ok) throw new Error("Video feed not ready");
    const videos = await response.json();
    if (!Array.isArray(videos) || videos.length === 0) {
      videoGrid.innerHTML = '<div class="empty-card">New videos will appear here automatically after the channel sync runs.</div>';
      return;
    }
    videoGrid.innerHTML = videos.slice(0, (location.pathname.endsWith("index.html") || location.pathname === "/" || location.pathname.endsWith("/")) ? 4 : 12).map(video => `
      <article class="video-card">
        <a href="${safeUrl(video.url)}" target="_blank" rel="noopener">
          <img class="video-thumb" src="${safeUrl(video.thumbnail)}" alt="" loading="lazy">
        </a>
        <div class="video-info"><h3>${escapeHtml(video.title || "INNOVIXA video")}</h3>
        <p>${escapeHtml(video.published || "")}</p>
        <a class="card-link" href="${safeUrl(video.url)}" target="_blank" rel="noopener">Watch video ↗</a></div>
      </article>`).join("");
  } catch {
    videoGrid.innerHTML = '<div class="empty-card">Videos are syncing. Please check back soon, or visit <a class="cyan" href="https://www.youtube.com/@INNOVIXA">our YouTube channel ↗</a>.</div>';
  }
}
async function loadProjects() {
  try {
    const response = await fetch("projects.json", {cache:"no-store"});
    const projects = await response.json();
    if (!Array.isArray(projects) || !projects.length) throw new Error();
    projectGrid.innerHTML = projects.map(project => `
      <article class="project-card"><div class="project-symbol">${escapeHtml(project.icon || "✧")}</div>
      <h3>${escapeHtml(project.title || "Project")}</h3><p>${escapeHtml(project.description || "")}</p>
      ${project.driveUrl ? `<a class="button secondary" href="${safeUrl(project.driveUrl)}" target="_blank" rel="noopener">Open Drive resource ↗</a>` : ""}
      ${project.projectUrl ? `<a class="card-link" href="${safeUrl(project.projectUrl)}" target="_blank" rel="noopener">View project ↗</a>` : ""}
      </article>`).join("");
  } catch {
    projectGrid.innerHTML = '<div class="empty-card">Project resources will be listed here soon.</div>';
  }
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function safeUrl(value) {
  try { const u = new URL(value, location.href); return ["https:","http:"].includes(u.protocol) ? escapeHtml(u.href) : "#"; }
  catch { return "#"; }
}
loadVideos(); loadProjects();

// Let visitors pause the decorative robot animation.
const motionToggle = document.querySelector(".motion-toggle");
if (motionToggle) {
  motionToggle.addEventListener("click", () => {
    const paused = document.body.classList.toggle("motion-paused");
    motionToggle.setAttribute("aria-pressed", String(paused));
    motionToggle.textContent = paused ? "▶ Play animation" : "Ⅱ Pause animation";
    motionToggle.setAttribute("aria-label", paused ? "Play background animation" : "Pause background animation");
  });
}
