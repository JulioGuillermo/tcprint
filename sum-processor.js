// @ts-check

(() => {
  const STRONG_NEGATIONS = ["no", "ni", "sin"];

  const friendlyTerms = [
    "majo",
    "maja",
    "majos",
    "majas",
    "amable",
    "amables",
    "simpático",
    "simpáticos",
    "simpática",
    "simpáticas",
    "simpatico",
    "simpaticos",
    "simpatica",
    "simpaticas",
    "agradable",
    "agradables",
    "cercano",
    "atento",
    "atentos",
    "atenta",
    "atentas",
    "encantador",
    "encantadora",
    "encantadores",
    "educado",
    "educados",
    "educada",
    "educadas",
    "abierto",
    "buena gente",
    "excelente trato",
    "majete",
    "majetes",
  ];

  const rudeTerms = [
    "borde",
    "bordes",
    "cortante",
    "cortantes",
    // "raro",
    // "rara",
    // "raros",
    // "raras",
    "grosero",
    "groseros",
    "grosera",
    "groseras",
    "antipático",
    "antipáticos",
    "antipática",
    "antipáticas",
    "antipatico",
    "antipaticos",
    "antipatica",
    "antipaticas",
    "tira la puerta",
    "cerrada",
    "cerrado",
    "cerradas",
    "cerrados",
    "y cierra",
    "agresiva",
    "agresivo",
    "agresivas",
    "agresivos",
    "brusco",
    "bruscos",
    "brusca",
    "bruscas",
    "maleducado",
    "maleducada",
    "maleducados",
    "maleducadas",
    "no abre",
    "no necesita nada",
  ];

  const sellTerms = [
    "vender",
    "vende",
    "venden",
    "venta",
    "comprar",
    "compra",
    "compran",
    "adquirir",
    "inversión",
    "invertir",
    "alquilar",
    "alquiler",
    "encargo",
    "encargar",
    "interés",
    "interes",
    "interesado",
    "interesada",
    "se lo plantea",
    "futuro",
    "posible venta",
    "quiere mudarse",
    "fallecida",
    "fallecido",
    "fallecidas",
    "fallecidos",
  ];

  const noSellTerms = [
    "no vende",
    "no compra",
    "no alquila",
    "no quiere nada",
    "no quiere vender",
    "no quiere comprar",
    "sin interés",
    "sin interes",
    "no interesa",
    "no está interesado",
    "no está interesada",
    "no esta interesado",
    "no esta interesada",
    "no están interesados",
    "no están interesadas",
    "no estan interesados",
    "no estan interesadas",
    "no interesado",
    "nada interesado",
    "no interesada",
    "nada interesada",
    "no interesados",
    "nada interesados",
    "no interesadas",
    "nada interesadas",
    "no le interesa",
    "no se lo plantea",
    "no tiene intención",
    "no tiene intencion",
    "no tiene interes",
    "no tiene interés",
    "descartado",
  ];

  const informerTerms = [
    "informador",
    "informadora",
    "informa",
    "ayuda",
    "fidelizar",
    "llevarle un detalle",
    "seguir en contacto",
    "hacer seguimiento",
    "habla de vecinos",
    "da información",
  ];

  const noInformerTerms = [
    "no sabe",
    "no informa",
    "no ayuda",
    "no me ayuda",
    "no me ayudan",
    "no va a ayudar",
    "no van a ayudar",
    "no me va a ayudar",
    "no me van a ayudar",
    "no va ayudar",
    "no van ayudar",
    "no me va ayudar",
    "no me van ayudar",
    "nada de vecinos",
    "no sabe de vecinos",
    "no me va a ayudar",
    "no da información",
    "no da informacion",
  ];

  class Highligther {
    htmlResaltado = "";
    T = 0;
    V = 0;
    I = 0;

    /**
     * @param {string} className
     */
    processClass(className) {
      if (className === "friendly") this.T++;
      else if (className === "rude") this.T--;
      else if (className === "wants-to-sell") this.V++;
      else if (className === "no-sale-interest") this.V--;
      else if (className === "informer") this.I++;
      else if (className === "not-informer") this.I--;
    }

    /**
     * @param {string} match
     * @param {string} text
     * @returns {string}
     */
    processExplicit(match, text) {
      let className = "";
      const lowMatch = match.toLowerCase();

      if (rudeTerms.includes(lowMatch)) {
        className = "rude";
      } else if (noSellTerms.includes(lowMatch)) {
        className = "no-sale-interest";
      } else if (noInformerTerms.includes(lowMatch)) {
        className = "not-informer";
      }

      const index = text.toLowerCase().indexOf(lowMatch);
      const precedingText = text.substring(0, index).trim();
      const precedingWord = precedingText.split(/\s+/).pop();

      if (
        precedingWord &&
        STRONG_NEGATIONS.includes(precedingWord.toLowerCase())
      ) {
        return match;
      }

      this.processClass(className);
      return `<span class="${className}">${match}</span>`;
    }

    /**
     * @param {string} match
     * @param {string} text
     * @returns {string}
     */
    processPositive(match, text) {
      const lowMatch = match.toLowerCase();

      let className = "";
      if (friendlyTerms.includes(lowMatch)) {
        className = "friendly";
      } else if (sellTerms.includes(lowMatch)) {
        className = "wants-to-sell";
      } else if (informerTerms.includes(lowMatch)) {
        className = "informer";
      }

      const matchIndex = text.toLowerCase().indexOf(lowMatch);
      if (matchIndex === -1) return match;

      const precedingText = text.substring(0, matchIndex).trim();
      const precedingWords = precedingText
        .split(/\s+/)
        .filter((w) => w.length > 0);
      const lastPrecedingWord = precedingWords.pop();

      const isStronglyNegated = STRONG_NEGATIONS.includes(
        lastPrecedingWord ? lastPrecedingWord.toLowerCase() : "",
      );

      if (!isStronglyNegated) {
        this.processClass(className);
        return `<span class="${className}">${match}</span>`;
      }

      if (lastPrecedingWord?.toLowerCase() === "ni") {
        return match;
      }

      if (className === "friendly") className = "rude";
      else if (className === "wants-to-sell") className = "no-sale-interest";
      else if (className === "informer") className = "not-informer";

      this.processClass(className);
      return `<span class="${className}">${match}</span>`;
    }

    /**
     * @param {string} text
     * @returns {Promise<string>}
     */
    async processText(text) {
      this.htmlResaltado = text;
      this.T = 0;
      this.V = 0;
      this.I = 0;

      const terminosExplicitos = [
        ...rudeTerms,
        ...noSellTerms,
        ...noInformerTerms,
      ];
      const regexExplicito = new RegExp(
        `\\b(?:${terminosExplicitos.join("|")})\\b`,
        "gi",
      );

      this.htmlResaltado = this.htmlResaltado.replace(
        regexExplicito,
        (match) => {
          return this.processExplicit(match, text);
        },
      );

      const allPositiveTerms = [
        ...friendlyTerms,
        ...sellTerms,
        ...informerTerms,
      ];
      const regexPositivo = new RegExp(
        `\\b(?:${allPositiveTerms.join("|")})\\b`,
        "gi",
      );

      this.htmlResaltado = this.htmlResaltado.replace(
        regexPositivo,
        (match) => {
          return this.processPositive(match, text);
        },
      );

      return `
    <span class="friendly-tag tag">T: ${this.T}</span>
    <span class="sell-tag tag">V: ${this.V}</span>
    <span class="informer-tag tag">I: ${this.I}</span>
    ${this.htmlResaltado}
    `;
    }
  }

  globalThis.highligther = new Highligther();
})();
