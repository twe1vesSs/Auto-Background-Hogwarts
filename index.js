import { eventSource, event_types } from '../../../../script.js';
import { eventSource, event_types } from '../../../../script.js';
import { getContext } from '../../../../scripts/extensions.js';

// ПРОВЕРЬ: Название папки на GitHub должно быть в точности таким
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
    
    // Прямой поиск элемента фона Таверны
    const bgElement = document.getElementById('bg1');
    if (bgElement) {
        const urlValue = `url("${bgUrl}")`;
        if (bgElement.style.backgroundImage !== urlValue) {
            console.log(`[HP-BG] Смена фона на: ${newBg}`);
            bgElement.style.backgroundImage = urlValue;
        }
    }
}

// Функция создания настроек с задержкой, чтобы DOM успел прогрузиться
function initSettings() {
    const settingsHtml = `
        <div class="hp-bg-settings">
            <h4>Hogwarts Auto-Background</h4>
            <label class="checkbox_label">
                <input type="checkbox" id="hp_bg_enable" ${settings.isEnabled ? 'checked' : ''}>
                Включить авто-смену фонов
            </label>
        </div>
    `;
    
    // Пытаемся добавить в контейнер расширений
    const container = document.getElementById('extensions_settings');
    if (container) {
        container.insertAdjacentHTML('beforeend', settingsHtml);
        document.getElementById('hp_bg_enable').addEventListener('change', (e) => {
            settings.isEnabled = e.target.checked;
        });
    }
}

// Инициализация
async function init() {
    initSettings();
    
    eventSource.on(event_types.MESSAGE_RECEIVED, (messageId) => {
        const context = getContext();
        const message = context.chat[messageId];
        if (message) checkAndChangeBackground(message.mes);
    });

    eventSource.on(event_types.USER_MESSAGE_RENDERED, (messageId) => {
        const context = getContext();
        const message = context.chat[messageId];
        if (message) checkAndChangeBackground(message.mes);
    });

    console.log('[HP-BG] Инициализировано');
}

init();
