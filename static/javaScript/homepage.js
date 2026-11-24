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


        const data = await response.json();

        typing.remove();

        if (!response.ok) {
            addMessage(data.error || "Something went wrong.", "bot");
            return;
        }

        addMessage(data.reply, "bot");


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
        function (match) {
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

travelForm.addEventListener("submit", function (event) {

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


// ===============================
// SAFAR AI - INTERACTIVE MAP
// ===============================

const BACKEND_URL = "https://safar-ai-88ab.onrender.com";
const mapButton = document.getElementById("mapButton");
const mapContainer = document.getElementById("mapContainer");
const closeMap = document.getElementById("closeMap");

const destinationInput =
    document.getElementById("destinationInput");

const searchDestination =
    document.getElementById("searchDestination");

const spotsList =
    document.getElementById("spots-list");

let map = null;
let mapInitialized = false;

let currentMarker = null;
let spotMarkers = [];
let routeLayer = null;


// ===============================
// OPEN MAP
// ===============================

mapButton.addEventListener("click", function () {

    mapContainer.style.display = "block";

    if (!mapInitialized) {

        map = L.map("map").setView(
            [27.1767, 78.0081],
            13
        );

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    "&copy; OpenStreetMap contributors"
            }
        ).addTo(map);

        mapInitialized = true;
    }

    setTimeout(function () {

        map.invalidateSize();

    }, 200);

});


// ===============================
// CLOSE MAP
// ===============================

closeMap.addEventListener("click", function () {

    mapContainer.style.display = "none";

});


// ===============================
// SEARCH BUTTON
// ===============================

searchDestination.addEventListener(
    "click",
    searchForDestination
);


// ===============================
// ENTER KEY SEARCH
// ===============================

destinationInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            searchForDestination();

        }

    }
);


// ===============================
// SEARCH DESTINATION
// ===============================

async function searchForDestination() {

    const destination =
        destinationInput.value.trim();

    if (!destination) {

        alert("Please enter a destination.");

        return;
    }

    searchDestination.disabled = true;
    searchDestination.innerText = "Searching...";


    try {

        let data = [];


        // ===============================
        // NOMINATIM SEARCH
        // ===============================

        try {

            const response = await fetch(
                "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=" +
                encodeURIComponent(destination)
            );


            if (response.ok) {

                data = await response.json();

            }

        } catch (error) {

            console.log(
                "Nominatim failed. Trying Photon..."
            );

        }


        // ===============================
        // PHOTON FALLBACK
        // ===============================

        if (!data.length) {

            const photonResponse = await fetch(
                "https://photon.komoot.io/api/?q=" +
                encodeURIComponent(destination) +
                "&limit=1"
            );


            if (!photonResponse.ok) {

                throw new Error(
                    "Location search failed."
                );

            }


            const photonData =
                await photonResponse.json();


            if (
                photonData.features &&
                photonData.features.length
            ) {

                const coordinates =
                    photonData.features[0]
                        .geometry
                        .coordinates;


                data = [

                    {
                        lat: coordinates[1],

                        lon: coordinates[0],

                        display_name:
                            photonData
                                .features[0]
                                .properties
                                .name ||
                            destination
                    }

                ];

            }

        }


        // ===============================
        // DESTINATION NOT FOUND
        // ===============================

        if (!data.length) {

            alert(
                "Destination not found. Try another city."
            );

            return;
        }


        // ===============================
        // COORDINATES
        // ===============================

        const latitude =
            parseFloat(data[0].lat);

        const longitude =
            parseFloat(data[0].lon);


        console.log(
            "Destination:",
            destination
        );

        console.log(
            "Latitude:",
            latitude
        );

        console.log(
            "Longitude:",
            longitude
        );


        // ===============================
        // MOVE MAP
        // ===============================

        map.setView(
            [latitude, longitude],
            13
        );


        // ===============================
        // REMOVE OLD DESTINATION MARKER
        // ===============================

        if (currentMarker) {

            map.removeLayer(
                currentMarker
            );

        }


        // ===============================
        // ADD DESTINATION MARKER
        // ===============================

        currentMarker =
            L.marker([
                latitude,
                longitude
            ])
                .addTo(map);


        currentMarker.bindPopup(
            "<b>" +
            destination +
            "</b><br>Destination"
        );


        // ===============================
        // CLEAR OLD SPOTS
        // ===============================

        clearSpotMarkers();


        // ===============================
        // CLEAR OLD ROUTE
        // ===============================

        if (routeLayer) {

            map.removeLayer(
                routeLayer
            );

            routeLayer = null;

        }


        // ===============================
        // HIDE OLD INFORMATION
        // ===============================

        const spotInfo =
            document.getElementById(
                "spotInfo"
            );

        if (spotInfo) {

            spotInfo.style.display =
                "none";

        }


        // ===============================
        // FIND NEARBY PLACES
        // ===============================

        await fetchNearbySpots(
            latitude,
            longitude
        );


    } catch (error) {

        console.error(
            "Destination search error:",
            error
        );

        alert(
            "Unable to search destination right now."
        );


    } finally {

        searchDestination.disabled =
            false;

        searchDestination.innerText =
            "Search";

    }

}


