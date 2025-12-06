// script.js – Nourisha interactions

document.addEventListener("DOMContentLoaded", () => {
  highlightActiveNav();
  enableSmoothScroll();
  logoScrollTop();
  attachCardToasts();
  initCalorieCalculator();
  initFaqAccordion();
  enhanceContactForm();
  initCart();
  initLocation();
  initHeroSlider();

});

/* ========== NAVBAR ========== */

// Active nav based on current page
function highlightActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    if (link.getAttribute("href") === path) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Smooth scroll for same‑page anchors (e.g. #privacy)
function enableSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

// Logo click -> scroll to top
function logoScrollTop() {
  const logo = document.querySelector(".logo");
  if (!logo) return;
  logo.style.cursor = "pointer";
  logo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ========== SIMPLE TOAST ========== */

function showToast(message) {
  let toast = document.getElementById("nourisha-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "nourisha-toast";
    toast.style.position = "fixed";
    toast.style.left = "50%";
    toast.style.bottom = "24px";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "#2f7a3a";
    toast.style.color = "#fff";
    toast.style.padding = "0.7rem 1.4rem";
    toast.style.borderRadius = "999px";
    toast.style.fontSize = "0.92rem";
    toast.style.fontWeight = "600";
    toast.style.boxShadow = "0 10px 25px rgba(0,0,0,0.25)";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.25s ease, transform 0.25s ease";
    toast.style.zIndex = "9999";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = "1";
  toast.style.transform = "translateX(-50%) translateY(-6px)";

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(0)";
  }, 2200);
}

/* ========== CARDS INTERACTION ========== */

// Home featured + menu + plan cards -> toast on click
function attachCardToasts() {
  const selectors = [".menu-card", ".plan-card"];
  selectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((card) => {
      card.style.cursor = "pointer";
      card.addEventListener("click", () => {
        const title =
          card.querySelector("h3") ||
          card.querySelector("h4") ||
          card.querySelector("h2");
        const name = title ? title.textContent.trim() : "this item";
        showToast(
          `Nice choice! “${name}” added to cart successfully.`
        );
      });
    });
  });
}

/* ========== CALORIE COUNTER ========== */
// Uses: #cc-age, #cc-height, #cc-weight, #cc-gender, #cc-activity, #cc-calc-btn, #cc-result

