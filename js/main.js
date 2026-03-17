/**
 * ================================================
 * VoltShop — Главный JavaScript файл
 * Управление DOM: тема, навигация, таймер, корзина
 * ================================================
 */

/* ------------------------------------------------
   Переключение темы (тёмная / светлая)
   ------------------------------------------------ */
(function initTheme() {
  var saved = null;
  try {
    saved = localStorage.getItem("voltshop-theme");
  } catch (e) {}
  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
    updateThemeIcon(saved);
  }
})();

function toggleTheme() {
  var current = document.documentElement.getAttribute("data-theme") || "dark";
  var next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  updateThemeIcon(next);
  try {
    localStorage.setItem("voltshop-theme", next);
  } catch (e) {}
}

function updateThemeIcon(theme) {
  var moon = document.getElementById("icon-moon");
  var sun = document.getElementById("icon-sun");
  if (!moon || !sun) return;
  if (theme === "light") {
    moon.style.display = "none";
    sun.style.display = "";
  } else {
    moon.style.display = "";
    sun.style.display = "none";
  }
}

/* ------------------------------------------------
   Подсветка активной ссылки в навигации
   ------------------------------------------------ */
function setActiveNav() {
  var path = window.location.pathname.split("/").pop() || "index.html";
  var links = document.querySelectorAll(".main-nav a, .footer-nav a");
  links.forEach(function (a) {
    var href = a.getAttribute("href") || "";
    if (href === path || (path === "index.html" && href === "index.html")) {
      a.classList.add("active");
    } else {
      a.classList.remove("active");
    }
  });
}

/* ------------------------------------------------
   Таймер обратного отсчёта (только на главной)
   ------------------------------------------------ */
function initCountdown() {
  var hEl = document.getElementById("t-hours");
  var mEl = document.getElementById("t-mins");
  var sEl = document.getElementById("t-secs");
  if (!hEl) return;

  var h = 8,
    m = 24,
    s = 37;
  setInterval(function () {
    s--;
    if (s < 0) {
      s = 59;
      m--;
    }
    if (m < 0) {
      m = 59;
      h--;
    }
    if (h < 0) {
      h = 0;
      m = 0;
      s = 0;
    }
    hEl.textContent = String(h).padStart(2, "0");
    mEl.textContent = String(m).padStart(2, "0");
    sEl.textContent = String(s).padStart(2, "0");
  }, 1000);
}

/* ------------------------------------------------
   Управление количеством (страница товара)
   ------------------------------------------------ */
function changeQty(delta) {
  var el = document.getElementById("product-qty");
  if (!el) return;
  var val = parseInt(el.textContent) + delta;
  el.textContent = Math.max(1, val);
}

/* ------------------------------------------------
   Выбор миниатюры в галерее (страница товара)
   ------------------------------------------------ */
function selectThumb(el, emoji) {
  document.querySelectorAll(".product-thumb").forEach(function (t) {
    t.classList.remove("active");
  });
  el.classList.add("active");
  var main = document.getElementById("main-img");
  if (main) main.textContent = emoji;
}

/* ------------------------------------------------
   Ценовой слайдер (каталог)
   ------------------------------------------------ */
function initPriceRange() {
  var range = document.getElementById("price-range");
  var display = document.getElementById("price-display");
  if (!range || !display) return;
  range.addEventListener("input", function () {
    display.textContent = parseInt(this.value).toLocaleString("ru-RU") + " ₽";
  });
}

/* ------------------------------------------------
   Удаление товара из корзины
   ------------------------------------------------ */
function removeCartItem(btn) {
  var item = btn.closest(".cart-item");
  if (item) {
    item.style.opacity = "0";
    item.style.transform = "translateX(20px)";
    item.style.transition = "opacity 0.25s, transform 0.25s";
    setTimeout(function () {
      item.remove();
      updateCartCount();
    }, 250);
  }
}

function updateCartCount() {
  var items = document.querySelectorAll(".cart-item");
  var badge = document.querySelector(".cart-badge");
  var heading = document.querySelector(".cart-count");
  var count = items.length;
  if (badge) badge.textContent = count;
  if (heading)
    heading.textContent =
      "(" + count + " " + pluralRu(count, "товар", "товара", "товаров") + ")";
}

function pluralRu(n, f1, f2, f5) {
  var mod10 = n % 10,
    mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return f5;
  if (mod10 === 1) return f1;
  if (mod10 >= 2 && mod10 <= 4) return f2;
  return f5;
}

/* ------------------------------------------------
   Инициализация при загрузке страницы
   ------------------------------------------------ */
document.addEventListener("DOMContentLoaded", function () {
  setActiveNav();
  initCountdown();
  initPriceRange();
  updateThemeIcon(
    document.documentElement.getAttribute("data-theme") || "dark",
  );
});
