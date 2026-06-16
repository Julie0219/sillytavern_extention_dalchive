// ============================================================
// Dalchive  v0.15.0  (다세계관 아카이브)
// - 마법봉 메뉴 -> 팝업
// - 먼저 세계관 선택 (Harry Potter / Marvel / Call of Duty)
// - 선택한 세계관의 위키에서 카테고리 둘러보기 + 검색 + 이미지
// - 세계관별 위키 주소/카테고리/항목만 다르고 나머지 로직은 공통
// ============================================================

// ============================================================
// ★★★ 항목 추가 방법 (캐릭터 등을 직접 넣기) ★★★
//   1) 아래 WORLDS에서 원하는 세계관 -> 카테고리 배열을 찾는다
//   2) 그 배열에 '위키 문서 제목', 을 한 줄 추가한다 (따옴표+쉼표 주의)
//      예: '🪖 Characters (캐릭터)': [ ..., 'Captain MacMillan', '내가추가할이름', ]
//   3) 정확한 위키 제목을 모르면, 확장에서 그 이름을 검색한 뒤
//      나온 결과 제목을 그대로 복사해서 넣으면 된다.
//
// ★★★ 개발자 설명 덮어쓰기(OVERRIDES) — 7번 기능 ★★★
//   위키가 표/틀 위주라 설명이 안 나오거나, 내가 직접 쓴 설명을 보여주고
//   싶을 때 사용한다. 여기에 적어두면 그 항목은 위키 대신 이 내용을 보여준다.
//   배포하면 모든 사용자에게 이 내용이 적용된다.
//
//   형식:  '위키문서제목': { desc: '보여줄 설명', title_ko: '한글이름(선택)', img: '이미지URL(선택)' }
//     - desc     : 상세창에 표시할 설명 (필수). 줄바꿈은 \n
//     - title_ko : 제목 옆에 함께 보여줄 한글 이름 (선택)
//     - img      : 위키 이미지 대신 쓸 이미지 주소 (선택, 없으면 위키 이미지 사용)
// ============================================================
const OVERRIDES = {
    // 예시 (필요 없으면 지워도 됨):
    // 'Special Air Service/Members': {
    //     desc: 'SAS(영국 공수특전단)의 주요 멤버: 존 프라이스, 고스트, 소프 맥타비시 등.',
    // },
    // 'John Price': {
    //     title_ko: '존 프라이스 대위',
    //     desc: '태스크 포스 141의 리더. 모던 워페어 시리즈의 베테랑 지휘관.',
    // },
};

