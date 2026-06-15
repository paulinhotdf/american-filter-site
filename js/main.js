/* American Filter — interações */
(function(){
  // ---- WhatsApp ----
  var WA = "5512982855000"; // <- número American Filter / Tudo de Filtro (confirmar)
  document.querySelectorAll("[data-wa]").forEach(function(el){
    var txt = encodeURIComponent(el.getAttribute("data-wa") || "Olá! Quero saber mais sobre o American Filter.");
    el.setAttribute("href", "https://wa.me/" + WA + "?text=" + txt);
    el.setAttribute("target","_blank"); el.setAttribute("rel","noopener");
  });

  // ---- Nav stuck + mobile ----
  var nav = document.getElementById("nav");
  var onScroll = function(){ nav.classList.toggle("is-stuck", window.scrollY > 40); };
  onScroll(); window.addEventListener("scroll", onScroll, {passive:true});

  var burger = document.getElementById("burger");
  var links = document.querySelector(".nav__links");
  if(burger){ burger.addEventListener("click", function(){ links.classList.toggle("is-open"); }); }
  document.querySelectorAll(".nav__links a").forEach(function(a){
    a.addEventListener("click", function(){ links.classList.remove("is-open"); });
  });

  // ---- Reveal on scroll ----
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("is-in"); io.unobserve(e.target);} });
  }, {threshold:.16, rootMargin:"0px 0px -8% 0px"});
  document.querySelectorAll(".reveal").forEach(function(el){ io.observe(el); });
  document.querySelectorAll(".reveal-lines").forEach(function(el){
    el.querySelectorAll("span").forEach(function(s,i){ s.style.setProperty("--i", i); });
    io.observe(el);
  });

  // ---- Linha de produtos ----
  var MODELS = [
    {name:"Home Filter 1000", dim:'8" × 35" &nbsp;·&nbsp; Ø 20,3 × 88,9 cm',   flow:"até 1.000 litros/hora", desc:"Ideal para residências e comércios.", d:8, h:35},
    {name:"Home Filter 2500", dim:'10" × 54" &nbsp;·&nbsp; Ø 25,4 × 137,2 cm', flow:"até 2.500 litros/hora", desc:"Apartamentos e casas de porte médio, com fluxo constante.", d:10, h:54},
    {name:"Pro Filter 3500",  dim:'12" × 54" &nbsp;·&nbsp; Ø 30,5 × 137,2 cm', flow:"até 3.500 litros/hora", desc:"Casas grandes e alto consumo, vários pontos sem queda de pressão.", d:12, h:54},
    {name:"Pro Filter 5000",  dim:'14" × 65" &nbsp;·&nbsp; Ø 35,6 × 165,1 cm', flow:"até 5.000 litros/hora", desc:"Residências amplas, comércio, indústria e condomínio.", d:14, h:65}
  ];
  var mName=document.getElementById("mName"), mDim=document.getElementById("mDim"),
      mFlow=document.getElementById("mFlow"), mDesc=document.getElementById("mDesc");
  function setModel(i){
    var m=MODELS[i]; if(!m) return;
    mName.innerHTML=m.name; mDim.innerHTML=m.dim; mFlow.textContent=m.flow; mDesc.textContent=m.desc;
    document.querySelectorAll(".mtab").forEach(function(b){ b.classList.toggle("is-active", +b.dataset.i===i); });
    window.dispatchEvent(new CustomEvent("af:model",{detail:{d:m.d,h:m.h}}));
  }
  document.querySelectorAll(".mtab").forEach(function(b){
    b.addEventListener("click", function(){ setModel(+b.dataset.i); });
  });

  // ---- Formulário "Onde comprar" → WhatsApp do distribuidor ----
  var buyForm = document.getElementById("buyForm");
  if(buyForm){
    buyForm.addEventListener("submit", function(e){
      e.preventDefault();
      var f = buyForm;
      if(!f.nome.value || !f.cidade.value || !f.fone.value){ f.reportValidity && f.reportValidity(); return; }
      var msg = "Olá! Quero comprar o American Filter (filtro de entrada).\n\n"
        + "Nome: " + f.nome.value + "\n"
        + "Cidade/UF: " + f.cidade.value + "\n"
        + "WhatsApp: " + f.fone.value + "\n"
        + "Modelo: " + f.modelo.value + "\n"
        + "Aplicação: " + f.aplicacao.value;
      window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(msg), "_blank");
    });
  }

  // ---- Visualizador 360° (arrastar) + escala por modelo ----
  (function(){
    var img = document.getElementById("spinImg");
    var viewer = document.getElementById("viewer");
    if(!img || !viewer) return;
    var N = 36, srcs = [], idx = 0;
    for(var i=1;i<=N;i++){
      var name = "assets/img/spin/f" + (i<10?"0"+i:i) + ".jpg";
      srcs.push(name); var pre = new Image(); pre.src = name;
    }
    function show(i){ idx = ((i % N) + N) % N; img.src = srcs[idx]; }
    var dragging=false, startX=0, startIdx=0, auto=null, scaleStr="scale(0.78,0.78)";
    img.style.transform = scaleStr;
    function startAuto(){ stopAuto(); auto = setInterval(function(){ show(idx+1); }, 110); }
    function stopAuto(){ if(auto){ clearInterval(auto); auto=null; } }
    viewer.addEventListener("pointerdown", function(e){
      dragging=true; startX=e.clientX; startIdx=idx; stopAuto();
      try{ viewer.setPointerCapture(e.pointerId); }catch(_){}
    });
    window.addEventListener("pointermove", function(e){
      if(!dragging) return; var dx = e.clientX - startX;
      show(startIdx - Math.round(dx/12));
    });
    window.addEventListener("pointerup", function(){
      if(dragging){ dragging=false; setTimeout(startAuto, 3000); }
    });
    // escala conforme o modelo selecionado (altura e diâmetro reais)
    window.addEventListener("af:model", function(e){
      var d=e.detail.d, h=e.detail.h;
      scaleStr = "scale(" + (0.78*d/10).toFixed(3) + "," + (0.78*h/54).toFixed(3) + ")";
      img.style.transform = scaleStr;
    });
    startAuto();
  })();

  // ---- GSAP subtle parallax (optional) ----
  if(window.gsap && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(".hero__video", {yPercent:14, ease:"none",
      scrollTrigger:{trigger:".hero", start:"top top", end:"bottom top", scrub:true}});
  }
})();
