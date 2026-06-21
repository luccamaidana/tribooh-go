/* ==========================================================================
   Tribooh Go! — Ruleta de premios
   Lógica: giro random, selección de premio y descarga.
   ========================================================================== */

(() => {
  "use strict";

  /**
   * Los 6 premios, en el MISMO ORDEN en que aparecen en la imagen de la
   * ruleta (assets/ruleta.png), recorridos en sentido horario empezando
   * arriba (12 en punto).
   *
   * "centerAngle" es el ángulo (en grados, sentido horario, 0° = arriba)
   * donde cae el CENTRO de ese gajo dentro de la imagen de la ruleta.
   * Como son 6 gajos iguales, cada uno mide 60°.
   *
   * Si en algún momento reemplazan assets/ruleta.png por una versión con
   * los gajos en otro orden, solo hay que actualizar este array.
   */
  const PREMIOS = [
    {
      id: "rompecabezas",
      centerAngle: 0,
      btnImg: "assets/premios/btn-rompecabezas.png",
      jpg: "assets/premios/jpg-rompecabezas.jpg",
      archivoDescarga: "tribooh-go-rompecabezas.jpg",
      // TODO: este premio todavía no tiene asset propio (falta el JPG final).
      // Por ahora reutiliza el botón y el JPG de "diploma" como placeholder.
      // Cuando tengan el arte definitivo, reemplazar los dos archivos de
      // arriba (btn-rompecabezas.png y jpg-rompecabezas.jpg) y listo.
    },
    {
      id: "a-colorear",
      centerAngle: 60,
      btnImg: "assets/premios/btn-a-colorear.png",
      jpg: "assets/premios/jpg-a-colorear.jpg",
      archivoDescarga: "tribooh-go-a-colorear.jpg",
    },
    {
      id: "tarjetas",
      centerAngle: 120,
      btnImg: "assets/premios/btn-tarjetas.png",
      jpg: "assets/premios/jpg-tarjetas.jpg",
      archivoDescarga: "tribooh-go-tarjetas.jpg",
    },
    {
      id: "diploma",
      centerAngle: 180,
      btnImg: "assets/premios/btn-diploma.png",
      jpg: "assets/premios/jpg-diploma.jpg",
      archivoDescarga: "tribooh-go-diploma.jpg",
    },
    {
      id: "poster",
      centerAngle: 240,
      btnImg: "assets/premios/btn-poster.png",
      jpg: "assets/premios/jpg-poster.jpg",
      archivoDescarga: "tribooh-go-poster.jpg",
    },
    {
      id: "stickers",
      centerAngle: 300,
      btnImg: "assets/premios/btn-stickers.png",
      jpg: "assets/premios/jpg-stickers.jpg",
      archivoDescarga: "tribooh-go-stickers.jpg",
    },
  ];

  const VUELTAS_MINIMAS = 6; // vueltas completas antes de frenar, solo estética
  const DURACION_GIRO_MS = 4200; // debe coincidir con la transition-duration del CSS (.ruleta.girando)

  // -- Referencias al DOM ---------------------------------------------------
  const pantallaRuleta = document.getElementById("pantalla-ruleta");
  const pantallaPremio = document.getElementById("pantalla-premio");
  const ruleta = document.getElementById("ruleta");
  const btnGirar = document.getElementById("btn-girar");
  const btnDescargar = document.getElementById("premio-nombre");
  const btnOtraVez = document.getElementById("btn-otra-vez");
  const imgPremioNombre = document.getElementById("premio-nombre");
  const linkDescargaOculto = document.getElementById("link-descarga-oculto");

  // -- Estado -----------------------------------------------------------------
  let rotacionAcumulada = 0;
  let girando = false;
  let premioActual = null;

  /**
   * Elige un premio al azar. Los 6 tienen la misma probabilidad
   * (1/6 cada uno), tal como se definió.
   */
  function elegirPremioRandom() {
    const indice = Math.floor(Math.random() * PREMIOS.length);
    return PREMIOS[indice];
  }

  /**
   * Calcula cuántos grados hay que rotar la ruleta (en sentido horario,
   * sumado a lo ya rotado) para que el premio elegido termine bajo la
   * flecha superior.
   */
  function calcularRotacionParaPremio(premio) {
    // Para que el centro del gajo quede a 0° (arriba), hay que rotar
    // (360 - centerAngle). Le sumamos un jitter al azar para que no
    // caiga siempre exacto en el centro del gajo (se ve más natural),
    // dejando margen de sobra respecto al borde del gajo (±60°/2 = ±30°).
    const jitter = (Math.random() * 36) - 18; // entre -18° y +18°
    const objetivoDentroDeVuelta = (360 - premio.centerAngle + jitter + 360) % 360;

    // Vueltas completas extra, solo para que la animación se vea bien.
    const vueltasExtra = VUELTAS_MINIMAS * 360;

    // Se suma a la rotación acumulada para que la ruleta siempre siga
    // girando "hacia adelante" en vez de saltar para atrás.
    const rotacionBase = rotacionAcumulada - (rotacionAcumulada % 360);
    return rotacionBase + vueltasExtra + objetivoDentroDeVuelta;
  }

  function girarRuleta() {
    if (girando) return;
    girando = true;
    btnGirar.disabled = true;

    premioActual = elegirPremioRandom();
    rotacionAcumulada = calcularRotacionParaPremio(premioActual);

    ruleta.classList.add("girando");
    ruleta.style.transform = `rotate(${rotacionAcumulada}deg)`;

    // Fallback con setTimeout por si transitionend no dispara
    // (por ejemplo, si la pestaña pierde foco durante la animación).
    let yaResuelto = false;
    const resolverFinDeGiro = () => {
      if (yaResuelto) return;
      yaResuelto = true;
      mostrarPantallaPremio(premioActual);
    };

    ruleta.addEventListener("transitionend", resolverFinDeGiro, { once: true });
    setTimeout(resolverFinDeGiro, DURACION_GIRO_MS + 300);
  }

  function mostrarPantallaPremio(premio) {
    imgPremioNombre.src = premio.btnImg;
    imgPremioNombre.alt = `Tu premio: ${premio.id}`;

    pantallaRuleta.classList.remove("pantalla--activa");
    pantallaPremio.classList.add("pantalla--activa");

    girando = false;
    btnGirar.disabled = false;
  }

  function descargarPremio() {
    if (!premioActual) return;
    linkDescargaOculto.href = premioActual.jpg;
    linkDescargaOculto.setAttribute("download", premioActual.archivoDescarga);
    linkDescargaOculto.click();
  }

  function girarDeNuevo() {
    pantallaPremio.classList.remove("pantalla--activa");
    pantallaRuleta.classList.add("pantalla--activa");
  }

  // -- Eventos ----------------------------------------------------------------
  btnGirar.addEventListener("click", girarRuleta);
  btnDescargar.addEventListener("click", descargarPremio);
  btnOtraVez.addEventListener("click", girarDeNuevo);
})();
