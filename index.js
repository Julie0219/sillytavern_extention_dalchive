// ============================================================
// Dalchive  v0.14.0  (다세계관 아카이브)
// - 마법봉 메뉴 -> 팝업
// - 먼저 세계관 선택 (Harry Potter / Marvel ...)
// - 선택한 세계관의 위키에서 카테고리 둘러보기 + 검색 + 이미지
// - 세계관별 위키 주소/카테고리/항목만 다르고 나머지 로직은 공통
// ============================================================

// ------------------------------------------------------------
// 세계관 정의
// ★ 세계관 추가: 아래 WORLDS에 { name, emoji, api, categories } 한 덩어리 추가
// ★ 항목 추가: 해당 세계관 categories의 배열에 '위키 문서 제목', 한 줄 추가
//   (정확한 제목을 모르면 확장에서 검색 후 결과 제목을 복사)
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
                'Guardians of the Galaxy (Earth-616)', 'S.H.I.E.L.D. (Earth-616)', 'HYDRA (Earth-616)',
                'Defenders (Earth-616)', 'Inhumans (Earth-616)', 'Brotherhood of Mutants (Earth-616)',
                'Sinister Six (Earth-616)', 'Thunderbolts (Earth-616)', 'Nova Corps (Earth-616)',
            ],
            '💎 Items (아이템·유물)': [
                'Infinity Gems', 'Mjolnir', "Captain America's Shield", 'Iron Man Armor',
                'Cosmic Cube', 'Eye of Agamotto', 'Web-Shooters', 'Adamantium', 'Vibranium',
                'Infinity Gauntlet',
            ],
            '👽 Races (종족)': [
                'Mutants', 'Asgardians', 'Inhumans', 'Skrulls', 'Kree', 'Eternals (Earth-616)',
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
                'John Price', 'Simon "Ghost" Riley', 'John "Soap" MacTavish', 'Yuri',
                'Vladimir Makarov', 'Khaled Al-Asad', 'Imran Zakhaev', 'Alex Mason',
                'Frank Woods', 'Viktor Reznov', 'Raul Menendez', 'Jason Hudson',
                'Edward Richtofen', 'Tank Dempsey', 'Nikolai Belinski', 'Takeo Masaki',
                'Gabriel Rorke', 'Logan Walker', 'Jonathan Irons', 'Captain MacMillan',
                'Gaz', 'Roach', 'Sandman', 'Kamarov', 'Nikolai',
            ],
            '🏴 Factions (세력)': [
                'Task Force 141', 'Spetsnaz', 'Ultranationalists', 'SAS',
                'Marines', 'Delta Force', 'Navy SEALs', 'Inner Circle', 'Cordis Die',
                'Atlas Corporation', 'Sentinel Task Force', 'Federation', 'CIA',
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
            '🗺️ Maps (맵)': [
                'Nuketown', 'Nuketown 2025', 'Highrise', 'Terminal', 'Rust', 'Shipment',
                'Crash', 'Crossfire', 'Backlot', 'Vacant', 'Favela', 'Scrapyard', 'Estate',
                'Summit', 'Firing Range', 'Hijacked', 'Raid', 'Standoff', 'Der Riese',
                'Kino der Toten', 'Shi No Numa', 'Nacht der Untoten', 'Verruckt', 'Ascension',
                'Moon', 'Origins', 'Mob of the Dead',
            ],
        },
    },
};

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