function initCalorieCalculator() {
  const ageEl = document.getElementById("cc-age");
  const heightEl = document.getElementById("cc-height");
  const weightEl = document.getElementById("cc-weight");
  const genderEl = document.getElementById("cc-gender");
  const activityEl = document.getElementById("cc-activity");
  const btn = document.getElementById("cc-calc-btn");
  const resultEl = document.getElementById("cc-result");

  // Agar yeh page nahi hai to kuch mat karo
  if (
    !ageEl ||
    !heightEl ||
    !weightEl ||
    !genderEl ||
    !activityEl ||
    !btn ||
    !resultEl
  )
    return;

  // result div ko card style dene ke liye class set
  resultEl.classList.add("cc-result-card");

  btn.addEventListener("click", () => {
    const age = parseInt(ageEl.value, 10);
    const height = parseFloat(heightEl.value);
    const weight = parseFloat(weightEl.value);
    const gender = genderEl.value;
    const activity = parseFloat(activityEl.value);

    if (!age || !height || !weight || !gender || !activity) {
      resultEl.innerHTML =
        "<p style='color:crimson;font-weight:600;'>Please fill all fields correctly.</p>";
      return;
    }

    // Mifflin–St Jeor BMR formula
    let bmr;
    if (gender === "female") {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    }

    const maintenance = Math.round(bmr * activity);
    const lose = maintenance - 400;
    const gain = maintenance + 300;

    resultEl.innerHTML = `
      <div class="cc-top">
        <h3>Daily calories</h3>
        <p class="cc-sub">Based on your age, height, weight and activity.</p>
        <p class="cc-main-value">${maintenance}<span>kcal</span></p>
      </div>

      <div class="cc-layout">
        <div class="cc-ring-block">
          <div class="cc-ring">
            <div class="cc-ring-inner">
              <span>${maintenance}</span>
              <small>maintain</small>
            </div>
          </div>
        </div>

        <div class="cc-info-block">
          <p class="cc-info-title">Suggested ranges</p>
          <div class="cc-targets">
            <div class="cc-target">
              <p class="cc-label">Weight loss</p>
              <p class="cc-number">${lose} kcal/day</p>
              <p class="cc-note">Mild deficit for gradual fat loss.</p>
            </div>
            <div class="cc-target">
              <p class="cc-label">Muscle gain</p>
              <p class="cc-number">${gain} kcal/day</p>
              <p class="cc-note">Small surplus for lean gains.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

/* ========== FAQ ACCORDION ========== */

function initFaqAccordion() {
  const items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  items.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!btn || !answer) return;

    answer.style.display = "none";

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // close all
      items.forEach((other) => {
        other.classList.remove("open");
        const a = other.querySelector(".faq-answer");
        if (a) a.style.display = "none";
      });

      // open this one if it was closed
      if (!isOpen) {
        item.classList.add("open");
        answer.style.display = "block";
      }
    });
  });
}

/* ========== CONTACT FORM ========== */
/*
<form id="contact-form">
  inputs: #name, #email, #message
</form>
*/

function enhanceContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameEl = form.querySelector("#name");
  const emailEl = form.querySelector("#email");
  const messageEl = form.querySelector("#message");

  let feedback = document.getElementById("contact-feedback");
  if (!feedback) {
    feedback = document.createElement("div");
    feedback.id = "contact-feedback";
    feedback.style.marginTop = "0.6rem";
    feedback.style.fontSize = "0.9rem";
    form.appendChild(feedback);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const msg = messageEl.value.trim();

    if (!name || !email || !msg) {
      feedback.textContent = "Please fill in all fields.";
      feedback.style.color = "crimson";
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      feedback.textContent = "Please enter a valid email address.";
      feedback.style.color = "crimson";
      return;
    }

    feedback.textContent =
      "Thanks for reaching out! We will get back to you soon. (Demo only)";
    feedback.style.color = "#2f7a3a";
    showToast("Message sent (demo).");
    form.reset();
  });
}

/* ========== CART SYSTEM ========== */

let cart = [];

function initCart() {
  const cartIcon = document.getElementById("nav-cart");
  const cartPanel = document.getElementById("cart-panel");
  const cartClose = document.getElementById("cart-close-btn");
  const cartClear = document.getElementById("cart-clear-btn");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartCountEl = document.getElementById("cart-count");
  const cartTotalEl = document.getElementById("cart-total");

  if (
    !cartIcon ||
    !cartPanel ||
    !cartItemsContainer ||
    !cartCountEl ||
    !cartTotalEl
  ) {
    return;
  }

  // Load from localStorage if available
  const saved = window.localStorage.getItem("nourisha-cart");
  if (saved) {
    try {
      cart = JSON.parse(saved);
    } catch (e) {
      cart = [];
    }
  }

  updateCartUI();

  cartIcon.addEventListener("click", () => {
    cartPanel.classList.add("open");
  });

  if (cartClose) {
    cartClose.addEventListener("click", () => {
      cartPanel.classList.remove("open");
    });
  }

  if (cartClear) {
    cartClear.addEventListener("click", () => {
      cart = [];
      persistCart();
      updateCartUI();
    });
  }

  // Attach add-to-cart buttons
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price, 10) || 0;
      const calories = parseInt(btn.dataset.calories, 10) || 0;

      addItemToCart({ name, price, calories });
    });
  });

  // Remove item (event delegation)
  cartItemsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("cart-item-remove")) {
      const index = parseInt(e.target.dataset.index, 10);
      if (!isNaN(index)) {
        cart.splice(index, 1);
        persistCart();
        updateCartUI();
      }
    }
  });

  function addItemToCart(item) {
    cart.push(item);
    persistCart();
    updateCartUI();
    showToast(`${item.name} added to cart.`);
  }

  function persistCart() {
    window.localStorage.setItem("nourisha-cart", JSON.stringify(cart));
  }

  function updateCartUI() {
    // count
    cartCountEl.textContent = cart.length;

    // total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalEl.textContent = total;

    // items list
    cartItemsContainer.innerHTML = "";
    if (!cart.length) {
      const p = document.createElement("p");
      p.className = "cart-empty";
      p.textContent = "Your cart is empty.";
      cartItemsContainer.appendChild(p);
      return;
    }

    cart.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "cart-item";

      row.innerHTML = `
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-meta">${item.calories} kcal · ₹${item.price}</span>
        </div>
        <button class="cart-item-remove" data-index="${index}">×</button>
      `;

      cartItemsContainer.appendChild(row);
    });
  }
}
/* ========== LOCATION DETECTION ========== */

function initLocation() {
  const citySpan = document.getElementById("user-city");
  if (!citySpan) return;

  // Agar pehle se localStorage me saved hai to wahi dikha do
  const savedCity = window.localStorage.getItem("nourisha-city");
  if (savedCity) {
    citySpan.textContent = savedCity;
    return;
  }

  citySpan.textContent = "Detecting...";

  // Helper: API se city nikaalna
  function fetchCity(lat, lon) {
    let url = "https://geolocation-db.com/json/"; // IP-based simple API
    if (lat != null && lon != null) {
      // BigDataCloud client-side reverse geocode to city API [web:136]
      url =
        "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" +
        encodeURIComponent(lat) +
        "&longitude=" +
        encodeURIComponent(lon) +
        "&localityLanguage=en";
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // BigDataCloud: data.city || data.locality; Geolocation-DB: data.city [web:136]
        const city =
          data.city ||
          data.locality ||
          data.principalSubdivision ||
          data.countryName ||
          "Your area";
        citySpan.textContent = city;
        window.localStorage.setItem("nourisha-city", city);
      })
      .catch(() => {
        citySpan.textContent = "Your area";
      });
  }

  // Try browser geolocation first [web:131][web:144]
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchCity(latitude, longitude);
      },
      () => {
        // Permission denied or error -> fall back to IP-based
        fetchCity(null, null);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  } else {
    // Geolocation not supported -> IP fallback
    fetchCity(null, null);
  }
}
/* ========== HERO SLIDER ========== */

function initHeroSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  if (!slides.length) return;

  const prevBtn = document.getElementById("hero-prev");
  const nextBtn = document.getElementById("hero-next");
  let current = 0;
  let timer;

  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle("active", i === index);
    });
    current = index;
  }

  function nextSlide() {
    const next = (current + 1) % slides.length;
    showSlide(next);
  }

  function prevSlide() {
    const prev = (current - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  // auto-play
  function startAuto() {
    stopAuto();
    timer = setInterval(nextSlide, 5000);
  }

  function stopAuto() {
    if (timer) clearInterval(timer);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      startAuto();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      startAuto();
    });
  }

  // pause on hover
  const slider = document.querySelector(".hero-slider");
  if (slider) {
    slider.addEventListener("mouseenter", stopAuto);
    slider.addEventListener("mouseleave", startAuto);
  }

  showSlide(0);
  startAuto();
}
