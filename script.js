

// SHOW SECTION
function showSection(section) {
  const law = document.getElementById("lawSection");
  const penalty = document.getElementById("penaltySection");

  if (!law || !penalty) {
    console.log("❌ Sections not found");
    return;
  }

  law.style.display = "none";
  penalty.style.display = "none";

  if (section === "law") {
    law.style.display = "block";
  } else {
    penalty.style.display = "block";
  }
}

async function searchLaw() {
  const input = document.getElementById("lawInput");
  const resultBox = document.getElementById("lawResult");

  if (!input || !resultBox) return;

  const query = (input.value || "").trim();
  if (!query) {
    resultBox.innerHTML = "<p>Please enter a law name or section.</p>";
    return;
  }

  resultBox.innerHTML = "<p>Searching...</p>";
  try {
    const res = await fetch(`http://localhost:5000/api/law/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      resultBox.innerHTML = "<p>No law found.</p>";
      return;
    }

    resultBox.innerHTML = data
      .map(
        (law) => `
          <div class="card">
            <h3>${law.law_name || "Law"}</h3>
            <p><b>Section:</b> ${law.section_number || "N/A"}</p>
            <p>${law.description || ""}</p>
          </div>
        `
      )
      .join("");
  } catch (err) {
    console.log("Law search error:", err);
    resultBox.innerHTML = "<p>Failed to search law. Is the server running?</p>";
  }
}

async function checkPenalty() {
  const violationEl = document.getElementById("violation");
  const stateEl = document.getElementById("state");
  const resultBox = document.getElementById("penaltyResult");

  if (!violationEl || !stateEl || !resultBox) return;

  const violation = (violationEl.value || "").trim();
  const state = (stateEl.value || "").trim();

  if (!violation || !state) {
    resultBox.innerHTML = "<p>Please enter both violation and state.</p>";
    return;
  }

  resultBox.innerHTML = "<p>Checking...</p>";
  try {
    const res = await fetch(
      `http://localhost:5000/api/penalty/get?violation=${encodeURIComponent(violation)}&state=${encodeURIComponent(state)}`
    );
    const data = await res.json();

    if (data && data.message) {
      resultBox.innerHTML = `<p>${data.message}</p>`;
      return;
    }

    if (!data) {
      resultBox.innerHTML = "<p>No penalty found.</p>";
      return;
    }

    resultBox.innerHTML = `
      <div class="card">
        <h3>Penalty</h3>
        <p><b>Violation:</b> ${data.violation || violation}</p>
        <p><b>State:</b> ${data.state || state}</p>
        <p><b>Penalty:</b> ${data.fine_amount ?? data.penalty ?? data.fine ?? "N/A"}</p>
        ${data.imprisonment ? `<p><b>Imprisonment:</b> ${data.imprisonment}</p>` : ""}
        ${data.section ? `<p><b>Section:</b> ${data.section}</p>` : ""}
      </div>
    `;
  } catch (err) {
    console.log("Penalty check error:", err);
    resultBox.innerHTML = "<p>Failed to check penalty. Is the server running?</p>";
  }
}
  
  function toggleProfile() {
    const box = document.getElementById("profileBox");
    box.style.display = box.style.display === "block" ? "none" : "block";
  }
  function checkLogin() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (token && user) {
      const auth = document.getElementById("authSection");
      const profile = document.getElementById("profileIcon");
  
      if (auth) auth.style.display = "none";
      if (profile) profile.style.display = "block";
    }
  }
  
  // LOAD USER
  window.onload = function () {
    try {
      checkLogin();
  
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
  
      if (token && user) {
        if (document.getElementById("pname"))
          document.getElementById("pname").innerText = "Name: " + user.name;
  
        if (document.getElementById("pemail"))
          document.getElementById("pemail").innerText = "Email: " + user.email;
  
        if (document.getElementById("pphone"))
          document.getElementById("pphone").innerText = "Phone: " + (user.phone || "N/A");
  
        if (document.getElementById("pstate"))
          document.getElementById("pstate").innerText = "State: " + (user.state || "N/A");
  
        if (document.getElementById("pgender"))
          document.getElementById("pgender").innerText = "Gender: " + (user.gender || "N/A");
  
        if (document.getElementById("pprofile"))
          document.getElementById("pprofile").innerText = "Profile: " + (user.profile || "N/A");
      }
  
      // ✅ ADD BUTTON EVENTS HERE 👇
      // button events are attached in DOMContentLoaded below
  
      // OPTIONAL: disable for now if API not working
       //loadNews();
  
    } catch (err) {
      console.log("Error:", err);
    }
  };
  
  // 📰 NEWS API
  async function loadNews() {
    try {
      const res = await fetch("https://gnews.io/api/v4/top-headlines?country=in&token=35d329571b0fa23b26ab7b6c8c312a5e");
      const data = await res.json();
  
      const newsList = document.getElementById("newsList");
      newsList.innerHTML = "";
  
      data.articles.forEach(article => {
        const div = document.createElement("div");
        div.innerHTML = `<p>${article.title}</p>`;
        newsList.appendChild(div);
      });
  
    } catch (err) {
      console.log("News error:", err);
    }
  }
  async function register() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (!name || !email || !password) {
        return showPopup("Please fill all fields ❗", "#dc2626");
      }
    const phone = document.getElementById("phone").value;
    const state = document.getElementById("state").value;
    const gender = document.getElementById("gender").value;
    const profile = document.getElementById("profile").value;
  
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, state, gender, profile })
      });
    
      const data = await res.json().catch(() => ({}));
    
      if (!res.ok) {
        return showPopup(data.message || "Registration failed ❌", "#dc2626");
      }
    
      showPopup(data.message || "Registered successfully ✅", "#16a34a");
    
      // redirect to login
      window.location.href = "login.html";
    } catch (err) {
      console.log("Register error:", err);
      showPopup("Registration failed ❌", "#dc2626");
    }
  
  }
  
  
    
  async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    if (!email || !password) {
        return showPopup("Enter email & password ❗", "#dc2626");
      }
  
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
    
      const data = await res.json().catch(() => ({}));
    
      if (!res.ok) {
        return showPopup(data.message || "Login failed ❌", "#dc2626");
      }
    
      if (data.token) {
        showPopup("Login successful ✅", "#16a34a");
    
        // 🔥 STORE TOKEN + USER
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
    
        window.location.href = "index.html";
      } else {
        showPopup(data.message || "Invalid credentials ❌", "#dc2626");
      }
    } catch (err) {
      console.log("Login error:", err);
      showPopup("Login failed ❌", "#dc2626");
    }

  }

  function showPopup(message, color = "#374151") {
    const popup = document.getElementById("popup");
    popup.innerText = message;
    popup.style.background = color;
    popup.style.display = "block";
  
    setTimeout(() => {
      popup.style.display = "none";
    }, 3000);
  }

  document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM Loaded ✅");
  
    const lawBtn = document.getElementById("lawBtn");
    const penaltyBtn = document.getElementById("penaltyBtn");
  
    if (!lawBtn || !penaltyBtn) {
      console.log("❌ Buttons not found");
      return;
    }
  
    console.log("✅ Buttons connected");
  
    lawBtn.addEventListener("click", function () {
      console.log("Law clicked");
      searchLaw();
    });
  
    penaltyBtn.addEventListener("click", function () {
      console.log("Penalty clicked");
      checkPenalty();
    });
  });