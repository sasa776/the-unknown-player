
const screen = document.getElementById("screen");

const state = {
  started: false,
  level: 1,
  inventory: [],
  guesses: [],
  mistakes: 0,
  feedback: "",
  feedbackType: "",
  finalStep: 0
};

const objects = {
  duck: { icon: "🦆", name: "Mr. Cuack" },
  badge: { icon: "🏥", name: "Credencial de infiltrada" },
  flowers: { icon: "💐", name: "Ramo de flores" },
  note: { icon: "🎵", name: "Nota musical brillante" }
};

function normalize(value) {
  return value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

function setFeedback(message, type = "") {
  state.feedback = message;
  state.feedbackType = type;
}

function addObject(id) {
  if (!state.inventory.includes(id)) {
    state.inventory.push(id);
  }
}

function feedbackHTML() {
  if (!state.feedback) return "";
  return `<p class="feedback ${state.feedbackType}">${state.feedback}</p>`;
}

function inventoryHTML() {
  const items = Object.entries(objects).map(([id, obj]) => {
    const unlocked = state.inventory.includes(id);
    return `
      <div class="item ${unlocked ? "" : "locked"}">
        ${unlocked ? obj.icon : "🔒"} ${unlocked ? obj.name : "???"}
      </div>`;
  }).join("");

  return `
    <div class="inventory">
      <h3>INVENTARIO</h3>
      <div class="items">${items}</div>
    </div>`;
}

function render(content, includeInventory = true) {
  screen.innerHTML = content +
    (includeInventory && state.started ? inventoryHTML() : "");
}

function button(label, action, secondary = false) {
  return `<button class="${secondary ? "secondary" : ""}"
    onclick="${action}">${label}</button>`;
}

// PORTADA DE TERROR
function showTitle() {
  state.started = false;

  render(`
    <p class="subtitle">UN JUEGO INDIE DE TERROR</p>
    <h1>THE UNKNOWN PLAYER</h1>
    <div class="pixel-art">👁️‍🗨️</div>
    <div class="story">
      Una aventura extraña te espera.<br>
      Cinco niveles. miedos ocultos.<br>
    </div>
    <p class="subtitle">[ PRESS START ]</p>
    ${button("▶ JUGAR", "startGame()")}
    <p style="font-size:16px;color:#a889c7">
     TODOS LOS DERECHOS RESERVADOS.
    </p>
  `, false);
}

// GLITCH Y MENSAJE PERSONALIZADO
function startGame() {
  screen.classList.add("glitch");

  setTimeout(() => {
    screen.classList.remove("glitch");
    state.started = true;

    render(`
      <div class="pixel-art">💗✨💗</div>
      <h1>JAJAJA, TE ENGAÑÉ</h1>
      <div class="story">
        si gordo, soy tan nerd que te hice un jueguito ♡
      </div>
      <p>Ahora sí, bienvenido a mi mundo.</p>
      ${button("CONTINUAR ♡", "beginAdventure()")}
    `, false);
  }, 1000);
}

function beginAdventure() {
  state.level = 1;
  showLevel1();
}

// NIVEL 1: EL MENSAJE DE INSTAGRAM
function showLevel1() {
  state.level = 1;
  setFeedback("");

  render(`
    <p class="subtitle">NIVEL 1 DE 5</p>
    <h2>📱 EL PRIMER CONTACTO</h2>
    <div class="pixel-art">💌🦆</div>
    <div class="story">
      Todo comenzó el 28/5.<br>
      Antes de las citas, las flores y toda esta historia,
      alguien se animó a mandar un mensajito por Instagram.<br><br>
      <strong>¿Qué me escribiste exactamente?</strong>
    </div>
    <input id="messageAnswer" autocomplete="off"
      placeholder="Escribí el mensaje..." />
    ${button("ENVIAR MENSAJE", "checkMessage()")}
    ${feedbackHTML()}
  `);
}

function checkMessage() {
  const answer = document.getElementById("messageAnswer").value;

  if (normalize(answer) === normalize("que onda todo bien?")) {
    addObject("duck");
    setFeedback("¡CORRECTO! Mr. Cuack se une a tu aventura 🦆");
    render(`
      <p class="subtitle">NIVEL 1 COMPLETADO</p>
      <h2>¡MENSAJE RECUPERADO!</h2>
      <div class="pixel-art">🦆💗</div>
      <div class="story">
        Ese pequeño mensaje fue el principio de todo.
        Y cuando alguien volvió de un viaje con un pato blanco, 
        terminó formando parte de la historia.
      </div>
      ${feedbackHTML()}
      ${button("RESCATAR A MR. CUACK", "showLevel2()")}
    `);
  } else {
    setFeedback("Mmm... ese no fue el mensaje. ¡Intentá otra vez!", "error");
    showLevel1WithFeedback();
  }
}

function showLevel1WithFeedback() {
  const message = state.feedback;
  render(`
    <p class="subtitle">NIVEL 1 DE 5</p>
    <h2>📱 EL PRIMER CONTACTO</h2>
    <div class="pixel-art">💌🦆</div>
    <div class="story">
      Todo comenzó el 28/5.<br>
      <strong>¿Qué me escribiste exactamente?</strong>
    </div>
    <input id="messageAnswer" autocomplete="off"
      placeholder="Escribí el mensaje..." />
    <button onclick="checkMessage()">ENVIAR MENSAJE</button>
    <p class="feedback error">${message}</p>
  `);
}

// NIVEL 2: EL HOSPITAL
function showLevel2() {
  state.level = 2;
  setFeedback("");

  render(`
    <p class="subtitle">NIVEL 2 DE 5</p>
    <h2>🏥 OPERACIÓN: VISITAR AL SIN APÉNDICE</h2>
    <div class="pixel-art">🏥🩹</div>
    <div class="story">
      Segunda cita: hospital.<br>
      Vos te habías operado del apéndice y Sabri
      encontró la forma de ir a visitarte (porque es muy genia) .<br><br>
      <strong>¿De qué familiar me hice pasar para poder ir a verte?</strong>
    </div>
    <div class="choices">
      <button class="secondary" onclick="checkHospital('prima')">Tu prima</button>
      <button class="secondary" onclick="checkHospital('hermana')">Tu hermana</button>
      <button class="secondary" onclick="checkHospital('madre')">Tu mamá</button>
      <button class="secondary" onclick="checkHospital('medica')">La médica</button>
    </div>
    ${feedbackHTML()}
  `);
}

function checkHospital(answer) {
  if (answer === "hermana") {
    addObject("badge");

    render(`
      <p class="subtitle">NIVEL 2 COMPLETADO</p>
      <h2>IDENTIDAD CONFIRMADA</h2>
      <div class="pixel-art">🕵️‍♀️🏥</div>
      <div class="story">
        Infiltración exitosa.<br>
        Conseguio entrar a verte y ahora tiene una
        credencial de infiltrada. JAJAJA.
      </div>
      ${button("CONTINUAR LA AVENTURA", "showLevel3()")}
    `);
  } else {
    setFeedback(
      "Responde bien, o te explota el apéndice de nuevo 💥",
      "error"
    );
    showHospitalFeedback();
  }
}

function showHospitalFeedback() {
  const message = state.feedback;

  render(`
    <p class="subtitle">NIVEL 2 DE 5</p>
    <h2>🏥 OPERACIÓN: VISITAR AL SIN APÉNDICE</h2>
    <div class="pixel-art">🩹</div>
    <div class="story">
      ¿De qué familiar me hice pasar para poder ir a verte?
    </div>
    <div class="choices">
      <button class="secondary" onclick="checkHospital('prima')">Tu prima</button>
      <button class="secondary" onclick="checkHospital('hermana')">Tu hermana</button>
      <button class="secondary" onclick="checkHospital('madre')">Tu mamá</button>
      <button class="secondary" onclick="checkHospital('medica')">La médica</button>
    </div>
    <p class="feedback error">${message}</p>
  `);
}

// NIVEL 3: AHORCADO - SI ACEPTO
const secretPhrase = "SI ACEPTO";

function showLevel3() {
  state.level = 3;
  state.guesses = [];
  state.mistakes = 0;
  setFeedback("");
  renderHangman();
}

function maskedPhrase() {
  return [...secretPhrase].map(char => {
    if (char === " ") return "　";
    return state.guesses.includes(char) ? char : "_";
  }).join(" ");
}

function renderHangman() {
  const won = [...secretPhrase]
    .filter(char => char !== " ")
    .every(char => state.guesses.includes(char));

  render(`
    <p class="subtitle">NIVEL 3 DE 5</p>
    <h2>💐 CONQUISTÁ A SABRI</h2>
    <div class="pixel-art">🌷💗🌷</div>
    <div class="story">
      Llegó el momento de las flores y de la pregunta
      más importante.<br>
      Para desbloquear el ramo, descubrí la frase secreta.
    </div>
    <h2 style="letter-spacing:4px">${maskedPhrase()}</h2>
    <p>Errores: ${state.mistakes} / 6</p>
    <p>Letras usadas: ${state.guesses.join(", ") || "ninguna"}</p>

    ${won ? `
      <p class="feedback">¡LO LOGRASTE! ♡</p>
      ${button("ACEPTAR LAS FLORES 💐", "completeLevel3()")}
    ` : `
      <p>Escribí una letra o probá la frase completa.</p>
      <input id="hangmanAnswer" maxlength="20"
        autocomplete="off" placeholder="Una letra o la frase..." />
      <button onclick="guessHangman()">PROBAR</button>
    `}

    ${feedbackHTML()}
  `);
}

function guessHangman() {
  const field = document.getElementById("hangmanAnswer");
  const answer = normalize(field.value).toUpperCase();

  if (!answer) {
    setFeedback("Escribí una letra o la frase secreta.", "error");
    renderHangman();
    return;
  }

  if (answer === secretPhrase) {
    state.guesses = ["S", "I", "A", "C", "E", "P", "T", "O"];
    setFeedback("¡Adivinaste la frase!");
    renderHangman();
    return;
  }

  if (answer.length > 1) {
    setFeedback("¡Esa no es! Probá con otra letra.", "error");
    state.mistakes++;
  } else if (!/^[A-Z]$/.test(answer)) {
    setFeedback("Probá con una letra del abecedario.", "error");
  } else if (state.guesses.includes(answer)) {
    setFeedback("¡Esa letra ya la probaste!", "error");
  } else {
    state.guesses.push(answer);

    if (!secretPhrase.includes(answer)) {
      state.mistakes++;
      setFeedback("Esa letra no está. ¡Seguí intentando!", "error");
    } else {
      setFeedback("¡Bien! Esa letra está en la frase.");
    }
  }

  if (state.mistakes >= 6) {
    state.mistakes = 0;
    state.guesses = [];
    setFeedback(
      "¡Te quedaste sin intentos! La propuesta merece otra oportunidad. 💐",
      "error"
    );
  }

  renderHangman();
}

function completeLevel3() {
  addObject("flowers");

  render(`
    <p class="subtitle">NIVEL 3 COMPLETADO</p>
    <h2>¡SI ACEPTO! 💗</h2>
    <div class="pixel-art">💐💍✨</div>
    <div class="story">
      ¡MISIÓN COMPLETADA!<br>
      Sabri aceptó la misión de convertirse en tu novia. ♡<br><br>
      Objeto desbloqueado: el ramo de flores.
    </div>
    ${button("SEGUIR JUNTOS", "showLevel4()")}
  `);
}

// NIVEL 4: DESAFÍO MUSICAL
function showLevel4() {
  state.level = 4;
  setFeedback("");

  render(`
    <p class="subtitle">NIVEL 4 DE 5</p>
    <h2>🎸 EL SOUNDTRACK DE SABRI</h2>
    <div class="pixel-art">🎤🎸🎹</div>
    <div class="story">
      Entraste al mundo musical de Sabri.<br>
      Entre guitarras, voces y composiciones, hay una frase
      que solamente un verdadero fan podría completar.<br><br>
      Completá el fragmento de El Cuarteto de Nos:
      <br><br>
      <strong>«Casi nunca nadie dice<br>
      que yo estoy…»</strong>
    </div>
    <input id="musicAnswer" autocomplete="off"
      placeholder="Escribí las palabras que faltan..." />
    ${button("COMPLETAR LA FRASE", "checkMusic()")}
    ${feedbackHTML()}
  `);
}

function checkMusic() {
  const answer = document.getElementById("musicAnswer").value;

  if (normalize(answer) === "enamorado tuyo") {
    addObject("note");

    render(`
      <p class="subtitle">NIVEL 4 COMPLETADO</p>
      <h2>¡DESAFÍO MUSICAL SUPERADO!</h2>
      <div class="pixel-art">🎵✨💗</div>
      <div class="story">
        Completaste la frase y desbloqueaste
        la nota musical brillante.
        (que es equivalente al corazon de sabri) <br><br>
        Tu inventario está casi completo...
        pero todavía falta el último desafío.
      </div>
      ${button("IR AL ÚLTIMO NIVEL", "showLevel5()")}
    `);
  } else {
    setFeedback("Casi, casi... ¡Probá otra vez! 🎶", "error");
    showMusicFeedback();
  }
}

function showMusicFeedback() {
  const message = state.feedback;

  render(`
    <p class="subtitle">NIVEL 4 DE 5</p>
    <h2>🎸 EL SOUNDTRACK DE SABRI</h2>
    <div class="pixel-art">🎤🎸🎹</div>
    <div class="story">
      «Casi nunca nadie dice<br>
      que yo estoy…»
    </div>
    <input id="musicAnswer" autocomplete="off"
      placeholder="Escribí las palabras que faltan..." />
    <button onclick="checkMusic()">COMPLETAR LA FRASE</button>
    <p class="feedback error">${message}</p>
  `);
}

// NIVEL 5: ACERTIJO CON TODOS LOS OBJETOS
const finalRiddles = [
  {
    object: "🦆 MR. CUACK",
    question: "veo que tenes buena memoria para los mensajes. Que estabas haciendo cuando mandaste ese mensaje?",
    answer: "comiendo un asado"
  },
  {
    object: "🏥 CREDENCIAL DE INFILTRADA",
    question: "porque te reto la enfermera?",
    answer: "porque se me salia el suero"
  },
  {
    object: "💐 RAMO DE FLORES",
    question: "Cuando llegó la propuesta, ¿qué hicimos despues?",
    answer: "fuimos al urologo"
  },
  {
    object: "🎵 NOTA MUSICAL BRILLANTE",
    question: "Completá la frase: «comanse a besos esta noche...»",
    answer: "total nadie lo va a notar"
  }
];

function showLevel5() {
  state.level = 5;
  state.finalStep = 0;
  setFeedback("");

  render(`
    <p class="subtitle">NIVEL 5 DE 5</p>
    <h2>🔐 LA ÚLTIMA PISTA</h2>
    <div class="pixel-art">🗝️✨📦</div>
    <div class="story">
      Llegaste al final de la aventura.<br>
      El cofre está cerrado y los objetos que reuniste
      guardan los recuerdos necesarios para abrirlo.<br><br>
      <strong>«No alcanza con tenerlos: tenés que descubrir
      qué cuentan juntos».</strong>
    </div>
    <p>Resolvé las cuatro pistas para abrir el cofre.</p>
    <div class="progress">
      <div class="progress-bar" style="width:0%"></div>
    </div>
    ${button("COMENZAR EL ACERTIJO", "showFinalRiddle()")}
  `);
}

function showFinalRiddle() {
  const riddle = finalRiddles[state.finalStep];
  const progress = (state.finalStep / finalRiddles.length) * 100;

  if (!riddle) {
    showVictory();
    return;
  }

  setFeedback("");

  render(`
    <p class="subtitle">NIVEL 5 DE 5 · PISTA ${state.finalStep + 1}/4</p>
    <h2>${riddle.object}</h2>
    <div class="progress">
      <div class="progress-bar" style="width:${progress}%"></div>
    </div>
    <div class="pixel-art">🔎💗</div>
    <div class="story">${riddle.question}</div>
    <input id="riddleAnswer" autocomplete="off"
      placeholder="Escribí tu respuesta..." />
    ${button("COMPROBAR PISTA", "checkFinalRiddle()")}
    ${feedbackHTML()}
  `);
}

function checkFinalRiddle() {
  const answer = document.getElementById("riddleAnswer").value;
  const expected = finalRiddles[state.finalStep].answer;

  if (normalize(answer) === normalize(expected)) {
    state.finalStep++;

    if (state.finalStep >= finalRiddles.length) {
      showVictory();
    } else {
      render(`
        <p class="subtitle">PISTA DESBLOQUEADA</p>
        <h2>¡CORRECTO! ✨</h2>
        <div class="pixel-art">🔓💗</div>
        <div class="story">
          Un recuerdo más vuelve a brillar.<br>
          El cofre está cada vez más cerca de abrirse.
        </div>
        ${button("SIGUIENTE PISTA", "showFinalRiddle()")}
      `);
    }
  } else {
    setFeedback("Esa no es la respuesta. ¡Pensá en el recuerdo!", "error");
    showFinalRiddleFeedback();
  }
}

function showFinalRiddleFeedback() {
  const riddle = finalRiddles[state.finalStep];
  const message = state.feedback;
  const progress = (state.finalStep / finalRiddles.length) * 100;

  render(`
    <p class="subtitle">NIVEL 5 DE 5 · PISTA ${state.finalStep + 1}/4</p>
    <h2>${riddle.object}</h2>
    <div class="progress">
      <div class="progress-bar" style="width:${progress}%"></div>
    </div>
    <div class="story">${riddle.question}</div>
    <input id="riddleAnswer" autocomplete="off"
      placeholder="Escribí tu respuesta..." />
    <button onclick="checkFinalRiddle()">COMPROBAR PISTA</button>
    <p class="feedback error">${message}</p>
  `);
}

// FINAL: VICTORIA Y CARTA
function showVictory() {
  render(`
    <p class="subtitle">TODOS LOS OBJETOS REUNIDOS</p>
    <div class="pixel-art">🦆💐🎵💗</div>
    <h1>¡ENHORABUENA,<br>COMPLETASTE EL JUEGO!</h1>
    <div class="story">
      Todas las pistas encajaron.<br>
      El cofre se abrió y adentro había algo
      que no se puede conseguir pasando niveles:
      una carta de tu novia. ♡
    </div>
    ${button("ABRIR EL COFRE 💌", "showLetter()")}
  `);
}

function showLetter() {
  render(`
    <p class="subtitle">♡ MENSAJE DESBLOQUEADO ♡</p>
    <div class="pixel-art">💌✨💗</div>

    <article class="letter">
      <h2>¡Enhorabuena, completaste el juego!</h2>

      <p>Sí, gordo, no me alcanzó con ser nerd,
      encima soy una nerd enamorada.</p>

      <p>Te amo, espero que te haya gustado.</p>

      <p>Tu premio va a ser un beso porque no hay plata.</p>

      <p class="signoff">Atte.: tu novia ♡</p>
    </article>

    <h2>FIN DEL JUEGO ♡</h2>
    <p>Gracias por jugar.</p>
    ${button("VOLVER A JUGAR", "restartGame()", true)}
  `, false);
}

function restartGame() {
  state.level = 1;
  state.inventory = [];
  state.guesses = [];
  state.mistakes = 0;
  state.finalStep = 0;
  state.feedback = "";
  state.started = false;
  showTitle();
}

// INICIAR
showTitle();

