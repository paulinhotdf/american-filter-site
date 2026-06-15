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
    {name:"8×35",  dim:'Ø 8" × 35" &nbsp;·&nbsp; Ø 20,3 × 88,9 cm',   flow:"até 1.000 litros/hora", desc:"Ideal para residências e comércios.", d:8, h:35},
    {name:"10×54", dim:'Ø 10" × 54" &nbsp;·&nbsp; Ø 25,4 × 137,2 cm', flow:"até 2.500 litros/hora", desc:"Apartamentos e casas de porte médio, com fluxo constante.", d:10, h:54},
    {name:"12×54", dim:'Ø 12" × 54" &nbsp;·&nbsp; Ø 30,5 × 137,2 cm', flow:"até 3.500 litros/hora", desc:"Casas grandes e alto consumo, vários pontos sem queda de pressão.", d:12, h:54},
    {name:"14×65", dim:'Ø 14" × 65" &nbsp;·&nbsp; Ø 35,6 × 165,1 cm', flow:"até 5.000 litros/hora", desc:"Residências amplas, comércio, indústria e condomínio.", d:14, h:65}
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

  // ---- GSAP subtle parallax (optional) ----
  if(window.gsap && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(".hero__video", {yPercent:14, ease:"none",
      scrollTrigger:{trigger:".hero", start:"top top", end:"bottom top", scrub:true}});
  }
})();
