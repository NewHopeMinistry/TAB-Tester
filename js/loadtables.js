async function loadVersions() {

    let i = 0;
    let nonEnglish = true;
    let strongs = true;
    let menuVersions = document.getElementById("id-versions");
    let menuVersion = document.getElementById("id-MenuBtn1");
    let pageHeadline =  document.getElementById("id-headline");

    let div = document.createElement("div");
    div.id = 'id-versionHeader';
    div.classList.add("cs-versionHeader");
    div.textContent = 'Versions';
    menuVersions.appendChild(div);
    for (const version of versions) {

        if (Number(version.id) > 2000 && nonEnglish) {
            let div = document.createElement("div");
            div.id = 'id-nonEnglishHeader';
            div.classList.add("cs-nonEnglishHeader");
            div.textContent = 'Non-English Versions';
            menuVersions.appendChild(div);
            nonEnglish = false;
        };

        if (Number(version.id) > 3000 && strongs) {
            let div = document.createElement("div");
            div.id = 'id-strongshHeader';
            div.classList.add("cs-strongsHeader");
            div.textContent = `Strong's Versions`;
            menuVersions.appendChild(div);
            strongs = false;
        };

        div = document.createElement("div");
        div.addEventListener("click", async (e) => {
            await changeVersion(e);
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        });

        div.id = `id-version${version.id}`;
        if (activeVersionID === div.id) {
            menuVersion.textContent = version.ar;
            pageHeadline.textContent = version.t;
        };
        div.dataset.index = i;
        div.textContent = `${version.t} - ${version.ar}`;
        div.classList.add("cs-version");
        menuVersions.appendChild(div);
        i++;
    };
    div = document.createElement("div");
    div.id = 'id-lastVersionLine';
    div.classList.add("cs-lastLine");
    div.textContent = '...';
    menuVersions.appendChild(div);
    Promise.resolve(true);
};

async function LoadBooks() {

    let i = 0;
    let ii = 0;
    let div;
    let div1

    removeElements('id-books');
    let menuBooks = document.getElementById('id-books');

    div = document.createElement('div');
    div.classList.add('cs-bookHeader');
    div.textContent = 'Books';

    let spa = document.createElement("span");
    spa.id = 'id-sortHeader';
    spa.classList.add('cs-sortHeader');
    spa.addEventListener("click", (e) => {
        sortBooks();
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    });
    spa.textContent = 'SORT';
    spa.style.display = "inline-block";
    spa.style.position = "relative";
    spa.style.left = "24%";
    spa.style.transform = "transform: translate(-50%)";
    spa.style.padding = ".23em";
    spa.style.fontSize = ".56em";
    spa.style.fontWeight = "500";
    spa.style.backgroundColor = "var(--whiteText)";
    spa.style.color = "var(--bannerBackground)";
    spa.style.borderRadius = "5px";
    spa.style.width = "max-content";

    if (bookSort) { spa.title = 'Sort Biblically';
    } else { spa.title = 'Sort Alphabetically'; };
    div.appendChild(spa);
    menuBooks.appendChild(div);

    while (i < 39) {
        div = document.createElement('div');
        div.classList.add('cs-bookLine');
        div1 = document.createElement('div');
        div1.addEventListener("click", (e) => {
            changeBook(e);
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        });
        div1.id = `id-book${oldBooks[i].id}`;
        div1.classList.add('cs-book');
        div1.classList.add('cs-bookRight');
        div1.dataset.bid = oldBooks[i].id;
        div1.dataset.chapters = oldBooks[i].c;
        div1.textContent = oldBooks[i].t;
        if (activeBookID === div1.id) { chapterCount = Number(div1.dataset.chapters) };
        div.appendChild(div1);

        if (ii < 27) {
            div1 = document.createElement('div');
            div1.addEventListener("click", (e) => {
                changeBook(e);
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            });
            div1.id = `id-book${newBooks[ii].id}`;
            div1.classList.add('cs-book');
            div1.dataset.bid = newBooks[ii].id;
            div1.dataset.chapters = newBooks[ii].c;
            div1.textContent = newBooks[ii].t;
        } else {
            div1 = document.createElement('div');
            div1.classList.add('cs-endBook');
        };
        if (activeBookID === div1.id) { chapterCount = Number(div1.dataset.chapters) };
        div.appendChild(div1);
        menuBooks.appendChild(div);
        i++;
        ii++;
    };
    div = document.createElement('div');
    div.id = 'id-lastBookLine';
    div.classList.add('cs-lastLine');
    div.insertAdjacentHTML('beforeend', `...`);
    menuBooks.appendChild(div);
    Promise.resolve(true);
};

async function loadChapters() {

    let menuChapters = document.getElementById('id-chapters');
    let div = document.createElement('div');
    let div1;
    let x = 0;

    removeElements('id-chapters');
    div.classList.add('cs-chapterHeader');
    div.textContent = 'Chapters';
    menuChapters.appendChild(div);
    chapterCount++;

    for (let i = 1; i < chapterCount; i++) {

        div = document.createElement('div');
        div.classList.add('cs-chapterLine');
        while (x < 5 && i < chapterCount) {
            div1 = document.createElement('div');
            div1.addEventListener("click", (e) => {
                changeChapter(e);
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            });
            div1.id = `id-chapter${i}`;
            div1.classList.add('cs-chapter');
            div1.textContent = i;
            div.appendChild(div1);
            i++
            x++;
        };
        i = i - 1;
        x = 0;
        menuChapters.appendChild(div);
    };
    div = document.createElement('div');
    div.id = 'id-lastChapterLine';
    div.classList.add('cs-lastLine');
    div.textContent = '...';
    menuChapters.appendChild(div);
    Promise.resolve(true);
};

async function loadVerses() {

    let menuVerses = document.getElementById('id-verses');
    let div = document.createElement('div');
    let div1;
    let x = 0;

    removeElements('id-verses');
    div.classList.add('cs-verseHeader');
    div.textContent = 'Verses';
    menuVerses.appendChild(div);
    verseCount++;

    for (let i = 1; i < verseCount; i++) {

        div = document.createElement('div');
        div.classList.add('cs-verseLine');
        while (x < 5 && i < verseCount) {
            div1 = document.createElement('div');
            div1.addEventListener("click", (e) => {
                findVerse(e);
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            });
            div1.id = `id-verse${i}`;
            div1.classList.add('cs-verse');
            div1.textContent = i;
            div.appendChild(div1);
            i++
            x++;
        };
        i = i - 1;
        x = 0;
        menuVerses.appendChild(div);
    };

    menuVerses.appendChild(div);
    div.id = 'id-lastVerseLine';
    div = document.createElement('div');
    div.classList.add('cs-lastLine');
    div.textContent = '...';
    menuVerses.appendChild(div);
    Promise.resolve(true);
};