// ------------------------------------------------------------
// 세계관 정의
// ------------------------------------------------------------
const WORLDS = {
    harrypotter: {
        name: 'Harry Potter',
        emoji: '⚡',
        api: 'https://harrypotter.fandom.com/api.php',
        categories: {
            '🧙 Characters (인물)': [
                'Harry Potter', 'Hermione Granger', 'Ron Weasley', 'Albus Dumbledore', 'Severus Snape',
                'Lord Voldemort', 'Rubeus Hagrid', 'Draco Malfoy', 'Sirius Black', 'Remus Lupin',
                'Minerva McGonagall', 'Bellatrix Lestrange', 'Luna Lovegood', 'Neville Longbottom', 'Ginny Weasley',
                'Dobby', 'Newt Scamander', 'Cedric Diggory', 'Cho Chang', 'Lucius Malfoy', 'Nymphadora Tonks',
                'Alastor Moody', 'Dolores Umbridge', 'Horace Slughorn', 'Gellert Grindelwald', 'James Potter',
                'Lily Potter', 'Bill Weasley', 'Molly Weasley', 'Arthur Weasley', 'Fred Weasley', 'George Weasley',
                'Percy Weasley', 'Charlie Weasley', 'Fleur Delacour', 'Viktor Krum', 'Cornelius Fudge',
                'Kingsley Shacklebolt', 'Peter Pettigrew', 'Filius Flitwick', 'Pomona Sprout', 'Sybill Trelawney',
                'Argus Filch', 'Gilderoy Lockhart', 'Quirinus Quirrell', 'Bartemius Crouch Junior', 'Regulus Black',
                'Nagini', 'Aberforth Dumbledore', 'Garrick Ollivander',
            ],
            '🪄 Spells (주문)': [
                'Disarming Charm', 'Patronus Charm', 'Killing Curse', 'Levitation Charm', 'Wand-Lighting Charm',
                'Unlocking Charm', 'Summoning Charm', 'Stunning Spell', 'Shield Charm', 'Cruciatus Curse',
                'Imperius Curse', 'Sectumsempra', 'Laughing Charm', 'Memory Charm', 'Reductor Curse',
                'Full Body-Bind Curse', 'Episkey', 'Water-Making Spell', 'Fire-Making Spell', 'Mending Charm',
                'Wand-Extinguishing Charm', 'Confundus Charm', 'Dancing Feet Spell', 'Legilimency', 'Blasting Curse',
                'Severing Charm', 'Engorgement Charm', 'Bat-Bogey Hex', 'Tickling Charm', 'Knockback Jinx',
                'Banishing Charm', 'Hover Charm', 'Bubble-Head Charm', 'Cushioning Charm', 'Disillusionment Charm',
                'Extension Charm', 'Flame-Freezing Charm', 'Freezing Charm', 'Gripping Charm', 'Hot-Air Charm',
                'Impediment Jinx', 'Locomotion Charm', 'Obliteration Charm', 'Permanent Sticking Charm', 'Pepper Breath Hex',
                'Slug-Vomiting Charm', 'Stinging Hex', 'Tongue-Tying Curse', 'Trip Jinx', 'Unbreakable Charm',
            ],
            '🧪 Potions (마법약)': [
                'Polyjuice Potion', 'Felix Felicis', 'Amortentia', 'Veritaserum', 'Draught of Living Death',
                'Wolfsbane Potion', 'Skele-Gro', 'Pepperup Potion', 'Draught of Peace', 'Elixir of Life',
                'Butterbeer', 'Doxycide', 'Shrinking Solution', 'Swelling Solution', 'Forgetfulness Potion',
                'Mandrake Restorative Draught', 'Befuddlement Draught', 'Ageing Potion', 'Calming Draught', 'Blood-Replenishing Potion',
                'Confusing Concoction', 'Deflating Draught', 'Dragon Tonic', 'Essence of Dittany', 'Fire-Protection Potion',
                'Girding Potion', 'Hair-Raising Potion', 'Invigoration Draught', 'Love Potion', 'Memory Potion',
                'Sleeping Draught', 'Strengthening Solution', 'Wideye Potion', 'Wit-Sharpening Potion',
                'Antidote to Common Poisons', 'Cure for Boils', 'Hiccoughing Solution', 'Murtlap Essence',
            ],
            '🐉 Creatures (마법동물)': [
                'Niffler', 'Hippogriff', 'Basilisk', 'Thestral', 'Dementor', 'Dragon', 'Phoenix', 'House-elf',
                'Acromantula', 'Boggart', 'Werewolf', 'Centaur', 'Goblin', 'Troll', 'Veela', 'Unicorn', 'Bowtruckle',
                'Kneazle', 'Occamy', 'Demiguise', 'Mooncalf', 'Thunderbird', 'Erumpent', 'Grindylow', 'Cornish pixie',
                'Blast-Ended Skrewt', 'Flobberworm', 'Hungarian Horntail', 'Merpeople', 'Giant', 'Inferius', 'Pixie',
                'Hinkypunk', 'Red Cap', 'Kappa', 'Banshee', 'Ghoul', 'Gnome', 'Doxy', 'Streeler', 'Salamander',
                'Manticore', 'Sphinx', 'Chimaera', 'Augurey', 'Crup', 'Fwooper', 'Jarvey', 'Knarl',
            ],
            '🌿 Plants (마법식물)': [
                'Mandrake', "Devil's Snare", 'Whomping Willow', 'Gillyweed', 'Mimbulus mimbletonia',
                'Venomous Tentacula', 'Bubotuber', 'Fanged Geranium', 'Dittany', 'Aconite', 'Asphodel',
                'Wolfsbane', 'Wiggentree', 'Snargaluff', 'Flitterbloom', 'Puffapod', 'Screechsnap', 'Alihotsy',
                'Dirigible plum', 'Gurdyroot', 'Knotgrass', 'Lovage', 'Moly', 'Nettle', 'Sopophorous bean',
                'Valerian', 'Wormwood', 'Bouncing Bulb', 'Honking Daffodil', 'Leaping Toadstool', 'Mallowsweet',
                'Self-fertilising shrub', 'Shrivelfig', 'Spiky bush',
            ],
            '🏰 Locations (장소)': [
                'Hogwarts School of Witchcraft and Wizardry', 'Diagon Alley', 'Hogsmeade', 'Ministry of Magic',
                'Gringotts Wizarding Bank', 'The Burrow', 'Azkaban', 'Forbidden Forest', 'Room of Requirement',
                'Chamber of Secrets', 'Leaky Cauldron', 'Ollivanders', 'Knockturn Alley', "Godric's Hollow",
                'Shrieking Shack', 'Privet Drive', 'Platform Nine and Three-Quarters', 'Great Hall',
                'Gryffindor Tower', 'Hospital Wing', 'Quidditch pitch', "Hog's Head", 'Three Broomsticks',
                'Honeydukes', "Weasleys' Wizard Wheezes", 'Borgin and Burkes', 'Flourish and Blotts',
                "Madam Malkin's Robes for All Occasions", "Spinner's End", 'Malfoy Manor',
                'Number 12, Grimmauld Place', "King's Cross Station", 'Beauxbatons Academy of Magic',
                'Durmstrang Institute', 'Nurmengard', 'Little Hangleton', 'Ottery St Catchpole', 'Black Lake',
            ],
        },
    },

    marvel: {
        name: 'Marvel Universe',
        emoji: '🦸',
        api: 'https://marvel.fandom.com/api.php',
        categories: {
            '🦸 Heroes (히어로)': [
                'Peter Parker (Earth-616)', 'Tony Stark (Earth-616)', 'Steve Rogers (Earth-616)',
                'Thor Odinson (Earth-616)', 'Bruce Banner (Earth-616)', 'Natasha Romanoff (Earth-616)',
                'Clint Barton (Earth-616)', 'Stephen Strange (Earth-616)', "T'Challa (Earth-616)",
                'Carol Danvers (Earth-616)', 'Scott Summers (Earth-616)', 'James Howlett (Earth-616)',
                'Wade Wilson (Earth-616)', 'Matthew Murdock (Earth-616)', 'Frank Castle (Earth-616)',
                'Reed Richards (Earth-616)', 'Susan Storm (Earth-616)', 'Benjamin Grimm (Earth-616)',
                'Johnny Storm (Earth-616)', 'Jean Grey (Earth-616)', 'Ororo Munroe (Earth-616)',
                'Charles Xavier (Earth-616)', 'Hank McCoy (Earth-616)', 'Peter Quill (Earth-616)',
                'Sam Wilson (Earth-616)', 'Bucky Barnes (Earth-616)', 'Wanda Maximoff (Earth-616)',
                'Pietro Maximoff (Earth-616)', 'Vision (Earth-616)', 'Marc Spector (Earth-616)',
            ],
            '🦹 Villains (빌런)': [
                'Thanos (Earth-616)', 'Victor von Doom (Earth-616)', 'Norman Osborn (Earth-616)',
                'Loki Laufeyson (Earth-616)', 'Max Eisenhardt (Earth-616)', 'Wilson Fisk (Earth-616)',
                'Eddie Brock (Earth-616)', 'Otto Octavius (Earth-616)', 'Ultron (Earth-616)',
                'Red Skull (Earth-616)', 'En Sabah Nur (Earth-616)', 'Galactus (Earth-616)',
                'Kang (Earth-616)', 'Carnage (Earth-616)', 'Green Goblin', 'Mysterio',
                'Vulture (Earth-616)', 'Sandman (Earth-616)', 'Kraven the Hunter', 'Sabretooth (Earth-616)',
            ],
            '👥 Teams (팀·조직)': [
                'Avengers (Earth-616)', 'X-Men (Earth-616)', 'Fantastic Four (Earth-616)',
                'Guardians of the Galaxy (Earth-616)', 'S.H.I.E.L.D. (Earth-616)', 'Hydra (Earth-616)',
                'Defenders (Earth-616)', 'Inhumans (Earth-616)', 'Brotherhood of Evil Mutants (Earth-616)',
                'Sinister Six (Earth-616)', 'Thunderbolts (Earth-616)', 'Nova Corps (Earth-616)',
            ],
            '💎 Items (아이템·유물)': [
                'Infinity Gems', 'Mjolnir', "Captain America's Shield", 'Iron Man Armor',
                'Cosmic Cube', 'Eye of Agamotto', 'Web-Shooters', 'Adamantium', 'Vibranium',
                'Infinity Gauntlet',
            ],
            '👽 Races (종족)': [
                'Mutants (Homo superior)', 'Asgardians', 'Inhumans', 'Skrulls', 'Kree', 'Eternals (Earth-616)',
                'Celestials', 'Symbiotes', 'Atlanteans', 'Watchers',
            ],
            '🌆 Locations (장소)': [
                'Wakanda', 'Asgard', 'Latveria', 'Genosha', 'Sokovia', 'Knowhere',
                'Sanctum Sanctorum', 'Avengers Tower', "Xavier's School for Gifted Youngsters",
                'Baxter Building', "Hell's Kitchen", 'Madripoor',
            ],
        },
    },

    cod: {
        name: 'Call of Duty',
        emoji: '🎯',
        api: 'https://callofduty.fandom.com/api.php',
        categories: {
            '🪖 Characters (캐릭터)': [
                'John Price', 'Simon "Ghost" Riley', 'John "Soap" MacTavish',
                'Kyle "Gaz" Garrick', 'Alejandro Vargas', 'Rodolfo Parra',
                'Kate Laswell', 'Farah Karim', 'Alex Keller', 'Phillip Graves',
                'Keegan P. Russ', 'Kim "Horangi" Hong-jin', 'König', 'Nikto',
                'Vladimir Makarov', 'Valeria Garza', 'Roach', 'Nikolai',
            ],
            '🏴 Factions (세력)': [
                'Task Force 141', 'Spetsnaz/Modern Warfare (Reboot)', 'Ultranationalists',
                'Special Air Service/Modern Warfare', 'United States Marine Corps/Modern Warfare',
                'Delta Force', 'United States Navy/Modern Warfare', 'Inner Circle', 'Cordis Die',
                'Atlas Corporation', 'Sentinel Task Force', 'Federation',
                'Central Intelligence Agency/Modern Warfare (Reboot)',
                'Urzikstan Liberation Force', 'Los Vaqueros', 'Las Almas Cartel', 'Al-Qatala',
            ],
            '🔫 Weapons (무기)': [
                'AK-47', 'M4A1', 'M16', 'AUG', 'MP5', 'M1911', 'Desert Eagle', 'Intervention',
                'Barrett .50cal', 'RPG-7', 'Famas', 'Galil', 'Commando', 'AK-74u', 'PP90M1',
                'ACR', 'SCAR-H', 'UMP45', 'P90', 'Vector', 'Dragunov', 'Ray Gun', 'Thundergun',
                'Wunderwaffe DG-2', 'Combat Knife', 'Throwing Knife', 'Tomahawk', 'Crossbow',
                'M1 Garand', 'Thompson', 'MP40', 'Kar98k', 'PPSh-41', 'Browning M1919',
            ],
            '⚙️ Equipment & Perks (장비·퍽)': [
                'Juggernog', 'Speed Cola', 'Quick Revive', 'Double Tap Root Beer', 'Stamin-Up',
                'Mule Kick', 'PhD Flopper', 'Pack-a-Punch Machine', 'Mystery Box',
                'Claymore', 'C4', 'Semtex', 'Flashbang', 'Stun Grenade', 'Tactical Insertion',
                'Care Package', 'Predator Missile', 'UAV', 'Sentry Gun', 'Riot Shield',
                'Ballistic Knife', 'Monkey Bomb',
            ],
            '🗺️ Locations (장소)': [
                'Urzikstan', 'Verdansk', 'Las Almas', 'Al Mazrah',
                'United Republic of Adal', 'Kastovia', 'Vondel',
                'Rebirth Island', 'Caldera',
            ],
        },
    },
};

