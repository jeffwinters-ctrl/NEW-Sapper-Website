document.addEventListener('DOMContentLoaded', function () {

    // === NAVBAR SCROLL (hides announcement bar on scroll) ===
    var navbar = document.getElementById('navbar');
    var announcementBar = document.getElementById('announcement-bar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            if (announcementBar) announcementBar.style.display = 'none';
        } else {
            navbar.classList.remove('scrolled');
            if (announcementBar) announcementBar.style.display = '';
        }
    });

    // === MOBILE MENU ===
    var menuBtn = document.getElementById('mobile-menu-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    menuBtn.addEventListener('click', function () {
        mobileMenu.classList.toggle('hidden');
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            mobileMenu.classList.add('hidden');
        });
    });

    // === SCROLL REVEAL ===
    var revealElements = document.querySelectorAll('.scroll-reveal');
    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(function (el) {
        revealObserver.observe(el);
    });

    // === COUNTER ANIMATION ===
    var counters = document.querySelectorAll('.counter');
    var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var counter = entry.target;
                var target = parseInt(counter.getAttribute('data-target'));
                var duration = 2000;
                var startTime = null;

                function animate(currentTime) {
                    if (!startTime) startTime = currentTime;
                    var progress = Math.min((currentTime - startTime) / duration, 1);
                    var eased = 1 - Math.pow(1 - progress, 3);
                    counter.textContent = Math.floor(eased * target).toLocaleString();
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                }
                requestAnimationFrame(animate);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(function (c) {
        counterObserver.observe(c);
    });

    // === RESULT BARS ===
    var bars = document.querySelectorAll('.result-bar');
    var barObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    bars.forEach(function (bar) {
        barObserver.observe(bar);
    });

    // === FAQ ACCORDION ===
    var faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function (item) {
        var trigger = item.querySelector('.faq-trigger');
        trigger.addEventListener('click', function () {
            var isActive = item.classList.contains('active');
            faqItems.forEach(function (i) {
                i.classList.remove('active');
            });
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // === SMOOTH SCROLL FOR ANCHOR LINKS ===
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            var target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // === LIVE CONVERSATION DEMO ===
    var conversationData = [
        { who: 'sapper', name: 'Sarah (BDR, on behalf of client)', text: 'Hi Mike, this is Sarah calling from Meridian Energy Partners. I sent you a handwritten note last week about your facility expansion -- did that come across your desk?' },
        { who: 'prospect', name: 'Mike Reynolds, VP Operations', text: 'Yeah, I actually did see that. You guys do compression solutions, right? I was curious about the letter.' },
        { who: 'sapper', name: 'Sarah (BDR, on behalf of client)', text: 'Exactly. We noticed you have some capital projects in the pipeline this year. Would it make sense to get 20 minutes with our engineering team? They can walk through how we\'ve helped similar operations cut lead times by 30%.' },
        { who: 'prospect', name: 'Mike Reynolds, VP Operations', text: 'You know what, the timing is actually pretty good. We\'re evaluating vendors for a Q3 build-out. Let\'s set something up.' },
        { who: 'sapper', name: 'Sarah (BDR, on behalf of client)', text: 'Perfect. How does Thursday at 2:00 PM Central look? I\'ll send the invite to you and copy your procurement lead.' },
        { who: 'prospect', name: 'Mike Reynolds, VP Operations', text: 'Thursday works. Send it over.' },
        { who: 'booked', text: 'Thu Apr 10, 2:00 PM CT -- Meridian Energy Partners x Client Engineering' }
    ];

    var demoContainer = document.getElementById('conversation-demo');
    var callTimerEl = document.getElementById('call-timer');
    if (demoContainer) {
        var msgIndex = 0;
        var demoStarted = false;
        var callSeconds = 0;
        var callTimerInterval = null;

        function startCallTimer() {
            callSeconds = 0;
            if (callTimerInterval) clearInterval(callTimerInterval);
            callTimerInterval = setInterval(function () {
                callSeconds++;
                var m = Math.floor(callSeconds / 60);
                var s = callSeconds % 60;
                if (callTimerEl) callTimerEl.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
            }, 1000);
        }

        function stopCallTimer() {
            if (callTimerInterval) clearInterval(callTimerInterval);
        }

        function addTypingIndicator(who) {
            var el = document.createElement('div');
            el.className = 'chat-msg';
            el.id = 'typing-indicator';
            el.innerHTML =
                '<div class="chat-avatar ' + who + '">' + (who === 'sapper' ? 'SC' : 'MR') + '</div>' +
                '<div class="chat-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            demoContainer.appendChild(el);
            demoContainer.scrollTop = demoContainer.scrollHeight;
        }

        function removeTypingIndicator() {
            var t = document.getElementById('typing-indicator');
            if (t) t.remove();
        }

        function addMessage() {
            if (msgIndex >= conversationData.length) {
                stopCallTimer();
                setTimeout(function () {
                    demoContainer.innerHTML = '';
                    msgIndex = 0;
                    startCallTimer();
                    addMessage();
                }, 5000);
                return;
            }
            var msg = conversationData[msgIndex];

            if (msg.who === 'booked') {
                removeTypingIndicator();
                var el = document.createElement('div');
                el.className = 'meeting-booked';
                el.innerHTML =
                    '<p style="font-size:10px;color:rgba(16,185,129,0.6);font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px">&#10003; Qualified Meeting Booked</p>' +
                    '<p style="font-size:12px;color:#10b981;font-weight:600">' + msg.text + '</p>' +
                    '<p style="font-size:10px;color:rgba(16,185,129,0.4);margin-top:4px">Added to CRM &middot; Calendar invite sent</p>';
                demoContainer.appendChild(el);
                demoContainer.scrollTop = demoContainer.scrollHeight;
                msgIndex++;
                setTimeout(addMessage, 5000);
                return;
            }

            addTypingIndicator(msg.who);
            var delay = 1400 + Math.random() * 1200;
            setTimeout(function () {
                removeTypingIndicator();
                var el = document.createElement('div');
                el.className = 'chat-msg';
                el.innerHTML =
                    '<div class="chat-avatar ' + msg.who + '">' + (msg.who === 'sapper' ? 'SC' : 'MR') + '</div>' +
                    '<div class="chat-bubble">' +
                    '<div class="chat-name ' + msg.who + '-name">' + msg.name + '</div>' +
                    '<p>' + msg.text + '</p></div>';
                demoContainer.appendChild(el);
                demoContainer.scrollTop = demoContainer.scrollHeight;
                msgIndex++;
                setTimeout(addMessage, 1800 + Math.random() * 1200);
            }, delay);
        }

        var demoObserver = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting && !demoStarted) {
                demoStarted = true;
                startCallTimer();
                setTimeout(addMessage, 1000);
            }
        }, { threshold: 0.2 });
        demoObserver.observe(demoContainer);
    }

    // === ANIMATED PROCESS SECTION ===
    var processSteps = [
        {
            tab: 'Direct Mail',
            icon: '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
            stat: '+40% conversion lift',
            title: 'It Starts With a Handwritten Letter',
            subtitle: 'Our Differentiator -- Nobody Else Does This',
            desc: '"I sent you a handwritten letter last week -- did you get a chance to look it over?" That single line changed everything. Starting with direct mail means your prospect already knows your name before the phone rings. It increased conversion rates by 40% across our client base.',
            visual: '<div style="font-size:13px;color:rgba(255,255,255,0.5);border:1px dashed rgba(49,159,225,0.2);border-radius:12px;padding:20px;margin-top:12px"><div style="font-size:11px;color:#319fe1;font-weight:600;margin-bottom:8px">FROM THE DESK OF YOUR CLIENT</div><div style="color:rgba(255,255,255,0.7);line-height:1.6">Dear Mike,<br><br>I noticed Meridian has some exciting projects ahead this year. Our engineering team has helped similar operations reduce lead times by 30%...<br><br>I\'d love to connect for 20 minutes.<br><br><span style="font-style:italic;color:rgba(49,159,225,0.7)">-- Handwritten signature + QR code to landing page</span></div></div>'
        },
        {
            tab: 'Email',
            icon: '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/></svg>',
            stat: '125M+ proprietary records',
            title: 'AI-Powered Email That Actually Lands',
            subtitle: 'Enterprise-Grade Microsoft Infrastructure',
            desc: 'We purchase dedicated domains, warm them for 3 weeks, and run sequences on enterprise-grade Microsoft infrastructure -- not consumer Gmail. Every email is personalized using AI trained on 16 years of outreach data. You approve all content before it ships.',
            visual: '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px;margin-top:12px;font-size:12px"><div style="color:rgba(255,255,255,0.3);font-size:10px;margin-bottom:8px">SUBJECT: Quick question about your Q3 expansion</div><div style="color:rgba(255,255,255,0.6);line-height:1.6">Hi Mike,<br><br>I came across Meridian\'s growth plans and thought there might be a fit. We\'ve helped 3 companies in your space this quarter alone...<br><br><span style="color:#319fe1">Open rate: 42%</span> &middot; <span style="color:#10b981">Reply rate: 8.3%</span></div></div>'
        },
        {
            tab: 'LinkedIn',
            icon: '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>',
            stat: '~1 meeting per profile per month',
            title: 'LinkedIn: Our Fastest Growing Channel',
            subtitle: 'Connection Requests via Your Profile + Sales Navigator',
            desc: '"We use your LinkedIn profile. We set up Sales Navigator. It\'s a separate inbox that doesn\'t interfere with your current messages." Right now we\'re seeing nearly 1:1 -- one meeting per profile per month. LinkedIn is going up while email reply rates go down.',
            visual: '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px;margin-top:12px;font-size:12px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><div style="width:28px;height:28px;background:rgba(49,159,225,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#319fe1">YC</div><div><div style="font-size:11px;font-weight:600;color:rgba(255,255,255,0.8)">Your Client\'s Profile</div><div style="font-size:9px;color:rgba(255,255,255,0.4)">Connected with Mike Reynolds</div></div></div><div style="color:rgba(255,255,255,0.6);line-height:1.5">Hi Mike -- saw your post about the facility build-out. We just wrapped a similar project for [competitor]. Worth a quick chat?</div></div>'
        },
        {
            tab: 'Phone',
            icon: '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>',
            stat: '60-70% of all meetings',
            title: 'US-Based Callers. 150+ Dials a Day.',
            subtitle: 'This Is Where Most Meetings Come From',
            desc: '"Cold call contact rates have stayed steady at 6.5% for a decade. Calls still work -- and we make 150+ per day per rep from our St. Louis office." By this point, the prospect has seen the letter, the email, and the LinkedIn message. The call feels warm.',
            visual: '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px;margin-top:12px;font-size:12px"><div style="display:flex;justify-content:space-between;margin-bottom:12px"><span style="color:rgba(255,255,255,0.5)">Today\'s Activity</span><span style="color:#319fe1;font-weight:600">Sarah T. (BDR)</span></div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center"><div style="background:rgba(49,159,225,0.08);border-radius:6px;padding:8px"><div style="font-size:18px;font-weight:700;color:#319fe1">163</div><div style="font-size:9px;color:rgba(255,255,255,0.4)">Dials</div></div><div style="background:rgba(16,185,129,0.08);border-radius:6px;padding:8px"><div style="font-size:18px;font-weight:700;color:#10b981">11</div><div style="font-size:9px;color:rgba(255,255,255,0.4)">Conversations</div></div><div style="background:rgba(240,180,41,0.08);border-radius:6px;padding:8px"><div style="font-size:18px;font-weight:700;color:#f0b429">2</div><div style="font-size:9px;color:rgba(255,255,255,0.4)">Meetings Set</div></div></div></div>'
        }
    ];

    var processVisual = document.getElementById('process-visual');
    var processText = document.getElementById('process-text');
    var processProgress = document.getElementById('process-progress');
    var processTabs = document.querySelectorAll('.process-tab');
    if (processVisual && processText && processProgress) {
        var currentStep = 0;
        var processInterval = null;
        var STEP_DURATION = 5000;

        function renderStep(idx) {
            var s = processSteps[idx];
            processVisual.innerHTML = '<div class="process-visual-card"><div class="pv-icon">' + s.icon + '</div>' + s.visual + '</div>';
            processText.innerHTML = '<div class="process-text-panel"><div class="text-accent text-xs font-semibold uppercase tracking-wider mb-2">' + s.subtitle + '</div><h3 class="text-2xl md:text-3xl font-bold mb-4">' + s.title + '</h3><p class="text-gray-400 text-sm leading-relaxed mb-4">' + s.desc + '</p><div class="pv-stat" style="display:inline-block;background:rgba(49,159,225,0.08);border:1px solid rgba(49,159,225,0.15);border-radius:8px;padding:6px 12px"><span class="text-accent font-bold text-sm">' + s.stat + '</span></div></div>';
            processTabs.forEach(function (t, i) {
                t.classList.toggle('active', i === idx);
            });
            processProgress.style.transition = 'none';
            processProgress.style.width = '0%';
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    processProgress.style.transition = 'width ' + STEP_DURATION + 'ms linear';
                    processProgress.style.width = '100%';
                });
            });
        }

        function nextStep() {
            currentStep = (currentStep + 1) % processSteps.length;
            renderStep(currentStep);
        }

        function startProcess() {
            renderStep(0);
            processInterval = setInterval(nextStep, STEP_DURATION);
        }

        processTabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                clearInterval(processInterval);
                currentStep = parseInt(tab.getAttribute('data-step'));
                renderStep(currentStep);
                processInterval = setInterval(nextStep, STEP_DURATION);
            });
        });

        var processObserver = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                startProcess();
                processObserver.unobserve(entries[0].target);
            }
        }, { threshold: 0.2 });
        processObserver.observe(document.getElementById('process-anim'));
    }

});
