window.addEventListener("load", async () => {

    let rec = false;
    rec = getDefaults();
    if (rec) { rec = false; rec = loadVersions(); };
    if (rec) { rec = false; rec = LoadBooks(); };
    if (rec) { rec = false; rec = loadChapters(); allLoaded = true; };
    if (rec) { rec = false; rec = getVersion(); };

    if (rec && allLoaded) {
        locateBox('id-header1', 'id-pageContainer', 20);
        setTimeout(() => {
            document.getElementById("id-loader").style.display = 'none';
            document.getElementById("id-randomChapter").style.display = 'block';
            document.getElementById('id-TWFspan').textContent = TWFmsg;
            if (dateEdited) { document.getElementById('id-TWFedited').textContent = `Last Edited: ${dateEdited}`; };
            bookWidth();
        }, 130);
    };
    if (rec) {
        if (setTheme === '1') {
            darkTheme();
            toggleTheme();
            rotateTheme = false;
        };
        if (savedLocal) { document.getElementById("id-end").style.display = 'none'; };
        startUp();
    };
    window.addEventListener("resize", adjustPosition);
});

async function getVersion(e = null) {

    let id = null;
    if (e) { id = e.target.id; };
    if (!id || id === 'id-resetDefaults') { id = activeVersionID };
    let aVersion = document.getElementById(id);
    let idx = Number(aVersion.dataset.index);
    let url = `data/${versions[idx].ar}/${versions[idx].ar}Verses.json`;

    try {
        const res = await fetch(url);
        if (!res.ok) { throw new Error(res.status); };
        verses = await res.json();
        let holdSelectedVerseID = selectedVerseID;
        await getChapter();
        selectedVerseID = holdSelectedVerseID;
        activeVersionID = aVersion.id;
        document.getElementById('id-MenuBtn1').textContent = versions[idx].ar;
        document.getElementById('id-headline').textContent = versions[idx].t;
        activeVersionAbreviation = versions[idx].ar;
        searchIndex = null;
    } catch (error) {
        let err = error.message;
        switch (error.message) {
            case '500':
                err = 'Network fetch error: 500A!';
                break;
            case '503':
                err = 'No internet connection error: 503A!';
                break;
        }
        alert(err);
    };
    closeBoxes();
    if (selectedVerseID) {
        if (isNumeric(selectedVerseID)) { selectedVerseID = `id-verse${selectedVerseID}`};
        verseHighlight(selectedVerseID);
    };

    if (versions[idx].sch) {
        document.getElementById('id-search').style.display = 'block';
    } else {
        document.getElementById('id-search').style.display = 'none';
    };
    if (versions[idx].rdl) {
        document.getElementById('id-redLetter').style.display = 'block';
        if (redLetterDefault) {
            document.getElementById('id-redLetter').textContent = 'Black Letter';
        } else {
            document.getElementById('id-redLetter').textContent = 'Red Letter';
        };
    } else {
        document.getElementById('id-redLetter').style.display = 'none';
    };
    if (verses[0].pn) {
        document.getElementById('id-paragraphLayout').style.display = 'block';
    } else { document.getElementById('id-paragraphLayout').style.display = 'none'; };
    if (versions[idx].ar === 'TWF') {
        if(TWFopen) { document.getElementById('id-TWFcontainer').style.display = 'block'; };
    } else { document.getElementById('id-TWFcontainer').style.display = 'none'; };

    removeElements('id-searchResults');
    document.getElementById('id-searchBox').textContent = '';
    searchIndex = null;
    boxOpen = 0;
    Promise.resolve(true);
};

async function getChapter() {

    let activeBook = Number(activeBookID.slice("id-book".length));
    let activeChapter = Number(activeChapterID.slice("id-chapter".length));
    let i = verses.findIndex(rec => rec.bid === activeBook && rec.cn === activeChapter);

    removeElements('id-page');
    let h2 = document.createElement('h2');
    let page = document.getElementById('id-page');
    document.getElementById('id-MenuBtn2').textContent = document.getElementById(activeBookID).textContent;
    h2.textContent = `${document.getElementById(activeBookID).textContent} ${activeChapter}`;
    document.getElementById('id-bottomTitleLine').textContent = h2.textContent;
    page.appendChild(h2);

    let p;
    let pn;
    let sp;
    let spa;
    let vt;
    let vNum;

    verseCount = 0;
    while (i < verses.length && verses[i].cn === activeChapter && verses[i].bid === activeBook) {
        p = document.createElement('p');
        p.id = `p${verses[i].vid}`;
        pn = verses[i].pn;
        if (pn > 0 && paragraphLayoutDefault) {
            while (verses[i].pn === pn) {
                sp = document.createElement('span');
                sp.id = `id-versNumber${verses[i].vn}`;
                if (verses[i].vn === 1) { vNum = `${verses[i].vn} `;
                } else { vNum = ` ${verses[i].vn} `; };
                let aVerse = verses[i].vt;

                if (verses[i].jq === 1) { sp.innerHTML = JesusQuote(aVerse, vNum);
                } else {
                    spa = document.createElement('span');
                    spa.classList.add("cs-verseNumber");
                    spa.textContent = vNum;
                    vt = document.createTextNode(aVerse);
                    sp.appendChild(spa);
                    sp.appendChild(vt);
                };
                p.appendChild(sp);
                i++;
                verseCount++;
            };
        } else {
            sp = document.createElement('span');
            sp.id = `id-versNumber${verses[i].vn}`;
            vNum = `${verses[i].vn} `;
            let aVerse = verses[i].vt;
            if (verses[i].jq === 1) { sp.innerHTML = JesusQuote(aVerse, vNum);
            } else {
                spa = document.createElement('span');
                spa.classList.add("cs-verseNumber");
                spa.textContent = vNum;
                vt = document.createTextNode(aVerse);
                sp.appendChild(spa);
                sp.appendChild(vt);
            };
            p.classList.add("cs-singleVerse");
            p.appendChild(sp);
            i++;
            verseCount++;
        };
        page.appendChild(p);
    };
    loadVerses();
    if (activeBook === 1 && activeChapter === 1) { document.getElementById('id-bottomLastLine').style.visibility = 'hidden'; } else { document.getElementById('id-bottomLastLine').style.visibility = 'visible'; };

    if (activeBook === 66 && activeChapter === 22) { document.getElementById('id-bottomNextLine').style.visibility = 'hidden'; } else { document.getElementById('id-bottomNextLine').style.visibility = 'visible'; };
    setFontSize();
    document.getElementById('id-MenuBtn3').textContent = `${document.getElementById(activeChapterID).textContent}:`;
};

