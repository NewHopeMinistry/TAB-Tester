function changeBook(e = null) {

    if (e) { activeBookID = e.target.id; };
    let activeBook = Number(activeBookID.slice("id-book".length));
    activeChapterID = 'id-chapter1';
    chapterCount = Number(document.getElementById(activeBookID).dataset.chapters);
    document.getElementById('id-MenuBtn3').textContent = '1:';
    document.getElementById('id-MenuBtn4').textContent = '1:';
    getChapter();
    loadChapters();
    closeBoxes();
    selected(activeBookID, 'id-books');
    setQuerystring('bid', activeBook);
    setQuerystring('cn', 1);
    removeQueryParam('vh');
    document.getElementById('top').scrollIntoView({ block: 'start' });
    boxOpen = 0;
};

function changeChapter(e = null) {

    if (e) { activeChapterID = e.target.id; };
    let activeChapter = Number(activeChapterID.slice("id-chapter".length));
    chapterCount = Number(document.getElementById(activeBookID).dataset.chapters);
    getChapter();
    loadChapters();
    closeBoxes();
    selected(activeChapterID, 'id-chapters');
    setQuerystring('cn', activeChapter);
    document.getElementById('id-MenuBtn4').textContent = '1';
    document.getElementById('top').scrollIntoView({ block: 'start' });
    boxOpen = 0;
};

async function changeVersion(e = null) {

    let rec = false;
    rec = await getVersion(e);
    if (rec) { locateBox('id-header1', 'id-pageContainer', 20); };
    let activeVersion = Number(activeVersionID.slice("id-version".length));
    selected(activeVersionID, 'id-versions');
    setQuerystring('verid', activeVersion);
    setQuerystring('cn', 1);
    //setQuerystring('verid', activeVersion);
    Promise.resolve(true);
};

function findVerse(e = null) {

    let id;
    if (e) { id = e.target.id; };
    let save = Number(id.slice("id-verse".length));
    verseHighlight(id);
    setQuerystring('vh', save);
    selected(id, 'id-verses');
};

function lastChapter() {

    let i = 0;
    let books = [];
    let bid = Number(document.getElementById(activeBookID).dataset.bid);

    if (bid < 40) {
        i = oldBooks.findIndex(rec => rec.id === bid);
        books = oldBooks;
    } else {
        i = newBooks.findIndex(rec => rec.id === bid);
        books = newBooks;
    };

    let chapter = Number(document.getElementById(activeChapterID).textContent) - 1;
    if (chapter < 1) { bid--; chapter = books[i -1].c; chapterCount = books[i -1].c; };
    activeBookID = `id-book${bid}`;
    activeChapterID = `id-chapter${chapter}`;
    loadChapters();
    getChapter();
    removeQueryParam('vh');
    document.getElementById('id-MenuBtn4').textContent = '1:';
    document.getElementById('top').scrollIntoView({ block: 'start' });
};

function nextChapter() {

    let i = 0;
    let books = [];
    let bid = Number(document.getElementById(activeBookID).dataset.bid);
    if (bid < 40) {
        i = oldBooks.findIndex(rec => rec.id === bid);
        books = oldBooks;
    } else {
        i = newBooks.findIndex(rec => rec.id === bid);
        books = newBooks;
    };
    let chapters = books[i].c;
    let chapter = Number(document.getElementById(activeChapterID).textContent) + 1;
    if (chapter > chapters) { bid++; chapter = 1; };
    activeBookID = `id-book${bid}`;
    activeChapterID = `id-chapter${chapter}`;
    if (bid < 40) {
        i = oldBooks.findIndex(rec => rec.id === bid);
        books = oldBooks;
    } else {
        i = newBooks.findIndex(rec => rec.id === bid);
        books = newBooks;
    };
    chapterCount = books[i].c;
    getChapter();
    loadChapters();
    removeQueryParam('vh');
    document.getElementById('id-MenuBtn4').textContent = '1:';
    document.getElementById('top').scrollIntoView({ block: 'start' });
};

function readRandomChapter() {

    let min = 30640;
    let i = Math.floor(Math.random() * (0 - min + 1)) + min;
    let bid = verses[i].bid;
    let cn = verses[i].cn;

    activeBookID = `id-book${bid}`;
    activeChapterID = `id-chapter${cn}`;
    getChapter();
    document.getElementById('top').scrollIntoView({ block: 'start' });
    closeBoxes();
};
