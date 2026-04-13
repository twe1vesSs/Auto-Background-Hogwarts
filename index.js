import { eventSource, event_types } from '../../../../script.js';

const extensionPath = 'scripts/extensions/third-party/Auto-Background-Hogwarts';

const defaultBackground = "hogwarts_exterior.jpg";

const backgroundMap = {

const backgroundMap = {
    "большой зал, обед": "hogwarts_great_hall.jpg",
    "запретный лес": "forbidden_forest.jpg",
    "хижина хагрида": "hagrids_hut.jpg",
    "квиддич": "quidditch_pitch.jpg",
    "библиотека": "hogwarts_library.jpg",
    "кабинет дамблдора": "dumbledore_office.jpg",
    "гостиная гриффиндор": "gryffindor_common.jpg",
    "гостиная слизерин": "slytherin_common.jpg",
    "гостиная когтевран": "ravenclaw_common.jpg",
    "гостиная пуффендуй": "hufflepuff_common.jpg",
    "спальня": "spat_common.jpg",
    "учительская": "ychit_common.jpg",
    "подземелье": "hogwarts_dungeon.jpg",
    "зельеварение": "potions_classroom.jpg",
    "коридор": "hogwarts_corridor.jpg",
    "хогсмид": "hogsmeade_village.jpg",
    "черное озеро": "black_lake.jpg",
};

const style = document.createElement('style');
style.innerHTML = `
    #bg1, #bg2 { 
        transition: background-image 1.5s ease-in-out !important; 
    }
`;
document.head.appendChild(style);

function checkAndChangeBackground(text) {
    if (!text) return;
    const lowerText = text.toLowerCase();
    let newBg = defaultBackground; // По умолчанию ставим базовый


    for (const [keyword, bgFile] of Object.entries(backgroundMap)) {
        if (lowerText.includes(keyword)) {
            newBg = bgFile;
            break; 
        }
    }

    const bgUrl = `${extensionPath}/backgrounds/${newBg}`;
    const currentBg = $('#bg1').css('background-image');

    if (!currentBg.includes(newBg)) {
        console.log(`[Auto-BG-HP] Переключение на: ${newBg}`);
        $('#bg1').css('background-image', `url("${bgUrl}")`);
    }
}

eventSource.on(event_types.MESSAGE_RECEIVED, (messageId) => {
    const chatElements = document.querySelectorAll('.mes_text');
    const lastMessage = chatElements[chatElements.length - 1]?.innerText;
    checkAndChangeBackground(lastMessage);
});

eventSource.on(event_types.USER_MESSAGE_RENDERED, (messageId) => {
    const chatElements = document.querySelectorAll('.mes_text');
    const lastMessage = chatElements[chatElements.length - 1]?.innerText;
    checkAndChangeBackground(lastMessage);
});
