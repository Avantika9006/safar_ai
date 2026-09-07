/* =========================
   MOBILE MENU
========================= */

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {

    mobileMenu.classList.toggle("active");

    const icon = menuBtn.querySelector("i");

    if (mobileMenu.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
    } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }

});
const chatButton =
    document.getElementById("aiChatButton");

const chatBox =
    document.getElementById("aiChatbox");

const closeChat =
    document.getElementById("closeChat");

const sendMessage =
    document.getElementById("sendMessage");

const chatInput =
    document.getElementById("chatInput");

const chatMessages =
    document.getElementById("chatMessages");

 /* =========================
   AI CHATBOX
========================= */


/* OPEN CHAT */

chatButton.addEventListener("click", () => {
    chatBox.classList.add("active");
    chatInput.focus();
});


/* CLOSE CHAT */

closeChat.addEventListener("click", () => {
    chatBox.classList.remove("active");
});


/* SEND MESSAGE */

sendMessage.addEventListener("click", sendChat);

chatInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        sendChat();
    }

});


async function sendChat() {

    const message =
        chatInput.value.trim();

    if (!message) return;


    /* USER MESSAGE */

    addMessage(message, "user");

    chatInput.value = "";


    /* TYPING */

    const typing =
        addMessage("SafarAI is thinking...", "bot");


    try {

        const response = await fetch(
    "/api/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message
                })
            }
        );


        const data =
            await response.json();


        typing.remove();


        addMessage(
            data.reply,
            "bot"
        );


    } catch (error) {

        typing.remove();

        addMessage(
            "Sorry, I couldn't connect right now. Please try again.",
            "bot"
        );

    }

}


/* ADD MESSAGE */

function addMessage(text, type) {
    const message = document.createElement("div");

    message.className =
        type === "user"
            ? "user-message"
            : "bot-message";

    if (type === "bot") {
        message.innerHTML = formatAIResponse(text);
    } else {
        message.textContent = text;
    }

    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return message;
}

