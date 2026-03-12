/**
 * Ecolkem FAQ Chatbot Widget
 * Static keyword-matching chatbot with bilingual support (EN/ES)
 * Always steers toward contacting sales
 */
(function () {
  'use strict';

  // Detect language from URL path
  const isSpanish = window.location.pathname.includes('/es/');

  const t = {
    title: isSpanish ? 'Asistente Ecolkem' : 'Ecolkem Assistant',
    placeholder: isSpanish ? 'Escribe tu pregunta...' : 'Type your question...',
    greeting: isSpanish
      ? '¡Hola! 👋 Soy el asistente virtual de Ecolkem. Puedo ayudarte con información sobre nuestros productos, contacto y más. ¿En qué puedo ayudarte?'
      : 'Hello! 👋 I\'m Ecolkem\'s virtual assistant. I can help you with information about our products, contact details, and more. How can I help you?',
    fallback: isSpanish
      ? 'No estoy seguro de cómo responder a eso. Te recomiendo contactar a nuestro equipo de ventas para una respuesta personalizada.'
      : 'I\'m not sure how to answer that. I recommend contacting our sales team for a personalized response.',
    contactCTA: isSpanish
      ? '📞 <a href="' + (window.location.pathname.includes('/productos/') ? '../contacto.html' : 'contacto.html') + '" class="ecbot-link">Contactar Ventas</a> | 📧 <a href="mailto:info@ecolkem.com" class="ecbot-link">info@ecolkem.com</a> | ☎️ <a href="tel:+528183108434" class="ecbot-link">(81) 8310 8434</a>'
      : '📞 <a href="' + (window.location.pathname.includes('/products/') ? '../contact.html' : 'contact.html') + '" class="ecbot-link">Contact Sales</a> | 📧 <a href="mailto:info@ecolkem.com" class="ecbot-link">info@ecolkem.com</a> | ☎️ <a href="tel:18663265536" class="ecbot-link">1-866-ECOLKEM</a>',
    quickBtns: isSpanish
      ? ['Productos', 'Contacto', 'Cotización', 'Horario']
      : ['Products', 'Contact', 'Quote', 'Hours'],
    powered: isSpanish ? 'Asistente automático' : 'Automated assistant',
  };

  // FAQ knowledge base
  const faqs = isSpanish ? [
    {
      keywords: ['producto', 'productos', 'ofrecen', 'venden', 'catálogo', 'catalogo', 'línea', 'linea'],
      answer: 'Ofrecemos 6 líneas de productos:<br>• <b>Desengrasantes Industriales</b> — limpiadores alcalinos, ácidos y neutros<br>• <b>Fosfatos de Hierro y Zinc</b> — pretratamientos anticorrosivos<br>• <b>Desoxidantes e Inhibidores</b> — remoción y prevención de óxido<br>• <b>Artes Gráficas</b> — limpiadores para flexografía y offset<br>• <b>Limpieza Industrial</b> — desengrasantes y solventes dieléctricos<br>• <b>Desarrollo a Medida</b> — formulaciones personalizadas<br><br>¿Te interesa alguna línea en particular? Nuestro equipo de ventas puede asesorarte.',
    },
    {
      keywords: ['desengrasante', 'desengrasantes', 'limpiador', 'detergente', 'met-'],
      answer: 'Nuestros desengrasantes industriales incluyen formulaciones alcalinas, ácidas y neutras, tanto líquidas como sólidas. Son ideales para metales ferrosos y no ferrosos, con opciones libres de fosfatos y silicatos.<br><br>Productos destacados: MET-104, MET-202, MET-203, MET-204, MET-401, MET-601.',
    },
    {
      keywords: ['fosfato', 'fosfatos', 'ecophos', 'ecoseal', 'pretratamiento', 'recubrimiento'],
      answer: 'Ofrecemos fosfatos de hierro y zinc para mejorar la protección anticorrosiva y adherencia de recubrimientos. El proceso incluye 5 pasos: desengrase, enjuague, fosfatado, enjuague y sellado.<br><br>Productos: ECOPHOS-706 al 717, ECOSEAL-810.',
    },
    {
      keywords: ['desoxidante', 'óxido', 'oxido', 'inhibidor', 'corrosión', 'corrosion', 'deox'],
      answer: 'Tenemos desoxidantes para acero al carbón, acero inoxidable, aluminio, cobre y aleaciones. También ofrecemos inhibidores de corrosión para protección temporal y en proceso.<br><br>Productos: DEOX-500, DEOX-501, DEOX-503C, DEOX-505, DEOX-506, PRO-1501, PRO-1502.',
    },
    {
      keywords: ['gráfica', 'grafica', 'artes', 'flexo', 'offset', 'anilox', 'tinta', 'cleanilox', 'impresión', 'impresion'],
      answer: 'Para artes gráficas ofrecemos:<br>• <b>CLEANILOX</b> — limpiador de rodillos anilox<br>• <b>FLEXOMATE</b> — limpiador de fotopolímeros<br>• <b>ECOSOLVE-E7</b> — limpiador de rodillos offset<br>• <b>PLAX-400</b> — limpiador de placas offset<br>• <b>ECOCREAM-INK</b> — crema limpiadora de tintas',
    },
    {
      keywords: ['limpieza', 'mantenimiento', 'mro', 'manos', 'dieléctrico', 'dielectrico', 'ecosolve'],
      answer: 'Nuestra línea de limpieza industrial incluye:<br>• <b>RED Degreaser</b> — desengrasante industrial multiusos<br>• <b>TOP Degreaser</b> — limpiador de manos para mecánicos<br>• <b>ECOSOLVE-E5</b> — solvente dieléctrico (25,000V, no inflamable)',
    },
    {
      keywords: ['desarrollo', 'medida', 'personalizado', 'custom', 'formulación', 'formulacion'],
      answer: 'Ofrecemos desarrollo de productos a medida con un proceso de 6 pasos: definición del problema, investigación, formulación, pruebas de laboratorio, escalamiento y entrega de resultados.<br><br>Tenemos 3 alcances: Reporte Técnico, Formulación y Pruebas, o Manufactura Completa.',
    },
    {
      keywords: ['contacto', 'teléfono', 'telefono', 'llamar', 'email', 'correo', 'dirección', 'direccion', 'ubicación', 'ubicacion', 'whatsapp'],
      answer: '📍 <b>Dirección:</b> Frutillas 316, Col. Mirasol I, Monterrey, NL 64102, México<br>📞 <b>Teléfono:</b> (81) 8310 8434 | 1-866-ECOLKEM (EUA)<br>📧 <b>Email:</b> info@ecolkem.com<br><br><b>Equipo de Ventas:</b><br>• Ing. Fernando González — (81) 8309 6950<br>• Ing. Julián Sánchez — (81) 2040 7554',
    },
    {
      keywords: ['horario', 'hora', 'abierto', 'cerrado', 'atención', 'atencion'],
      answer: '🕗 Nuestro horario de atención es <b>Lunes a Viernes, 8:00 AM a 6:00 PM (hora centro)</b>.<br><br>Fuera de horario, puedes enviarnos un correo a info@ecolkem.com y te responderemos al siguiente día hábil.',
    },
    {
      keywords: ['cotización', 'cotizacion', 'precio', 'costo', 'comprar', 'presupuesto', 'pedir'],
      answer: 'Para solicitar una cotización, puedes:<br>• Llenar el formulario en nuestra <a href="contacto.html" class="ecbot-link">página de contacto</a><br>• Enviar un correo a <a href="mailto:info@ecolkem.com" class="ecbot-link">info@ecolkem.com</a><br>• Llamar al (81) 8310 8434<br>• Contactar por WhatsApp a nuestros asesores<br><br>Nuestro equipo te responderá a la brevedad con precios y disponibilidad.',
    },
    {
      keywords: ['envío', 'envio', 'entrega', 'cobertura', 'dónde', 'donde', 'país', 'pais'],
      answer: 'Ecolkem tiene presencia en <b>México y Estados Unidos</b>. Contamos con línea gratuita en EUA: 1-866-ECOLKEM.<br><br>Para más detalles sobre envíos y cobertura, contacta a nuestro equipo de ventas.',
    },
    {
      keywords: ['calidad', 'certificación', 'certificacion', 'iso', 'norma'],
      answer: 'Ecolkem cuenta con políticas de calidad rigurosas para garantizar la consistencia y eficacia de todos nuestros productos. Puedes conocer más en nuestra <a href="politica-de-calidad.html" class="ecbot-link">Política de Calidad</a>.',
    },
    {
      keywords: ['trabaj', 'empleo', 'vacante', 'carrera'],
      answer: 'Puedes consultar oportunidades laborales en nuestra sección de <a href="carreras.html" class="ecbot-link">Carreras</a>. ¡Nos encantaría conocerte!',
    },
    {
      keywords: ['proveedor', 'proveedores', 'alianza', 'distribuidor'],
      answer: 'Si estás interesado en ser proveedor o distribuidor de Ecolkem, visita nuestra sección de <a href="proveedores.html" class="ecbot-link">Proveedores</a> o contáctanos directamente.',
    },
    {
      keywords: ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'hey', 'qué tal', 'saludos'],
      answer: '¡Hola! 👋 Bienvenido a Ecolkem. ¿En qué puedo ayudarte hoy? Puedo darte información sobre nuestros productos, contacto, cotizaciones y más.',
    },
    {
      keywords: ['gracias', 'thanks', 'adiós', 'adios', 'bye', 'chao'],
      answer: '¡Gracias por tu interés en Ecolkem! Si necesitas algo más, no dudes en preguntar o contactar a nuestro equipo de ventas. ¡Que tengas un excelente día! 😊',
    },
  ] : [
    {
      keywords: ['product', 'products', 'offer', 'sell', 'catalog', 'line', 'range'],
      answer: 'We offer 6 product lines:<br>• <b>Industrial Degreasers</b> — alkaline, acid & neutral cleaners<br>• <b>Iron & Zinc Phosphates</b> — corrosion-resistant pretreatments<br>• <b>Deoxidizers & Inhibitors</b> — rust removal & prevention<br>• <b>Graphic Arts</b> — flexography & offset cleaners<br>• <b>Industrial Cleaning & MRO</b> — degreasers & dielectric solvents<br>• <b>Custom Product Development</b> — tailored formulations<br><br>Interested in a specific line? Our sales team can help.',
    },
    {
      keywords: ['degrease', 'degreaser', 'cleaner', 'detergent', 'alkaline', 'met-'],
      answer: 'Our industrial degreasers include alkaline, acid, and neutral formulations — both liquid and solid. They work on ferrous and non-ferrous metals, with phosphate-free and silicate-free options.<br><br>Key products: MET-104, MET-202, MET-203, MET-204, MET-401, MET-601.',
    },
    {
      keywords: ['phosphate', 'ecophos', 'ecoseal', 'pretreatment', 'coating', 'zinc'],
      answer: 'We offer iron and zinc phosphate pretreatments to improve corrosion protection and coating adhesion. The process has 5 steps: degrease, rinse, phosphate, rinse, and seal.<br><br>Products: ECOPHOS-706 through 717, ECOSEAL-810.',
    },
    {
      keywords: ['deoxidize', 'rust', 'inhibitor', 'corrosion', 'deox', 'oxide'],
      answer: 'We have deoxidizers for carbon steel, stainless steel, aluminum, copper, and alloys. We also offer corrosion inhibitors for temporary and in-process protection.<br><br>Products: DEOX-500, DEOX-501, DEOX-503C, DEOX-505, DEOX-506, PRO-1501, PRO-1502.',
    },
    {
      keywords: ['graphic', 'art', 'flexo', 'offset', 'anilox', 'ink', 'cleanilox', 'print'],
      answer: 'Our graphic arts line includes:<br>• <b>CLEANILOX</b> — anilox roller cleaner<br>• <b>FLEXOMATE</b> — photopolymer plate cleaner<br>• <b>ECOSOLVE-E7</b> — offset roller cleaner<br>• <b>PLAX-400</b> — offset plate cleaner<br>• <b>ECOCREAM-INK</b> — ink cleaning cream',
    },
    {
      keywords: ['cleaning', 'maintenance', 'mro', 'hand', 'dielectric', 'ecosolve'],
      answer: 'Our industrial cleaning line includes:<br>• <b>RED Degreaser</b> — multi-purpose industrial degreaser<br>• <b>TOP Degreaser</b> — mechanic\'s hand cleaner<br>• <b>ECOSOLVE-E5</b> — dielectric solvent (25,000V rating, non-flammable)',
    },
    {
      keywords: ['develop', 'custom', 'tailor', 'formul', 'bespoke'],
      answer: 'We offer custom product development with a 6-step process: problem definition, research, formulation, lab testing, scale-up, and delivery.<br><br>Three scope options: Technical Report, Formulation & Testing, or Full Manufacturing.',
    },
    {
      keywords: ['contact', 'phone', 'call', 'email', 'address', 'location', 'where', 'whatsapp', 'reach'],
      answer: '📍 <b>Address:</b> Frutillas 316, Col. Mirasol I, Monterrey, NL 64102, Mexico<br>📞 <b>Phone:</b> (81) 8310 8434 | 1-866-ECOLKEM (US toll-free)<br>📧 <b>Email:</b> info@ecolkem.com<br><br><b>Sales Team:</b><br>• Ing. Fernando González — (81) 8309 6950<br>• Ing. Julián Sánchez — (81) 2040 7554',
    },
    {
      keywords: ['hour', 'hours', 'open', 'close', 'schedule', 'time', 'available'],
      answer: '🕗 We\'re open <b>Monday through Friday, 8:00 AM to 6:00 PM (CST)</b>.<br><br>Outside business hours, email us at info@ecolkem.com and we\'ll respond the next business day.',
    },
    {
      keywords: ['quote', 'price', 'cost', 'buy', 'purchase', 'order', 'pricing'],
      answer: 'To request a quote you can:<br>• Fill out the form on our <a href="contact.html" class="ecbot-link">contact page</a><br>• Email <a href="mailto:info@ecolkem.com" class="ecbot-link">info@ecolkem.com</a><br>• Call 1-866-ECOLKEM (toll-free US)<br>• Reach our sales reps via WhatsApp<br><br>Our team will get back to you promptly with pricing and availability.',
    },
    {
      keywords: ['ship', 'deliver', 'coverage', 'countr', 'international', 'where do you'],
      answer: 'Ecolkem operates in <b>Mexico and the United States</b>. US toll-free line: 1-866-ECOLKEM (1-866-326-5536).<br><br>For specific shipping and coverage details, please contact our sales team.',
    },
    {
      keywords: ['quality', 'certif', 'iso', 'standard', 'policy'],
      answer: 'Ecolkem maintains rigorous quality policies to ensure product consistency and effectiveness. Learn more on our <a href="quality-policy.html" class="ecbot-link">Quality Policy</a> page.',
    },
    {
      keywords: ['job', 'career', 'hiring', 'work', 'position', 'vacanc'],
      answer: 'Check out opportunities on our <a href="careers.html" class="ecbot-link">Careers</a> page. We\'d love to hear from you!',
    },
    {
      keywords: ['supplier', 'vendor', 'partner', 'distribut'],
      answer: 'Interested in becoming a supplier or distributor? Visit our <a href="suppliers.html" class="ecbot-link">Suppliers</a> page or contact us directly.',
    },
    {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'],
      answer: 'Hello! 👋 Welcome to Ecolkem. How can I help you today? I can provide information about our products, contact details, quotes, and more.',
    },
    {
      keywords: ['thank', 'thanks', 'bye', 'goodbye', 'see you'],
      answer: 'Thank you for your interest in Ecolkem! If you need anything else, don\'t hesitate to ask or reach out to our sales team. Have a great day! 😊',
    },
  ];

  // Fix relative links for product subpages
  function fixLinks(html) {
    var inProducts = window.location.pathname.includes('/products/') || window.location.pathname.includes('/productos/');
    if (inProducts) {
      html = html.replace(/href="((?!http|mailto|tel|#|\.\.)[^"]+\.html)"/g, 'href="../$1"');
    }
    if (isSpanish && !inProducts) {
      // Links from /es/ pages should stay relative
    }
    return html;
  }

  function findAnswer(input) {
    var q = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    var bestMatch = null;
    var bestScore = 0;

    for (var i = 0; i < faqs.length; i++) {
      var score = 0;
      for (var j = 0; j < faqs[i].keywords.length; j++) {
        var kw = faqs[i].keywords[j].normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (q.indexOf(kw) !== -1) {
          score += kw.length; // longer keyword matches score higher
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = faqs[i];
      }
    }

    var answer = bestMatch ? bestMatch.answer : t.fallback;
    return fixLinks(answer) + '<div class="ecbot-cta">' + t.contactCTA + '</div>';
  }

  // Build UI
  function createWidget() {
    // Styles
    var style = document.createElement('style');
    style.textContent = `
      .ecbot-btn {
        position: fixed; bottom: 24px; right: 24px; z-index: 9999;
        width: 60px; height: 60px; border-radius: 50%;
        background: #e8713a; border: none; cursor: pointer;
        box-shadow: 0 4px 16px rgba(0,0,0,0.25);
        display: flex; align-items: center; justify-content: center;
        transition: transform 0.2s, background 0.2s;
      }
      .ecbot-btn:hover { transform: scale(1.08); background: #d4622e; }
      .ecbot-btn svg { width: 28px; height: 28px; fill: white; }

      .ecbot-window {
        position: fixed; bottom: 96px; right: 24px; z-index: 9999;
        width: 380px; max-width: calc(100vw - 32px);
        max-height: min(520px, calc(100vh - 120px));
        background: white; border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        display: none; flex-direction: column;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        overflow: hidden;
      }
      .ecbot-window.open { display: flex; }

      .ecbot-header {
        background: #1a2f4a; color: white; padding: 16px 20px;
        display: flex; align-items: center; justify-content: space-between;
        border-radius: 16px 16px 0 0;
      }
      .ecbot-header-title { font-weight: 600; font-size: 15px; display: flex; align-items: center; gap: 8px; }
      .ecbot-header-dot { width: 8px; height: 8px; border-radius: 50%; background: #4ade80; }
      .ecbot-close { background: none; border: none; color: white; cursor: pointer; font-size: 20px; padding: 0 4px; opacity: 0.7; }
      .ecbot-close:hover { opacity: 1; }

      .ecbot-messages {
        flex: 1; overflow-y: auto; padding: 16px;
        display: flex; flex-direction: column; gap: 12px;
        min-height: 200px; max-height: 340px;
      }
      .ecbot-msg {
        max-width: 88%; padding: 10px 14px; border-radius: 12px;
        font-size: 13.5px; line-height: 1.5; word-wrap: break-word;
      }
      .ecbot-msg.bot {
        background: #f1f5f9; color: #1e293b; align-self: flex-start;
        border-bottom-left-radius: 4px;
      }
      .ecbot-msg.user {
        background: #1a2f4a; color: white; align-self: flex-end;
        border-bottom-right-radius: 4px;
      }
      .ecbot-msg a.ecbot-link { color: #2563eb; text-decoration: underline; }
      .ecbot-msg.bot a.ecbot-link { color: #2563eb; }
      .ecbot-msg.user a.ecbot-link { color: #93c5fd; }

      .ecbot-cta {
        margin-top: 10px; padding-top: 10px;
        border-top: 1px solid #e2e8f0;
        font-size: 12.5px;
      }
      .ecbot-cta a { color: #2563eb; text-decoration: underline; }

      .ecbot-quick {
        padding: 8px 16px 4px; display: flex; gap: 6px; flex-wrap: wrap;
      }
      .ecbot-quick button {
        background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe;
        border-radius: 20px; padding: 5px 14px; font-size: 12.5px;
        cursor: pointer; transition: background 0.15s;
      }
      .ecbot-quick button:hover { background: #dbeafe; }

      .ecbot-input-wrap {
        display: flex; padding: 12px; border-top: 1px solid #e5e7eb; gap: 8px;
      }
      .ecbot-input {
        flex: 1; border: 1px solid #d1d5db; border-radius: 24px;
        padding: 8px 16px; font-size: 13.5px; outline: none;
        transition: border-color 0.15s;
      }
      .ecbot-input:focus { border-color: #3b82f6; }
      .ecbot-send {
        background: #e8713a; border: none; border-radius: 50%;
        width: 36px; height: 36px; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: background 0.15s;
      }
      .ecbot-send:hover { background: #d4622e; }
      .ecbot-send svg { width: 18px; height: 18px; fill: white; }

      .ecbot-footer {
        text-align: center; padding: 6px; font-size: 11px; color: #94a3b8;
      }

      @media (max-width: 480px) {
        .ecbot-window { right: 8px; bottom: 88px; width: calc(100vw - 16px); max-height: calc(100vh - 100px); }
        .ecbot-btn { bottom: 16px; right: 16px; width: 52px; height: 52px; }
      }
    `;
    document.head.appendChild(style);

    // Chat button
    var btn = document.createElement('button');
    btn.className = 'ecbot-btn';
    btn.setAttribute('aria-label', isSpanish ? 'Abrir chat' : 'Open chat');
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>';
    document.body.appendChild(btn);

    // Chat window
    var win = document.createElement('div');
    win.className = 'ecbot-window';
    win.innerHTML = `
      <div class="ecbot-header">
        <span class="ecbot-header-title"><span class="ecbot-header-dot"></span>${t.title}</span>
        <button class="ecbot-close" aria-label="Close">&times;</button>
      </div>
      <div class="ecbot-messages" id="ecbot-messages"></div>
      <div class="ecbot-quick" id="ecbot-quick"></div>
      <div class="ecbot-input-wrap">
        <input class="ecbot-input" type="text" placeholder="${t.placeholder}" id="ecbot-input" autocomplete="off">
        <button class="ecbot-send" aria-label="Send"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
      </div>
      <div class="ecbot-footer">${t.powered}</div>
    `;
    document.body.appendChild(win);

    var messages = win.querySelector('#ecbot-messages');
    var input = win.querySelector('#ecbot-input');
    var quickWrap = win.querySelector('#ecbot-quick');
    var closeBtn = win.querySelector('.ecbot-close');
    var sendBtn = win.querySelector('.ecbot-send');

    function addMessage(text, isUser) {
      var msg = document.createElement('div');
      msg.className = 'ecbot-msg ' + (isUser ? 'user' : 'bot');
      if (isUser) {
        msg.textContent = text;
      } else {
        msg.innerHTML = text;
      }
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
    }

    function handleSend() {
      var val = input.value.trim();
      if (!val) return;
      addMessage(val, true);
      input.value = '';
      // Quick reply buttons disappear after first message
      quickWrap.style.display = 'none';
      // Short delay for natural feel
      setTimeout(function () {
        addMessage(findAnswer(val), false);
      }, 400);
    }

    // Toggle
    btn.addEventListener('click', function () {
      var isOpen = win.classList.toggle('open');
      if (isOpen && messages.children.length === 0) {
        addMessage(t.greeting, false);
        // Add quick buttons
        t.quickBtns.forEach(function (label) {
          var qb = document.createElement('button');
          qb.textContent = label;
          qb.addEventListener('click', function () {
            input.value = label;
            handleSend();
          });
          quickWrap.appendChild(qb);
        });
      }
      if (isOpen) input.focus();
    });

    closeBtn.addEventListener('click', function () {
      win.classList.remove('open');
    });

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handleSend();
    });
  }

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
