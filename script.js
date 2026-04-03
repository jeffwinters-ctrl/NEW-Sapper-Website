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
        { who: 'sapper', name: 'Sarah (Sapper BDR)', text: 'Hi Mike, this is Sarah calling on behalf of Acme Industrial. I sent you a letter last week -- did you get a chance to look it over?' },
        { who: 'prospect', name: 'Mike (VP Operations)', text: 'Yeah actually, I did see that come across my desk. You guys do compressor solutions right?' },
        { who: 'sapper', name: 'Sarah (Sapper BDR)', text: 'Exactly. I know you have some projects coming up this quarter. Would it make sense to set up a 20-minute call with our engineering team to see if we can help?' },
        { who: 'prospect', name: 'Mike (VP Operations)', text: 'You know what, the timing is actually pretty good. We have a facility expansion in Q3. Let\'s do it.' },
        { who: 'sapper', name: 'Sarah (Sapper BDR)', text: 'Perfect. I have Thursday at 2pm CT open. I\'ll send the invite to you and your team right now.' },
        { who: 'booked', text: 'Meeting Booked: Thursday 2:00 PM CT -- Acme Industrial x Client Engineering Team' }
    ];

    var demoContainer = document.getElementById('conversation-demo');
    if (demoContainer) {
        var msgIndex = 0;
        var demoStarted = false;

        function addTypingIndicator(who) {
            var el = document.createElement('div');
            el.className = 'chat-msg';
            el.id = 'typing-indicator';
            el.innerHTML =
                '<div class="chat-avatar ' + who + '">' + (who === 'sapper' ? 'SC' : 'MK') + '</div>' +
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
                setTimeout(function () {
                    demoContainer.innerHTML = '';
                    msgIndex = 0;
                    addMessage();
                }, 4000);
                return;
            }
            var msg = conversationData[msgIndex];

            if (msg.who === 'booked') {
                removeTypingIndicator();
                var el = document.createElement('div');
                el.className = 'meeting-booked';
                el.innerHTML =
                    '<p style="font-size:11px;color:rgba(16,185,129,0.7);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">&#10003; Meeting Confirmed</p>' +
                    '<p style="font-size:13px;color:#10b981;font-weight:600">' + msg.text + '</p>';
                demoContainer.appendChild(el);
                demoContainer.scrollTop = demoContainer.scrollHeight;
                msgIndex++;
                setTimeout(addMessage, 5000);
                return;
            }

            addTypingIndicator(msg.who);
            var delay = 1200 + Math.random() * 800;
            setTimeout(function () {
                removeTypingIndicator();
                var el = document.createElement('div');
                el.className = 'chat-msg';
                el.innerHTML =
                    '<div class="chat-avatar ' + msg.who + '">' + (msg.who === 'sapper' ? 'SC' : 'MK') + '</div>' +
                    '<div class="chat-bubble">' +
                    '<div class="chat-name ' + msg.who + '-name">' + msg.name + '</div>' +
                    '<p>' + msg.text + '</p></div>';
                demoContainer.appendChild(el);
                demoContainer.scrollTop = demoContainer.scrollHeight;
                msgIndex++;
                setTimeout(addMessage, 1500 + Math.random() * 1000);
            }, delay);
        }

        var demoObserver = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting && !demoStarted) {
                demoStarted = true;
                setTimeout(addMessage, 800);
            }
        }, { threshold: 0.3 });
        demoObserver.observe(demoContainer);
    }

});