// ============================================================
// ★★★ 원격 데이터 (깃허브 JSON) ★★★
//   아래 URL의 JSON을 읽어와, 코드에 박힌 WORLDS/OVERRIDES에 합칩니다.
//   덕분에 이 파일을 재배포하지 않아도, 깃허브에서 JSON만 고치면
//   모든 사용자에게 자동 반영됩니다. (사용자는 업데이트 불필요)
//
//   ※ 설정 방법은 README의 "깃허브 원격 데이터" 항목을 참고하세요.
//   ※ 원격을 안 쓰려면 REMOTE_DATA_URL 을 '' (빈 문자열)로 두세요.
//      그러면 코드에 박힌 기본값만 사용합니다.
//
//   JSON 형식:
//   {
//     "items":     { "cod": { "🪖 Characters (캐릭터)": ["새 이름"] } },
//     "overrides": { "John Price": { "title_ko": "존 프라이스", "desc": "설명" } }
//   }
// ============================================================
const REMOTE_DATA_URL = ''; // 예: 'https://raw.githubusercontent.com/사용자명/저장소/main/dalchive-data.json'

// 원격 JSON을 받아 WORLDS/OVERRIDES에 병합 (실패하면 조용히 기본값 유지)
async function loadRemoteData() {
    if (!REMOTE_DATA_URL) return;
    try {
        const res = await fetch(REMOTE_DATA_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const remote = await res.json();
        mergeRemoteData(remote);
        console.log('[Dalchive] 원격 데이터 적용됨');
    } catch (e) {
        // 원격 실패 = 코드 기본값으로 그대로 동작 (안전)
        console.warn('[Dalchive] 원격 데이터 불러오기 실패, 기본값 사용:', e.message);
    }
}

function mergeRemoteData(remote) {
    if (!remote || typeof remote !== 'object') return;
    // 1) items: 기존 카테고리 배열에 추가 (중복 제거, 새 카테고리도 허용)
    if (remote.items && typeof remote.items === 'object') {
        for (const [worldId, cats] of Object.entries(remote.items)) {
            if (!WORLDS[worldId] || !cats || typeof cats !== 'object') continue;
            for (const [cat, list] of Object.entries(cats)) {
                if (!Array.isArray(list)) continue;
                if (!WORLDS[worldId].categories[cat]) WORLDS[worldId].categories[cat] = [];
                const existing = WORLDS[worldId].categories[cat];
                for (const item of list) {
                    if (typeof item === 'string' && !existing.includes(item)) existing.push(item);
                }
            }
        }
    }
    // 2) overrides: 원격이 우선 (덮어쓰기)
    if (remote.overrides && typeof remote.overrides === 'object') {
        Object.assign(OVERRIDES, remote.overrides);
    }
}

// 현재 선택된 세계관 (선택 전엔 null)
let currentWorld = null;
function api() { return WORLDS[currentWorld].api; }

// 확장 설정 (번역에 쓸 연결 프로필 ID 저장)
const cpSettings = { translateProfileId: '' };
function loadSettings() {
    try {
        const ctx = SillyTavern.getContext();
        const saved = ctx.extensionSettings?.['chatdal-pensieve'];
        if (saved && typeof saved.translateProfileId === 'string') {
            cpSettings.translateProfileId = saved.translateProfileId;
        }
    } catch (e) { /* 무시 */ }
}
function saveSettings() {
    try {
        const ctx = SillyTavern.getContext();
        ctx.extensionSettings['chatdal-pensieve'] = { translateProfileId: cpSettings.translateProfileId };
        ctx.saveSettingsDebounced();
    } catch (e) { /* 무시 */ }
}

// ------------------------------------------------------------
// API 헬퍼 (현재 세계관의 위키 사용)
// ------------------------------------------------------------
async function apiGet(params) {
    const url = `${api()}?${params}&format=json&origin=*`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

async function searchWiki(query) {
    const data = await apiGet(`action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=15`);
    return (data?.query?.search ?? []).map(s => ({ title: s.title, wordcount: s.wordcount }));
}

// API 제목 인코딩: 슬래시(하위문서)는 유지하고 나머지만 인코딩
function encodeTitle(title) {
    return title.split('/').map(encodeURIComponent).join('/');
}

async function fetchWikitext(title, fullArticle, depth = 0) {
    let p = `action=parse&page=${encodeTitle(title)}&prop=wikitext`;
    if (!fullArticle) p += '&section=0';
    const data = await apiGet(p);
    const raw = data?.parse?.wikitext?.['*'] ?? '';
    const rd = raw.match(/^#REDIRECT\s*\[\[([^\]|#]+)/i) || raw.match(/^#REDIRECT\s+(.+)$/im);
    if (rd && depth < 2) return fetchWikitext(rd[1].trim(), fullArticle, depth + 1);
    return raw;
}

async function fetchImage(title) {
    try {
        const data = await apiGet(`action=query&prop=pageimages&titles=${encodeTitle(title)}&pithumbsize=300&redirects=1`);
        const pages = data?.query?.pages ?? {};
        const first = Object.values(pages)[0];
        return first?.thumbnail?.source ?? null;
    } catch (e) { return null; }
}

// ------------------------------------------------------------
// 위키텍스트 청소
// ------------------------------------------------------------
function stripMarkup(text) {
    if (!text) return '';
    text = text.replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, '');
    text = text.replace(/<ref[^>]*\/>/g, '');
    text = text.replace(/\{\{r\|[^}]*\}\}/gi, '');       // 마블 참조 {{r|...}}
    text = text.replace(/\{\{cl\|[^}]*\}\}/gi, '');      // 마블 참조 {{cl|...}}
    text = text.replace(/\{\{citation\}\}/gi, '');
    // 이미지: [[File:...]] / [[Image:...]] 통째 제거
    text = text.replace(/\[\[(?:File|Image):[^\]]*\]\]/gi, '');
    text = text.replace(/^\s*thumb\s*\|[^\n]*$/gim, '');
    text = text.replace(/thumb\|(?:right|left|center)?\|?\d*px\|[^\n]*/gi, '');

    // 위키 표 {| ... |} 제거 (여러 줄/중첩)
    let p;
    do { p = text; text = text.replace(/\{\|[^{]*?\|\}/gs, ''); } while (text !== p);
    text = text.replace(/^\{\|.*$/gm, '');     // 닫히지 않은 표 시작
    text = text.replace(/^\|[-+}].*$/gm, '');  // |- |+ |} 행
    text = text.replace(/^!.*$/gm, '');        // ! 헤더 셀
    text = text.replace(/^\|.*$/gm, '');       // | 데이터 셀 (필드 줄도 겸함)

    // 여러 줄 틀 {{ ... }} 제거 (중첩을 안쪽부터 반복, s플래그로 줄바꿈 포함)
    do { p = text; text = text.replace(/\{\{[^{}]*\}\}/gs, ''); } while (text !== p);
    text = text.replace(/\{\{[^}]*$/gs, '');   // 닫히지 않은 틀 잔재

    text = text.replace(/<br\s*\/?>/gi, ' ');
    text = text.replace(/<[^>]+>/g, '');
    text = text.replace(/={2,}\s*([^=\n]+?)\s*={2,}/g, '\n$1: ');  // ==제목==
    text = text.replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, '$1');
    text = text.replace(/\[\[([^\]]*)\]\]/g, '$1');
    text = text.replace(/'''(.*?)'''/g, '$1');
    text = text.replace(/''(.*?)''/g, '$1');
    text = text.replace(/^\s*\*\s*$/gm, '');
    text = text.replace(/[ \t]+/g, ' ');
    text = text.replace(/\n{3,}/g, '\n\n');
    return text.trim();
}

