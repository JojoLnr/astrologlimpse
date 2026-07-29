import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your exact Firebase Configuration from index.html
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
    // 1. Dynamic Broadsheet View Trigger logic (Checking URL for '?sign=')
    const urlParams = new URLSearchParams(window.location.search);
    const signParam = urlParams.get('sign');
    
    if (signParam) {
        const landingView = document.getElementById('landing-view');
        const dispatchView = document.getElementById('dispatch-view');
        
        if (landingView) landingView.style.display = 'none';
        if (dispatchView) dispatchView.style.display = 'block';

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

        // Fetch the document directly from Firestore using your exact field mappings
        const fetchHoroscope = async () => {
            try {
                const docRef = doc(db, "horoscopes", cleanSign);
                const docSnap = await getDoc(docRef);

                const astroContent = document.getElementById('astronomical-content');
                const hermeticContent = document.getElementById('hermetic-content');
                const structuralContent = document.getElementById('structural-content');

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    
                    if (data.astro_title) {
                        const journalTitle = document.getElementById('journal-title');
                        if (journalTitle) journalTitle.innerText = data.astro_title;
                        document.title = data.astro_title + " - Astroglimpse";
                    }
                    if (data.astro_p1 && astroContent) {
                        astroContent.innerText = data.astro_p1;
                    }
                    if (data.venus_p1 && hermeticContent) {
                        hermeticContent.innerText = data.venus_p1;
                    }
                    if (data.structural_p1 && structuralContent) {
                        structuralContent.innerText = data.structural_p1;
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
    }

    // 2. Form Submission logic (for subscriber signup)
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