async function fetchWikitext(title, fullArticle, depth = 0) {
    let p = `action=parse&page=${encodeURIComponent(title)}&prop=wikitext`;
    if (!fullArticle) p += '&section=0';
    const data = await apiGet(p);
    const raw = data?.parse?.wikitext?.['*'] ?? '';
    const rd = raw.match(/^#REDIRECT\s*\[\[([^\]|#]+)/i) || raw.match(/^#REDIRECT\s+(.+)$/im);
    if (rd && depth < 2) return fetchWikitext(rd[1].trim(), fullArticle, depth + 1);
    return raw;
}

async function fetchImage(title) {
    try {
        const data = await apiGet(`action=query&prop=pageimages&titles=${encodeURIComponent(title)}&pithumbsize=300&redirects=1`);
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
        'See also', 'External links', 'Gallery', 'Etymology', 'Notes', 'Sources', 'Trivia', 'Links and References'];
    for (const h of cutHeadings) {
        t = t.replace(new RegExp(`\\n=+\\s*${h}\\s*=+[\\s\\S]*$`, 'i'), '');
    }
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
    // RP에 유용하고 짧은 핵심 정보만 (Affiliation 등 길고 복잡한 필드는 제외)
    const fieldLabels = {
        CurrentAlias: 'Alias', RealName: 'Real name', Gender: 'Gender',
        Origin: 'Origin', Identity: 'Identity', Citizenship: 'Citizenship',
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
    // 전체 모드면 Overview + History 둘 다, 아니면 Overview(없으면 History)
    let desc = '';
    const overview = extractField(wikitext, 'Overview');
    const history = extractField(wikitext, 'History');
    if (fullArticle) {
        if (overview) desc += stripMarkup(overview);
        if (history) desc += (desc ? '\n\n' : '') + stripMarkup(history);
    } else {
        desc = stripMarkup(overview || history || '');
    }
    let out = '';
    if (fields.length) out += fields.join('\n') + '\n\n';
    out += desc;
    // 요약 모드에서만 과도하게 길면 잘라줌 (전체 모드는 안 자름)
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
let isTranslated = false;

async function translateText() {
    const ta = document.querySelector('#cp-detail .cp-text');
    if (!ta) return;
    const btn = document.getElementById('cp-translate');

    // 이미 번역됨 -> 원문으로 토글
    if (isTranslated) {
        ta.value = originalText;
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
    const prompt = `Translate the following text into natural Korean. Output ONLY the Korean translation, with no notes or commentary.\n\n${source}`;

    try {
        let result = '';

        // 방법 1 (권장): ConnectionManagerRequestService
        //   -> 전역 연결을 바꾸지 않고 지정 프로필로 단발 요청. RP 세션 안전.
        const svc = ctx.ConnectionManagerRequestService;
        if (profileId && svc && typeof svc.sendRequest === 'function') {
            const res = await svc.sendRequest(profileId, prompt, 2000);
            result = extractText(res);
        }
        // 방법 2 (폴백): 프로필 미지정 시 현재 연결로 generateRaw
        //   -> 이때도 전역 연결을 바꾸지 않음 (현재 연결 그대로 사용)
        else if (!profileId && ctx.generateRaw) {
            const res = await ctx.generateRaw({ prompt, systemPrompt: '' });
            result = extractText(res);
        }
        // 프로필은 지정됐는데 서비스가 없는 구버전 -> 안내 (RP 보호 위해 프로필 전환 안 함)
        else if (profileId) {
            toastr.warning('이 SillyTavern 버전은 안전한 프로필 번역을 지원하지 않아, 번역 프로필 설정을 비우고 현재 연결로 번역하세요.');
            btn.textContent = '🌐 번역';
            btn.disabled = false;
            return;
        }

        if (result && result.trim()) {
            ta.value = result.trim();
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

async function openDetail(title) {
    const full = document.getElementById('cp-full')?.checked;
    document.getElementById('cp-list-view').style.display = 'none';
    const detail = document.getElementById('cp-detail');
    detail.style.display = 'flex';
    detail.querySelector('.cp-detail-title').textContent = title;
    detail.querySelector('.cp-img').innerHTML = '';
    // 번역 상태 초기화
    isTranslated = false;
    originalText = '';
    const tbtn = document.getElementById('cp-translate');
    if (tbtn) tbtn.textContent = '🌐 번역';
    // 위키 원문 링크 설정 (도메인 + /wiki/제목)
    const wikiLink = document.getElementById('cp-wiki-link');
    if (wikiLink) wikiLink.href = wikiPageUrl(title);
    const ta = detail.querySelector('.cp-text');
    ta.value = '불러오는 중...';
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
        <div class="cp-title">📚 Dalchive</div>

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
                <input type="text" id="cp-search" placeholder="검색어 (영문)" />
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
            <button id="cp-back" class="menu_button cp-back">← 목록으로</button>
            <div class="cp-detail-title"></div>
            <div class="cp-img"></div>
            <textarea class="cp-text" rows="8"></textarea>
            <div class="cp-detail-actions">
                <button id="cp-translate" class="menu_button cp-translate">🌐 번역</button>
                <a id="cp-wiki-link" class="cp-wiki-link" href="#" target="_blank" rel="noopener noreferrer">📖 위키에서 보기 ↗</a>
            </div>
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

    // 항목 클릭
    document.getElementById('cp-list').addEventListener('click', e => {
        const item = e.target.closest('.cp-item');
        if (item) openDetail(decodeURIComponent(item.dataset.title));
    });

    // 뒤로가기들
    document.getElementById('cp-back').addEventListener('click', showListView);
    document.getElementById('cp-world-back').addEventListener('click', showWorldSelect);
    document.getElementById('cp-translate').addEventListener('click', translateText);
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

async function openPopup() {
    loadSettings();
    const { Popup, POPUP_TYPE } = SillyTavern.getContext();
    const popup = new Popup(popupHTML(), POPUP_TYPE.TEXT, '', { wide: true, large: true, okButton: '닫기' });
    popup.show();
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
    console.log('[Dalchive v0.14] loaded');
});
