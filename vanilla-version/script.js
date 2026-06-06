// Update Current Date for the banner
function updateDate() {
  const dateEl = document.getElementById("current-date");
  if (dateEl) {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    dateEl.textContent = `${day}/${month}/${year}`;
  }
}

// 20-Minute Countdown Timer
function startTimer() {
  const minEl = document.getElementById("timer-m");
  const secEl = document.getElementById("timer-s");

  if (!minEl || !secEl) return;

  let time = 20 * 60; // 20 minutes in seconds

  // Check if there's a saved time in session storage
  const savedTime = sessionStorage.getItem("lp_timer_remaining");
  if (savedTime) {
    time = parseInt(savedTime, 10);
  }

  const interval = setInterval(() => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    minEl.textContent = String(minutes).padStart(2, "0");
    secEl.textContent = String(seconds).padStart(2, "0");

    if (time <= 0) {
      clearInterval(interval);
      // Optionally reset or keep at 0
      time = 20 * 60; // For demo, let's just loop or stop
    } else {
      time--;
      sessionStorage.setItem("lp_timer_remaining", time);
    }
  }, 1000);
}

// Simple Intersection Observer for scroll animations
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    { threshold: 0.1 },
  );

  document
    .querySelectorAll("section, .card, .bonus-card, .testimonial-card")
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
      observer.observe(el);
    });
}

// Video Auto Play/Pause logic
function initVideoObserver() {
  const video = document.getElementById("vsl-video");
  const overlay = document.getElementById("vsl-overlay");
  if (!video) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Play the video. Muted attribute in HTML ensures this works.
          video.play().catch((error) => {
            console.log("Autoplay blocked.", error);
          });
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.5 },
  );

  observer.observe(video);

  // Unmute interaction
  if (overlay) {
    overlay.addEventListener("click", () => {
      video.muted = false; // Unmute the video
      video.currentTime = 0; // Restart from beginning for full impact
      overlay.style.opacity = "0";
      setTimeout(() => {
        overlay.style.display = "none";
      }, 300);
    });
  }
}

// Custom style for the observer classes (integrated into the observer function)
document.addEventListener("DOMContentLoaded", () => {
  updateDate();
  startTimer();
  initScrollAnimations();
  initVideoObserver(); // Initialize local video observer

  // Re-inject Lucide just in case
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

// Polyfill for "in-view" if not using the class in CSS directly
const style = document.createElement("style");
style.textContent = `
    .in-view {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);
