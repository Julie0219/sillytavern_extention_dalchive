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
                'Nagini', 'Aberforth Dumbledore', 'Garrick Ollivander', 'Marauders',
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
            '⚔️ Events (주요 사건)': [
                'Battle of Hogwarts', 'First Wizarding War', 'Second Wizarding War',
                'Triwizard Tournament', 'Opening of the Chamber of Secrets',
                'Battle of the Department of Mysteries', 'Battle of the Astronomy Tower',
                'Skirmish at the Lovegood House', 'Attack on the Burrow',
                'Battle of the Seven Potters', 'Quidditch World Cup', "Dumbledore's Army",
                "Marauder's Map", 'Life debt', "Sirius Black's will",
                "Fred and George Weasley's departure from Hogwarts",
            ],
            "🎬 Film Plots (영화별 플롯)": [
                "Harry Potter and the Philosopher's Stone (film)",
                'Harry Potter and the Chamber of Secrets (film)',
                'Harry Potter and the Prisoner of Azkaban (film)',
                'Harry Potter and the Goblet of Fire (film)',
                'Harry Potter and the Order of the Phoenix (film)',
                'Harry Potter and the Half-Blood Prince (film)',
                'Harry Potter and the Deathly Hallows: Part 1',
                'Harry Potter and the Deathly Hallows: Part 2',
            ],
        },
    },

    marvel: {
        name: 'Marvel (MCU)',
        emoji: '🦸',
        api: 'https://marvelcinematicuniverse.fandom.com/api.php',
        categories: {
            '🦸 Heroes (히어로)': [
                'Tony Stark', 'Steve Rogers', 'Thor', 'Bruce Banner',
                'Natasha Romanoff', 'Clint Barton', 'Stephen Strange', 'T\'Challa',
                'Carol Danvers', 'Peter Parker', 'Scott Lang', 'Sam Wilson',
                'Bucky Barnes', 'Wanda Maximoff', 'Vision', 'James Rhodes',
                'Peter Quill', 'Gamora', 'Rocket Raccoon', 'Groot',
                'Drax', 'Nebula', 'Mantis', 'Shang-Chi',
                'Marc Spector', 'Matt Murdock', 'Nick Fury', 'Loki',
                'Wolverine', 'Cyclops', 'Venom',
            ],
            '🦹 Villains (빌런)': [
                'Thanos', 'Loki', 'Ultron', 'Helmut Zemo', 'Wenwu',
                'Hela', 'Killmonger', 'Thunderbolt Ross', 'Red Skull',
                'Ego', 'Kang the Conqueror', 'Quentin Beck', 'Adrian Toomes',
                'Wilson Fisk', 'Kingo', 'Agatha Harkness', 'Mysterio',
                'Green Goblin', 'Doctor Octopus',
            ],
            '👥 Teams (팀·조직)': [
                'Avengers', 'Guardians of the Galaxy', 'S.H.I.E.L.D.', 'HYDRA',
                'Wakandan Royal Family', 'Masters of the Mystic Arts',
                'Ten Rings (Organization)', 'Nova Corps', 'Ravagers',
                'Sokovia Accords', 'Strategic Scientific Reserve',
            ],
            '💎 Items (아이템·유물)': [
                'Infinity Stones', 'Space Stone', 'Mind Stone', 'Reality Stone',
                'Power Stone', 'Time Stone', 'Soul Stone',
                'Infinity Gauntlet', 'Mjolnir', 'Stormbreaker',
                'Captain America\'s Shield', 'Eye of Agamotto', 'Tesseract',
            ],
            '👽 Races (종족)': [
                'Asgardians', 'Eternals', 'Celestials', 'Kree', 'Skrulls',
                'Chitauri', 'Frost Giants', 'Symbiotes', 'Flora colossus',
            ],
            '🌆 Locations (장소)': [
                'Wakanda', 'Asgard', 'Sokovia', 'Knowhere', 'Sakaar',
                'Sanctum Sanctorum', 'Avengers Compound', 'Stark Tower',
                'New York City', 'Titan', 'Vormir', 'Kamar-Taj', 'Quantum Realm', 'Triskelion',
            ],
            '⚔️ Events (주요 사건)': [
                'Battle of New York', 'Battle of Sokovia', 'Avengers Civil War',
                'Snap', 'Blip', 'Battle of Earth', 'Battle of Wakanda',
                'Battle of Titan', 'War on Hydra', 'Battle at the Triskelion',
                'Sokovia Accords', 'Time Heist',
            ],
            '🎬 Film Plots (작품별 플롯)': {
                '🎬 Phase One': [
                    'Iron Man (film)', 'The Incredible Hulk', 'Iron Man 2',
                    'Thor (film)', 'Captain America: The First Avenger', 'The Avengers',
                ],
                '🎬 Phase Two': [
                    'Iron Man 3', 'Thor: The Dark World', 'Captain America: The Winter Soldier',
                    'Guardians of the Galaxy (film)', 'Avengers: Age of Ultron', 'Ant-Man (film)',
                ],
                '🎬 Phase Three': [
                    'Captain America: Civil War', 'Doctor Strange (film)',
                    'Guardians of the Galaxy Vol. 2', 'Spider-Man: Homecoming',
                    'Thor: Ragnarok', 'Black Panther (film)', 'Avengers: Infinity War',
                    'Ant-Man and the Wasp', 'Captain Marvel (film)', 'Avengers: Endgame',
                    'Spider-Man: Far From Home',
                ],
                '🎬 Phase Four': [
                    'Black Widow (film)', 'Shang-Chi and the Legend of the Ten Rings',
                    'Eternals (film)', 'Spider-Man: No Way Home',
                    'Doctor Strange in the Multiverse of Madness', 'Thor: Love and Thunder',
                    'Black Panther: Wakanda Forever',
                ],
                '🎬 Phase Five': [
                    'Ant-Man and the Wasp: Quantumania', 'Guardians of the Galaxy Vol. 3',
                    'The Marvels', 'Deadpool & Wolverine', 'Captain America: Brave New World',
                    'Thunderbolts',
                ],
                '🎬 Phase Six': [
                    'The Fantastic Four: First Steps', 'Avengers: Doomsday',
                    'Spider-Man: Brand New Day', 'Avengers: Secret Wars',
                ],
                '🎬 X-Men · 기타': [
                    'The Wolverine',
                ],
            },
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
                'AK-47', 'M4A1', 'M16', 'AUG', 'MP5', 'M1911', 'Desert Eagle', 'Intervention (weapon)',
                'Barrett .50cal', 'RPG-7', 'Famas', 'Galil', 'Commando (weapon)', 'AK-74u', 'PP90M1',
                'ACR', 'SCAR-H', 'UMP45', 'P90', 'Vector', 'Dragunov', 'Ray Gun', 'Thundergun',
                'Wunderwaffe DG-2', 'Combat Knife', 'Throwing Knife', 'Tomahawk', 'Crossbow',
                'M1 Garand', 'Thompson (weapon)', 'MP40', 'Kar98k', 'PPSh-41', 'Browning M1919',
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
            '🎮 Campaign Plots (캠페인 플롯)': {
                '🎯 Modern Warfare (2019)': [
                    'Fog of War (level)', 'Piccadilly (level)', 'Embedded', 'Proxy War',
                    'Clean House', 'Hunting Party', 'The Embassy', 'Highway of Death',
                    'Hometown', 'The Wolf\'s Den (level)', 'Captive', 'Old Comrades',
                    'Going Dark', 'Into the Furnace',
                ],
                '🎯 Modern Warfare II (2022)': [
                    'Strike (level)', 'Kill or Capture', 'Wetwork (level)', 'Tradecraft',
                    'Borderline', 'Cartel Protection', 'Close Air', 'Hardpoint (level)',
                    'Recon by Fire', 'Violence and Timing', 'El Sin Nombre (level)',
                    'Dark Water', 'Alone (level)', 'Prison Break (Modern Warfare II)',
                    'Hindsight', 'Ghost Team', 'Countdown (Modern Warfare II)',
                ],
                '🎯 Modern Warfare III (2023)': [
                    'Operation 627', 'Precious Cargo', 'Reactor', 'Payload (level)',
                    'Deep Cover', 'Passenger', 'Crash Site (Modern Warfare III)',
                    'Flashpoint', 'Oligarch', 'Highrise (level)', 'Frozen Tundra',
                    'Gora Dam', 'Danger Close (level)', 'Trojan Horse',
                ],
                '👻 Ghosts': [
                    'Ghost Stories', 'Brave New World', 'No Man\'s Land (Ghosts)',
                    'Struck Down', 'Homecoming (Ghosts)', 'Legends Never Die',
                    'Federation Day', 'Birds of Prey (Ghosts)', 'The Hunted', 'Clockwork',
                    'Atlas Falls', 'Into the Deep', 'End of the Line (Ghosts)', 'Sin City',
                    'All or Nothing (Ghosts)', 'Severed Ties', 'Loki', 'The Ghost Killer',
                ],
            },
        },
    },
    residentevil: {
        name: 'Resident Evil / Biohazard',
        emoji: '🧟',
        api: 'https://residentevil.fandom.com/api.php',
        categories: {
            '👤 Characters (인물)': [
                'Leon Scott Kennedy', 'Chris Redfield', 'Jill Valentine', 'Claire Redfield',
                'Ada Wong', 'Albert Wesker', 'Rebecca Chambers', 'Barry Burton',
                'Carlos Oliveira', 'Sherry Birkin', 'William Birkin', 'Annette Birkin',
                'Ashley Graham', 'Jack Krauser', 'Luis Sera', 'Ramon Salazar',
                'Osmund Saddler', 'HUNK', 'Ethan Winters', 'Mia Winters',
                'Alcina Dimitrescu', 'Karl Heisenberg', 'Sheva Alomar', 'Helena Harper',
                'Ozwell E. Spencer', 'James Marcus',
            ],
            '🧟 Creatures & B.O.W. (크리처)': [
                'Tyrant', 'Nemesis-T Type', 'Zombie', 'Hunter', 'Cerberus',
                'Licker', 'Crimson Head', 'Chimera', 'Ustanak', 'Regenerador',
                'Plaga', 'Ganado',
            ],
            '🏢 Organizations (조직)': [
                'Umbrella Corporation', 'S.T.A.R.S.', 'B.S.A.A.', 'Tricell',
                'Division of Security Operations', 'Raccoon City Police Department',
                'Neo Umbrella', 'Blue Umbrella', 'Los Iluminados',
            ],
            '🧬 Viruses & Pathogens (바이러스·병원체)': [
                't-Virus', 'G-Virus', 't-Veronica', 'Uroboros', 'C-Virus',
                'Las Plagas', 'Cadou', 'Megamycete', 'NE-α Type',
            ],
            '🗺️ Locations (장소)': [
                'Raccoon City', 'Spencer Mansion', 'Arklay Mountains',
                'Tall Oaks', 'Tall Oaks Church', 'Terragrigia', 'Baker Estate', 'Rockfort Island',
            ],
            '⚔️ Events (주요 사건)': [
                'Raccoon City Destruction Incident', 'Mansion Incident',
                'Kijuju Autonomous Zone Incident', 'Terragrigia Panic', 'Lanshiang outbreak',
                'Harvardville Airport incident',
                'Raid on the Spencer Estate', 'Rockfort Island Incident',
                'Sheena Island Incident', 'Sushestvovanie Island incident',
            ],
            '🎮 Game Plots (게임별 플롯)': [
                'Resident Evil', 'Resident Evil 2', 'Resident Evil 3: Nemesis',
                'Resident Evil CODE:Veronica', 'Resident Evil 4 (2023 game)/plot',
                'Resident Evil 5', 'Resident Evil 6', 'Resident Evil 7: Biohazard',
                'Resident Evil Village',
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
                // 트리(객체) 카테고리엔 원격 추가를 건너뜀 (배열만 지원)
                if (!Array.isArray(existing)) continue;
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

// 위키텍스트에서 특정 섹션(헤딩 매칭)의 본문을 잘라냄. 헤딩 포함해서 반환.
function extractSection(wikitext, matchFn) {
    // == Heading == 또는 === Heading === 등 모든 레벨. 다음 같은/상위 레벨 헤딩 전까지.
    const headingRe = /^(={2,6})\s*([^=\n][^=\n]*?)\s*\1\s*$/gm;
    const heads = [];
    let m;
    while ((m = headingRe.exec(wikitext)) !== null) {
        heads.push({ level: m[1].length, name: m[2].replace(/<[^>]+>/g, '').trim(), start: m.index, after: headingRe.lastIndex });
    }
    for (let i = 0; i < heads.length; i++) {
        if (matchFn(heads[i].name.toLowerCase())) {
            // 다음 헤딩(레벨 무관)까지를 섹션 본문으로 — 단 하위 헤딩은 포함
            const myLevel = heads[i].level;
            let end = wikitext.length;
            for (let j = i + 1; j < heads.length; j++) {
                if (heads[j].level <= myLevel) { end = heads[j].start; break; }
            }
            return wikitext.slice(heads[i].start, end);
        }
    }
    return null;
}

async function fetchWikitext(title, fullArticle, depth = 0) {
    // --- 전체 문서를 한 번에 받아온다 (섹션/플롯 추출은 로컬에서 처리) ---
    let raw = '';
    try {
        const data = await apiGet(`action=parse&page=${encodeTitle(title)}&prop=wikitext`);
        raw = data?.parse?.wikitext?.['*'] ?? '';
    } catch (e) { raw = ''; }
    // 리다이렉트 따라가기
    const rd = raw.match(/^#REDIRECT\s*\[\[([^\]|#]+)/i) || raw.match(/^#REDIRECT\s+(.+)$/im);
    if (rd && depth < 2) return fetchWikitext(rd[1].trim(), fullArticle, depth + 1);

    if (fullArticle) return raw;  // 전체 가져오기: 그대로

    // 제목 자체가 "/plot" 하위문서면 문서 전체가 줄거리 → 통째로 정리
    if (/\/plot$/i.test(title)) {
        return raw ? '\u0001PLOTSUB\u0001' + raw : '';
    }

    // --- 요약 보기 ---
    // 0) "제목/plot" 하위문서가 있으면 그게 가장 상세한 줄거리 (RE 위키 등)
    if (depth === 0) {
        try {
            const sub = await apiGet(`action=parse&page=${encodeTitle(title + '/plot')}&prop=wikitext`);
            const subRaw = sub?.parse?.wikitext?.['*'] ?? '';
            if (subRaw && subRaw.trim().length > 80 && !/^#REDIRECT/i.test(subRaw.trim())) {
                return '\u0001PLOTSUB\u0001' + subRaw;
            }
        } catch (e) { /* 없음 → 진행 */ }
    }
    if (!raw) return '';

    // 1) Plot 섹션을 로컬에서 추출 (Plot 최우선 → Synopsis/Story → Summary)
    let section = extractSection(raw, n => n === 'plot')
        || extractSection(raw, n => n.includes('plot'))
        || extractSection(raw, n => n === 'synopsis' || n === 'story')
        || extractSection(raw, n => n === 'summary')
        || extractSection(raw, n => n.includes('synopsis'));
    if (section && section.trim()) return '\n' + section;

    // 2) Plot류 섹션이 없음 → 문서 전체를 cleanGeneric에 넘김.
    //    cleanGeneric이 인포박스 필드(주문/마법약 등)와 본문을 정상 추출함.
    //    (PLOTSUB로 보내면 인포박스가 통째로 날아가 '표/틀 위주' 오류가 남 — 그래서 raw 그대로)
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
// [[File:...]] / [[Image:...]]를 균형 카운팅으로 제거 (중첩 [[ ]] 무제한 대응)
function removeFileLinks(text) {
    let result = '';
    let i = 0;
    while (i < text.length) {
        if (/^\[\[(?:File|Image):/i.test(text.slice(i, i + 8))) {
            let depth = 0, j = i;
            while (j < text.length) {
                if (text.startsWith('[[', j)) { depth++; j += 2; }
                else if (text.startsWith(']]', j)) { depth--; j += 2; if (depth === 0) break; }
                else j++;
            }
            i = j;
        } else {
            result += text[i]; i++;
        }
    }
    return result;
}

function stripMarkup(text) {
    if (!text) return '';
    text = text.replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, '');
    text = text.replace(/<ref[^>]*\/>/g, '');
    text = text.replace(/\{\{r\|[^}]*\}\}/gi, '');       // 마블 참조 {{r|...}}
    text = text.replace(/\{\{cl\|[^}]*\}\}/gi, '');      // 마블 참조 {{cl|...}}
    text = text.replace(/\{\{citation\}\}/gi, '');
    // 카테고리 / 인터위키 링크 제거 (본문 노출 방지)
    text = text.replace(/\[\[Category:[^\]]*\]\]/gi, '');
    text = text.replace(/\[\[[a-z]{2}(?:-[a-z]+)?:[^\]]*\]\]/g, '');  // [[pt-br:..]] [[zh:..]] 등
    // 줄 단독 인터위키 (알려진 언어코드만 — 본문 오제거 방지)
    text = text.replace(/^(?:ar|bg|ca|cs|da|de|el|en|es|fa|fi|fr|he|hu|id|it|ja|ko|nl|no|pl|pt|pt-br|ro|ru|sv|th|tr|uk|vi|zh|zh-tw)\s*:[^\n]*$/gim, '');
    // 이미지: [[File:...]] / [[Image:...]] 통째 제거 — 균형 카운팅으로 중첩 무제한 대응
    text = removeFileLinks(text);
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
    // 외부 링크: [http://... 표시텍스트] -> 표시텍스트만 (URL 노출 방지)
    text = text.replace(/\[(?:https?:|\/\/)\S+\s+([^\]]+)\]/gi, '$1');
    // 표시텍스트 없는 외부 링크 [http://...] -> 통째 제거
    text = text.replace(/\[(?:https?:|\/\/)\S+\]/gi, '');
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
        'Weapon levels', 'Multiplayer', 'Trivia and references',
        // COD 레벨 문서: 줄거리 외 게임플레이 섹션
        'Walkthrough', 'Weapons', 'Loadout', 'Loadouts', 'Starting Loadout', 'Intel',
        'Objectives', 'Enemies', 'Featured Weapons', 'Weapons and Equipment', 'Characters'];
    for (const h of cutHeadings) {
        t = t.replace(new RegExp(`\\n=+\\s*${h}\\s*=+[\\s\\S]*$`, 'i'), '');
    }
    // 가변 제목 섹션: "List of Maps Set in ...", "List of ..." 게임맵 목록
    t = t.replace(/\n=+\s*List of Maps[\s\S]*$/i, '');
    t = t.replace(/\[\[Category:[^\]]*\]\]/gi, '');
    t = t.replace(/^[a-z]{2,3}:[^\n]*$/gim, '');
    t = removeFileLinks(t);
    t = t.replace(/^\s*thumb\|.*$/gim, '');
    t = t.replace(/^\s*\*\s*$/gm, '');
    return t;
}

