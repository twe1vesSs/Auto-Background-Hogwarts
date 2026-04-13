import {
    eventSource,
    event_types,
    saveSettingsDebounced,
} from '../../../../script.js';
import { extension_settings } from '../../../extensions.js';
import { t } from '../../../i18n.js';

const MODULE = 'hogwarts_auto_bg';
const extensionName = "Auto-Background-Hogwarts";
const extensionPath = `scripts/extensions/third-party/${extensionName}`;

const defaultSettings = {
    enabled: true,
    defaultBackground: "hogwarts_exterior.jpg",
};

const backgroundMap = {
    "большой зал": "hogwarts_great_hall.jpg",
    "обед": "hogwarts_great_hall.jpg",
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

function getSettings() {
    if (extension_settings[MODULE] === undefined) {
        extension_settings[MODULE] = structuredClone(defaultSettings);
    }
    return extension_settings[MODULE];
}

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

function addExtensionSettings(settings) {
    const settingsContainer = document.getElementById('extensions_settings');
    if (!settingsContainer) return;

    const inlineDrawer = document.createElement('div');
    inlineDrawer.classList.add('inline-drawer');
    settingsContainer.append(inlineDrawer);

    const inlineDrawerToggle = document.createElement('div');
    inlineDrawerToggle.classList.add('inline-drawer-toggle', 'inline-drawer-header');

    const extensionTitle = document.createElement('b');
    extensionTitle.textContent = t`Auto Background Hogwarts 🏰`;

    const inlineDrawerIcon = document.createElement('div');
    inlineDrawerIcon.classList.add('inline-drawer-icon', 'fa-solid', 'fa-circle-chevron-down', 'down');

    inlineDrawerToggle.append(extensionTitle, inlineDrawerIcon);

    const inlineDrawerContent = document.createElement('div');
    inlineDrawerContent.classList.add('inline-drawer-content');
    inlineDrawer.append(inlineDrawerToggle, inlineDrawerContent);

    const enabledCheckboxLabel = document.createElement('label');
    enabledCheckboxLabel.classList.add('checkbox_label');
    const enabledCheckbox = document.createElement('input');
    enabledCheckbox.type = 'checkbox';
    enabledCheckbox.checked = settings.enabled;
    enabledCheckbox.addEventListener('change', () => {
        settings.enabled = enabledCheckbox.checked;
        saveSettingsDebounced();
    });
    const enabledCheckboxText = document.createElement('span');
    enabledCheckboxText.textContent = t`Включить авто-фоны`;
    enabledCheckboxLabel.append(enabledCheckbox, enabledCheckboxText);
    inlineDrawerContent.append(enabledCheckboxLabel);
}

(function init() {
    const settings = getSettings();
    addExtensionSettings(settings);

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
