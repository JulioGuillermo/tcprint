// @ts-check

(() => {
  const references = {
    friendlyNeg: [
      "fue borde",
      "es borde",
      "fue grosero",
      "es grosero",
      // "fue antipático",
      // "es antipático",
      "fue seco",
      "es seco",
      "fue maleducado",
      "es maleducado",
      "respondió mal",
      "respondió de mala manera",
      "contestó mal",
      "tuvo mala actitud",
      "no tuvo buena actitud",
      "fue desagradable",
      "mostró poco interés en hablar",
      "se mostró distante",
      "fue frío en el trato",
      "fue cortante",
      "fue poco educado",
      "fue arisco",
      "habló con mal tono",
      "levantó la voz",
      "contestó con malas formas",
      "fue despectivo",
      "tuvo malos modales",
      "fue irrespetuoso",
      "cortó la conversación",
      "interrumpió constantemente",
      "no dejó hablar",
      "no escuchaba",
      "se mostró molesto",
      "se enfadó enseguida",
      "fue agresivo al hablar",
      "fue sarcástico",
      "parecía enfadado",
      "cerró la puerta de golpe",
      "tira la puerta",
      "tiró la puerta",
      "cierra la puerta de golpe",
      "cerró de malas formas",
      "gesticuló con enfado",
      "dio un portazo",
      "fue seco y desagradable",
      "colgó sin decir nada",
      "habló con desgana",
      "fue borde desde el principio",
      "tuvo un trato hostil",
      "fue borde y seco",
      "mostró desinterés total",
    ],

    friendlyPos: [
      "es amable",
      "fue amable",
      "es simpático",
      "fue simpático",
      "es majo",
      "fue majo",
      "es agradable",
      "fue agradable",
      "es educado",
      "fue educado",
      "es cordial",
      "fue cordial",
      "es atento",
      "fue atento",
      "fue respetuoso",
      "es respetuoso",
      "tuvo buena actitud",
      "fue encantador",
      "es encantador",
      "fue receptivo",
      "se mostró dispuesto a hablar",
      "respondió con amabilidad",
      "fue colaborador",
      "fue muy simpático",
      "fue muy amable",
      "fue muy majo",
      "fue correcto y educado",
      "fue cercano en el trato",
      "fue positivo y amable",
    ],

    informerNeg: [
      "no dio detalles",
      "no comentó nada",
      "fue poco claro",
      "no explicó mucho",
      "no quiso dar información",
      "no proporcionó datos",
      "no especificó nada",
      "evitó responder",
      "no quiso explicar",
      "respondió de forma vaga",
      "dio pocas explicaciones",
      "no fue claro",
      "fue ambiguo al hablar",
      "dio respuestas muy cortas",
      "no dio mucha información",
      "dijo poco",
      "no fue preciso",
      "fue evasivo",
      "no quiso entrar en detalles",
      "no se extendió mucho",
      "omitió información importante",
    ],

    informerPos: [
      "dio muchos detalles",
      "explicó claramente",
      "informó todo",
      "dio toda la información",
      "explicó con detalle",
      "fue muy claro",
      "fue transparente",
      "respondió a todo",
      "proporcionó todos los datos",
      "explicó de manera completa",
      "dio explicaciones precisas",
      "fue detallista al hablar",
      "contó todo lo necesario",
      "no ocultó nada",
      "fue muy informativo",
      "explicó paso a paso",
      "aclaró todas las dudas",
      "dio información extensa",
      "explicó con ejemplos",
      "fue muy comunicativo",
    ],

    sellNeg: [
      "no quiere vender",
      "no desean vender",
      "no quieren vender",
      "no está interesado en vender",
      "no están interesados en vender",
      "descarta la venta",
      "descartan vender",
      "no tiene intención de vender",
      "no tienen intención de vender",
      "no piensa vender",
      "no piensan vender",
      "no tiene planes de vender",
      "no planea vender",
      "no planean vender",
      "no se plantea vender",
      "no se plantean vender",
      "no tiene interés en vender",
      "no tiene ninguna intención de vender",
      "no considera la venta",
      "no le interesa vender",
      "no le interesa nada relacionado con la venta",
      "ha decidido no vender",
      "no tiene intención de hacer nada",
      "no quiere hacer nada ahora",
      "no tiene interés en tratar el tema de la venta",
      "por ahora no quiere vender",
      "no quiere saber nada de vender",
    ],

    sellPos: [
      "quiere vender",
      "quieren vender",
      "desea vender",
      "desean vender",
      "considera vender",
      "consideran vender",
      "se plantea la venta",
      "se plantean la venta",
      "tiene intención de vender",
      "tienen intención de vender",
      "está pensando en vender",
      "están pensando en vender",
      "planea vender",
      "planean vender",
      "piensa vender en el futuro",
      "piensan vender en el futuro",
      "tiene en mente vender",
      "tienen en mente vender",
      "podría vender más adelante",
      "podrían vender más adelante",
      "está dispuesto a vender",
      "estarían dispuestos a vender",
      "tiene previsto vender",
      "tienen previsto vender",
      "valora la posibilidad de vender",
      "valoran la posibilidad de vender",
      "está considerando la venta",
      "están considerando la venta",
      "se lo está planteando",
      "se lo están planteando",
      "en el futuro podría vender",
      "más adelante quiere vender",
      "se plantea vender pronto",
    ],
  };

  class Highligther {
    /** @type {any} */
    model = null;

    async loadModel() {
      if (this.model) return;
      console.log("Loading model...");
      this.model = await use.load(
        "https://tfhub.dev/google/universal-sentence-encoder-multilingual/3",
      );
      // this.model = await use.loadQnA();
      console.log("Model loaded ✅");
    }

    /**
     * @param {number} v
     * @param {string} l
     */
    getTag(v, l) {
      return `<span class="tag ${v < -0.02 ? "bad" : v > 0.02 ? "good" : "neutral"}">${l}: ${(v * 100).toFixed(0)}</span>`;
    }

    /**
     * @param {string} text
     * @param {{[k: string]: string[]}} references
     * @param {string[]} keys
     * @param {number[]} similarities
     * @returns {string}
     */
    processTextResult(text, references, keys, similarities) {
      const map = {};
      var idx = 0;
      for (let k of keys) {
        const count = references[k].length;
        const sim = similarities.filter((v, i) => i >= idx && i < idx + count);
        idx += count;

        map[k] = Math.max(...sim);
      }

      const T = map.friendlyPos - map.friendlyNeg;
      const I = map.informerPos - map.informerNeg;
      const V = map.sellPos - map.sellNeg;

      console.log({
        text,
        T,
        I,
        V,
        map,
      });

      return `
      ${this.getTag(T, "T")}
      ${this.getTag(V, "V")}
      ${this.getTag(I, "I")}
      ${text}
      `;
    }

    /**
     * @param {string} text
     * @returns {Promise<string>}
     */
    async processText(text) {
      if (!this.model) await this.loadModel();
      if (!this.model) return text;

      const keys = Object.keys(references);
      const phrases = keys.flatMap((k) => references[k]);

      const embeddedPhrases = await this.model.embed(phrases);
      const embeddedText = await this.model.embed(text);

      const similarityMatrix = await embeddedText
        .matMul(embeddedPhrases.transpose())
        .array();

      return this.processTextResult(
        text,
        references,
        keys,
        similarityMatrix[0],
      );
    }
  }

  globalThis.highligther = new Highligther();
})();
