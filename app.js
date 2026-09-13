(() => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Mobile navigation
      const menuToggle = document.getElementById('menuToggle');
      const navLinks = document.getElementById('navLinks');
      menuToggle?.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(open));
      });
      navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle?.setAttribute('aria-expanded', 'false');
      }));

      // Production navigation: scroll the real page.
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (event) => {
          const hash = link.getAttribute('href');
          if (!hash || hash === '#') return;
          const target = document.querySelector(hash);
          if (!target) return;
          event.preventDefault();
          target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
          history.replaceState(null, '', hash);
        });
      });

      // Scroll reveal
      const reveals = document.querySelectorAll('.reveal');
      if (prefersReduced || !('IntersectionObserver' in window)) {
        reveals.forEach(el => el.classList.add('visible'));
      } else {
        const revealObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              revealObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12 });
        reveals.forEach(el => revealObserver.observe(el));
      }

      // Demo metric count-up
      const counters = document.querySelectorAll('[data-count]');
      if (!prefersReduced && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = Number(el.dataset.count || 0);
            const suffix = el.dataset.suffix || '';
            const start = performance.now();
            const duration = 850;
            const tick = (now) => {
              const p = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              el.textContent = Math.round(target * eased) + suffix;
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            counterObserver.unobserve(el);
          });
        }, { threshold: .7 });
        counters.forEach(el => counterObserver.observe(el));
      }

      // Interactive Business X-Ray
      const xrayData = {
        email: {
          title: 'EMAIL & INBOX FLOW',
          summary: 'Turn incoming messages into organized work instead of a pile of unread requests.',
          before: 'Everything lands together. Estimate requests, scheduling, support, and big jobs compete for attention in the same inbox.',
          after: 'Messages can be classified, tagged, routed, assigned, and followed up based on what the customer actually needs.',
          flow: 'Incoming Email → Identify Intent → Estimate / Job / Scheduling / Support → Correct Person → Follow-Up'
        },
        sales: {
          title: 'SALES PIPELINE',
          summary: 'Give good opportunities a clear owner, next step, and follow-up path.',
          before: 'Big jobs live in texts, notes, memory, and scattered inboxes. Nobody has one clean view of what is active or overdue.',
          after: 'Opportunities can enter a defined pipeline with ownership, notes, status, reminders, and clear next actions.',
          flow: 'New Opportunity → Qualify → Assign Sales → Estimate / Proposal → Follow-Up → Won / Lost'
        },
        phone: {
          title: 'PHONE & CALL FLOW',
          summary: 'Reduce interruptions while making sure important callers still reach the right person.',
          before: 'Every call hits the office the same way. Staff stop what they are doing, take messages, and manually relay details.',
          after: 'Routine calls can be screened, common questions answered, details captured, and priority calls routed appropriately.',
          flow: 'Incoming Call → Identify Need → Answer / Capture → Route / Schedule → Record → Follow-Up'
        },
        scheduling: {
          title: 'SCHEDULING',
          summary: 'Make appointments and job scheduling part of the business workflow instead of a separate chore.',
          before: 'Appointments move through phone calls, sticky notes, texts, and calendars with constant back-and-forth.',
          after: 'Scheduling can use structured information, availability rules, reminders, and automatic customer updates.',
          flow: 'Request → Check Availability → Schedule → Confirm → Remind → Update Team'
        },
        accounting: {
          title: 'ACCOUNTING HANDOFFS',
          summary: 'Reduce duplicate entry between operations, sales, and the accounting tools you already use.',
          before: 'Job information gets retyped into invoices, payment notes, or accounting software after the work is already done.',
          after: 'Where supported, approved job and customer data can move through defined handoffs to reduce duplicate entry.',
          flow: 'Completed Work → Verify Details → Invoice / Payment Step → Accounting Record → Status Update'
        },
        followup: {
          title: 'FOLLOW-UP ENGINE',
          summary: 'Stop depending on memory to keep a prospect, estimate, or customer moving.',
          before: 'Someone means to call back Friday. Friday gets busy. The customer quietly disappears.',
          after: 'Rules can create reminders, sequences, alerts, and escalation steps until the opportunity has a real outcome.',
          flow: 'Trigger → Reminder → Message / Call Task → Response Check → Next Step → Close Loop'
        },
        website: {
          title: 'WEBSITE & LEAD CAPTURE',
          summary: 'Turn your website into the front door of the operating system, not a digital brochure.',
          before: 'Forms send generic emails that someone has to read, interpret, and re-enter somewhere else.',
          after: 'Forms can collect better information up front and feed structured lead, service, or scheduling workflows.',
          flow: 'Visitor → Smart Form → Qualify Need → Create Lead / Request → Route → Follow-Up'
        },
        office: {
          title: 'OFFICE WORKFLOW',
          summary: 'Give the office team fewer manual handoffs and a clearer view of what needs attention.',
          before: 'The office manager becomes the routing system for the entire company — calls, emails, jobs, estimates, questions, and follow-ups.',
          after: 'Defined workflows and automation can sort routine work while keeping people in control of exceptions and decisions.',
          flow: 'Incoming Work → Classify → Prioritize → Assign → Track → Escalate Exceptions'
        }
      };

      const xrayButtons = document.querySelectorAll('[data-xray]');
      const xrayTitle = document.getElementById('xrayTitle');
      const xraySummary = document.getElementById('xraySummary');
      const xrayBefore = document.getElementById('xrayBefore');
      const xrayAfter = document.getElementById('xrayAfter');
      const xrayFlow = document.getElementById('xrayFlow');
      xrayButtons.forEach(btn => btn.addEventListener('click', () => {
        xrayButtons.forEach(other => {
          other.classList.toggle('active', other === btn);
          other.setAttribute('aria-selected', String(other === btn));
        });
        const item = xrayData[btn.dataset.xray];
        if (!item) return;
        xrayTitle.textContent = item.title;
        xraySummary.textContent = item.summary;
        xrayBefore.textContent = item.before;
        xrayAfter.textContent = item.after;
        xrayFlow.textContent = item.flow;
      }));

      // Pointer tilt (small, restrained)
      if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('[data-tilt]').forEach(card => {
          card.addEventListener('pointermove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - .5;
            const y = (event.clientY - rect.top) / rect.height - .5;
            card.style.transform = `perspective(900px) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 3).toFixed(2)}deg) translateY(-1px)`;
          });
          card.addEventListener('pointerleave', () => card.style.transform = '');
        });
      }

      // Cursor glow
      const glow = document.getElementById('cursorGlow');
      if (glow && !prefersReduced && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('pointermove', (e) => {
          glow.style.left = `${e.clientX}px`;
          glow.style.top = `${e.clientY}px`;
          glow.style.opacity = '1';
        });
        document.addEventListener('pointerleave', () => glow.style.opacity = '0');
      }

      // Lightweight hero particle / network animation
      const canvas = document.getElementById('heroCanvas');
      if (canvas && !prefersReduced) {
        const ctx = canvas.getContext('2d');
        const dots = [];
        let raf = 0;
        let width = 0;
        let height = 0;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);

        function resize() {
          const rect = canvas.getBoundingClientRect();
          width = rect.width;
          height = rect.height;
          canvas.width = Math.round(width * dpr);
          canvas.height = Math.round(height * dpr);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          dots.length = 0;
          const count = Math.min(64, Math.max(30, Math.round(width / 22)));
          for (let i = 0; i < count; i++) {
            dots.push({
              x: Math.random() * width,
              y: Math.random() * height,
              vx: (Math.random() - .5) * .18,
              vy: (Math.random() - .5) * .18,
              r: Math.random() * 1.35 + .45
            });
          }
        }

        function frame() {
          ctx.clearRect(0, 0, width, height);
          for (const p of dots) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(104, 196, 255, .48)';
            ctx.fill();
          }
          for (let i = 0; i < dots.length; i++) {
            for (let j = i + 1; j < dots.length; j++) {
              const a = dots[i], b = dots[j];
              const dx = a.x - b.x, dy = a.y - b.y;
              const dist = Math.hypot(dx, dy);
              if (dist < 105) {
                ctx.beginPath();
                ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = `rgba(79, 160, 255, ${0.13 * (1 - dist / 105)})`;
                ctx.lineWidth = .7;
                ctx.stroke();
              }
            }
          }
          raf = requestAnimationFrame(frame);
        }

        resize();
        frame();
        window.addEventListener('resize', () => {
          cancelAnimationFrame(raf);
          resize();
          frame();
        }, { passive: true });
      }
    })();