function cleanWikitext(wikitext, fullArticle) {
    if (!wikitext) return '';
    // /plot 하위문서 마커: 문서 전체가 줄거리이므로 섹션 추출 없이 통째로 정리
    if (wikitext.startsWith('\u0001PLOTSUB\u0001')) {
        const body = wikitext.slice('\u0001PLOTSUB\u0001'.length);
        const cleaned = stripMarkup(removeAppendices(body)).trim();
        if (cleaned.replace(/[\s:·]/g, '').length < 15) {
            return '(이 항목은 위키에 표/틀 위주로 되어 있어 설명 추출이 어려워요. 검색으로 다른 문서를 시도해 보세요.)';
        }
        return cleaned;
    }
    // 동음이의(Disambiguation) 안내 페이지: 실제 설명이 없으므로 안내만
    if (/\{\{\s*Disambig/i.test(wikitext) || /\b(?:may|can)\s+refer to:/i.test(wikitext.slice(0, 300))) {
        return '(이 항목은 여러 대상을 가리키는 안내 페이지예요. 검색창에 더 구체적인 이름을 넣어보세요.)';
    }
    // 마블: 캐릭터/종족 등은 거대 틀(Marvel Database) 안에 내용이 있음 -> 필드 추출.
    // 마블(MCU 위키)은 {{Character}}/{{Movie}} 등 일반 인포박스+산문 구조라 cleanGeneric으로 처리.
    // (구 코믹스 위키의 {{Marvel Database:}} 거대 틀이 있으면 cleanMarvel로 분기 — 하위호환용)
    const isMarvelTemplate = /\{\{Marvel Database:/i.test(wikitext);
    let result = (currentWorld === 'marvel' && isMarvelTemplate)
        ? cleanMarvel(wikitext, fullArticle)
        : cleanGeneric(wikitext, fullArticle);
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

// 인포박스 틀 전체를 균형 카운팅으로 정확히 추출 (내부 {{...}}, [[...]] 무관).
// 'infobox' 이름이 든 틀을 우선, 없으면 문서 맨 앞의 첫 틀을 반환.
function extractInfoboxTemplate(wikitext) {
    // 인포박스 틀 시작 위치 찾기
    let start = -1;
    // 1순위: '{{... infobox ...' (대소문자 무관, 슬래시 포함 — {{Infobox/character}})
    const ibNamed = wikitext.match(/\{\{[^\n}]*infobox/i);
    if (ibNamed) start = ibNamed.index;
    if (start < 0) {
        // 2순위: 문서 맨 앞쪽의 첫 다중행 틀 ({{Spell, {{Individual infobox, {{Movie 등)
        // 단 hatnote성 틀({{Quote, {{For, {{CharHub 등)은 건너뜀
        const re = /\{\{([A-Za-z][^\n|}]*)/g;
        let m;
        while ((m = re.exec(wikitext)) !== null) {
            const name = m[1].trim().toLowerCase();
            if (/^(quote|for|about|main|see also|redirect|youmay|otheruses|spoiler|tt|game|articletype|remake|cite|r|cl|dialogue|charhub|displaytitle|infobox list|alias)/.test(name)) continue;
            // 이 틀을 균형 카운팅으로 잘라 내부에 '|field =' 줄이 2개 이상이면 인포박스로 간주
            const tpl = balancedTemplate(wikitext, m.index);
            if (tpl && (tpl.match(/\n\s*\|[^\n=]*=/g) || []).length >= 2) { start = m.index; break; }
            if (m.index > 2500) break; // 너무 뒤면 포기
        }
    }
    if (start < 0) return null;
    return balancedTemplate(wikitext, start);
}

// 주어진 위치에서 시작하는 {{...}} 틀을 균형 카운팅으로 잘라 반환
function balancedTemplate(text, start) {
    if (!text.startsWith('{{', start)) return null;
    let depth = 0, i = start;
    for (; i < text.length; i++) {
        if (text.startsWith('{{', i)) { depth++; i++; }
        else if (text.startsWith('}}', i)) { depth--; i++; if (depth === 0) { i++; break; } }
    }
    return text.slice(start, i);
}

// 인포박스 틀 텍스트에서 의미있는 필드만 추출. 멀티라인 값/ref/gallery/convert 처리.
function parseInfoboxFields(ibText) {
    const wanted = {
        incantation: 'incantation', type: 'type', light: 'light', effect: 'effect',
        creator: 'creator', species: 'species', classification: 'classification',
        alias: 'alias', status: 'status', gender: 'gender', sex: 'gender',
        born: 'born', died: 'died', house: 'house', loyalty: 'loyalty',
        nationality: 'nationality', blood: 'blood', occupation: 'occupation',
        title: 'title', rank: 'rank', affiliation: 'affiliation', affiliations: 'affiliation',
        wand: 'wand', patronus: 'patronus', boggart: 'boggart', 'real name': 'real name',
        'jp name': null, family: 'family', age: 'age', height: 'height',
        first: 'first appearance', last: 'last appearance', aka: 'aka',
        'date of birth': 'born', hair: 'hair', eyes: 'eyes',
    };
    // 틀 내부를 |로 분할 (단 [[..]], {{..}} 안의 |는 보호)
    const inner = ibText.replace(/^\{\{[^\n|]*/, '').replace(/\}\}\s*$/, '');
    const parts = [];
    let depth = 0, buf = '';
    for (let i = 0; i < inner.length; i++) {
        const c = inner[i];
        if (inner.startsWith('{{', i) || inner.startsWith('[[', i)) { depth++; buf += inner.substr(i, 2); i++; continue; }
        if (inner.startsWith('}}', i) || inner.startsWith(']]', i)) { depth--; buf += inner.substr(i, 2); i++; continue; }
        if (c === '|' && depth === 0) { parts.push(buf); buf = ''; continue; }
        buf += c;
    }
    if (buf) parts.push(buf);

    const out = [];
    for (const part of parts) {
        const eq = part.indexOf('=');
        if (eq < 0) continue;
        const key = part.slice(0, eq).trim().toLowerCase();
        if (!(key in wanted) || wanted[key] === null) continue;
        const label = wanted[key];
        // 값 정리: <gallery> 통째 제거, <ref> 제거, 그 후 stripMarkup
        let val = part.slice(eq + 1);
        val = val.replace(/<gallery[\s\S]*?<\/gallery>/gi, '');
        val = val.replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '').replace(/<ref[^>]*\/>/gi, '');
        val = val.replace(/\{\{[Cc]onvert\s*\|\s*([^|}]*)\|([^|}]*)[^}]*\}\}/g, '$1$2'); // {{convert|181|cm}} -> 181cm
        val = val.replace(/<!--[\s\S]*?-->/g, '');
        val = stripMarkup(val);
        // 목록형(여러 줄/별표)은 첫 줄만, 너무 길면 자름
        let lines = val.split('\n').map(s => s.replace(/^\s*[*#]+\s*/, '').trim()).filter(Boolean);
        if (!lines.length) continue;
        let v = lines[0];
        // 여러 항목이면 처음 2~3개를 쉼표로
        if (lines.length > 1 && lines.length <= 4 && lines.every(l => l.length < 40)) {
            v = lines.join(', ');
        }
        v = v.replace(/\}+\s*$/, '').replace(/\s{2,}/g, ' ').trim();
        if (v && v.length <= 120) out.push(`${label}: ${v}`);
    }
    return out;
}

function cleanGeneric(wikitext, fullArticle) {
    // 미션/사건/영화 문서: Plot 섹션을 최우선으로, 없으면 Synopsis/Summary/Story/Overview 순.
    // (영화 문서는 Synopsis(짧은 소개)와 Plot(실제 줄거리)이 둘 다 있는 경우가 많아,
    //  Plot을 먼저 잡아야 진짜 줄거리가 나옴)
    let plotMatch = wikitext.match(/\n==+\s*Plot\s*==+\s*([\s\S]*?)(?=\n==[^=]|$)/i)
        || wikitext.match(/\n==+\s*(?:Synopsis|Summary|Story|Overview)\s*==+\s*([\s\S]*?)(?=\n==[^=]|$)/i);
    if (plotMatch) {
        const plot = stripMarkup(plotMatch[1]).trim();
        // 요약 모드: Plot(줄거리)만 보여줌 (감독·개봉일 등 도입부 메타정보는 전체보기에서)
        if (!fullArticle && plot) {
            return plot;
        }
        // 전체 모드: 도입부 + Plot
        let intro = wikitext.split(/\n==[^=]/)[0];
        intro = intro.replace(/\{\{[^\n]*infobox[\s\S]*?\n\}\}/gi, '');
        intro = intro.replace(/\{\{(?:For|Quote|About|Main|See also|Redirect|game)\b[^{}]*(?:\{\{[^{}]*\}\}[^{}]*)*\}\}/gi, '');
        let ip;
        do { ip = intro; intro = intro.replace(/\{\{[^{}]*\}\}/g, ''); } while (intro !== ip);
        intro = stripMarkup(intro).trim();
        let combined = (intro && plot) ? (intro + '\n\n' + plot) : (plot || intro);
        return combined.trim();
    }

    // --- 인포박스 필드 추출 (모든 세계관 위키 대응) ---
    // 1) 'infobox' 단어가 든 틀이 있으면 그 틀을, 없으면 문서 맨 앞 첫 틀을 인포박스로 간주.
    //    균형 카운팅으로 틀 전체를 정확히 잘라냄(내부 {{convert}}, [[File:]], <gallery> 무관).
    const ibRaw = extractInfoboxTemplate(wikitext);
    const infoboxFields = ibRaw ? parseInfoboxFields(ibRaw) : [];
    // MCU 위키 인포박스({{Character / {{Movie 등)에서 director/release 등 추가 발췌
    if (ibRaw) {
        const mcuLabels = { director: 'Director', release: 'Release', runtime: 'Runtime' };
        for (const [field, label] of Object.entries(mcuLabels)) {
            const m = ibRaw.match(new RegExp(`\\n\\|\\s*${field}\\s*=\\s*([^\\n]*)`, 'i'));
            if (m) {
                const v = stripMarkup(m[1]).replace(/\}+\s*$/, '').trim();
                if (v && v.length <= 80 && !v.includes('*') && !infoboxFields.some(f => f.startsWith(label)))
                    infoboxFields.push(`${label}: ${v}`);
            }
        }
    }
    let body = removeAppendices(wikitext);
    // 추출한 인포박스 틀을 본문에서 제거 (필드는 위에서 이미 발췌함)
    if (ibRaw) body = body.replace(ibRaw, '');
    body = body.replace(/\{\{[^\n]*infobox[\s\S]*?\n\}\}/gi, '');
    // 요약 모드: 본문은 도입부(첫 == 헤딩 전)만. 전체 모드: 본문 전체.
    if (!fullArticle) {
        body = body.split(/\n==[^=]/)[0];
    }
    // {{For|...}} {{Quote|...}} 등 hatnote/인용 템플릿은 본문에서 제거
    body = body.replace(/\{\{(?:For|Quote|About|Main|See also|Redirect)\b[^{}]*(?:\{\{[^{}]*\}\}[^{}]*)*\}\}/gi, '');
    // {{Nihongo|영어|일본어|로마자|...}} -> 첫 인자(영어 이름)만 남김
    body = body.replace(/\{\{[Nn]ihongo\s*\|\s*([^{}|]*)\|[^{}]*\}\}/g, '$1');
    body = body.replace(/\{\{(?:w|nowrap|lang|small)\|([^{}|]*)\}\}/gi, '$1');
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

// 표시용 제목: "/plot" 하위문서나 "(2023 game)" 같은 디스앰비 꼬리표를 떼어 깔끔하게
function displayTitle(title) {
    return title
        .replace(/\/plot$/i, '')
        .replace(/\s*\((?:\d{4}\s*)?(?:game|film|level|video game|\d{4}\s*game)\)\s*$/i, '')
        .replace(/\s*\(Modern Warfare[^)]*\)\s*$/i, '')
        .replace(/\s*\(Ghosts\)\s*$/i, '')
        .replace(/\s*\(Event\)\s*$/i, '')
        .replace(/\s*\(level\)\s*$/i, '')
        .trim();
}

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
    titleEl.textContent = (ov && ov.title_ko) ? `${displayTitle(title)} (${ov.title_ko})` : displayTitle(title);

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
    list.innerHTML = items.map(it => {
        if (it.group) {
            // 드릴다운(시리즈) 항목 — 클릭하면 하위 미션 목록으로
            return `<div class="cp-item cp-group" data-group="${encodeURIComponent(it.title)}">
                <span class="cp-item-title">${it.title}</span>
                <span class="cp-meta">${it.count}개 ›</span>
            </div>`;
        }
        return `<div class="cp-item" data-title="${encodeURIComponent(it.title)}">
            <span class="cp-item-title">${displayTitle(it.title)}</span>
            ${it.wordcount ? `<span class="cp-meta">${it.wordcount}w</span>` : ''}
        </div>`;
    }).join('');
}

// 2단계 트리용: 시리즈(그룹) 목록 렌더 + 뒤로 상태
let currentGroupBack = null;  // { label, groups } — 미션 목록에서 시리즈 목록으로 돌아가기 위함

function renderGroupList(label, groupsObj) {
    currentGroupBack = { label, groupsObj };
    const items = Object.entries(groupsObj).map(([name, arr]) => ({
        group: true, title: name, count: arr.length,
    }));
    document.getElementById('cp-status').textContent = `${label} — 시리즈를 선택하세요`;
    renderList(items);
}

function renderMissionList(label, seriesName, missions) {
    const items = missions.map(t => ({ title: t }));
    document.getElementById('cp-status').innerHTML =
        `<button class="cp-series-back menu_button" type="button">‹ 시리즈 목록</button> ${seriesName} — ${items.length}개`;
    renderList(items);
    const back = document.querySelector('.cp-series-back');
    if (back && currentGroupBack) {
        back.addEventListener('click', () =>
            renderGroupList(currentGroupBack.label, currentGroupBack.groupsObj));
    }
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
            const val = w.categories[label];
            // 카테고리 값이 객체면 2단계 트리(시리즈 → 미션), 배열이면 평면 목록
            if (val && !Array.isArray(val) && typeof val === 'object') {
                renderGroupList(label, val);
            } else {
                currentGroupBack = null;
                const items = val.map(t => ({ title: t }));
                document.getElementById('cp-status').textContent = `${label} — ${items.length}개`;
                renderList(items);
            }
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
        const group = e.target.closest('.cp-group');
        if (group && currentGroupBack) {
            const name = decodeURIComponent(group.dataset.group);
            const missions = currentGroupBack.groupsObj[name] || [];
            renderMissionList(currentGroupBack.label, name, missions);
            return;
        }
        const item = e.target.closest('.cp-item');
        if (item && item.dataset.title) openDetail(decodeURIComponent(item.dataset.title));
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
    console.log('[Dalchive v2.3] loaded');
});
