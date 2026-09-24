// Troca PT/EN. Cada página define window.I18N_EN antes de carregar este arquivo.
// Os textos em português são lidos do próprio HTML:
//   data-i18n="chave"          troca o texto
//   data-i18n-html="chave"     troca o HTML (para textos com <strong>, <em>)
//   data-i18n-attr="attr:chave" troca um atributo (alt, href, aria-label)
(function () {
  var EN = window.I18N_EN || {};
  var PT = window.I18N_PT || {};
  var metaDesc = document.querySelector('meta[name="description"]');
  var toggle = document.getElementById("lang");
  var listeners = [];
  var current = "pt";

  PT["meta.title"] = document.title;
  if (metaDesc) PT["meta.description"] = metaDesc.content;
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    PT[el.dataset.i18n] = el.textContent.replace(/\s+/g, " ").trim();
  });
  document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
    PT[el.dataset.i18nHtml] = el.innerHTML.replace(/\s+/g, " ").trim();
  });
  document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
    var parts = el.dataset.i18nAttr.split(":");
    PT[parts[1]] = el.getAttribute(parts[0]);
  });

  function apply(lang) {
    current = lang;
    var dict = lang === "en" ? EN : PT;
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
    if (dict["meta.title"]) document.title = dict["meta.title"];
    if (metaDesc && dict["meta.description"]) metaDesc.content = dict["meta.description"];
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      if (dict[el.dataset.i18n] != null) el.textContent = dict[el.dataset.i18n];
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      if (dict[el.dataset.i18nHtml] != null) el.innerHTML = dict[el.dataset.i18nHtml];
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      var parts = el.dataset.i18nAttr.split(":");
      if (dict[parts[1]] != null) el.setAttribute(parts[0], dict[parts[1]]);
    });
    if (toggle) toggle.setAttribute("aria-checked", lang === "en" ? "true" : "false");
    try { localStorage.setItem("lang", lang); } catch (e) {}
    listeners.forEach(function (fn) { fn(lang); });
  }

  var fromUrl = new URLSearchParams(location.search).get("lang");
  var saved = null;
  try { saved = localStorage.getItem("lang"); } catch (e) {}
  var start = fromUrl === "en" || fromUrl === "pt" ? fromUrl
    : saved === "en" || saved === "pt" ? saved
    : (navigator.language || "pt").toLowerCase().indexOf("pt") === 0 ? "pt" : "en";
  if (start === "en") apply("en");

  if (toggle) {
    toggle.addEventListener("click", function () {
      apply(current === "en" ? "pt" : "en");
    });
  }

  window.i18n = {
    t: function (key) { return (current === "en" ? EN : PT)[key]; },
    onChange: function (fn) { listeners.push(fn); }
  };
})();
