import { eventSource, event_types } from '../../../../script.js';

const extensionName = "Auto-Background-Hogwarts";
const extensionPath = `scripts/extensions/third-party/${extensionName}`;

let settings = {
    isEnabled: true,
    defaultBackground: "hogwarts_exterior.jpg"
};

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

function checkAndChangeBackground(text) {
    if (!settings.isEnabled || !text) return;
    
    const lowerText = text.toLowerCase();
    let newBg = settings.defaultBackground;

    for (const [keyword, bgFile] of Object.entries(backgroundMap)) {
        if (lowerText.includes(keyword)) {
            newBg = bgFile;
            break; 
        }
    }

    const bgUrl = `${extensionPath}/backgrounds/${newBg}`;
    if ($('#bg1').length) {
        // Проверяем, не тот же ли это фон, чтобы не перезапускать анимацию зря
        const currentBg = $('#bg1').css('background-image');
        if (!currentBg.includes(newBg)) {
            $('#bg1').css('background-image', `url("${bgUrl}")`);
        }
    }
}

function initSettings() {
    const html = `
        <div class="hp-bg-settings">
            <h4>Hogwarts Auto-Background</h4>
            <label class="checkbox_label">
                <input type="checkbox" id="hp_bg_enable" ${settings.isEnabled ? 'checked' : ''}>
                Включить авто-смену фонов
            </label>
        </div>
    `;
    $('#extensions_settings').append(html);

    $('#hp_bg_enable').on('change', function() {
        settings.isEnabled = $(this).prop('checked');
    });
}

(function init() {
    initSettings();
    
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
    
    console.log('[HP-BG] Extension Loaded with CSS');
})();