// ===============================
// CLEAR SPOT MARKERS
// ===============================

function clearSpotMarkers() {

    spotMarkers.forEach(
        function (marker) {

            map.removeLayer(marker);

        }
    );

    spotMarkers = [];

}


// ===============================
// FETCH NEARBY PLACES
// ===============================

async function fetchNearbySpots(
    latitude,
    longitude
) {

    spotsList.innerHTML =
        "<p>🔍 Finding nearby places...</p>";


    // ===============================
    // OVERPASS QUERY
    // ===============================

    const query = `
        [out:json][timeout:15];

        (
            node["tourism"="attraction"]
                (around:3000,${latitude},${longitude});

            node["tourism"="museum"]
                (around:3000,${latitude},${longitude});

            node["historic"="monument"]
                (around:3000,${latitude},${longitude});

            node["historic"="castle"]
                (around:3000,${latitude},${longitude});

            node["leisure"="park"]
                (around:3000,${latitude},${longitude});
        );

        out body;
    `;


    // ===============================
    // OVERPASS SERVERS
    // ===============================

    const servers = [

        "https://overpass-api.de/api/interpreter",

        "https://overpass.kumi.systems/api/interpreter"

    ];


    // ===============================
    // TRY SERVERS
    // ===============================

    for (
        const server of servers
    ) {

        try {

            console.log(
                "Trying Overpass:",
                server
            );


            const url =
                server +
                "?data=" +
                encodeURIComponent(query);


            const response =
                await fetch(url);


            if (!response.ok) {

                console.warn(
                    "Overpass error:",
                    response.status
                );

                continue;

            }


            const data =
                await response.json();


            console.log(
                "Nearby places:",
                data.elements.length
            );


            renderSpotList(
                data.elements,
                latitude,
                longitude
            );


            return;


        } catch (error) {

            console.warn(
                "Overpass server failed:",
                server
            );

        }

    }


    // ===============================
    // NO SERVER WORKED
    // ===============================

    spotsList.innerHTML =
        "<p>❌ Nearby places are temporarily unavailable. Please try again.</p>";

}
    // ===============================
    // DISPLAY NEARBY PLACES
    // ===============================

    function renderSpotList(
        spots,
        searchLat,
        searchLon
    ) {

        spotsList.innerHTML = "";


        const validSpots = [];


        spots.forEach(
            function (spot) {

                const name =
                    spot.tags &&
                    spot.tags.name;


                if (!name) {

                    return;

                }


                const lat =
                    spot.lat ||
                    (spot.center &&
                        spot.center.lat);


                const lon =
                    spot.lon ||
                    (spot.center &&
                        spot.center.lon);


                if (
                    lat === undefined ||
                    lon === undefined
                ) {

                    return;

                }


                const distance =
                    calculateDistance(
                        searchLat,
                        searchLon,
                        lat,
                        lon
                    );


                validSpots.push({

                    name: name,

                    lat: lat,

                    lon: lon,

                    distance: distance,

                    tags: spot.tags

                });

            }
        );


        // ===============================
        // SORT NEAREST FIRST
        // ===============================

        validSpots.sort(
            function (a, b) {

                return (
                    a.distance -
                    b.distance
                );

            }
        );


        // Maximum 15 places

        const nearbySpots =
            validSpots.slice(0, 15);


        if (!nearbySpots.length) {

            spotsList.innerHTML =
                "<p>No nearby attractions found.</p>";

            return;

        }


        // ===============================
        // CREATE MARKERS + LIST
        // ===============================

        nearbySpots.forEach(
            function (spot, index) {


                // ===============================
                // MAP MARKER
                // ===============================

                const marker =
                    L.marker([
                        spot.lat,
                        spot.lon
                    ])
                        .addTo(map);


                marker.bindPopup(
                    "<b>" +
                    spot.name +
                    "</b><br>" +
                    "📍 " +
                    spot.distance.toFixed(1) +
                    " km away"
                );


                // Clicking marker also creates route

                marker.on(
                    "click",
                    function () {

                        selectSpot(
                            searchLat,
                            searchLon,
                            spot.lat,
                            spot.lon,
                            spot.name
                        );

                    }
                );


                spotMarkers.push(marker);


                // ===============================
                // LIST ITEM
                // ===============================

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "spot-item";


                item.innerHTML = `
                <strong>
                    ${index + 1}. ${spot.name}
                </strong>

                <br>

                <small>
                    📍 ${spot.distance.toFixed(1)} km away
                </small>
            `;


                // Clicking list item

                item.addEventListener(
                    "click",
                    function () {

                        selectSpot(
                            searchLat,
                            searchLon,
                            spot.lat,
                            spot.lon,
                            spot.name
                        );

                    }
                );


                spotsList.appendChild(item);

            }
        );

    }


    // ===============================
    // SELECT PLACE + CREATE ROUTE
    // ===============================

    async function selectSpot(
        fromLat,
        fromLon,
        toLat,
        toLon,
        spotName
    ) {

        // ===============================
        // REMOVE OLD ROUTE
        // ===============================

        if (routeLayer) {

            map.removeLayer(
                routeLayer
            );

            routeLayer = null;

        }


        try {

            // ===============================
            // OSRM ROUTING
            // ===============================

            const routeURL =
                "https://router.project-osrm.org/route/v1/driving/" +
                fromLon +
                "," +
                fromLat +
                ";" +
                toLon +
                "," +
                toLat +
                "?overview=full&geometries=geojson";


            const response =
                await fetch(routeURL);


            if (!response.ok) {

                throw new Error(
                    "Routing server failed."
                );

            }


            const data =
                await response.json();


            if (
                !data.routes ||
                !data.routes.length
            ) {

                alert(
                    "Route could not be found."
                );

                return;

            }


            const route =
                data.routes[0];


            // ===============================
            // DRAW ROUTE
            // ===============================

            routeLayer =
                L.geoJSON(
                    route.geometry
                )
                    .addTo(map);


            map.fitBounds(
                routeLayer.getBounds(),
                {
                    padding: [30, 30]
                }
            );


            // ===============================
            // ROAD DISTANCE
            // ===============================

            const distance =
                (
                    route.distance / 1000
                ).toFixed(1);


            // ===============================
            // TRAVEL TIME
            // ===============================

            const duration =
                Math.round(
                    route.duration / 60
                );


            // ===============================
            // SHOW PLACE INFO
            // ===============================

            showSpotInformation(
                spotName,
                distance,
                duration,
                fromLat,
                fromLon,
                toLat,
                toLon
            );


        } catch (error) {

            console.error(
                "Routing error:",
                error
            );

            alert(
                "Unable to create route."
            );

        }

    }


    // ===============================
    // SHOW PLACE INFORMATION
    // ===============================

    function showSpotInformation(
        name,
    distance,
    duration,
    fromLat,
    fromLon,
    latitude,
    longitude
    ) {

        const info =
            document.getElementById("spotInfo");


        info.style.display = "block";


        // ===============================
        // BASIC PLACE INFORMATION
        // ===============================

        document.getElementById("spotName")
            .textContent = name;


        document.getElementById("spotDistance")
            .textContent = `${distance} km`;


        document.getElementById("spotDuration")
            .textContent = `${duration} min`;


        // ===============================
        // POPULATION DENSITY
        // ===============================

        document.getElementById(
            "populationDensity"
        ).textContent = "Data unavailable";


        // ===============================
        // CROWD
        // ===============================

        document.getElementById(
            "crowdLevel"
        ).textContent = "Loading...";


        // ===============================
        // SAFAR AI TIP
        // ===============================

        document.getElementById(
            "safarTip"
        ).textContent =
            "💡 Checking current crowd information...";


        // ===============================
        // GET CROWD DATA
        // ===============================

        getCrowdData(
            latitude,
            longitude,
            name
        );


        // Directly open Google Maps route in a new tab/app
       openInGoogleMaps(
    fromLat,
    fromLon,
    latitude,
    longitude
);

    }
    async function getCrowdData(spotName) {

        const crowdElement = document.getElementById("crowdLevel");
        const tipElement = document.getElementById("safarTip");

        crowdElement.textContent = "Loading...";
        tipElement.textContent = "💡 Checking current crowd information...";

        try {

            const response = await fetch(
                `https://safar-ai-88ab.onrender.com/api/crowd?venue=${encodeURIComponent(spotName)}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Crowd API failed");
            }

            console.log("BestTime response:", data);

            // We will read the exact percentage from BestTime response here
            const percentage = getBestTimePercentage(data);

            if (percentage === null) {

                crowdElement.textContent = "Data unavailable";

                tipElement.textContent =
                    "💡 Current crowd data is not available for this place.";

                return;
            }

            let level;

            if (percentage < 30) {
                level = "Low 🟢";
            }
            else if (percentage < 70) {
                level = "Moderate 🟡";
            }
            else {
                level = "High 🔴";
            }

            crowdElement.textContent =
                `${level} (${percentage}%)`;

            tipElement.textContent =
                `💡 SAFAR AI: Current busyness is ${percentage}%.`;

        } catch (error) {

            console.error("Crowd error:", error);

            crowdElement.textContent =
                "Live data unavailable";

            tipElement.textContent =
                "💡 Current crowd information could not be retrieved.";
        }
    }

    // ===============================
    // GOOGLE MAPS DEEP LINKING
    // ===============================

    // ===== UPDATED: Google Maps route/navigation =====
function openInGoogleMaps(fromLat, fromLng, destLat, destLng) {

    const googleMapsUrl =
        `https://www.google.com/maps/dir/?api=1` +
        `&origin=${fromLat},${fromLng}` +
        `&destination=${destLat},${destLng}` +
        `&travelmode=driving`;

    window.open(googleMapsUrl, "_blank");
}

    // ===============================
    // DISTANCE CALCULATION
    // ===============================

    function calculateDistance(
        lat1,
        lon1,
        lat2,
        lon2
    ) {

        const R = 6371;


        const dLat =
            (lat2 - lat1) *
            Math.PI /
            180;


        const dLon =
            (lon2 - lon1) *
            Math.PI /
            180;


        const a =
            Math.sin(dLat / 2) *
            Math.sin(dLat / 2) +

            Math.cos(
                lat1 * Math.PI / 180
            ) *

            Math.cos(
                lat2 * Math.PI / 180
            ) *

            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);


        const c =
            2 *
            Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );


        return R * c;


    }

    function openInGoogleMaps(destLat, destLng) {
        const iframe = document.getElementById("googleMapIframe");
        const modal = document.getElementById("googleMapModal");

        if (iframe && modal) {
            // Embed Google Maps view inside the modal iframe
            iframe.src = `https://maps.google.com/maps?q=${destLat},${destLng}&z=15&output=embed`;
            modal.style.display = "flex";
        }
    }

    // Modal Close Listener
    document.addEventListener("DOMContentLoaded", function () {
        const closeBtn = document.getElementById("closeGoogleMap");
        const modal = document.getElementById("googleMapModal");

        if (closeBtn && modal) {
            closeBtn.addEventListener("click", function () {
                modal.style.display = "none";
                document.getElementById("googleMapIframe").src = ""; // Stop iframe loading on close
            });
        }
    }); 