function formatAIResponse(text) {
    // Escape HTML for safety
    const div = document.createElement("div");
    div.textContent = text;

    let html = div.innerHTML;

    // Headings
    html = html.replace(/^### (.*)$/gm, "<h4>$1</h4>");
    html = html.replace(/^## (.*)$/gm, "<h3>$1</h3>");
    html = html.replace(/^# (.*)$/gm, "<h2>$1</h2>");

    // Bold text
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Horizontal lines
    html = html.replace(/^---$/gm, "<hr>");

    // Bullet points
    html = html.replace(/^\s*[\*\-] (.*)$/gm, "<li>$1</li>");

    // Convert consecutive list items into a list
    html = html.replace(
        /(<li>.*?<\/li>(?:<br>)?)+/gs,
        function(match) {
            return "<ul>" + match.replace(/<br>/g, "") + "</ul>";
        }
    );

    // Line breaks
    html = html.replace(/\n/g, "<br>");

    return html;
}

document.querySelectorAll(".mobile-menu a").forEach(link => {

    link.addEventListener("click", () => {

        mobileMenu.classList.remove("active");

        const icon = menuBtn.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});


/* =========================
   SCROLL TO PLANNER
========================= */

function scrollToPlanner() {

    document
        .getElementById("planner")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================
   COUNTER ANIMATION
========================= */

const counters = document.querySelectorAll(".stat strong");

let counterStarted = false;

function startCounters() {

    if (counterStarted) return;

    const statsSection = document.querySelector(".stats");

    const rect = statsSection.getBoundingClientRect();

    if (rect.top < window.innerHeight) {

        counterStarted = true;

        counters.forEach(counter => {

            const target = parseFloat(
                counter.getAttribute("data-target")
            );

            let current = 0;

            const increment = target / 80;

            function updateCounter() {

                current += increment;

                if (current >= target) {

                    if (target === 4.9) {
                        counter.textContent = "4.9★";
                    } else if (target === 12000) {
                        counter.textContent = "12K+";
                    } else if (target === 850) {
                        counter.textContent = "850+";
                    } else {
                        counter.textContent = Math.floor(target) + "+";
                    }

                    return;
                }

                if (target === 4.9) {
                    counter.textContent = current.toFixed(1);
                } else {
                    counter.textContent =
                        Math.floor(current).toLocaleString();
                }

                requestAnimationFrame(updateCounter);
            }

            updateCounter();

        });

    }

}

window.addEventListener("scroll", startCounters);

startCounters();


/* =========================
   EXPERIENCE HOVER
========================= */

const experienceItems =
    document.querySelectorAll(".experience-item");

experienceItems.forEach(item => {

    item.addEventListener("mouseenter", () => {

        experienceItems.forEach(other => {
            other.classList.remove("active");
        });

        item.classList.add("active");

    });

});


/* =========================
   TRAVEL FORM
========================= */

const travelForm =
    document.getElementById("travelForm");

const formMessage =
    document.getElementById("formMessage");

travelForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const destination =
        document.getElementById("destination").value;

    const style =
        document.getElementById("travelStyle").value;

    const duration =
        document.getElementById("duration").value;

    const travelers =
        document.getElementById("travelers").value;


    if (
        !destination ||
        !style ||
        !duration ||
        !travelers
    ) {

        formMessage.textContent =
            "Please fill in all the details.";

        return;
    }


    formMessage.innerHTML = `
        ✨ Your ${style.toLowerCase()} trip to
        <strong>${destination}</strong>
        is being prepared!
    `;

    travelForm.reset();

});


/* =========================
   TESTIMONIAL SLIDER
========================= */

const testimonials = [

    {
        text: `"The best part was not having to spend hours figuring everything out. The trip felt completely personal."`,
        name: "Ananya Sharma",
        trip: "Ladakh, India",
        letter: "A"
    },

    {
        text: `"Every destination felt intentional. We discovered places we would never have found ourselves."`,
        name: "Rohan Mehta",
        trip: "Bali, Indonesia",
        letter: "R"
    },

    {
        text: `"It was the perfect balance between having a plan and still feeling free to explore."`,
        name: "Priya Kapoor",
        trip: "Rajasthan, India",
        letter: "P"
    },

    {
        text: `"The whole experience made travel feel simple again. We just packed our bags and went."`,
        name: "Arjun Verma",
        trip: "Switzerland",
        letter: "A"
    }

];


let currentTestimonial = 0;

const testimonialText =
    document.getElementById("testimonialText");

const travelerName =
    document.getElementById("travelerName");

const travelerTrip =
    document.getElementById("travelerTrip");

const travelerAvatar =
    document.querySelector(".traveler-avatar");


function showTestimonial(index) {

    const testimonial =
        testimonials[index];

    testimonialText.style.opacity = 0;

    setTimeout(() => {

        testimonialText.textContent =
            testimonial.text;

        travelerName.textContent =
            testimonial.name;

        travelerTrip.textContent =
            testimonial.trip;

        travelerAvatar.textContent =
            testimonial.letter;

        testimonialText.style.opacity = 1;

    }, 200);

}


document
    .getElementById("nextStory")
    .addEventListener("click", () => {

        currentTestimonial++;

        if (
            currentTestimonial >=
            testimonials.length
        ) {
            currentTestimonial = 0;
        }

        showTestimonial(currentTestimonial);

    });


document
    .getElementById("prevStory")
    .addEventListener("click", () => {

        currentTestimonial--;

        if (currentTestimonial < 0) {
            currentTestimonial =
                testimonials.length - 1;
        }

        showTestimonial(currentTestimonial);

    });


/* =========================
   FAQ ACCORDION
========================= */

const faqItems =
    document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const question =
        item.querySelector(".faq-question");

    const answer =
        item.querySelector(".faq-answer");


    question.addEventListener("click", () => {

        const alreadyOpen =
            item.classList.contains("active");


        faqItems.forEach(otherItem => {

            otherItem.classList.remove("active");

            otherItem.querySelector(
                ".faq-answer"
            ).style.maxHeight = null;

        });


        if (!alreadyOpen) {

            item.classList.add("active");

            answer.style.maxHeight =
                answer.scrollHeight + "px";

        }

    });

});


/* =========================
   DESTINATION BUTTONS
========================= */

const destinationCards =
    document.querySelectorAll(".destination-card");

destinationCards.forEach(card => {

    card.addEventListener("click", () => {

        const destination =
            card.querySelector("h3").textContent;

        document.getElementById(
            "destination"
        ).value = destination;

        scrollToPlanner();

    });

});