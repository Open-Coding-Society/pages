(function () {
  const form = document.getElementById("capstoneForm");
  const status = document.getElementById("capstoneStatus");

  if (!form) return;

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    status.textContent = "Creating capstone...";
    status.className = "capstone-status";

    const formData = new FormData(form);

    const payload = {
      title: (formData.get("title") || "").toString().trim(),
      teamMembers: (formData.get("teamMembers") || "").toString().trim(),
      description: (formData.get("description") || "").toString().trim(),
      courseCode: (formData.get("courseCode") || "csse").toString().trim(),
      week: (formData.get("week") || "25").toString().trim(),
      heroTitle: (formData.get("heroTitle") || "Overview").toString().trim(),
      badge: (formData.get("badge") || "DESIGN-BASED RESEARCH CAPSTONE").toString().trim(),
      overview: (formData.get("overview") || "").toString().trim(),
      featureBullets: splitLines(formData.get("featureBullets")),
      impactBullets: splitLines(formData.get("impactBullets")),
      tags: splitLines(formData.get("tags")),
      imageUrl: (formData.get("imageUrl") || "").toString().trim()
    };

    const token = (formData.get("token") || "").toString().trim();

    try {
      const response = await fetch("http://localhost:8585/api/capstones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create capstone.");
      }

      status.textContent = `Created successfully: ${result.filePath}. GitHub Pages may take a minute to rebuild.`;
      status.className = "capstone-status capstone-success";
      form.reset();
    } catch (error) {
      status.textContent = error.message || "Something went wrong.";
      status.className = "capstone-status capstone-error";
    }
  });

  function splitLines(value) {
    return (value || "")
      .toString()
      .split("\n")
      .map(item => item.trim())
      .filter(Boolean);
  }
})();
