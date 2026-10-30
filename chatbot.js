console.log("CHATBOT JS LOADED");

document.addEventListener("DOMContentLoaded", () => {

  const chatToggle = document.getElementById("chat-toggle");
  const chatWidget = document.getElementById("chat-widget");
  const closeChat = document.getElementById("close-chat");
  const input = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");
  const messages = document.getElementById("chat-messages");


  if (!chatToggle || !chatWidget || !closeChat || !input || !sendBtn || !messages) {
    console.error("Chatbot HTML mismatch");
    return;
  }

  // Inject pulsing online status indicator
  const chatHeader = document.querySelector(".chat-header");
  if (chatHeader) {
    const headerSpan = chatHeader.querySelector("span");
    if (headerSpan) {
      headerSpan.innerHTML = `
        <div class="chat-header-title">
      <span><img src="assets/chat-icon.png" alt="" class="chat-title-logo"> AI Assistant</span>
                <div class="chat-status">
            <span class="status-dot"></span>
            <span class="status-text">Online</span>
          </div>
        </div>
      `;
    }
  }

  // Welcome Tooltip logic
  setTimeout(() => {
    if (localStorage.getItem('chat-tooltip-dismissed') === 'true') return;
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'chat-tooltip';
    tooltip.id = 'chat-tooltip';
    tooltip.innerHTML = `
      <span>Have questions? Ask our AI Assistant! ♻️</span>
      <button id="close-tooltip">&times;</button>
    `;
    document.body.appendChild(tooltip);
    
    // Animate in
    setTimeout(() => tooltip.classList.add('active'), 100);
    
    // Close button
    const closeTooltipBtn = document.getElementById('close-tooltip');
    if (closeTooltipBtn) {
      closeTooltipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dismissTooltip(tooltip);
      });
    }
    
    // Clicking tooltip opens chat
    tooltip.addEventListener('click', () => {
      dismissTooltip(tooltip);
      chatWidget.classList.add('active');
    });
  }, 4000);

  function dismissTooltip(tooltip) {
    tooltip.classList.remove('active');
    setTimeout(() => tooltip.remove(), 450);
    localStorage.setItem('chat-tooltip-dismissed', 'true');
  }

  // Open chatbot
  // Toggle chatbot open / close
  chatToggle.onclick = () => {
    chatWidget.classList.toggle("active");
    const existingTooltip = document.getElementById('chat-tooltip');
    if (existingTooltip) {
      dismissTooltip(existingTooltip);
    }
  };


