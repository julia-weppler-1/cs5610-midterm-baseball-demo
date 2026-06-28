function Cards() {
  const me = {};

  
  const renderCards = (cards) => {
    const cardsDiv = document.getElementById("cards");
    for (const { team, first_name, last_name, State, year, price } of cards) {
      const card = document.createElement("div");
      card.className = "card card-tile";
      card.innerHTML = `
        <div class="card-body">
          <div class="card-team">${team}</div>
          <h5 class="card-name">${first_name} ${last_name}</h5>
          <div class="card-meta">${State} &middot; ${year}</div>
          <div class="card-price">$${price}</div>
        </div>
      `;
      cardsDiv.appendChild(card);
    }
  };
  me.refreshCards = async (team = "") => {
    const url = team
      ? `/api/cards?team=${encodeURIComponent(team)}`
      : "/api/cards";
    const res = await fetch(url); // beginning of AJAX

    if (!res.ok) {
      console.log("Failed");
      document.getElementsByTagName("main")[0].innerHTML =
        "<p>Failed to load cards</p>";
      return;
    }

    const data = await res.json();
    console.log("Fetched cards", data);

    const cardsDiv = document.getElementById("cards");
    cardsDiv.innerHTML = "";

    renderCards(data.cards);
  };

  me.setupFilterBar = () => {
    const input = document.getElementById("team-filter");
    let timer;
    input.addEventListener("input", () => {
        me.refreshCards(input.value.trim());
    });
  };

  me.uploadCard = async (card) => {
    const res = await fetch("/api/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(card),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error("Failed");
    }
    return res.json();
  }

  me.setupUploadForm = () => {
    const form = document.getElementById("upload-form");
    const modalEl = document.getElementById("uploadModal");
    form.addEventListener("submit", async (e) => {

      e.preventDefault();
      
      const formData = new FormData(form);
      const card = Object.fromEntries(formData.entries());

      try {
        await me.uploadCard(card);
        form.reset();
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
        const filterInput = document.getElementById("team-filter");
        await me.refreshCards(filterInput ? filterInput.value.trim() : "");

      } catch (err) {
        throw err;
      }
    })
  }
  return me;
}

const myCards = Cards();
myCards.refreshCards();
myCards.setupUploadForm();
myCards.setupFilterBar();