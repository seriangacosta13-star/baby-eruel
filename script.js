/* ================= AUDIO ================= */

const unlockSound = document.getElementById("unlockSound");
const paperSound = document.getElementById("paperSound");
const confettiSound = document.getElementById("confettiSound");
const bgMusic = document.getElementById("bgMusic");
const clueSound = document.getElementById("clueSound");

let musicStarted = false;

function playClueSound() {
    if (!clueSound) return;
    clueSound.currentTime = 0;
    clueSound.volume = 0.6;
    clueSound.play().catch(() => {});
}

function unlockAllAudio() {
    [unlockSound, paperSound, confettiSound, bgMusic].forEach(audio => {
        if (!audio) return;

        audio.volume = 0;
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
            audio.volume = 1;
        }).catch(() => {});
    });
}

function startMusic() {
    if (musicStarted || !bgMusic) return;

    bgMusic.volume = 0.4;
    bgMusic.play().catch(() => {});
    musicStarted = true;
}

function playUnlock() {
    if (!unlockSound) return;

    unlockSound.currentTime = 0;
    unlockSound.volume = 0.8;
    unlockSound.play().catch(() => {});
}

let fadeInterval = null;

function fadeOutMusic(duration = 800) {
    if (fadeInterval) clearInterval(fadeInterval);

    const step = bgMusic.volume / (duration / 50);

    fadeInterval = setInterval(() => {
        if (bgMusic.volume <= 0) {
            bgMusic.volume = 0;
            bgMusic.pause();
            clearInterval(fadeInterval);
        } else {
            bgMusic.volume -= step;
        }
    }, 50);
}

function fadeInMusic(target = 0.4, duration = 800) {
    if (fadeInterval) clearInterval(fadeInterval);

    bgMusic.volume = 0;
    bgMusic.play().catch(() => {});

    const step = target / (duration / 50);

    fadeInterval = setInterval(() => {
        if (bgMusic.volume >= target) {
            bgMusic.volume = target;
            clearInterval(fadeInterval);
        } else {
            bgMusic.volume += step;
        }
    }, 50);
}


/* ================= GLOBAL ELEMENTS ================= */

const backLayer = document.getElementById("back-layer");

const bag = document.getElementById("bag");
const bagScreen = document.getElementById("bag-screen");
const itemsScreen = document.getElementById("items-screen");

const envelopeScreen = document.getElementById("envelope-container");
const letterScreen = document.getElementById("letter-container");

const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".yes-btn");

const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");
const backFinal = document.getElementById("back-to-items-final");

/* ================= BAG FLOW ================= */

bag.addEventListener("click", () => {
    fadeInMusic();
    bgMusic.volume = 0;
    bgMusic.play().then(() => {
        bgMusic.pause();
        bgMusic.currentTime = 0;
        fadeInMusic();    // smooth start
    }).catch(() => {});

    bagScreen.style.display = "none";
    itemsScreen.style.display = "flex";
});



/* ================= MYSTERY ITEMS ================= */

document.querySelectorAll(".mystery-item").forEach(item => {
    item.dataset.state = "locked";

    item.addEventListener("click", () => {
        if (item.dataset.state === "locked") {
            playUnlock();

            item.classList.add("locked");

            setTimeout(() => {
                item.classList.remove("locked");
                item.classList.add("unlocked");
                item.dataset.state = "revealed";
            }, 400);

            return;
        }

        // SECOND CLICK → OPEN
        const type = item.dataset.item;
        openedItems.add(type);


        if (type === "invitation") {
            itemsScreen.style.display = "none";
            envelopeScreen.style.display = "block";
        }

        if (type === "letter") {
            letterModal.style.display = "flex";
        }

        if (type === "gift") {
            giftModal.style.display = "flex";
        }
    });
});

/* ================= ENVELOPE ================= */

envelopeScreen.addEventListener("click", () => {
    if (paperSound) {
        paperSound.currentTime = 0;
        paperSound.volume = 0.9;
        paperSound.play().catch(() => {});
    }

    envelopeScreen.style.display = "none";
    letterScreen.style.display = "flex";
    backLayer.style.display = "block";

    setTimeout(() => {
        document.querySelector(".letter-window").classList.add("open");
    }, 50);
});

/* ================= NO BUTTON ================= */

noBtn.addEventListener("mouseover", () => {
    const distance = 200;
    const angle = Math.random() * Math.PI * 2;

    noBtn.style.transform = `translate(
        ${Math.cos(angle) * distance}px,
        ${Math.sin(angle) * distance}px
    )`;
});

/* ================= YES BUTTON ================= */

yesBtn.addEventListener("click", () => {
    title.textContent = "Yippeeee!";
    title.style.background = "rgba(212, 233, 203, 0.65)";
    title.style.padding = "10px 18px";
    title.style.borderRadius = "12px";
    title.style.display = "inline-block";
    

    catImg.src = "cat_dance.gif";

    document.querySelector(".letter-window").classList.add("final");
    buttons.style.display = "none";
    finalText.style.display = "block";
    backFinal.style.display = "inline-block";

    if (confettiSound) {
        confettiSound.currentTime = 0;
        confettiSound.play().catch(() => {});
    }

    confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
    });
});

/* ================= BACK FROM FINAL ================= */

backFinal.addEventListener("click", () => {
    letterScreen.style.display = "none";
    backLayer.style.display = "none";

    const win = document.querySelector(".letter-window");
    win.classList.remove("open", "final");

    title.textContent = "Will you be my Valentine?";
    catImg.src = "cat_heart.gif";
    buttons.style.display = "flex";
    finalText.style.display = "none";
    backFinal.style.display = "none";

    itemsScreen.style.display = "flex";
    maybeShowOutro();

});

