(function ($) {
  "use strict";

  var DATA_PATH = "data/site-data.json?v=20260714-qr-5647";

  $(function () {
    $.getJSON(DATA_PATH)
      .done(function (data) {
        var pageKey = $("body").data("page");
        renderShell(data, pageKey);
        renderPage(data, pageKey);
        bindNavigation();
        bindFaq();
        bindForms(pageKey);
        bindThanksRedirect(data, pageKey);
      })
      .fail(function () {
        $("#app").html(
          '<section class="section"><div class="container"><div class="card"><h1>內容載入失敗</h1><p>請確認 data/site-data.json 存在並可讀取。</p></div></div></section>'
        );
      });
  });

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getLineUrl(data) {
    var brand = data.brand || {};
    if (brand.lineUrl) return brand.lineUrl;
    return "https://page.line.me/" + encodeURIComponent(brand.lineId || "");
  }

  function renderShell(data, pageKey) {
    var nav = data.nav
      .map(function (item) {
        var active = item.page === pageKey ? " is-active" : "";
        return '<li><a class="' + active + '" href="' + item.url + '">' + escapeHtml(item.label) + "</a></li>";
      })
      .join("");

    $("#site-header").html(
      '<div class="nav-wrap">' +
        '<a class="brand-link" href="index.html"><img class="brand-logo" src="' +
        escapeHtml(data.brand.logoImage) +
        '" alt="' +
        escapeHtml(data.brand.name) +
        ' logo"><span class="brand-copy"><strong>' +
        escapeHtml(data.brand.name) +
        "</strong><span>" +
        escapeHtml(data.brand.tagline) +
        "</span></span></a>" +
        '<button class="nav-toggle" type="button" aria-label="開啟導覽" aria-expanded="false">☰</button>' +
        '<nav aria-label="主要導覽"><ul class="nav-list">' +
        nav +
        "</ul></nav>" +
        "</div>"
    );

    $("#site-footer").html(
      '<div class="footer-wrap"><div>' +
        '<img class="footer-logo" src="' +
        escapeHtml(data.brand.logoImage) +
        '" alt="' +
        escapeHtml(data.brand.name) +
        ' logo"><div><strong>' +
        escapeHtml(data.brand.name) +
        "</strong><p>" +
        escapeHtml(data.brand.tagline) +
        " LINE ID: " +
        escapeHtml(data.brand.lineId) +
        '</p></div></div><div class="mini-links"><a href="order.html">訂購</a><a href="contact.html">詢問</a><a href="faq.html">FAQ</a></div></div>'
    );
  }

  function bindNavigation() {
    $(".nav-toggle").on("click", function () {
      var $list = $(".nav-list");
      var isOpen = !$list.hasClass("is-open");
      $list.toggleClass("is-open", isOpen);
      $(this).attr("aria-expanded", String(isOpen));
    });
  }

  function renderPage(data, pageKey) {
    var page = data.pages[pageKey];
    if (!page) return;

    if (pageKey === "home") renderHome(data, page);
    if (pageKey === "education") renderEducation(page);
    if (pageKey === "roasting") renderRoasting(page);
    if (pageKey === "faq") renderFaq(page);
    if (pageKey === "contact") renderContact(data, page);
    if (pageKey === "order") renderOrder(data, page);
    if (pageKey === "thanks") renderThanks(page);
  }

  function renderHome(data, page) {
    $("body").css("--hero-image", "url('" + data.brand.heroImage.replace("assets/images/", "../images/") + "')");
    $("#app").html(
      '<section class="hero logo-hero" aria-label="' +
        escapeHtml(page.title + " " + page.subtitle) +
        '"><div class="container"><h1 class="sr-only">' +
        escapeHtml(page.title) +
        '</h1><p class="sr-only">' +
        escapeHtml(page.subtitle) +
        "</p></div></section>" +
        '<section class="section"><div class="container story-grid"><div><div class="section-title"><p class="kicker">Brand Story</p><h2>' +
        escapeHtml(page.storyTitle) +
        '</h2></div><div class="prose">' +
        page.story.map(function (text) { return "<p>" + escapeHtml(text) + "</p>"; }).join("") +
        '</div><div class="actions"><a class="button" href="' +
        page.primaryCta.url +
        '">' +
        escapeHtml(page.primaryCta.label) +
        '</a><a class="button light" href="' +
        page.secondaryCta.url +
        '">' +
        escapeHtml(page.secondaryCta.label) +
        '</a></div></div><div class="card-grid">' +
        renderCards(page.values) +
        "</div></div></section>" +
        '<section class="section alt"><div class="container line-grid">' +
        renderLineCopy(data, page.lineTitle, page.lineBody, data.brand.lineQrMain) +
        "</div></section>" +
        '<section class="section"><div class="container"><div class="section-title"><p class="kicker">Highlights</p><h2>' +
        escapeHtml(page.featureTitle) +
        '</h2></div><div class="card-grid">' +
        renderCards(page.features) +
        "</div></div></section>"
    );
  }

  function renderEducation(page) {
    $("#app").html(
      renderPageHero(page) +
        '<section class="section"><div class="container"><div class="section-title"><p class="kicker">Origins</p><h2>' +
        escapeHtml(page.originsTitle) +
        '</h2></div><div class="origin-grid">' +
        page.origins
          .map(function (item) {
            return '<article class="card origin-card"><h3>' +
              escapeHtml(item.name) +
              "</h3><small>" +
              escapeHtml(item.region) +
              "</small><p><strong>" +
              escapeHtml(item.flavor) +
              "</strong></p><p>" +
              escapeHtml(item.note) +
              "</p></article>";
          })
          .join("") +
        '</div></div></section><section class="section alt"><div class="container"><div class="section-title"><p class="kicker">Roast Guide</p><h2>' +
        escapeHtml(page.roastTitle) +
        '</h2></div><div class="card-grid">' +
        page.roasts
          .map(function (item) {
            return '<article class="card"><p class="kicker">' +
              escapeHtml(item.english) +
              "</p><h3>" +
              escapeHtml(item.name) +
              "</h3><p>" +
              escapeHtml(item.summary) +
              '</p><div class="tag-row">' +
              item.tags.map(function (tag) { return '<span class="tag">' + escapeHtml(tag) + "</span>"; }).join("") +
              "</div></article>";
          })
          .join("") +
        "</div></div></section>"
    );
  }

  function renderRoasting(page) {
    $("#app").html(
      renderPageHero(page) +
        '<section class="section"><div class="container"><div class="steps-grid">' +
        page.steps
          .map(function (item) {
            return '<article class="card step-card">' +
              renderItemImage(item, "step-image") +
              '<span class="step-number">' +
              escapeHtml(item.number) +
              "</span><h3>" +
              escapeHtml(item.title) +
              "</h3><p>" +
              escapeHtml(item.text) +
              '</p><div class="focus">' +
              escapeHtml(item.focus) +
              "</div></article>";
          })
          .join("") +
        '</div></div></section><section class="section alt"><div class="container"><div class="section-title"><p class="kicker">Key Points</p><h2>' +
        escapeHtml(page.summaryTitle) +
        '</h2></div><ul class="note-list">' +
        page.summary.map(function (item) { return "<li>" + escapeHtml(item) + "</li>"; }).join("") +
        "</ul></div></section>"
    );
  }

  function renderFaq(page) {
    $("#app").html(
      renderPageHero(page) +
        '<section class="section"><div class="container"><div class="faq-card-grid">' +
        page.items
          .map(function (item, index) {
            return '<article class="faq-card">' +
              renderItemImage(item, "faq-image") +
              '<div class="faq-copy"><div class="faq-badge">Q' +
              String(index + 1).padStart(2, "0") +
              '</div><div><h3>' +
              escapeHtml(item.q) +
              '</h3><p>A：' +
              escapeHtml(item.a) +
              "</p></div></div></article>";
          })
          .join("") +
        "</div></div></section>"
    );
  }

  function renderItemImage(item, className) {
    if (!item.image) return "";
    return '<figure class="' +
      className +
      '"><img src="' +
      escapeHtml(item.image) +
      '" alt="' +
      escapeHtml(item.imageAlt || item.title || item.q || "") +
      '"></figure>';
  }

  function renderContact(data, page) {
    $("#app").html(
      renderSimpleHero(page) +
        '<section class="section"><div class="container two-col"><div>' +
        renderForm(page) +
        "</div>" +
        renderLinePanel(data, data.brand.lineQrMain) +
        "</div></section>"
    );
  }

  function renderOrder(data, page) {
    var monthlyContent = "";
    if (page.beans && page.beans.length) {
      monthlyContent = '<div class="menu-grid">' +
        page.beans
          .map(function (bean) {
            return '<article class="card"><h3>' +
              escapeHtml(bean.item) +
              '</h3><p class="bean-meta">' +
              escapeHtml(bean.roast) +
              "</p><p>" +
              escapeHtml(bean.flavor) +
              "</p><p><strong>" +
              escapeHtml(bean.price) +
              "</strong></p></article>";
          })
          .join("") +
        "</div>";
    } else {
      monthlyContent = '<div class="card-grid">' +
        renderCards(page.monthlyHighlights || []) +
        "</div>";
    }

    $("#app").html(
      renderSimpleHero(page) +
        '<section class="section"><div class="container"><div class="section-title"><p class="kicker">' +
        escapeHtml(page.month) +
        "</p><h2>" +
        escapeHtml(page.menuTitle) +
        "</h2></div>" +
        monthlyContent +
        '</div></section><section class="section alt"><div class="container two-col"><div><div class="section-title"><p class="kicker">Offer</p><h2>' +
        escapeHtml(page.promotionsTitle) +
        '</h2></div><ul class="note-list">' +
        page.promotions.map(function (item) { return "<li>" + escapeHtml(item) + "</li>"; }).join("") +
        '</ul></div><div><div class="section-title"><p class="kicker">Loyalty</p><h2>' +
        escapeHtml(page.loyaltyTitle) +
        '</h2></div><ul class="note-list">' +
        page.loyalty.map(function (item) { return "<li>" + escapeHtml(item) + "</li>"; }).join("") +
        "</ul></div></div></section>" +
        '<section class="section"><div class="container two-col"><div>' +
        renderForm(page) +
        "</div>" +
        renderLinePanel(data, data.brand.lineQrBrand) +
        "</div></section>"
    );
  }

  function renderThanks(page) {
    $("#app").html(
      '<section class="section thanks-panel"><div class="container"><div class="card"><p class="kicker">Submitted</p><h1>' +
        escapeHtml(page.title) +
        '</h1><p class="prose">' +
        escapeHtml(page.subtitle) +
        '</p><div class="actions" style="justify-content:center"><a class="button" href="index.html">回首頁</a></div></div></div></section>'
    );
  }

  function renderPageHero(page) {
    var hasImage = page.image && !page.hideHeroImage;
    var sectionClass = hasImage ? "page-hero" : "page-hero simple-hero";
    var imageHtml = hasImage
      ? '</div><div class="page-hero-image"><img src="' +
        escapeHtml(page.image) +
        '" alt="' +
        escapeHtml(page.title) +
        '"></div>'
      : "</div>";

    return '<section class="' + sectionClass + '"><div class="container"><div><p class="kicker">' +
      escapeHtml(page.kicker) +
      "</p><h1>" +
      escapeHtml(page.title) +
      '</h1><p class="lead">' +
      escapeHtml(page.subtitle) +
      "</p>" +
      imageHtml +
      "</div></section>";
  }

  function renderSimpleHero(page) {
    return '<section class="page-hero"><div class="container"><div><p class="kicker">' +
      escapeHtml(page.kicker) +
      "</p><h1>" +
      escapeHtml(page.title) +
      '</h1><p class="lead">' +
      escapeHtml(page.subtitle) +
      "</p></div></div></section>";
  }

  function renderCards(items) {
    return items
      .map(function (item) {
        return '<article class="card"><h3>' + escapeHtml(item.title) + "</h3><p>" + escapeHtml(item.text) + "</p></article>";
      })
      .join("");
  }

  function renderLineCopy(data, title, body, qrPath) {
    return '<div><div class="section-title"><p class="kicker">LINE</p><h2>' +
      escapeHtml(title) +
      '</h2><p>' +
      escapeHtml(body) +
      '</p></div><div class="actions"><a class="button" href="contact.html">留下詢問</a><a class="button light" href="order.html">查看優惠</a></div></div>' +
      renderLinePanel(data, qrPath);
  }

  function renderLinePanel(data, qrPath) {
    var lineUrl = getLineUrl(data);
    return '<aside class="qr-panel"><a class="qr-link" href="' +
      escapeHtml(lineUrl) +
      '" target="_blank" rel="noopener" aria-label="' +
      escapeHtml(data.brand.lineText) +
      '"><img src="' +
      escapeHtml(qrPath) +
      '" alt="LINE QRcode"><span>' +
      escapeHtml(data.brand.lineText) +
      '</span></a><a class="line-id" href="' +
      escapeHtml(lineUrl) +
      '" target="_blank" rel="noopener">LINE ID: ' +
      escapeHtml(data.brand.lineId) +
      '</a><a class="button light qr-button" href="' +
      escapeHtml(lineUrl) +
      '" target="_blank" rel="noopener">開啟 LINE 加好友</a></aside>';
  }

  function renderForm(page) {
    var fields = page.fields
      .map(function (field) {
        var full = field.type === "textarea" ? " full" : "";
        var required = field.required ? " required" : "";
        var control = "";
        if (field.type === "select") {
          control = '<select name="' + field.name + '"' + required + ">" +
            '<option value="">請選擇</option>' +
            field.options.map(function (option) { return '<option value="' + escapeHtml(option) + '">' + escapeHtml(option) + "</option>"; }).join("") +
            "</select>";
        } else if (field.type === "textarea") {
          control = '<textarea name="' + field.name + '"' + required + "></textarea>";
        } else {
          var min = field.min ? ' min="' + escapeHtml(field.min) + '"' : "";
          control = '<input type="' + field.type + '" name="' + field.name + '"' + min + required + ">";
        }
        return '<div class="field' + full + '"><label>' + escapeHtml(field.label) + control + "</label></div>";
      })
      .join("");

    return '<form class="form-panel js-lead-form" data-form-type="' +
      escapeHtml(page.formType) +
      '"><div class="form-grid">' +
      fields +
      '</div><div class="actions"><button class="button" type="submit">' +
      escapeHtml(page.submitLabel) +
      '</button><button class="button light js-test-data" type="button">' +
      escapeHtml(page.testLabel) +
      '</button></div><div class="form-status" role="status" aria-live="polite"></div></form>';
  }

  function bindFaq() {
    $(document).on("click", ".faq-question", function () {
      $(this).closest(".faq-item").toggleClass("is-open");
    });
  }

  function bindForms(pageKey) {
    $(document).on("click", ".js-test-data", function () {
      var $form = $(this).closest("form");
      fillTestData($form);
    });

    $(document).on("submit", ".js-lead-form", function (event) {
      event.preventDefault();
      submitForm($(this), pageKey);
    });
  }

  function fillTestData($form) {
    var type = $form.data("form-type");
    var sample = {
      name: "測試使用者",
      phone: "0900000000",
      lineId: "test-line",
      email: "test@example.com",
      topic: "產品風味",
      message: "這是一筆前端測試資料，用來確認表單欄位與 Google Apps Script 串接。",
      item: "請推薦",
      quantity: "1",
      grind: "不研磨",
      pickup: "先詢問",
      contactMethod: "LINE",
      note: "測試訂單資料"
    };
    if (type === "order") {
      sample.topic = "本月優惠";
      sample.message = "想了解本月優惠、現貨與適合的風味，請協助聯絡。";
    }
    $form.find("[name]").each(function () {
      var name = $(this).attr("name");
      $(this).val(sample[name] || "");
    });
    $form.find(".form-status").removeClass("error").addClass("success").text(type === "order" ? "已填入測試訂單。" : "已填入測試詢問。");
  }

  function submitForm($form, pageKey) {
    var config = window.SIYU_FORM_CONFIG || {};
    var endpoint = $.trim(config.googleScriptUrl || "");
    var payload = {};
    $form.serializeArray().forEach(function (item) {
      payload[item.name] = item.value;
    });
    payload.formType = $form.data("form-type");
    payload.sourcePage = pageKey;
    payload.submittedAt = new Date().toISOString();

    var $status = $form.find(".form-status");
    $status.removeClass("success error").text("送出中...");

    if (!endpoint) {
      saveDemoSubmission(config.demoStorageKey, payload);
      $status.addClass("success").text("Demo 模式已儲存，正在前往感謝頁。");
      window.setTimeout(function () { window.location.href = "thanks.html?mode=demo"; }, 500);
      return;
    }

    fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    })
      .then(function () {
        $status.addClass("success").text("已送出，正在前往感謝頁。");
        window.setTimeout(function () { window.location.href = "thanks.html"; }, 500);
      })
      .catch(function () {
        saveDemoSubmission(config.demoStorageKey, payload);
        $status.addClass("error").text("送出時遇到問題，已先在本機保存 demo 資料。");
      });
  }

  function saveDemoSubmission(key, payload) {
    var storageKey = key || "siyu-demo-submissions";
    var existing = [];
    try {
      existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch (error) {
      existing = [];
    }
    existing.push(payload);
    localStorage.setItem(storageKey, JSON.stringify(existing));
  }

  function bindThanksRedirect(data, pageKey) {
    if (pageKey !== "thanks") return;
    var seconds = data.pages.thanks.redirectSeconds || 2;
    window.setTimeout(function () {
      window.location.href = "index.html";
    }, seconds * 1000);
  }
})(jQuery);
