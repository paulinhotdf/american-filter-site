/* Encontre um revendedor */
(function(){
  var WA = "5512982855000";
  var list = document.getElementById("revList");
  var input = document.getElementById("revSearch");
  var empty = document.getElementById("revEmpty");
  var count = document.getElementById("revCount");
  var DATA = [];

  function norm(s){ return (s||"").toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,""); }

  function card(r){
    var waMsg = encodeURIComponent("Olá! Vim pelo site American Filter e quero falar com o revendedor de " + r.cidade + "/" + r.uf + ".");
    return '<article class="rev-card">' +
      '<div class="rev-card__loc">' + r.cidade + ' · ' + r.uf + (r.regiao ? ' <span>('+r.regiao+')</span>' : '') + '</div>' +
      '<h3 class="rev-card__name">' + r.nome + '</h3>' +
      (r.obs ? '<p class="rev-card__obs">' + r.obs + '</p>' : '') +
      '<a class="btn btn--gold rev-card__btn" target="_blank" rel="noopener" href="https://wa.me/' + (r.whats||WA) + '?text=' + waMsg + '">Falar no WhatsApp</a>' +
    '</article>';
  }

  function render(items){
    if(!items.length){
      list.innerHTML = ""; empty.hidden = false;
      count.textContent = "Nenhum revendedor encontrado nessa busca";
      return;
    }
    empty.hidden = true;
    count.textContent = items.length + (items.length>1 ? " revendedores" : " revendedor");
    list.innerHTML = items.map(card).join("");
  }

  function filter(){
    var q = norm(input.value);
    if(!q){ render(DATA); return; }
    render(DATA.filter(function(r){
      return norm(r.cidade).indexOf(q)>=0 || norm(r.uf).indexOf(q)>=0 || norm(r.regiao).indexOf(q)>=0 || norm(r.nome).indexOf(q)>=0;
    }));
  }

  fetch("assets/data/revendedores.json")
    .then(function(r){ return r.json(); })
    .then(function(d){ DATA = d || []; render(DATA); })
    .catch(function(){ render([]); });

  if(input) input.addEventListener("input", filter);

  // WhatsApp data-wa (shared)
  document.querySelectorAll("[data-wa]").forEach(function(el){
    var txt = encodeURIComponent(el.getAttribute("data-wa") || "Olá! Quero saber mais sobre o American Filter.");
    el.setAttribute("href","https://wa.me/"+WA+"?text="+txt);
    el.setAttribute("target","_blank"); el.setAttribute("rel","noopener");
  });
})();