function removeAppendices(wikitext) {
    let t = wikitext;
    const cutHeadings = ['Appearances', 'Notes and references', 'References', 'Behind the scenes',
        'See also', 'External links', 'Gallery', 'Etymology', 'Notes', 'Sources', 'Trivia', 'Links and References',
        // COD 등 게임 위키에서 RP에 불필요한 섹션
        'Personalization', 'Skins', 'Quips', 'Quotes', 'Transcript', 'Voice quotes', 'Voicelines',
        'Variants', 'Achievements', 'Trophies', 'Videos', 'Audio', 'Charms', 'Camouflages', 'Attachments',
        'Weapon levels', 'Multiplayer', 'Trivia and references'];
    for (const h of cutHeadings) {
        t = t.replace(new RegExp(`\\n=+\\s*${h}\\s*=+[\\s\\S]*$`, 'i'), '');
    }
    // 가변 제목 섹션: "List of Maps Set in ...", "List of ..." 게임맵 목록
    t = t.replace(/\n=+\s*List of Maps[\s\S]*$/i, '');
    t = t.replace(/\[\[Category:[^\]]*\]\]/gi, '');
    t = t.replace(/^[a-z]{2,3}:[^\n]*$/gim, '');
    t = t.replace(/\[\[File:[^\]]*\]\]/gi, '');
    t = t.replace(/^\s*thumb\|.*$/gim, '');
    t = t.replace(/^\s*\*\s*$/gm, '');
    return t;
}

