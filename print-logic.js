// @ts-check

const winPrint = window.print;

const Focalization = "Focalización";
const Property = "Inmueble";
const PropertyStatus = "Estado inmueble";
const Owner = "Propietario";
const OccupiedBy = "Ocupado por";
const PotentialAcquisition = "Potencial adquición";
const FullPropertyAddress = "Dirección completa inmueble";
const Stairwell = "Escalera";
const OwnerPhone = "Tel. propietario";
const DaysSinceLastContact = "Días de último contacto";
const ZoneSummary = "Resumen Zona";
const RelatedInformer = "Informador relacionado";
const OwnerLocated = "Propietario localizado";
const Responsible = "Responsable";
const Zone = "Zona";

const STRONG_NEGATIONS = ["no", "ni", "sin"];

const friendlyTerms = [
  "majo",
  "maja",
  "amable",
  "simpático",
  "agradable",
  "cercano",
  "atento",
  "encantador",
  "educado",
  "abierto",
  "buena gente",
  "excelente trato",
  "majete",
];

const rudeTerms = [
  "borde",
  "cortante",
  "rara",
  "grosero",
  "antipático",
  "tira la puerta",
  "cerrada",
  "cerrado",
  "y cierra",
  "agresiva",
  "agresivo",
  "brusco",
  "maleducado",
  "no abre",
  "no necesita nada",
];

const sellTerms = [
  "vender",
  "venta",
  "comprar",
  "compra",
  "adquirir",
  "inversión",
  "alquilar",
  "encargo",
  "interés",
  "se lo plantea",
  "futuro",
  "posible venta",
  "quiere mudarse",
  "fallecida",
  "fallecido",
];

const noSellTerms = [
  "no vende",
  "no compra",
  "no alquila",
  "no quiere nada",
  "no quiere vender",
  "no quiere comprar",
  "sin interés",
  "no interesa",
  "no le interesa",
  "no se lo plantea",
  "no tiene intención",
  "no tiene interes",
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
  "no informa",
  "no ayuda",
  "nada de vecinos",
  "no sabe de vecinos",
  "no me va a ayudar",
  "no da información",
];

class Style {
  _tag = false;
  _bold = false;
  _italic = false;
  _stroke = false;
  _underline = false;
  /** @type {string?} */
  _fg = null;
  /** @type {string?} */
  _bg = null;

  tag(t = true) {
    this._tag = t;
    return this;
  }

  bold(b = true) {
    this._bold = b;
    return this;
  }

  italic(i = true) {
    this._italic = i;
    return this;
  }

  stroke(s = true) {
    this._stroke = s;
    return this;
  }

  underline(u = true) {
    this._underline = u;
    return this;
  }

  fg(color = "#000000") {
    this._fg = color;
    return this;
  }

  bg(color = "#ffffff") {
    this._bg = color;
    return this;
  }

  /**
   * @param {HTMLElement} element
   */
  applyTo(element) {
    if (this._bg) element.style.background = `${this._bg}`;
    if (this._fg) element.style.color = `${this._fg}`;
    if (this._bold) element.style.fontWeight = "bold";
    if (this._italic) element.style.fontVariant = "italic";
    if (this._tag) element.classList.add("tag");
    return element;
  }

  /**
   * @param {HTMLElement} element
   */
  apply(element) {
    const span = document.createElement("span");
    span.innerText = element.innerText;
    this.applyTo(span);
    element.innerHTML = "";
    element.appendChild(span);
    return span;
  }
}

/**
 * @param {HTMLElement} element
 * @returns
 */
function indicator(element) {
  const div = document.createElement("div");
  div.classList.add("indicator");
  element.prepend(div);
  return div;
}

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
   * @returns {string}
   */
  processText(text) {
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

    this.htmlResaltado = this.htmlResaltado.replace(regexExplicito, (match) => {
      return this.processExplicit(match, text);
    });

    const allPositiveTerms = [...friendlyTerms, ...sellTerms, ...informerTerms];
    const regexPositivo = new RegExp(
      `\\b(?:${allPositiveTerms.join("|")})\\b`,
      "gi",
    );

    this.htmlResaltado = this.htmlResaltado.replace(regexPositivo, (match) => {
      return this.processPositive(match, text);
    });

    return this.htmlResaltado;
  }
}

class Processor {
  focalizationCol = -1;
  propertyCol = -1;
  propertyStatusCol = -1;
  ownerCol = -1;
  occupiedByCol = -1;
  potentialAcquisitionCol = -1;
  fullPropertyAddressCol = -1;
  stairwellCol = -1;
  ownerPhoneCol = -1;
  daysSinceLastContactCol = -1;
  zoneSummaryCol = -1;
  relatedInformerCol = -1;
  ownerLocatedCol = -1;
  responsibleCol = -1;
  zoneCol = -1;

