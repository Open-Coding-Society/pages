class PersonaHallTrial {
    constructor({ profileData = {}, onComplete = null, onClose = null } = {}) {
      this.profileData = profileData;
      this.onComplete = onComplete;
      this.onClose = onClose;
      this.overlay = null;
  
      this.personas = [
        {
          id: "technologist",
          title: "Technologist",
          summary: "Driven, independent, technical problem-solver.",
          img: "/images/personas/technologist.png",
          color: "#20c7ff",
        },
        {
          id: "scrummer",
          title: "Scrummer",
          summary: "Collaborative learner who grows through teamwork and iteration.",
          img: "/images/personas/scrummer.png",
          color: "#ffb12b",
        },
        {
          id: "planner",
          title: "Planner",
          summary: "Organized project manager who tracks, plans, and communicates.",
          img: "/images/personas/planner.png",
          color: "#7cff4f",
        },
        {
          id: "closer",
          title: "Closer",
          summary: "Detail-oriented finisher who thrives with clear milestones.",
          img: "/images/personas/finisher.png",
          color: "#ff4b4b",
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
          width: min(980px, 94vw);
          max-height: 90vh;
          overflow-y: auto;
          background: rgba(13,13,26,0.96);
          border: 2px solid #4ecca3;
          border-radius: 14px;
          padding: 24px;
          color: #e0e0e0;
          box-shadow: 0 0 28px rgba(78,204,163,0.28);
        ">
          <h2 style="margin:0 0 8px; color:#4ecca3; text-align:center;">
            Persona Hall
          </h2>
          <p style="text-align:center; margin:0;">
            Choose the persona that best matches how you work in CS projects.
          </p>
  
          <div id="persona-options" style="
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
            margin-top: 20px;
          "></div>
  
          <div style="display:flex; justify-content:flex-end; margin-top:20px;">
            <button id="persona-close" style="
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
  
      const options = this.overlay.querySelector("#persona-options");
  
      this.personas.forEach((persona) => {
        const button = document.createElement("button");
  
        button.style.cssText = `
          text-align: center;
          background: #070b18;
          color: #e0e0e0;
          border: 2px solid ${persona.color};
          border-radius: 12px;
          padding: 10px;
          cursor: pointer;
          font-family: inherit;
          transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
        `;
  
        button.innerHTML = `
          <img src="${persona.img}" alt="${persona.title}" style="
            width: 100%;
            height: 230px;
            object-fit: cover;
            border-radius: 10px;
            display: block;
            margin-bottom: 10px;
          ">
  
          <h3 style="
            margin:0 0 6px;
            color:${persona.color};
            font-size:22px;
            letter-spacing:1px;
            text-transform:uppercase;
          ">${persona.title}</h3>
  
          <p style="
            margin:0;
            line-height:1.35;
            font-size:13px;
            color:#d8e6ef;
          ">${persona.summary}</p>
        `;
  
        button.onmouseenter = () => {
          button.style.transform = "scale(1.035)";
          button.style.filter = "brightness(1.08)";
          button.style.boxShadow = `0 0 24px ${persona.color}66`;
        };
  
        button.onmouseleave = () => {
          button.style.transform = "scale(1)";
          button.style.filter = "brightness(1)";
          button.style.boxShadow = "none";
        };
  
        button.onclick = () => this.selectPersona(persona);
        options.appendChild(button);
      });
  
      this.overlay.querySelector("#persona-close").onclick = () => this.close();
    }
  
    selectPersona(persona) {
      this.close();
  
      this.onComplete?.({
        persona: persona.id,
        title: persona.title,
        summary: persona.summary,
        image: persona.img,
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
  
  export default PersonaHallTrial;