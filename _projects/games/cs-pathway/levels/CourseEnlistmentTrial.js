class CourseEnlistmentTrial {
  constructor({ profileData = {}, onComplete = null, onClose = null } = {}) {
    this.profileData = profileData;
    this.onComplete = onComplete;
    this.onClose = onClose;
    this.overlay = null;

    this.courses = [
      {
        id: "CSSE",
        title: "CSSE",
        summary: "Foundational coding and software engineering skills.",
        color: "#f59e0b",
      },
      {
        id: "CSP",
        title: "CSP",
        summary: "Creative computing, projects, and broader CS concepts.",
        color: "#60a5fa",
      },
      {
        id: "CSA",
        title: "CSA",
        summary: "More advanced programming, logic, and problem solving.",
        color: "#a78bfa",
      },
      {
        id: "CSH",
        title: "CS Honors",
        summary: "Advanced honors-level computer science after CSA.",
        color: "#34d399",
      },
    ];
  }

  start() {
    this.overlay = document.createElement("div");
    this.overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 3000;
      background: rgba(0, 0, 0, 0.72);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Courier New', monospace;
      backdrop-filter: blur(4px);
    `;

    this.overlay.innerHTML = `
      <div style="
        width: min(760px, 94vw);
        background: rgba(13,13,26,0.96);
        border: 2px solid #4ecca3;
        border-radius: 14px;
        padding: 24px;
        color: #e0e0e0;
        box-shadow: 0 0 28px rgba(78,204,163,0.28);
      ">
        <h2 style="margin:0 0 8px; color:#4ecca3; text-align:center;">
          Course Enlistment
        </h2>

        <p style="text-align:center; margin:0;">
          Choose your course.
        </p>

        <div id="course-options" style="
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-top: 20px;
        "></div>

        <div style="display:flex; justify-content:flex-end; margin-top:20px;">
          <button id="course-close" style="
            background: transparent;
            color: #e0e0e0;
            border: 1px solid #777;
            padding: 8px 14px;
            border-radius: 8px;
            cursor: pointer;
            font-family: inherit;
          ">Cancel</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);

    const options = this.overlay.querySelector("#course-options");

    this.courses.forEach((course) => {
      const button = document.createElement("button");

      button.style.cssText = `
        text-align: center;
        background: #070b18;
        color: #e0e0e0;
        border: 2px solid ${course.color};
        border-radius: 12px;
        padding: 24px 14px;
        cursor: pointer;
        font-family: inherit;
        transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
      `;

      button.innerHTML = `
        <h3 style="
          margin:0 0 8px;
          color:${course.color};
          font-size:28px;
          letter-spacing:1px;
          text-transform:uppercase;
        ">${course.title}</h3>

        <p style="
          margin:0;
          line-height:1.35;
          font-size:13px;
          color:#d8e6ef;
        ">${course.summary}</p>
      `;

      button.onmouseenter = () => {
        button.style.transform = "scale(1.035)";
        button.style.filter = "brightness(1.08)";
        button.style.boxShadow = `0 0 24px ${course.color}66`;
      };

      button.onmouseleave = () => {
        button.style.transform = "scale(1)";
        button.style.filter = "brightness(1)";
        button.style.boxShadow = "none";
      };

      button.onclick = () => this.selectCourse(course);
      options.appendChild(button);
    });

    this.overlay.querySelector("#course-close").onclick = () => this.close();
  }

  selectCourse(course) {
    this.close();

    this.onComplete?.({
      course: course.id,
      title: course.title,
      summary: course.summary,
      recommendedClasses: [course.title],
    });
  }

  close() {
    if (this.overlay?.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }

    this.overlay = null;
    this.onClose?.();
  }
}

export default CourseEnlistmentTrial;