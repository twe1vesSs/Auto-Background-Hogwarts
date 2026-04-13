import { eventSource, event_types, saveSettingsDebounced } from '../../../../script.js';
import { extension_settings } from '../../../extensions.js';

const MODULE = 'hogwarts_auto_bg';
const extensionName = "Auto-Background-Hogwarts";
const extensionPath = `scripts/extensions/third-party/${extensionName}`;

const defaultSettings = {
    enabled: true,
    defaultBackground: "hogwarts_exterior.jpg"
};

function getSettings() {
    if (extension_settings[MODULE] === undefined) {
        extension_settings[MODULE] = structuredClone(defaultSettings);
    }
    return extension_settings[MODULE];
}
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
    const settings = getSettings();
    if (!settings.enabled || !text) return;
    
    const lowerText = text.toLowerCase();
    let newBg = settings.defaultBackground;

    for (const [keyword, bgFile] of Object.entries(backgroundMap)) {
        if (lowerText.includes(keyword)) {
            newBg = bgFile;
            break; 
        }
    }

    const bgUrl = `${extensionPath}/backgrounds/${newBg}`;
    const bgElement = document.getElementById('bg1');
    if (bgElement) {
        const urlValue = `url("${bgUrl}")`;
        if (bgElement.style.backgroundImage !== urlValue) {
            bgElement.style.backgroundImage = urlValue;
        }
    }
}

function addExtensionSettings() {
    const settings = getSettings();
    const settingsContainer = document.getElementById('extensions_settings');
    if (!settingsContainer) return;

    // Создаем структуру как в твоем рабочем примере
    const inlineDrawer = document.createElement('div');
    inlineDrawer.classList.add('inline-drawer', 'hp-bg-settings-container');

    const inlineDrawerToggle = document.createElement('div');
    inlineDrawerToggle.classList.add('inline-drawer-toggle', 'inline-drawer-header');

    const title = document.createElement('b');
    title.textContent = 'Auto Background Hogwarts 🏰';

    const icon = document.createElement('div');
    icon.classList.add('inline-drawer-icon', 'fa-solid', 'fa-circle-chevron-down', 'down');

    inlineDrawerToggle.append(title, icon);

    const inlineDrawerContent = document.createElement('div');
    inlineDrawerContent.classList.add('inline-drawer-content', 'hp-bg-settings-content');

    const label = document.createElement('label');
    label.classList.add('checkbox_label');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = settings.enabled;
    checkbox.addEventListener('change', () => {
        settings.enabled = checkbox.checked;
        saveSettingsDebounced();
    });

    const labelText = document.createElement('span');
    labelText.textContent = 'Включить авто-смену фонов';

    label.append(checkbox, labelText);
    inlineDrawerContent.append(label);
    inlineDrawer.append(inlineDrawerToggle, inlineDrawerContent);
    
    settingsContainer.append(inlineDrawer);
    console.log('[HP-BG] Settings panel added to DOM');
}

(function init() {
    addExtensionSettings();
    
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
})();
