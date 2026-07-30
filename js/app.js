import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC406s8oXgyxjUUkZrjc9ABSs99Vgyn5L0",
    authDomain: "astrologlimpse.firebaseapp.com",
    projectId: "astrologlimpse",
    storageBucket: "astrologlimpse.firebasestorage.app",
    messagingSenderId: "817221650162",
    appId: "1:817221650162:web:cd792fa99a0bb087f4326b",
    measurementId: "G-0181W9VKL9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper to safely populate elements if they exist in the DOM
const setElementText = (id, text) => {
    const el = document.getElementById(id);
    if (el && text) {
        if (text.includes('<br>')) {
            el.innerHTML = text; // Allow line breaks for dates
        } else {
            el.innerText = text;
        }
    }
};

// Helper to parse the matrix transit strings (e.g. "Mercury | 12° 45' | Sextile Natal Venus")
const populateMatrixRow = (rowId, dataString) => {
    const rowEl = document.getElementById(rowId);
    if (rowEl && dataString) {
        const parts = dataString.split('|').map(s => s.trim());
        if(parts.length === 3) {
            rowEl.innerHTML = `<td>${parts[0]}</td><td>${parts[1]}</td><td>${parts[2]}</td>`;
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const signParam = urlParams.get('sign');
    
    const landingView = document.getElementById('landing-view');
    const dispatchView = document.getElementById('dispatch-view');

    // Display Routing
    if (signParam) {
        if (landingView) landingView.classList.remove('active');
        if (dispatchView) dispatchView.classList.add('active');

        const cleanSign = signParam.toLowerCase().trim();
        
        const glyphs = {
            aries: "♈︎", taurus: "♉︎", gemini: "♊︎", cancer: "♋︎",
            leo: "♌︎", virgo: "♍︎", libra: "♎︎", scorpio: "♏︎",
            sagittarius: "♐︎", capricorn: "♑︎", aquarius: "♒︎", pisces: "♓︎"
        };

        const signGlyph = document.getElementById('sign-glyph');
        if (glyphs[cleanSign] && signGlyph) {
            signGlyph.innerText = glyphs[cleanSign];
        }

        const fetchHoroscope = async () => {
            try {
                const docRef = doc(db, "horoscopes", cleanSign);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    
                    // Masthead
                    if (data.masthead_sub) setElementText('masthead-sub', data.masthead_sub);
                    
                    // Astronomical Overview
                    setElementText('duality-caption', data.duality_caption);
                    setElementText('astro-title', data.astro_title);
                    setElementText('astro-p1', data.astro_p1);
                    setElementText('astro-p2', data.astro_p2);
                    setElementText('astro-p3', data.astro_p3);

                    // Matrix Table
                    populateMatrixRow('matrix-row1', data.matrix_row1_transit);
                    populateMatrixRow('matrix-row2', data.matrix_row2_transit);
                    populateMatrixRow('matrix-row3', data.matrix_row3_transit);

                    // Hermetic Delineations
                    setElementText('hermetic-title', data.hermetic_title);
                    setElementText('venus-title', data.venus_title);
                    setElementText('venus-p1', data.venus_p1);
                    setElementText('venus-p2', data.venus_p2);
                    
                    // Structural Realignments
                    setElementText('structural-title', data.structural_title);
                    setElementText('structural-p1', data.structural_p1);
                    setElementText('structural-p2', data.structural_p2);

                    // Somatic Protocols
                    setElementText('somatic-title', data.somatic_title);
                    setElementText('somatic-p1-title', data.somatic_p1_title + ":");
                    setElementText('somatic-p1-desc', data.somatic_p1_desc);
                    setElementText('somatic-p2-title', data.somatic_p2_title + ":");
                    setElementText('somatic-p2-desc', data.somatic_p2_desc);
                    setElementText('somatic-p3-title', data.somatic_p3_title + ":");
                    setElementText('somatic-p3-desc', data.somatic_p3_desc);
                    setElementText('somatic-p4-title', data.somatic_p4_title + ":");
                    setElementText('somatic-p4-desc', data.somatic_p4_desc);

                    // Insights Section
                    setElementText('insight-career-sub', data.insight_career_sub);
                    setElementText('insight-career-desc', data.insight_career_desc);
                    setElementText('insight-love-sub', data.insight_love_sub);
                    setElementText('insight-love-desc', data.insight_love_desc);
                    setElementText('insight-wellness-sub', data.insight_wellness_sub);
                    setElementText('insight-wellness-desc', data.insight_wellness_desc);

                    // Tarot & Dates
                    setElementText('tarot-card-name', data.tarot_card_name);
                    setElementText('tarot-card-sub', data.tarot_card_sub);
                    setElementText('tarot-card-desc', data.tarot_card_desc);
                    setElementText('mantra-text', data.mantra_text);
                    setElementText('key-dates-text', data.key_dates_text);
                    
                } else {
                    setElementText('astro-p1', "Cosmic signals are currently obscured. No data available for this sign today.");
                }
            } catch (error) {
                console.error("Failed to fetch dispatch from database:", error);
                setElementText('astro-p1', "A disruption occurred in the cosmic web. Unable to load data.");
            }
        };
        
        fetchHoroscope();
    } else {
        // If there's no URL parameter, force the user to the landing page form
        if (landingView) landingView.classList.add('active');
        if (dispatchView) dispatchView.classList.remove('active');
    }

    // Subscriber Signup Form Logic
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const emailInputElem = document.getElementById("email");
            const zodiacInputElem = document.getElementById("zodiac");
            
            if (!emailInputElem || !zodiacInputElem) return;

            const emailInput = emailInputElem.value.trim().toLowerCase();
            const zodiacInput = zodiacInputElem.value.toLowerCase();
            
            const docRef = doc(db, "subscribers", emailInput);

            try {
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    await updateDoc(docRef, { zodiacSign: zodiacInput });
                } else {
                    await setDoc(docRef, {
                        email: emailInput,
                        paying: false,
                        subscribedAt: serverTimestamp(),
                        zodiacSign: zodiacInput
                    });
                }

                signupForm.style.display = 'none';
                const successMsg = document.getElementById('success-message');
                if (successMsg) successMsg.style.display = 'block';
            } catch (error) {
                console.error("Error managing subscription: ", error);
                alert("A disruption occurred in the cosmic web. Please try again.");
            }
        });
    }
});
