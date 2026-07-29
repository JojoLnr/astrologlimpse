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

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const signParam = urlParams.get('sign');
    
    if (signParam) {
        const landingView = document.getElementById('landing-view');
        const dispatchView = document.getElementById('dispatch-view');
        
        if (landingView) landingView.classList.remove('active');
        if (dispatchView) dispatchView.classList.add('active');

        const cleanSign = signParam.toLowerCase().trim();
        
        const glyphs = {
            aries: "♈︎", taurus: "♉︎", gemini: "♊︎", cancer: "♋︎",
            leo: "♌︎", virgo: "♍︎", libra: "♎︎", scorpio: "♏︎",
            sagittarius: "♐︎", capricorn: "♑︎", aquarius: "♒︎", pisces: "♓︎"
        };

        const signGlyph = document.getElementById('sign-glyph');
        const signGlyphLarge = document.getElementById('sign-glyph-large');
        const signTitle = document.getElementById('sign-title');

        if (glyphs[cleanSign]) {
            if (signGlyph) signGlyph.innerText = glyphs[cleanSign];
            if (signGlyphLarge) signGlyphLarge.innerText = glyphs[cleanSign];
            if (signTitle) signTitle.innerText = `Daily Dispatch for ${cleanSign.charAt(0).toUpperCase() + cleanSign.slice(1)}`;
        }

        const fetchHoroscope = async () => {
            try {
                const docRef = doc(db, "horoscopes", cleanSign);
                const docSnap = await getDoc(docRef);

                // Mapping all template nodes
                const astroContent = document.getElementById('astronomical-content');
                const hermeticContent = document.getElementById('hermetic-content');
                const structuralContent = document.getElementById('structural-content');
                const careerContent = document.getElementById('career-content');
                const loveContent = document.getElementById('love-content');
                const wellnessContent = document.getElementById('wellness-content');
                const tarotContent = document.getElementById('tarot-content');
                const mantraContent = document.getElementById('mantra-content');
                const keyDatesContent = document.getElementById('key-dates-content');
                const dignitiesTableBody = document.getElementById('dignities-table-body');

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    
                    if (data.astro_title) {
                        const journalTitle = document.getElementById('journal-title');
                        if (journalTitle) journalTitle.innerText = data.astro_title;
                        document.title = data.astro_title + " - Astroglimpse";
                    }
                    if (data.astro_p1 && astroContent) astroContent.innerText = data.astro_p1;
                    if (data.venus_p1 && hermeticContent) hermeticContent.innerText = data.venus_p1;
                    if (data.structural_p1 && structuralContent) structuralContent.innerText = data.structural_p1;
                    if (data.career_text && careerContent) careerContent.innerText = data.career_text;
                    if (data.love_text && loveContent) loveContent.innerText = data.love_text;
                    if (data.wellness_text && wellnessContent) wellnessContent.innerText = data.wellness_text;
                    if (data.tarot_text && tarotContent) tarotContent.innerText = data.tarot_text;
                    if (data.mantra && mantraContent) mantraContent.innerText = data.mantra;
                    if (data.key_dates && keyDatesContent) keyDatesContent.innerText = data.key_dates;

                    // Render Dynamic Transits Matrix Table if provided
                    if (data.transits && Array.isArray(data.transits) && dignitiesTableBody) {
                        dignitiesTableBody.innerHTML = data.transits.map(t => `
                            <tr>
                                <td>${t.transit || ''}</td>
                                <td>${t.degree || ''}</td>
                                <td>${t.aspect || ''}</td>
                            </tr>
                        `).join('');
                    }
                } else {
                    if (astroContent) astroContent.innerText = "Cosmic signals are currently obscured. No data available for this sign today.";
                    if (hermeticContent) hermeticContent.innerText = "Awaiting celestial transmission...";
                    if (structuralContent) structuralContent.innerText = "Awaiting celestial transmission...";
                }
            } catch (error) {
                console.error("Failed to fetch dispatch from database:", error);
                const astroContent = document.getElementById('astronomical-content');
                if (astroContent) astroContent.innerText = "A disruption occurred in the cosmic web. Unable to load data.";
            }
        };
        
        fetchHoroscope();
    } else {
        const landingView = document.getElementById('landing-view');
        if (landingView) landingView.classList.add('active');
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