/* ================= LETTER MODAL ================= */

const letterModal = document.getElementById("letter-modal");

document.getElementById("back-letter-modal").addEventListener("click", e => {
    e.stopPropagation();
    letterModal.style.display = "none";
    itemsScreen.style.display = "flex";
});

/* ================= GIFT + VIDEO ================= */

const giftModal = document.getElementById("gift-modal");
const videoBox = document.getElementById("gift-video");
const video = document.getElementById("giftVideo");
const countdownEl = document.getElementById("countdown");
const clueEl = document.getElementById("gift-clue");

const clueBtn = document.getElementById("clue-btn");

const clues = [
    "pwede mo siyang magustohan or hindi HAHAHAHA",
    "cute hehehehe",
    "my https://youtu.be/nQJEp-k-ogs?list=RDnQJEp-k-ogs",
    "436",
    "kapag tinanong mo ko, hindi kita sasagutin HAHAHAHAHAHAHA"
];

let clueIndex = 0;

clueBtn.addEventListener("click", () => {
    playClueSound();

    clueEl.textContent = clues[clueIndex];
    clueEl.style.animation = "none";
    clueEl.offsetHeight; // reset animation
    clueEl.style.animation = "fadeClue 0.4s ease";
    clueEl.style.fontSize = "16px";

    clueIndex = (clueIndex + 1) % clues.length;
});


video.addEventListener("play", () => {
    fadeOutMusic(1200);   // 🎵 fade out bg music
});

video.addEventListener("pause", () => {
    fadeInMusic();    // 🎵 fade back in
});

video.addEventListener("ended", () => {
    fadeOutMusic(1200);    // 🎵 fade back in when video ends
});


let giftUnlocked = false;

// TEST MODE
// 🎯 SET REAL UNLOCK DATE
const targetDate = new Date("2026-02-11T21:40:00"); // change date/time


function updateCountdown() {
    if (giftUnlocked) return;

    const diff = targetDate - new Date();

    if (diff <= 0) {
        giftUnlocked = true;

        countdownEl.textContent = "Unlocked";
        clueEl.textContent = "";
        videoBox.style.display = "block";

        video.currentTime = 0;
        video.load();
        return;
    }

    const s = Math.floor((diff / 1000) % 60);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));

    countdownEl.textContent = `${d}d ${h}h ${m}m ${s}s`;
    
}

setInterval(updateCountdown, 1000);
updateCountdown();
        

document.getElementById("back-gift-modal").addEventListener("click", e => {
    e.stopPropagation();
    video.pause();
    giftModal.style.display = "none";
    itemsScreen.style.display = "flex";
    clueIndex = 0;
    clueEl.textContent = "Tap for a clue";

});

/* ================= BACK LAYER ================= */

backLayer.addEventListener("click", () => {
    backLayer.style.display = "none";
    letterScreen.style.display = "none";
    envelopeScreen.style.display = "block";
});

document.getElementById("back-gift-modal").addEventListener("click", e => {
    e.stopPropagation();
    video.pause();
    fadeInMusic();        // 👈 important
    giftModal.style.display = "none";
    itemsScreen.style.display = "flex";
});

let openedItems = new Set();
let lastItemExited = false;

const outroBtn = document.getElementById("outro-btn");
const outroScreen = document.getElementById("outro-screen");


// trigger outro
outroBtn.addEventListener("click", () => {
    outroScreen.style.display = "flex";
    outroScreen.classList.add("show");

    startOutroChaos();
});

function maybeShowOutro() {
    if (openedItems.size === 3 && !lastItemExited) {
        lastItemExited = true;
        outroBtn.style.display = "block";
        outroBtn.classList.add("pop-in");
    }
}
document.getElementById("back-letter-modal").addEventListener("click", () => {
    letterModal.style.display = "none";
    itemsScreen.style.display = "flex";
    maybeShowOutro();
});
document.getElementById("back-gift-modal").addEventListener("click", e => {
    e.stopPropagation();
    video.pause();
    fadeInMusic();
    giftModal.style.display = "none";
    itemsScreen.style.display = "flex";
    maybeShowOutro();
});

const gifSources = [
    "ke1.gif",
    "ke2.gif",
    "ke3.gif",
    "ke4.gif"
];

let outroGifLoop = null;

function spawnOutroGif() {
    const gif = document.createElement("img");
    gif.src = gifSources[Math.floor(Math.random() * gifSources.length)];
    gif.className = "outro-gif";

    const size = 60 + Math.random() * 40;
    gif.style.width = size + "px";

    const x = Math.random() * (window.innerWidth - size);
    const y = Math.random() * (window.innerHeight - size);

    gif.style.left = x + "px";
    gif.style.top = y + "px";

    document.getElementById("outro-screen").appendChild(gif);

    // auto remove
    setTimeout(() => {
        gif.remove();
    }, 10000);
}

function startOutroChaos() {
    spawnOutroGif();
    outroGifLoop = setInterval(() => {
        if (document.querySelectorAll(".outro-gif").length < 1000) {
            spawnOutroGif();
        }
    }, 300 + Math.random() * 70);
}

function stopOutroChaos() {
    clearInterval(outroGifLoop);
    outroGifLoop = null;
}
const introBlur = document.getElementById("intro-blur");

introBlur.addEventListener("click", () => {
    introBlur.classList.add("hide");

    // unlock audio + start bg music
    unlockAllAudio();
    startMusic();

    setTimeout(() => {
        introBlur.style.display = "none";
    }, 900);
});