  /**
   * @param {HTMLTableRowElement} tr
   */
  getCols(tr) {
    tr.querySelectorAll("th").forEach((col, idx) => {
      const headerText = col.textContent?.trim();
      if (!headerText) return;

      if (headerText === Focalization) {
        this.focalizationCol = idx;
      } else if (headerText === Property) {
        this.propertyCol = idx;
      } else if (headerText === PropertyStatus) {
        this.propertyStatusCol = idx;
      } else if (headerText === Owner) {
        this.ownerCol = idx;
      } else if (headerText === OccupiedBy) {
        this.occupiedByCol = idx;
      } else if (headerText === PotentialAcquisition) {
        this.potentialAcquisitionCol = idx;
      } else if (headerText === FullPropertyAddress) {
        this.fullPropertyAddressCol = idx;
      } else if (headerText === Stairwell) {
        this.stairwellCol = idx;
      } else if (headerText === OwnerPhone) {
        this.ownerPhoneCol = idx;
      } else if (headerText === DaysSinceLastContact) {
        this.daysSinceLastContactCol = idx;
      } else if (headerText === ZoneSummary) {
        this.zoneSummaryCol = idx;
      } else if (headerText === RelatedInformer) {
        this.relatedInformerCol = idx;
      } else if (headerText === OwnerLocated) {
        this.ownerLocatedCol = idx;
      } else if (headerText === Responsible) {
        this.responsibleCol = idx;
      } else if (headerText === Zone) {
        this.zoneCol = idx;
      }
    });
  }

  /**
   * @param {number} days
   */
  getDaysClass(days) {
    if (days == -1) return "daysNever";
    if (days > 300) return "days300";
    if (days > 120) return "days120";
    if (days > 90) return "days90";
    if (days > 30) return "days30";
    return "days0";
  }

  /**
   * @param {string} by
   */
  getOcccupiedClass(by) {
    if (by === "" || by === "no identificado") return "unknown";
    if (by === "inquilino") return "rent";
    if (by === "vacio") return "empty";
    return "prop";
  }

  /**
   * @param {string} name
   */
  getNameClass(name) {
    if (name === "") return "no-name";

    const kws = ["nombre", "zona", "propietario", "prop.", "titular"];
    for (let kw of kws) {
      if (name.includes(kw)) return "no-name";
    }

    if (name.split(" ").length < 3) return "incompleted-name";

    return "name";
  }

  /**
   * @param {string} text
   * @returns {string}
   */
  processSumary(text) {
    return new Highligther().processText(text);
  }

  /**
   * @param {HTMLTableRowElement} row
   */
  processRow(row) {
    if (this.daysSinceLastContactCol == -1) return;
    const cols = row.querySelectorAll("td");

    const daysStr = cols[this.daysSinceLastContactCol].textContent ?? "";
    const days = daysStr === "" ? -1 : parseInt(daysStr);

    const dayClass = this.getDaysClass(days);
    new Style()
      .tag()
      .apply(cols[this.daysSinceLastContactCol])
      .classList.add(dayClass);

    if (this.propertyCol !== -1) {
      indicator(
        cols[this.propertyCol].firstChild ?? cols[this.propertyCol],
      ).classList.add(dayClass);
    }

    if (this.occupiedByCol !== -1) {
      const occupiedClass = this.getOcccupiedClass(
        cols[this.occupiedByCol].textContent?.toLowerCase()?.trim() ?? "",
      );
      new Style()
        .tag()
        .apply(cols[this.occupiedByCol])
        .classList.add(occupiedClass);
    }

    if (this.ownerCol !== -1) {
      const nameClass = this.getNameClass(
        cols[this.ownerCol].textContent?.trim()?.toLowerCase() ?? "",
      );
      new Style().tag().apply(cols[this.ownerCol]).classList.add(nameClass);
    }

    if (
      this.potentialAcquisitionCol !== -1 &&
      cols[this.potentialAcquisitionCol].textContent?.toLowerCase()?.trim() ===
        "true"
    ) {
      new Style()
        .tag()
        .apply(cols[this.potentialAcquisitionCol])
        .classList.add("acquisition-flag");
    }

    if (
      this.relatedInformerCol !== -1 &&
      cols[this.relatedInformerCol].textContent?.toLowerCase()?.trim() ===
        "true"
    ) {
      new Style()
        .tag()
        .apply(cols[this.relatedInformerCol])
        .classList.add("informer-flag");
    }

    if (this.zoneSummaryCol !== -1) {
      cols[this.zoneSummaryCol].innerHTML = this.processSumary(
        cols[this.zoneSummaryCol].textContent ?? "",
      );
    }
  }

  /**
   * @param {HTMLTableElement} table
   */
  processTable(table) {
    const head = table.querySelector("thead>tr");
    if (!head) return;

    this.getCols(head);

    const rows = table.querySelectorAll("tbody>tr");
    rows.forEach((r) => this.processRow(r));
  }
}

function processTable() {
  const table = document.querySelector("#contentToPrint>table");
  if (!table) return;

  const processor = new Processor();
  processor.processTable(table);
}

window.print = () => {
  processTable();
  winPrint();
  console.log(document.querySelector("#contentToPrint"));
};

console.log(document.querySelector("#contentToPrint"));
