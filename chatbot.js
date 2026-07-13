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
          <span>♻️ AI Assistant</span>
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
    if (text.includes("time") || text.includes("date") || text.includes("clock") || text.includes("today") || text.includes("now") || text.includes("current")) {
      const dubTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Dubai", dateStyle: "medium", timeStyle: "short" });
      const locTime = new Date().toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
      return {
        message: `🕒 <b>Real-Time Date & Time</b>:<br>• <b>Your Local Time</b>: ${locTime}<br>• <b>Dubai Headquarters Time</b>: ${dubTime} (GST, UTC+4)<br><br>Our trading desk is active during Dubai business hours (9:00 AM - 6:00 PM, Mon-Fri).`
      };
    }

    // DETAILED PLASTIC COMMODITIES
    if (text.includes("pet") || text.includes("hdpe") || text.includes("pp") || text.includes("ldpe") || text.includes("lldpe") || text.includes("polymers") || text.includes("grades")) {
      return {
        message: "🧴 <b>Recyclable Plastics Handled</b>:<br>• <b>PET</b>: Transparent, light blue, and green flakes, sheets, and preform scrap.<br>• <b>HDPE</b>: Blow moulding grade (bottles, containers) and injection grade (crates, pallets).<br>• <b>PP</b>: Copolymer, homopolymer, raffia, and battery cases.<br>• <b>LDPE / LLDPE</b>: Natural/coloured film rolls, commercial packing film bales, and agricultural film scrap."
      };
    }

    // DETAILED RUBBER COMMODITIES
    if (text.includes("crumb") || text.includes("granule") || text.includes("otr") || text.includes("shredded") || text.includes("baled") || text.includes("devulcanised") || text.includes("buffing")) {
      return {
        message: "🛞 <b>Recyclable Rubber & Tyres Handled</b>:<br>• <b>Baled & Shredded Tyres</b>: Automobile, commercial vehicle, and tractor tyres in high-density bales or shredded sizes.<br>• <b>Truck Tyres (3-Cut)</b>: Sectioned truck tyres cut into three parts to maximize shipping payload volume.<br>• <b>Rubber Crumbs & Granules</b>: High-quality, steel-free granules for athletic tracks, safety flooring, and asphalt modifiers.<br>• <b>OTR & Aviation Tyres</b>: Heavy-duty off-the-road and airplane tyres for reclaiming.<br>• <b>Devulcanised Rubber & Buffing Powder</b>: Premium devulcanised rubber compounds and fine buffing dust ready for compounding and sealing."
      };
    }

    // QUESTIONS
    if (text.includes("hi") || text.includes("hello") || text.includes("hey") || text.includes("greetings")) {
      return {
        message: "👋 Hello! Welcome to Gateway Resources FZCO. How can I assist you with recyclable materials or trading today?"
      };
    }

    if (text.includes("plastic")) {
      return {
        message: "🧴 <b>Plastic Segment</b>:<br>We source, trade, and handle logistics for recyclable plastics globally, including PET bottles, HDPE containers, LDPE film, PP bags, PVC scrap, and technical engineering plastics (ABS).<br><br><a href='plastic-segment.html'>Explore Plastic Segment →</a>"
      };
    }

    if (text.includes("rubber") || text.includes("tyre") || text.includes("tire")) {
      return {
        message: "🛞 <b>Rubber Segment</b>:<br>We procurement and supply end-of-life vehicle tyres (automobile, truck, OTR, aviation), rubber crumbs, granules, and devulcanised rubber compounds to responsible recyclers.<br><br><a href='rubber-segment.html'>Explore Rubber Segment →</a>"
      };
    }

    if (text.includes("sustainability") || text.includes("recycle") || text.includes("green") || text.includes("circular") || text.includes("eco")) {
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

    if (text.includes("location") || text.includes("address") || text.includes("where") || text.includes("dubai") || text.includes("office") || text.includes("headquarter")) {
      return {
        message: "📍 <b>Dubai Headquarters</b>:<br>Office 2707, Jumeirah Bay Tower X3, Jumeirah Lake Towers (JLT), PO Box 12502, Dubai, United Arab Emirates.<br><br><a href='https://maps.google.com/?q=Jumeirah+Bay+Tower+X3+Dubai' target='_blank'>Google Maps Location →</a>"
      };
    }

    if (text.includes("experience") || text.includes("years") || text.includes("old") || text.includes("history")) {
      return {
        message: "📈 <b>Our Track Record</b>:<br>With over 10+ years of logistics and commodity trade experience, we have successfully shipped 120,000+ tons of recyclable products to manufacturing plants across more than 40 countries."
      };
    }

    if (text.includes("compliance") || text.includes("audit") || text.includes("report") || text.includes("standards")) {
      return {
        message: "🛡️ <b>High Compliance Standards</b>:<br>We strictly work with organizations adhering to international environmental policies. All our trade partners, vendors, and clients undergo periodic audits and complete due diligence reports."
      };
    }
for (const item of faq) {
  if (item.keywords.some(keyword => text.includes(keyword))) {
    return {
      message: item.answer
    };
  }
}
    return {
      message: "🤖 I'm here to help! You can ask me about our <b>Company</b>, <b>Plastic</b> or <b>Rubber</b> products, <b>Services</b>, <b>Dubai Location</b>, or how to <b>Contact</b> our trading desk."
    };
  }


});