// ========= LOADER =========
window.addEventListener("load", () => {
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 2500);
});

// ========= AÑO DINÁMICO =========
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ========= ANIMACIÓN REVEAL (SCROLL) =========
const reveals = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  reveals.forEach((el) => observer.observe(el));
} else {
  // Navegadores viejos: mostrar todo sin animación
  reveals.forEach((el) => el.classList.add("visible"));
}

// ========= SCROLL SUAVE PARA ENLACES "#..." =========
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ========= MODAL DE SEGURIDAD (RESERVAR POR WHATSAPP) =========
const heroBtn = document.getElementById("btnHeroReserva");
const modal = document.getElementById("security-modal");
const modalClose = document.getElementById("modalClose");
const modalGoForm = document.getElementById("modalGoForm");
const contactoSection = document.getElementById("contacto");

function openModal() {
  if (modal) modal.classList.add("open");
}

function closeModal() {
  if (modal) modal.classList.remove("open");
}

if (heroBtn) {
  heroBtn.addEventListener("click", openModal);
}

if (modalClose) {
  modalClose.addEventListener("click", closeModal);
}

if (modalGoForm) {
  modalGoForm.addEventListener("click", () => {
    closeModal();
    if (contactoSection) {
      contactoSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

if (modal) {
  // Cerrar modal al hacer clic fuera del cuadro
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

// ========= FORMULARIO → WHATSAPP =========
const btnWhatsForm = document.getElementById("btnWhatsForm");

if (btnWhatsForm) {
  btnWhatsForm.addEventListener("click", () => {
    const form = document.querySelector(".contact-form");
    if (!form) return;

    const nombre = form.nombre.value.trim();
    const tipo = form.tipo.value;
    const origen = form.origen.value.trim();
    const destino = form.destino.value.trim();
    const fecha = form.fecha.value;
    const comentarios = form.comentarios.value.trim();

    if (!nombre || !tipo || !origen || !destino || !fecha) {
      alert(
        "Por favor completa nombre, tipo de traslado, origen, destino y fecha/hora antes de enviar la reserva."
      );
      return;
    }

    const phone = "18574682732"; // Número de Joel sin '+'
    const message = `
*Solicitud de viaje desde la web JC DRIVER VIP*

👤 Nombre: ${nombre}
🚗 Tipo de traslado: ${tipo}
📍 Origen: ${origen}
🎯 Destino: ${destino}
🗓️ Fecha y hora: ${fecha}
💬 Comentarios: ${comentarios || "Ninguno"}
`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${phone}?text=${encoded}`;
    window.open(url, "_blank");
  });
}

// ========= GEOLOCALIZACIÓN: USAR MI UBICACIÓN ACTUAL =========
const btnUbicacionOrigen = document.getElementById("btnUbicacionOrigen");
const inputOrigen = document.getElementById("inputOrigen");

if (btnUbicacionOrigen && inputOrigen) {
  btnUbicacionOrigen.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }

    btnUbicacionOrigen.disabled = true;
    btnUbicacionOrigen.textContent = "Obteniendo ubicación...";

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;

        inputOrigen.value = mapsLink;

        btnUbicacionOrigen.disabled = false;
        btnUbicacionOrigen.textContent = "Usar mi ubicación actual";
      },
      (err) => {
        console.error(err);
        alert(
          "No se pudo obtener tu ubicación. Por favor verifica los permisos de ubicación."
        );
        btnUbicacionOrigen.disabled = false;
        btnUbicacionOrigen.textContent = "Usar mi ubicación actual";
      }
    );
  });
}

// ========= TARJETAS DE SERVICIOS CLICABLES =========
// Al hacer clic en un servicio, se selecciona el tipo en el formulario
// y se hace scroll a la sección de contacto.
const serviceCards = document.querySelectorAll(".service-card[data-tipo]");

if (serviceCards.length) {
  serviceCards.forEach((card) => {
    card.addEventListener("click", () => {
      const tipo = card.getAttribute("data-tipo");
      const selectTipo = document.querySelector('select[name="tipo"]');

      if (selectTipo && tipo) {
        selectTipo.value = tipo;
      }

      if (contactoSection) {
        contactoSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}