// Close using X button
closeChat.onclick = () => {

  chatWidget.classList.remove("active");

};

  sendBtn.onclick = handleMessage;
  document.querySelectorAll(".quick-btn").forEach(button => {

  button.addEventListener("click", () => {

    input.value = button.innerText;
    handleMessage();

  });

});


  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleMessage();
    }
  });



  function addMessage(text, type) {

    const div = document.createElement("div");

    div.className = type === "user"
      ? "user-message"
      : "bot-message";

div.innerHTML = text
  .replace(
    /\+971 4575 5378/g,
    '<a href="tel:+97145755378">📞 +971 4575 5378</a>'
  )
  .replace(
    /info@gatewayresources\.net/g,
    '<a href="mailto:info@gatewayresources.net">✉️ info@gatewayresources.net</a>'
  );
    messages.appendChild(div);

    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {

  const div = document.createElement("div");

  div.className = "bot-message typing";

  div.innerText = "Bot is typing...";

  messages.appendChild(div);

  messages.scrollTop = messages.scrollHeight;

  return div;

}



  function handleMessage() {

    const userText = input.value.trim();

    if (!userText) return;


    addMessage(userText, "user");

    input.value = "";


    const reply = getReply(userText);


   const typing = showTyping();


setTimeout(() => {

  typing.remove();

  addMessage(reply.message, "bot");


  if (reply.action === "page") {
    window.location.href = reply.target;
  }


  if (reply.action === "scroll") {

    const section = document.querySelector(reply.target);

    if (section) {

      section.scrollIntoView({
        behavior: "smooth"
      });

    }

  }


}, 1200);
  }





  function getReply(message) {

 const text = message
  .toLowerCase()
  .replace(/[^\w\s]/gi, "")
  .trim();

    // Whole-word check: "hi" matches "hi there" but NOT "shipping" or "which";
    // an extra "s" at the end is allowed ("price" also matches "prices")
    function has(words) {
      return words.some(w => new RegExp("\\b" + w + "s?\\b").test(text));
    }



    // HOME / MAIN
    if (text.includes("home") || text.includes("main page") || text.includes("homepage")) {
      return {
        message: "Navigating to Home page... 🏠",
        action: "page",
        target: "index.html"
      };
    }

    // REDIRECTS / PAGE NAVIGATION
    if (text.includes("take me to") || text.includes("go to") || text.includes("navigate") || text.includes("open")) {
      if (text.includes("plastic")) {
        return {
          message: "Navigating to our Plastic Segment page... 🧴",
          action: "page",
          target: "plastic-segment.html"
        };
      }
      if (text.includes("rubber") || text.includes("tyre") || text.includes("tire")) {
        return {
          message: "Navigating to our Rubber Segment page... 🛞",
          action: "page",
          target: "rubber-segment.html"
        };
      }
      if (text.includes("about")) {
        return {
          message: "Scrolling to the About Us section... 🏢",
          action: "scroll",
          target: "#about"
        };
      }
      if (text.includes("contact") || text.includes("message")) {
        return {
          message: "Scrolling to the Contact section... 📞",
          action: "scroll",
          target: "#contact"
        };
      }
      if (text.includes("location") || text.includes("map") || text.includes("office")) {
        return {
          message: "Scrolling to our Global Headquarters location... 📍",
          action: "scroll",
          target: "#location"
        };
      }
      if (text.includes("segment")) {
        return {
          message: "Scrolling to Our Segments section... ♻️",
          action: "scroll",
          target: "#segments"
        };
      }
    }

    // TIME & DATE QUESTIONS
    if (/\b(time|date|clock|today|current time|what time)\b/.test(text)) {      const dubTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Dubai", dateStyle: "medium", timeStyle: "short" });
      const locTime = new Date().toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
      return {
        message: `🕒 <b>Real-Time Date & Time</b>:<br>• <b>Your Local Time</b>: ${locTime}<br>• <b>Dubai Headquarters Time</b>: ${dubTime} (GST, UTC+4)<br><br>Our trading desk is active during Dubai business hours (9:00 AM - 6:00 PM, Mon-Fri).`
      };
    }

    // ===== NEW QUESTIONS =====

    // Thank you
    if (has(["thank", "thanks", "thank you", "thank u", "thx", "appreciate", "appreciated"])) {
      return {
        message: "😊 You're welcome! Is there anything else I can help you with?"
      };
    }

    // Full product list ("what do you sell" must land here, not in "supply to us")
    if (has(["what products", "which products", "all products", "product list", "full list", "list of products", "what materials", "which materials", "what do you trade", "what do you sell", "what do you deal", "what commodities"])) {
      return {
        message: "📦 <b>Commodities We Trade</b>:<br><br>🧴 <b>Plastic</b>: HDPE 100 Regrind, HDPE 80 Regrind, HDPE Drums Regrind, LDPE Bales, PET Chips, PET Flakes, PET Lumps (Colour and Natural), PET Sorter Reject Flakes, PET Strap Bales, PET Strap Shredded, Polyester Industrial Wiry (Natural), PP Bags, PP Buckets Regrind.<br><br>🛞 <b>Rubber</b>: Baled Automobile Tyres, Shredded Tyres (various sizes), Truck Tyres (3 cut), Rubber Crumbs / Granules, OTR Tyres, Airplane Tyres, Vulcanised / Devulcanised Rubber, Buffing Powder, Rubber Stampings and Seals.<br><br>Ask me about any of them, for example <i>\"What is PET strap shredded?\"</i>"
      };
    }

    // Selling to us / becoming a supplier (checked before "quote", so "can you buy my scrap" lands here)
    if (has(["sell", "selling", "supplier", "vendor", "become a supplier", "buy my", "buy our", "purchase my", "purchase our"])) {
      return {
        message: "🤝 <b>Supply to Gateway Resources</b>:<br>We are always looking for reliable suppliers. Please email us the <b>material</b>, a few <b>photos</b>, the <b>monthly quantity</b> and the <b>loading location</b> at info@gatewayresources.net, and our team will get back to you."
      };
    }

    // Quote / price
    if (has(["quote", "quotation", "price", "pricing", "cost", "rate", "buy", "purchase", "enquiry", "inquiry"])) {
      return {
        message: "💬 <b>Request a Quote</b>:<br>Send us the <b>material</b>, <b>quantity</b> and <b>destination port</b> at info@gatewayresources.net or through the contact form on this page, and our trading team will reply with an offer.<br><br><a href='index.html#contact'>Go to the contact form →</a>"
      };
    }

    // LinkedIn / social media
    if (has(["linkedin", "social media", "instagram", "facebook", "follow you", "follow us"])) {
      return {
        message: "🔗 <b>Follow Us</b>:<br>Stay up to date with Gateway Resources on LinkedIn.<br><br><a href='https://www.linkedin.com/company/gateway-resources/' target='_blank' rel='noopener noreferrer'>Gateway Resources on LinkedIn →</a>"
      };
    }

    // ===== END OF NEW QUESTIONS =====

    // ===== PRODUCT EXPLANATIONS ("What is ...?") =====
    // More specific names come first, so "pet sorter reject flakes" is not caught by "pet flakes"
    const products = [
      // ----- Plastic -----
      { k: ["polyester industrial wiry", "industrial wiry", "wiry", "polyester"], s: "🧴", t: "Polyester Industrial Wiry (Natural)",
        d: "Industrial polyester (PET) yarn and filament waste: stiff, wire-like strands in their natural, undyed colour, left over from making heavy-duty industrial yarns. It is recycled into polyester fibre and other polyester products." },
      { k: ["pet sorter reject", "sorter reject", "reject flake"], s: "🧴", t: "PET Sorter Reject Flakes",
        d: "PET flakes that optical sorting machines remove from the main stream in a PET recycling line, for example because of off-colours or small impurities. They are still usable as raw material for products such as polyester fibre and strapping." },
      { k: ["pet strap shredded", "strap shredded", "shredded strap", "shredded pet strap"], s: "🧴", t: "PET Strap Shredded",
        d: "Used PET packaging straps (the bands that hold goods on pallets) cut into small pieces, ready for washing, melting and recycling into new strapping, fibre or other PET products." },
      { k: ["pet strap bale", "strap bale", "baled strap"], s: "🧴", t: "PET Strap Bales",
        d: "Used PET packaging straps (the bands that hold goods on pallets) compressed into bales for transport. They are recycled into new strapping, polyester fibre and other PET products." },
      { k: ["pet strap", "strap"], s: "🧴", t: "PET Straps",
        d: "Used PET packaging straps, the bands that hold goods on pallets. We trade them as <b>PET Strap Bales</b> (compressed bales) and <b>PET Strap Shredded</b> (cut into small pieces). Both are recycled into new strapping, fibre and other PET products." },
      { k: ["pet lumps colour", "pet lumps color", "pet lumps coloured", "pet lumps colored", "colour pet lump", "color pet lump", "coloured pet lump", "colored pet lump", "colour lump", "color lump"], s: "🧴", t: "PET Lumps (Colour)",
        d: "Solid lumps of coloured PET produced in PET processing plants, for example when machines are started up or switched between products. The lumps are ground and re-melted into new PET products." },
      { k: ["pet lumps natural", "natural pet lump", "natural lump", "clear pet lump"], s: "🧴", t: "PET Lumps (Natural)",
        d: "Solid lumps of natural (uncoloured) PET produced in PET processing plants, for example when machines are started up or switched between products. Because they have no colour, they can be used in a wider range of new PET products." },
      { k: ["pet lump", "lump"], s: "🧴", t: "PET Lumps",
        d: "Solid lumps of PET produced in PET processing plants, for example when machines are started up or switched between products. We trade them as <b>PET Lumps Colour</b> and <b>PET Lumps Natural</b> (uncoloured). They are ground and re-melted into new PET products." },
      { k: ["pet flake"], s: "🧴", t: "PET Flakes",
        d: "Used PET bottles that are collected, sorted and ground into small flakes. PET flakes are a main raw material for polyester fibre, strapping, sheets and new bottles." },
      { k: ["pet chip"], s: "🧴", t: "PET Chips",
        d: "PET in small chip or pellet form. It is a ready-to-use raw material for making bottles, polyester fibre and sheets." },
      { k: ["hdpe 100", "hdpe100", "pe100", "pe 100"], s: "🧴", t: "HDPE 100 Regrind",
        d: "Ground (regrind) high-density polyethylene from the PE100 grade, the high-strength grade used mainly for pressure pipes such as water and gas pipes. It is recycled into new pipes and other HDPE products." },
      { k: ["hdpe 80", "hdpe80", "pe80", "pe 80"], s: "🧴", t: "HDPE 80 Regrind",
        d: "Ground (regrind) high-density polyethylene from the PE80 grade, a pipe grade with a slightly lower pressure rating than PE100. It is recycled into new pipes and other HDPE products." },
      { k: ["hdpe drum", "drum regrind", "drum"], s: "🧴", t: "HDPE Drums Regrind",
        d: "Used HDPE drums (large plastic containers for liquids and chemicals) that are ground into flakes. The regrind is recycled into new drums, pallets, crates and pipes." },
      { k: ["ldpe bale", "ldpe", "ldpe film"], s: "🧴", t: "LDPE Bales",
        d: "Low-density polyethylene film, such as packaging, stretch and shrink film and plastic bags, compressed into bales. It is recycled into pellets for new film, bags and other soft plastic products." },
      { k: ["pp bag", "woven bag", "woven pp", "jumbo bag"], s: "🧴", t: "PP Bags",
        d: "Used woven polypropylene bags, such as sacks for rice, sugar, cement and fertiliser. They are baled and recycled into PP granules for new bags and other PP products." },
      { k: ["pp bucket", "bucket regrind", "bucket"], s: "🧴", t: "PP Buckets Regrind",
        d: "Used polypropylene buckets and containers that are ground into flakes (regrind). It is recycled into pellets for moulded products such as new buckets, crates and household items." },
      // ----- Rubber -----
      { k: ["baled automobile", "baled tyre", "baled tire", "automobile tyre", "automobile tire", "car tyre", "car tire", "passenger tyre", "passenger tire"], s: "🛞", t: "Baled Automobile Tyres",
        d: "Whole used car tyres pressed into dense, rectangular bales, so many more tyres fit in one container. They are recycled into rubber crumb, used in pyrolysis, or used as tyre-derived fuel." },
      { k: ["shredded tyre", "shredded tire", "tyre shred", "tire shred", "shred"], s: "🛞", t: "Shredded Tyres (Various Sizes)",
        d: "End-of-life tyres cut by shredding machines into pieces of different sizes. They are used as tyre-derived fuel (for example in cement plants), in pyrolysis, or processed further into rubber crumb." },
      { k: ["truck tyres 3 cut", "3 cut", "3cut", "three cut", "truck tyre", "truck tire"], s: "🛞", t: "Truck Tyres (3 cut)",
        d: "Used truck tyres cut into three parts: the two sidewalls and the tread. Cut this way, they stack flat, so far more fit in a container. They are recycled into rubber crumb and reclaimed rubber." },
      { k: ["rubber crumb", "rubber granule", "crumb", "granule"], s: "🛞", t: "Rubber Crumbs / Granules",
        d: "Tyre rubber ground into small granules, with the steel and fibre removed. They are used for sports fields and running tracks, playground and safety flooring, rubber mats and rubberised asphalt." },
      { k: ["otr", "off the road", "offtheroad", "mining tyre", "mining tire"], s: "🛞", t: "OTR (Off-the-Road) Tyres",
        d: "Very large tyres from mining trucks, loaders and earth-moving machines. They contain a lot of rubber and are cut up and recycled into rubber crumb and reclaimed rubber." },
      { k: ["airplane tyre", "airplane tire", "aeroplane tyre", "aircraft tyre", "aircraft tire", "aviation tyre", "aviation tire", "airplane", "aircraft", "aviation"], s: "🛞", t: "Airplane Tyres",
        d: "Used aircraft tyres. They are made from high-quality rubber with a high share of natural rubber, which makes them valuable for producing reclaimed rubber and rubber crumb." },
      { k: ["devulcanised", "devulcanized", "vulcanised", "vulcanized", "devulcanisation", "vulcanisation"], s: "🛞", t: "Vulcanised / Devulcanised Rubber",
        d: "<b>Vulcanised rubber</b> is rubber that has been cured with sulphur and heat, which makes it strong and elastic, like the rubber in tyres. <b>Devulcanised rubber</b> is recycled rubber treated to partly break those bonds again, so it can be mixed and moulded into new rubber products." },
      { k: ["buffing powder", "buffing", "buffings"], s: "🛞", t: "Buffing Powder",
        d: "Fine rubber dust and shavings produced when worn tyres are ground smooth before retreading. It is used in rubber compounds, mats and flooring, and as a filler." },
      { k: ["rubber stamping", "stamping", "rubber seal", "seal", "gasket"], s: "🛞", t: "Rubber Stampings and Seals",
        d: "Off-cuts and scrap from manufacturing rubber parts such as seals, gaskets and stamped components. It is clean, unused rubber that is recycled into new rubber products." }
    ];
    for (const p of products) {
      if (has(p.k)) {
        return {
          message: `${p.s} <b>${p.t}</b>:<br>${p.d}<br><br><a href='index.html#contact'>Ask for a quote →</a>`
        };
      }
    }
    // ===== END OF PRODUCT EXPLANATIONS =====

    // DETAILED PLASTIC COMMODITIES (whole words only, so "shipping" and "supplier" no longer match "pp")
    if (has(["pet", "hdpe", "pp", "ldpe", "lldpe", "polymer", "grade"])) {
      return {
        message: "🧴 <b>Recyclable Plastics We Trade</b>:<br>• <b>HDPE</b>: HDPE 100 Regrind, HDPE 80 Regrind, HDPE Drums Regrind<br>• <b>LDPE</b>: LDPE Bales<br>• <b>PET</b>: PET Chips, PET Flakes, PET Lumps (Colour and Natural), PET Sorter Reject Flakes, PET Strap Bales, PET Strap Shredded<br>• <b>Polyester</b>: Polyester Industrial Wiry (Natural)<br>• <b>PP</b>: PP Bags, PP Buckets Regrind<br><br>Ask me about any of them, for example <i>\"What is HDPE 100 regrind?\"</i>"
      };
    }

    // DETAILED RUBBER COMMODITIES
    if (text.includes("crumb") || text.includes("granule") || text.includes("otr") || text.includes("shredded") || text.includes("baled") || text.includes("devulcanised") || text.includes("buffing")) {
      return {
        message: "🛞 <b>Recyclable Rubber & Tyres We Trade</b>:<br>• Baled Automobile Tyres<br>• Shredded Tyres (various sizes)<br>• Truck Tyres (3 cut)<br>• Rubber Crumbs / Granules<br>• OTR (Off-the-Road) Tyres<br>• Airplane Tyres<br>• Vulcanised / Devulcanised Rubber<br>• Buffing Powder<br>• Rubber Stampings and Seals<br><br>Ask me about any of them, for example <i>\"What are 3 cut truck tyres?\"</i>"
      };
    }

    // GREETING (whole words only, so "which", "this" and "shipping" no longer trigger it)
    if (has(["hi", "hello", "hey", "hii", "greeting", "good morning", "good afternoon", "good evening", "salam", "assalamualaikum"])) {
      return {
        message: "👋 Hello! Welcome to Gateway Resources FZCO. Ask me about our <b>plastic</b> or <b>rubber</b> commodities, how to <b>get a quote</b>, how to <b>supply to us</b>, or how to <b>reach our team</b>."
      };
    }

    if (text.includes("plastic")) {
      return {
        message: "🧴 <b>Plastic Segment</b>:<br>We source, trade, and handle logistics for recyclable plastics globally, including HDPE regrind, LDPE bales, PET flakes, chips, lumps and straps, polyester industrial wiry, PP bags and PP buckets regrind.<br><br><a href='plastic-segment.html'>Explore Plastic Segment →</a>"
      };
    }

    if (text.includes("rubber") || text.includes("tyre") || text.includes("tire")) {
      return {
        message: "🛞 <b>Rubber Segment</b>:<br>We procure and supply end-of-life tyres (automobile, truck, OTR and airplane), shredded tyres, rubber crumbs and granules, vulcanised and devulcanised rubber, buffing powder, and rubber stampings and seals to responsible recyclers.<br><br><a href='rubber-segment.html'>Explore Rubber Segment →</a>"
      };
    }

    if (text.includes("sustainability") || text.includes("recycle") || text.includes("green") || text.includes("circular") || has(["eco"])) {
      return {
        message: "♻️ <b>Circular Economy Commitment</b>:<br>Gateway Resources is committed to reducing environmental waste. We connect scrap suppliers with responsible manufacturers to ensure a sustainable tomorrow through economically sound recycling pipelines."
      };
    }


    if (text.includes("service") || text.includes("provide") || text.includes("what do you do") || text.includes("operation")) {
      return {
        message: "🛠️ <b>Our Core Operations</b>:<br>We provide end-to-end global trading solutions:<br>1. Sourcing & Procurement of scrap/waste materials<br>2. Logistics & Global shipping distribution<br>3. Financing & Trade credit support<br>4. Compliance & vendor quality auditing."
      };
    }

    if (text.includes("contact") || text.includes("phone") || text.includes("number") || text.includes("call") || text.includes("telephone")) {
      return {
        message: "📞 <b>Contact Us</b>:<br>Telephone: <a href='tel:+97145755378'>+971 4575 5378</a><br>Email: <a href='mailto:info@gatewayresources.net'>info@gatewayresources.net</a><br>Our team is available Mon-Fri during Dubai business hours."
      };
    }

    if (text.includes("email") || text.includes("mail")) {
      return {
        message: "✉️ <b>Email Address</b>:<br><a href='mailto:info@gatewayresources.net'>info@gatewayresources.net</a>. Feel free to send us your trade inquiries, certifications, or supply listings."
      };
    }

    if (text.includes("location") || text.includes("address") || has(["where"]) || text.includes("dubai") || text.includes("office") || text.includes("headquarter")) {
      return {
        message: "📍 <b>Dubai Headquarters</b>:<br>Office 2707, Jumeirah Bay Tower X3, Jumeirah Lake Towers (JLT), PO Box 12502, Dubai, United Arab Emirates.<br><br><a href='https://maps.google.com/?q=Jumeirah+Bay+Tower+X3+Dubai' target='_blank'>Google Maps Location →</a>"
      };
    }


const faqList = (typeof faq !== "undefined") ? faq : [];
for (const item of faqList) {
  if (has(item.keywords)) {
    return {
      message: item.answer
    };
  }
}
    return {
      message: "🤖 I'm here to help! You can ask me about our <b>Company</b>, <b>Plastic</b> or <b>Rubber</b> products, <b>Services</b>, how to <b>get a quote</b> or <b>supply to us</b>, our <b>Dubai Location</b>, or how to <b>Contact</b> our trading desk."
    };
  }


});
/* ===== Chatbot design F (sketch): white header on top, green icon strip + chat below ===== */
(function () {
  var widget = document.getElementById('chat-widget');
  if (!widget || widget.querySelector('.cb-side')) return;
  var header = widget.querySelector('.chat-header');

  // Logo in the header: the green hexagon icon
  if (header) {
    var hLogo = header.querySelector('.chat-title-logo');
    if (!hLogo) {
      hLogo = document.createElement('img');
      hLogo.className = 'chat-title-logo';
      hLogo.alt = '';
      var titleSpot = header.querySelector('span') || header;
      titleSpot.insertBefore(hLogo, titleSpot.firstChild);
    }
    hLogo.src = 'assets/chat-icon.png';
  }

  // Messages, quick buttons and typing box go in the main column (the header stays on top)
  var main = document.createElement('div');
  main.className = 'cb-main';
  Array.prototype.slice.call(widget.children).forEach(function (el) {
    if (el !== header) main.appendChild(el);
  });

  // Green strip with one icon per topic
  var side = document.createElement('div');
  side.className = 'cb-side';
  side.innerHTML =
    '<button type="button" class="cb-tab is-on" data-go="chat" title="Chat" aria-label="Chat"><i class="fas fa-comment-dots"></i></button>' +
    '<button type="button" class="cb-tab" data-go="Plastic" title="Plastic" aria-label="Plastic"><i class="fas fa-recycle"></i></button>' +
    '<button type="button" class="cb-tab" data-go="Rubber" title="Rubber" aria-label="Rubber"><i class="fas fa-life-ring"></i></button>' +
    '<button type="button" class="cb-tab" data-go="Company" title="Company" aria-label="Company"><i class="fas fa-building"></i></button>' +
    '<button type="button" class="cb-tab" data-go="Contact" title="Contact" aria-label="Contact"><i class="fas fa-phone"></i></button>' +
    '<button type="button" class="cb-tab" data-go="Location" title="Location" aria-label="Location"><i class="fas fa-location-dot"></i></button>';

  // Strip + main column side by side, under the header
  var body = document.createElement('div');
  body.className = 'cb-body';
  body.appendChild(side);
  body.appendChild(main);
  widget.appendChild(body);

  // Clicking an icon = clicking the matching quick button
  side.addEventListener('click', function (e) {
    var tab = e.target.closest('.cb-tab');
    if (!tab) return;
    var tabs = side.querySelectorAll('.cb-tab');
    for (var i = 0; i < tabs.length; i++) tabs[i].classList.toggle('is-on', tabs[i] === tab);

    var go = tab.getAttribute('data-go');
    if (go === 'chat') {
      var input = document.getElementById('chat-input');
      if (input) input.focus();
      return;
    }
    var buttons = widget.querySelectorAll('.quick-btn');
    for (var k = 0; k < buttons.length; k++) {
      if (buttons[k].textContent.indexOf(go) > -1) { buttons[k].click(); break; }
    }
  });
})();
