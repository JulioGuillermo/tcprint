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
   * @returns {Promise<string>}
   */
  async processSumary(text) {
    if (!globalThis.highligther) return text;

    return await globalThis.highligther.processText(text);
  }

  /**
   * @param {HTMLTableRowElement} row
   */
  async processRow(row) {
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
      cols[this.zoneSummaryCol].innerHTML = await this.processSumary(
        cols[this.zoneSummaryCol].textContent ?? "",
      );
    }
  }

  /**
   * @param {HTMLTableElement} table
   */
  async processTable(table) {
    const head = table.querySelector("thead>tr");
    if (!head) return;

    this.getCols(head);

    const rows = table.querySelectorAll("tbody>tr");
    for (let r of rows) {
      await this.processRow(r);
    }
  }
}

async function processTable() {
  const table = document.querySelector("#contentToPrint>table");
  if (!table) return;

  const processor = new Processor();
  await processor.processTable(table);
}

window.print = async () => {
  await processTable();
  winPrint();
  console.log(document.querySelector("#contentToPrint"));
};

console.log(document.querySelector("#contentToPrint"));