function cleanWikitext(wikitext, fullArticle) {
    if (!wikitext) return '';
    // 동음이의(Disambiguation) 안내 페이지: 실제 설명이 없으므로 안내만
    if (/\{\{\s*Disambig(uation)?/i.test(wikitext) || /may refer to:/i.test(wikitext.slice(0, 200))) {
        return '(이 항목은 여러 대상을 가리키는 안내 페이지예요. 검색창에 더 구체적인 이름을 넣어보세요.)';
    }
    // 마블: 모든 내용이 거대 틀 안에 있음 -> 필드 추출 방식
    let result = (currentWorld === 'marvel') ? cleanMarvel(wikitext, fullArticle) : cleanGeneric(wikitext);
    // 청소 후 내용이 거의 없으면(본문이 통째로 틀/표였던 경우) 안내
    if (result.replace(/[\s:·]/g, '').length < 15) {
        return '(이 항목은 위키에 표/틀 위주로 되어 있어 설명 추출이 어려워요. 검색으로 다른 문서를 시도해 보세요.)';
    }
    return result;
}

// 마블 거대 틀에서 | Field = 값 추출
function extractField(wikitext, field) {
    const re = new RegExp(`\\n\\|\\s*${field}\\s*=\\s*([\\s\\S]*?)(?=\\n\\|\\s*[A-Za-z][A-Za-z0-9]*\\s*=|\\n\\}\\})`);
    const m = wikitext.match(re);
    return m ? m[1].trim() : null;
}

function cleanMarvel(wikitext, fullArticle) {
    // 짧은 핵심 정보 필드 (Origin은 길 수 있어 여기서 제외하고 본문으로 따로 처리)
    const fieldLabels = {
        CurrentAlias: 'Alias', RealName: 'Real name', Gender: 'Gender',
        Identity: 'Identity', Citizenship: 'Citizenship',
        Universe: 'Universe', Species: 'Species', Status: 'Status',
    };
    const fields = [];
    for (const [f, label] of Object.entries(fieldLabels)) {
        const v = extractField(wikitext, f);
        if (v) {
            let c = stripMarkup(v).split('\n')[0].trim();
            if (c && c.length < 100 && !c.includes('{{') && !c.startsWith('*')) {
                fields.push(`${label}: ${c}`);
            }
        }
    }
    // 본문: Origin(긴 설명) 우선. Overview/History도 활용하되 링크목록뿐이면 제외.
    const overview = extractField(wikitext, 'Overview');
    const history = extractField(wikitext, 'History');
    const origin = extractField(wikitext, 'Origin');
    // 내용이 링크 목록(* 항목)뿐이면 본문으로 쓰지 않음
    const isJustLinks = (s) => {
        if (!s) return true;
        const cleaned = stripMarkup(s).trim();
        if (!cleaned) return true;
        const lines = cleaned.split('\n').filter(l => l.trim());
        return lines.length > 0 && lines.every(l => l.trim().startsWith('*') || l.trim().length < 3);
    };
    const ovText = isJustLinks(overview) ? '' : stripMarkup(overview);
    const histText = isJustLinks(history) ? '' : stripMarkup(history);
    const orgText = origin ? stripMarkup(origin) : '';
    let desc = '';
    if (fullArticle) {
        const parts = [];
        if (ovText) parts.push(ovText);
        if (orgText) parts.push('Origin: ' + orgText);
        if (histText) parts.push(histText);
        desc = parts.join('\n\n');
    } else {
        // 요약: Overview가 있으면 그것(일반 캐릭터), 없으면 Origin(종족 등) > History
        desc = ovText || orgText || histText || '';
    }
    let out = '';
    if (fields.length) out += fields.join('\n') + '\n\n';
    out += desc;
    if (!fullArticle && out.length > 4000) out = out.slice(0, 4000).trim() + ' …';
    return out.trim() || stripMarkup(wikitext).slice(0, fullArticle ? 100000 : 800);
}

function cleanGeneric(wikitext) {
    const infoboxFields = [];
    const infoboxMatch = wikitext.match(/\{\{[^\n]*infobox([\s\S]*?)\n\}\}/i);
    if (infoboxMatch) {
        const wanted = ['incantation', 'type', 'light', 'effect', 'creator', 'species',
            'classification', 'difficulty', 'ingredients', 'characteristics', 'alias',
            'status', 'gender', 'born', 'died', 'house', 'loyalty', 'location', 'region',
            'realname', 'aliases', 'affiliation', 'powers', 'abilities', 'origin', 'identity'];
        for (const line of infoboxMatch[1].split('\n')) {
            const fm = line.match(/^\s*\|\s*([a-zA-Z_0-9]+)\s*=\s*(.+)/);
            if (fm && wanted.includes(fm[1].toLowerCase())) {
                const val = stripMarkup(fm[2]);
                if (val) infoboxFields.push(`${fm[1]}: ${val}`);
            }
        }
    }
    let body = removeAppendices(wikitext);
    body = body.replace(/\{\{[^\n]*infobox[\s\S]*?\n\}\}/gi, '');
    body = body.replace(/\{\{(?:w|nowrap|lang|small|nihongo)\|([^{}|]*)\}\}/gi, '$1');
    let prev;
    do { prev = body; body = body.replace(/\{\{[^{}]*\}\}/g, ''); } while (body !== prev);
    body = stripMarkup(body);
    let out = '';
    if (infoboxFields.length) out += infoboxFields.join('\n') + '\n\n';
    out += body;
    return out.trim();
}

// 사용자가 만들어둔 연결 프로필 목록 읽기 ({name, id})
function getConnectionProfiles() {
    try {
        const ctx = SillyTavern.getContext();
        const cm = ctx.extensionSettings?.connectionManager;
        if (cm && Array.isArray(cm.profiles)) {
            return cm.profiles
                .filter(p => p && p.name)
                .map(p => ({ name: p.name, id: p.id }));
        }
    } catch (e) { /* 무시 */ }
    return [];
}

// ------------------------------------------------------------
// 번역 (SillyTavern의 연결 프로필 + genraw 사용)
// ------------------------------------------------------------
let originalText = '';   // 번역 전 원문 (토글용)
let originalTitleText = '';   // 번역 전 제목 (토글용)
let isTranslated = false;

async function translateText() {
    const ta = document.querySelector('#cp-detail .cp-text');
    if (!ta) return;
    const btn = document.getElementById('cp-translate');
    const titleEl = document.querySelector('#cp-detail .cp-detail-title');

    // 이미 번역됨 -> 원문으로 토글
    if (isTranslated) {
        ta.value = originalText;
        if (titleEl && originalTitleText) titleEl.textContent = originalTitleText;
        isTranslated = false;
        btn.textContent = '🌐 번역';
        return;
    }

    const source = ta.value.trim();
    if (!source) return;
    originalText = source;
    btn.textContent = '번역 중...';
    btn.disabled = true;

    const ctx = SillyTavern.getContext();
    const profileId = (cpSettings.translateProfileId || '').trim();
    // 제목 + 본문을 한 번에 번역 (구분자로 나눠서 보냄 → 토큰 절약)
    const titleSrc = currentDetailTitle || '';
    const prompt =
        `Translate the following into natural Korean. Keep the two sections separated by the marker "|||". ` +
        `Output ONLY the Korean translation in the same format, no notes.\n\n` +
        `TITLE: ${titleSrc}\n|||\nBODY: ${source}`;

    try {
        let result = '';
        const svc = ctx.ConnectionManagerRequestService;
        if (profileId && svc && typeof svc.sendRequest === 'function') {
            const res = await svc.sendRequest(profileId, prompt, 2200);
            result = extractText(res);
        }
        else if (!profileId && ctx.generateRaw) {
            const res = await ctx.generateRaw({ prompt, systemPrompt: '' });
            result = extractText(res);
        }
        else if (profileId) {
            toastr.warning('이 SillyTavern 버전은 안전한 프로필 번역을 지원하지 않아, 번역 프로필 설정을 비우고 현재 연결로 번역하세요.');
            btn.textContent = '🌐 번역';
            btn.disabled = false;
            return;
        }

        if (result && result.trim()) {
            // 결과를 제목/본문으로 분리
            const { koTitle, koBody } = splitTranslation(result);
            ta.value = koBody || result.trim();
            // 제목: "원문 (한글번역)" 병기
            if (titleEl && koTitle) titleEl.textContent = `${titleSrc} (${koTitle})`;
            isTranslated = true;
            btn.textContent = '↩ 원문 보기';
        } else {
            toastr.error('번역 결과가 비어 있어요.');
            btn.textContent = '🌐 번역';
        }
    } catch (e) {
        toastr.error('번역 실패: ' + e.message);
        btn.textContent = '🌐 번역';
    } finally {
        btn.disabled = false;
    }
}

// 다양한 응답 형태에서 텍스트 추출
function extractText(res) {
    if (!res) return '';
    if (typeof res === 'string') return res;
    if (res.content) return res.content;
    if (res.text) return res.text;
    if (Array.isArray(res.choices) && res.choices[0]) {
        return res.choices[0].message?.content || res.choices[0].text || '';
    }
    return '';
}

// 번역 결과를 제목/본문으로 분리 (TITLE: ... ||| BODY: ... 형식)
function splitTranslation(result) {
    let koTitle = '', koBody = '';
    const parts = result.split('|||');
    if (parts.length >= 2) {
        koTitle = parts[0].replace(/^\s*(TITLE|제목)\s*[:：]?\s*/i, '').trim();
        koBody = parts[1].replace(/^\s*(BODY|본문|내용)\s*[:：]?\s*/i, '').trim();
    } else {
        // 구분자 없이 왔으면 전체를 본문으로
        koBody = result.replace(/^\s*(BODY|본문)\s*[:：]?\s*/i, '').trim();
    }
    return { koTitle, koBody };
}

// ------------------------------------------------------------
// 화면 전환
// ------------------------------------------------------------
function showWorldSelect() {
    currentWorld = null;
    document.getElementById('cp-world-view').style.display = 'block';
    document.getElementById('cp-list-view').style.display = 'none';
    document.getElementById('cp-detail').style.display = 'none';
}
function showListView() {
    document.getElementById('cp-world-view').style.display = 'none';
    document.getElementById('cp-list-view').style.display = 'block';
    document.getElementById('cp-detail').style.display = 'none';
}

let currentDetailTitle = '';   // 현재 보고 있는 항목의 원래 제목 (전체 가져오기·번역용)
let currentDetailFull = false; // 현재 상세가 전체 모드인지 (요약 토글용)

async function openDetail(title, forceFull) {
    currentDetailTitle = title;
    const full = (forceFull !== undefined) ? forceFull : !!document.getElementById('cp-full')?.checked;
    currentDetailFull = full;
    document.getElementById('cp-list-view').style.display = 'none';
    const detail = document.getElementById('cp-detail');
    detail.style.display = 'flex';

    // 제목 표시 (override에 한글 이름 있으면 "원문 (한글)" 병기)
    const ov = OVERRIDES[title];
    const titleEl = detail.querySelector('.cp-detail-title');
    titleEl.textContent = (ov && ov.title_ko) ? `${title} (${ov.title_ko})` : title;

    detail.querySelector('.cp-img').innerHTML = '';
    // 번역 상태 초기화
    isTranslated = false;
    originalText = '';
    originalTitleText = titleEl.textContent;
    const tbtn = document.getElementById('cp-translate');
    if (tbtn) tbtn.textContent = '🌐 번역';
    // 위키 원문 링크
    const wikiLink = document.getElementById('cp-wiki-link');
    if (wikiLink) wikiLink.href = wikiPageUrl(title);

    const ta = detail.querySelector('.cp-text');
    const fullBtn = document.getElementById('cp-load-full');

    // 1) 개발자 override가 있으면 위키 대신 그 설명 표시
    if (ov && ov.desc) {
        if (ov.img) {
            detail.querySelector('.cp-img').innerHTML = `<img src="${ov.img}" alt="${title}" />`;
        } else {
            const imgUrl = await fetchImage(title);
            if (imgUrl) detail.querySelector('.cp-img').innerHTML = `<img src="${imgUrl}" alt="${title}" />`;
        }
        ta.value = ov.desc;
        if (fullBtn) fullBtn.style.display = 'none';   // override는 전체/요약 버튼 불필요
        return;
    }

    // 2) 일반 위키 항목
    ta.value = '불러오는 중...';
    // 전체 모드면 "요약 보기", 요약 모드면 "전체 가져오기"로 토글
    if (fullBtn) {
        fullBtn.style.display = '';
        fullBtn.textContent = full ? '📑 요약 보기' : '📄 전체 가져오기';
    }
    const [imgUrl, raw] = await Promise.all([fetchImage(title), fetchWikitext(title, full)]);
    if (imgUrl) detail.querySelector('.cp-img').innerHTML = `<img src="${imgUrl}" alt="${title}" />`;
    ta.value = cleanWikitext(raw, full) || '(설명을 찾지 못했어요. 검색으로 다른 제목을 시도해 보세요.)';
}

// 위키 문서 원문 URL 만들기 (api.php -> /wiki/제목)
function wikiPageUrl(title) {
    const base = api().replace(/\/api\.php.*$/, '');
    // 공백->밑줄, 각 경로 조각만 인코딩하고 슬래시(하위문서)는 유지
    const path = title.replace(/ /g, '_').split('/').map(encodeURIComponent).join('/');
    return base + '/wiki/' + path;
}

function renderList(items) {
    const list = document.getElementById('cp-list');
    list.innerHTML = items.map(it =>
        `<div class="cp-item" data-title="${encodeURIComponent(it.title)}">
            <span class="cp-item-title">${it.title}</span>
            ${it.wordcount ? `<span class="cp-meta">${it.wordcount}w</span>` : ''}
        </div>`).join('');
}

// 세계관을 골랐을 때: 카테고리 버튼을 그 세계관 것으로 다시 그림
function enterWorld(worldId) {
    currentWorld = worldId;
    const w = WORLDS[worldId];
    document.getElementById('cp-world-label').textContent = `${w.emoji} ${w.name}`;
    const cats = document.getElementById('cp-cats');
    cats.innerHTML = Object.keys(w.categories).map(label =>
        `<button class="cp-cat menu_button" data-label="${encodeURIComponent(label)}">${label}</button>`).join('');
    // 카테고리 버튼 이벤트
    cats.querySelectorAll('.cp-cat').forEach(btn => {
        btn.addEventListener('click', () => {
            const label = decodeURIComponent(btn.dataset.label);
            cats.querySelectorAll('.cp-cat').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const items = w.categories[label].map(t => ({ title: t }));
            document.getElementById('cp-status').textContent = `${label} — ${items.length}개`;
            renderList(items);
        });
    });
    document.getElementById('cp-status').textContent = '카테고리를 누르거나 검색해 보세요.';
    document.getElementById('cp-list').innerHTML = '';
    document.getElementById('cp-search').value = '';
    showListView();
}

// ------------------------------------------------------------
// 팝업 HTML
// ------------------------------------------------------------
function popupHTML() {
    const worldButtons = Object.entries(WORLDS).map(([id, w]) =>
        `<button class="cp-world menu_button" data-world="${id}">${w.emoji} ${w.name}</button>`).join('');
    return `
    <div id="cp-root">
        <div class="cp-title">
            <span class="cp-title-text">📚 Dalchive</span>
            <button id="cp-close" class="cp-close" title="닫기" type="button">✕</button>
        </div>

        <!-- 세계관 선택 -->
        <div id="cp-world-view">
            <div class="cp-prompt">어떤 세계관이 궁금하신가요?</div>
            <div class="cp-worlds">${worldButtons}</div>
            <div class="cp-profile-row">
                <label>🌐 번역 프로필:
                    <select id="cp-profile-select"></select>
                </label>
                <div class="cp-profile-hint">번역 버튼이 이 프로필의 API로 번역해요. RP 모델과 분리됩니다.</div>
            </div>
        </div>

        <!-- 카테고리/검색 -->
        <div id="cp-list-view" style="display:none;">
            <div class="cp-world-bar">
                <button id="cp-world-back" class="menu_button cp-world-back">↺ 세계관 변경</button>
                <span id="cp-world-label" class="cp-world-label"></span>
            </div>
            <div class="cp-search-row">
                <div class="cp-search-wrap">
                    <input type="text" id="cp-search" placeholder="검색어 (영문)" />
                    <button id="cp-search-clear" class="cp-search-clear" title="검색어 지우기" type="button">✕</button>
                </div>
                <button id="cp-search-btn" class="menu_button">검색</button>
            </div>
            <div class="cp-cats" id="cp-cats"></div>
            <label class="cp-full-label">
                <input type="checkbox" id="cp-full" /> 문서 전체 가져오기 (체크 안 하면 요약만)
            </label>
            <div id="cp-status"></div>
            <div id="cp-list"></div>
        </div>

        <!-- 상세 -->
        <div id="cp-detail" style="display:none;">
            <div class="cp-detail-title"></div>
            <div class="cp-img"></div>
            <textarea class="cp-text" rows="8"></textarea>
            <div class="cp-detail-actions">
                <button id="cp-translate" class="menu_button cp-translate">🌐 번역</button>
                <button id="cp-load-full" class="menu_button cp-load-full">📄 전체 가져오기</button>
                <a id="cp-wiki-link" class="cp-wiki-link" href="#" target="_blank" rel="noopener noreferrer">📖 위키에서 보기 ↗</a>
            </div>
            <button id="cp-back" class="menu_button cp-back">← 목록으로</button>
        </div>
    </div>`;
}

function wirePopup() {
    const root = document.getElementById('cp-root');
    if (!root) return;

    // 세계관 선택 버튼
    root.querySelectorAll('.cp-world').forEach(btn => {
        btn.addEventListener('click', () => enterWorld(btn.dataset.world));
    });

    // 검색
    const doSearch = async () => {
        if (!currentWorld) return;
        const q = document.getElementById('cp-search').value.trim();
        if (!q) return;
        document.getElementById('cp-cats').querySelectorAll('.cp-cat').forEach(b => b.classList.remove('active'));
        const status = document.getElementById('cp-status');
        status.textContent = '검색 중...';
        try {
            const results = await searchWiki(q);
            status.textContent = results.length ? `검색 결과 ${results.length}개` : '결과 없음';
            renderList(results);
        } catch (e) { status.textContent = `검색 실패: ${e.message}`; }
    };
    document.getElementById('cp-search-btn').addEventListener('click', doSearch);
    document.getElementById('cp-search').addEventListener('keydown', e => {
        if (e.key === 'Enter') doSearch();
    });
    // 검색어 초기화 버튼 (4번)
    const searchInput = document.getElementById('cp-search');
    const clearBtn = document.getElementById('cp-search-clear');
    const updateClearBtn = () => { clearBtn.style.display = searchInput.value ? '' : 'none'; };
    searchInput.addEventListener('input', updateClearBtn);
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        updateClearBtn();
        searchInput.focus();
        // 검색 결과를 지우고 현재 카테고리 안내로 복귀
        document.getElementById('cp-list').innerHTML = '';
        document.getElementById('cp-status').textContent = '카테고리를 누르거나 검색해 보세요.';
    });
    updateClearBtn();

    // 항목 클릭
    document.getElementById('cp-list').addEventListener('click', e => {
        const item = e.target.closest('.cp-item');
        if (item) openDetail(decodeURIComponent(item.dataset.title));
    });

    // 뒤로가기들
    document.getElementById('cp-back').addEventListener('click', showListView);
    document.getElementById('cp-world-back').addEventListener('click', showWorldSelect);
    document.getElementById('cp-translate').addEventListener('click', translateText);
    // 우측 상단 ✕ 닫기 버튼
    const closeBtn = document.getElementById('cp-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            try {
                const { POPUP_RESULT } = SillyTavern.getContext();
                if (cpPopup && typeof cpPopup.complete === 'function') {
                    cpPopup.complete(POPUP_RESULT?.CANCELLED ?? 0);
                } else if (cpPopup && typeof cpPopup.completeCancelled === 'function') {
                    cpPopup.completeCancelled();
                } else if (cpPopup && typeof cpPopup.hide === 'function') {
                    cpPopup.hide();
                } else {
                    // 폴백: 팝업 컨테이너를 직접 닫기
                    document.querySelector('.popup:has(#cp-root) .popup-button-close')?.click();
                    document.querySelector('.popup:has(#cp-root) .popup-button-ok')?.click();
                }
            } catch (e) {
                // 최후 폴백: ESC 키로 닫기 시도
                document.querySelector('.popup:has(#cp-root)')?.dispatchEvent(
                    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
                );
            }
        });
    }
    // 전체/요약 토글: 현재가 요약이면 전체로, 전체면 요약으로 다시 연다
    document.getElementById('cp-load-full').addEventListener('click', () => {
        if (currentDetailTitle) openDetail(currentDetailTitle, !currentDetailFull);
    });
    // 번역 프로필 드롭다운 채우기 (value = 프로필 ID)
    const profSelect = document.getElementById('cp-profile-select');
    if (profSelect) {
        const profiles = getConnectionProfiles();
        let opts = '<option value="">(현재 연결 사용)</option>';
        for (const p of profiles) {
            const sel = (p.id === cpSettings.translateProfileId) ? ' selected' : '';
            const safeName = (p.name || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const safeId = (p.id || '').replace(/"/g, '&quot;');
            opts += `<option value="${safeId}"${sel}>${safeName}</option>`;
        }
        profSelect.innerHTML = opts;
        profSelect.addEventListener('change', () => {
            cpSettings.translateProfileId = profSelect.value;
            saveSettings();
        });
    }
}

let cpPopup = null;
async function openPopup() {
    loadSettings();
    const { Popup, POPUP_TYPE } = SillyTavern.getContext();
    cpPopup = new Popup(popupHTML(), POPUP_TYPE.TEXT, '', { wide: true, large: true, okButton: false, allowVerticalScrolling: true });
    cpPopup.show();
    setTimeout(() => { wirePopup(); showWorldSelect(); }, 50);
}

// ------------------------------------------------------------
// 마법봉 메뉴 버튼
// ------------------------------------------------------------
function addWandButton() {
    const menu = document.getElementById('extensionsMenu');
    if (!menu) return false;
    if (document.getElementById('cp-wand-btn')) return true;
    const item = document.createElement('div');
    item.id = 'cp-wand-btn';
    item.classList.add('list-group-item', 'flex-container', 'flexGap5', 'interactable');
    item.tabIndex = 0;
    item.title = 'Dalchive 열기';
    item.innerHTML = `<i class="fa-solid fa-book-bookmark"></i><span>Dalchive</span>`;
    item.addEventListener('click', openPopup);
    menu.appendChild(item);
    return true;
}

jQuery(() => {
    let tries = 0;
    const timer = setInterval(() => {
        if (addWandButton() || ++tries > 20) clearInterval(timer);
    }, 500);
    loadRemoteData();   // 깃허브 원격 데이터 병합 (설정돼 있으면)
    console.log('[Dalchive v0.19] loaded');
});
