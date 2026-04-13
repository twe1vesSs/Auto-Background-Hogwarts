import { eventSource, event_types } from '../../../../script.js';
import { getContext } from '../../../../scripts/extensions.js';

const extensionName = "Auto-Background-Hogwarts";
const scriptPath = import.meta.url;
const extensionRoot = scriptPath.substring(0, scriptPath.lastIndexOf('/'));

// Список доступных файлов (должен совпадать с именами на GitHub)
const availableBackgrounds = [
    "hogwarts_great_hall.jpg",
    "forbidden_forest.jpg",
    "hagrids_hut.jpg",
    "quidditch_pitch.jpg",
    "hogwarts_library.jpg",
    "dumbledore_office.jpg",
    "gryffindor_common.jpg",
    "slytherin_common.jpg",
    "ravenclaw_common.jpg",
    "hufflepuff_common.jpg",
    "bedroom_common.jpg",
    "teachers_room_common.jpg",
    "hogwarts_dungeon.jpg",
    "potions_classroom.jpg",
    "hogwarts_corridor.jpg",
    "hogsmeade_village.jpg",
    "black_lake.jpg",
    "hogwarts_exterior.jpg"
];

async function askAIForBackground(userText) {
    const context = getContext();
    
    // Формируем системный промпт для выбора фона
    const prompt = `Анализируй текст сообщения и выбери ОДНО наиболее подходящее название файла из списка ниже. 
    Ответь ТОЛЬКО названием файла. Если ничего не подходит, ответь "hogwarts_exterior.jpg".
    
    Список: ${availableBackgrounds.join(', ')}
    
    Текст сообщения: "${userText}"`;

    try {
        // Используем внутреннюю функцию Таверны для быстрого запроса
        const response = await fetch('/api/extra/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: prompt,
                max_context_length: 500,
                max_length: 20,
                quiet: true
            })
        });

        const data = await response.json();
        const chosenBg = data.output.trim().toLowerCase();
        
        // Проверяем, есть ли такой файл в нашем списке (защита от галлюцинаций ИИ)
        return availableBackgrounds.find(bg => chosenBg.includes(bg)) || "hogwarts_exterior.jpg";
    } catch (e) {
        console.error("[HP-BG] Ошибка запроса к ИИ:", e);
        return "hogwarts_exterior.jpg";
    }
}

async function handleBackgroundUpdate(text) {
    console.log("[HP-BG] ИИ анализирует контекст...");
    const bestBg = await askAIForBackground(text);
    
    const bgUrl = `${extensionRoot}/backgrounds/${bestBg}`;
    const bgElement = document.getElementById('bg1');
    
    if (bgElement) {
        bgElement.style.setProperty('background-image', `url("${bgUrl}")`, 'important');
        console.log(`[HP-BG] ИИ выбрал локацию: ${bestBg}`);
    }
}

(function init() {
    eventSource.on(event_types.MESSAGE_RECEIVED, async (messageId) => {
        const chatElements = document.querySelectorAll('.mes_text');
        const lastMessage = chatElements[chatElements.length - 1]?.innerText;
        await handleBackgroundUpdate(lastMessage);
    });
    
    console.log('[HP-BG] Умная смена фонов запущена');
})();
