
// ========================================
// INNOVIXA WEBSITE JAVASCRIPT
// Videos + Shorts + Projects + Navigation
// ========================================

const videoGrid = document.getElementById("video-grid");
const projectGrid = document.getElementById("project-grid");

// Footer year
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// ========================================
// MOBILE NAVIGATION
// ========================================

const menuButton = document.querySelector(".menu-toggle");
const nav = document.getElementById("nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");

    menuButton.setAttribute(
      "aria-expanded",
      String(open)
    );
  });

  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );
    });
  });
}

// ========================================
// VIDEO SYSTEM
// ========================================

let allVideos = [];
let activeFilter = "all";

// Safely escape HTML
function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[c]
  );
}

// Safely validate URLs
function safeUrl(value) {
  try {
    const u = new URL(value, location.href);

    return ["https:", "http:"].includes(u.protocol)
      ? escapeHtml(u.href)
      : "#";

  } catch {
    return "#";
  }
}

// Determine the correct YouTube URL
function getVideoUrl(video) {
  const id = String(video.id || "");

  if (!/^[a-zA-Z0-9_-]{11}$/.test(id)) {
    return safeUrl(video.url);
  }

  return video.type === "short"
    ? `https://www.youtube.com/shorts/${id}`
    : `https://www.youtube.com/watch?v=${id}`;
}

// ========================================
// RENDER VIDEOS AND SHORTS
// ========================================

function renderVideos() {

  if (!videoGrid) return;

  let videos = allVideos;

  if (activeFilter === "video") {
    videos = allVideos.filter(
      video => video.type === "video"
    );
  }

  if (activeFilter === "short") {
    videos = allVideos.filter(
      video => video.type === "short"
    );
  }

  // Homepage shows 4; videos page shows 50
  const isHomePage =
    location.pathname.endsWith("index.html") ||
    location.pathname === "/" ||
    location.pathname.endsWith("/");

  const limit = isHomePage ? 4 : 50;

  videos = videos.slice(0, limit);

  if (!videos.length) {
    videoGrid.innerHTML = `
      <div class="empty-card">
        No content available in this category yet.
      </div>
    `;
    return;
  }

  videoGrid.innerHTML = videos.map(video => {

    const title = escapeHtml(
      video.title || "INNOVIXA Video"
    );

    const published = escapeHtml(
      video.published || ""
    );

    const thumbnail = safeUrl(
      video.thumbnail ||
      `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`
    );

    const isShort = video.type === "short";

    const label = isShort ? "SHORT" : "VIDEO";

    const url = getVideoUrl(video);

    return `
      <article class="video-card">

        <a
          href="${url}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Watch ${title}"
        >

          <div class="video-thumbnail">

            <img
              class="video-thumb"
              src="${thumbnail}"
              alt="${title}"
              loading="lazy"
            >

            <span class="video-type">
              ${label}
            </span>

          </div>

        </a>

        <div class="video-info">

          <h3>${title}</h3>

          <p>${published}</p>

          <a
            class="card-link"
            href="${url}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch ${isShort ? "Short" : "Video"} ↗
          </a>

        </div>

      </article>
    `;

  }).join("");

}

// ========================================
// VIDEO FILTER BUTTONS
// ========================================

document.querySelectorAll(".video-filter").forEach(button => {

  button.addEventListener("click", () => {

    activeFilter = button.dataset.filter || "all";

    document.querySelectorAll(".video-filter").forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    renderVideos();

  });

});

// ========================================
// LOAD YOUTUBE VIDEOS JSON
// ========================================

async function loadVideos() {

  if (!videoGrid) return;

  try {

    const response = await fetch(
      `videos.json?t=${Date.now()}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Video feed not ready");
    }

    const videos = await response.json();

    if (!Array.isArray(videos)) {
      throw new Error("Invalid videos.json");
    }

    // Keep the type only when explicitly supplied.
    allVideos = videos.map(video => {

      const type =
        video.type === "short"
          ? "short"
          : "video";

      return {
        ...video,
        type
      };

    });

    if (!allVideos.length) {
      videoGrid.innerHTML = `
        <div class="empty-card">
          New videos will appear here automatically
          after the channel sync runs.
        </div>
      `;
      return;
    }

    renderVideos();

    console.log(
      "INNOVIXA videos loaded:",
      allVideos.length
    );

  } catch (error) {

    console.error("Video loading error:", error);

    videoGrid.innerHTML = `
      <div class="empty-card">
        Videos are syncing. Please check back soon,
        or visit
        <a class="cyan"
           href="https://www.youtube.com/@INNOVIXA"
           target="_blank"
           rel="noopener noreferrer">
          our YouTube channel ↗
        </a>.
      </div>
    `;

  }

}

// ========================================
// PROJECTS SYSTEM
// ========================================

async function loadProjects() {

  if (!projectGrid) return;

  try {

    const response = await fetch(
      "projects.json",
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Projects not ready");
    }

    const projects = await response.json();

    if (!Array.isArray(projects) || !projects.length) {
      throw new Error("No projects found");
    }

    projectGrid.innerHTML = projects.map(project => `

      <article class="project-card">

        <div class="project-symbol">
          ${escapeHtml(project.icon || "✧")}
        </div>

        <h3>
          ${escapeHtml(project.title || "Project")}
        </h3>

        <p>
          ${escapeHtml(project.description || "")}
        </p>

        ${
          project.driveUrl
            ? `
              <a
                class="button secondary"
                href="${safeUrl(project.driveUrl)}"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Drive resource ↗
              </a>
            `
            : ""
        }

        ${
          project.projectUrl
            ? `
              <a
                class="card-link"
                href="${safeUrl(project.projectUrl)}"
                target="_blank"
                rel="noopener noreferrer"
              >
                View project ↗
              </a>
            `
            : ""
        }

      </article>

    `).join("");

  } catch (error) {

    console.error("Project loading error:", error);

    projectGrid.innerHTML = `
      <div class="empty-card">
        Project resources will be listed here soon.
      </div>
    `;

  }

}

// ========================================
// BACKGROUND ANIMATION CONTROL
// ========================================

const motionToggle = document.querySelector(".motion-toggle");

if (motionToggle) {

  motionToggle.addEventListener("click", () => {

    const paused =
      document.body.classList.toggle("motion-paused");

    motionToggle.setAttribute(
      "aria-pressed",
      String(paused)
    );

    motionToggle.textContent = paused
      ? "▶ Play animation"
      : "Ⅱ Pause animation";

    motionToggle.setAttribute(
      "aria-label",
      paused
        ? "Play background animation"
        : "Pause background animation"
    );

  });

}

// ========================================
// START WEBSITE
// ========================================

loadVideos();
loadProjects();
