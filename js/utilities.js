function adjustPosition() {
    locateBox('id-header1', 'id-versions');
    locateBox('id-header1', 'id-books');
    locateBox('id-header1', 'id-chapters');
    locateBox('id-header1', 'id-verses');
    if(!TWFopen) { locateBox('id-header1', 'id-pageContainer', 20); };
};

async function bookWidth() {
    let element = document.getElementById("id-books");
    element.style.display = "block";
    let width = element.offsetWidth;
    element.style.display = "none";
    width = (width + 31) + "px";
    document.documentElement.style.setProperty('--bookWidth', width);
    element.classList.remove("cs-booksW");
    element.classList.add("cs-booksW1");
    document.getElementById("id-versions").style.width = width;
};

function changeFontSize(direction) {

    if (direction === '+') {
        if (activeFontSizeCount > 8) { return; };
        activeFontSize = activeFontSize * 1.15;
        activeFontSizeCount++;
    } else if (direction === '-') {
        if (activeFontSizeCount < 1) { return; };
        activeFontSize = activeFontSize / 1.15;
        activeFontSizeCount--;
    } else if (direction === 'd') {
        activeFontSize = defaultFontSize;
        activeFontSizeCount = 0;
    };
    setFontSize();

    localStorage.setItem("activeFontSizeCount", activeFontSizeCount);
    localStorage.setItem("activeFontSize", activeFontSize);

    const bottom = document.getElementById("id-endFontScroll");
    bottom.scrollIntoView({ behavior: "instant", block: "end" });
};

function changeTheme() {

    toggleTheme();
    if (rotateTheme) {
        darkTheme();
        rotateTheme = false;
        localStorage.setItem("setTheme", '1');
    } else {
        lightTheme();
        rotateTheme = true;
        localStorage.setItem("setTheme", '0');
    };

};

function closeBoxes() {
    document.getElementById('id-versions').style.display = 'none';
    document.getElementById('id-books').style.display = 'none';
    document.getElementById('id-chapters').style.display = 'none';
    document.getElementById('id-verses').style.display = 'none';
    document.getElementById('id-randomChapter').style.backgroundColor = 'ba0e0e';
    boxesOpen = false;
};

function darkTheme() {
    document.documentElement.style.setProperty('--bodyBackground', '#3d3636');
    document.documentElement.style.setProperty('--bannerBackground', '#1a0303');
    document.documentElement.style.setProperty('--mainBackground', '#473e3e');
    document.documentElement.style.setProperty('--blackText', '#dcdde4');
    document.documentElement.style.setProperty('--whiteText', '#dcdde4');
    document.documentElement.style.setProperty('--lighterMaroonEmphasis', '#f3d3d3');

    document.documentElement.style.setProperty('--verseNumber', '#709cdf');
    document.documentElement.style.setProperty('--navyEmphasis', '#709cdf');
    document.documentElement.style.setProperty('--searchResults', '#fa4d4d');
    document.documentElement.style.setProperty('--gradientLight', '#5d656e');
    document.documentElement.style.setProperty('--gradientDark', '#010914');
    document.getElementById('id-endLine').style.color = '#010914';
};

function deleteData() {

    let confirmed = confirm('Changes to your default data storage settings will take effect immediately. When you restart the browser you must have an active internet connection to use The Ark Bible, click OK to continue or Cancel to abort!');
    if (!confirmed) { return; };

    localStorage.removeItem('savedLocal');
    document.getElementById('top').scrollIntoView({ block: 'start' });
    unregisterServiceWorkers();
    alert('All locally stored data has been deleted, The Ark Bible app will only be available with an active internet connection, unless you decide to reinstall it later!')
};

async function getDefaults() {

    //  The default activeVersionID is 'id-version21', which is the Twenty-First Century Version.
    //  The default activeBookID is 'id-book1', which is Genesis.
    //  The default activeChapterID is 'id-chapter1', which is the first chapter from the book of the activeBookID.
    //  The default setTheme is '0', which is the light theme.
    //  The default activeFontSize is 1.06

    const params = new URLSearchParams(window.location.search);

    let ltr = localStorage.getItem('redLetter');
    if (ltr) { redLetterDefault = ltr; };

    let vh = params.get('vh');
    if (vh) { selectedVerseID = `id-verse${vh}`; pastSelectedVerseID = vh; };

    let verid = params.get('verid');
    if (verid) { activeVersionID = `id-version${verid}`; };
    if (!activeVersionID) { activeVersionID = localStorage.getItem("activeVersionID"); };
    if (!activeVersionID) { activeVersionID = defaultVersionID };

    let bid = params.get('bid');
    if (bid) { activeBookID = `id-book${bid}`; };
    if (!activeBookID) { activeBookID = localStorage.getItem("activeBookID"); };
    if (!activeBookID) { activeBookID = defaultBookID; };

    let cn = params.get('cn');
    if (cn) { activeChapterID = `id-chapter${cn}`; };
    if (!activeChapterID) { activeChapterID = localStorage.getItem("activeChapterID"); };
    if (!activeChapterID) { activeChapterID = defaultChapterID; };

    setTheme = localStorage.getItem("setTheme");
    activeFontSize = localStorage.getItem("activeFontSize");
    if (!activeFontSize) { activeFontSize = 1.06; } else { activeFontSize = Number(activeFontSize); };
    activeFontSizeCount = localStorage.getItem("activeFontSizeCount");
    if (!activeFontSizeCount) { activeFontSizeCount = 0; } else { activeFontSizeCount = Number(activeFontSizeCount); };

    let svd = localStorage.getItem('savedLocal');
    if (svd) { savedLocal = svd; };

    Promise.resolve(true);
};

function isNumeric(value) { return !isNaN(value) && !isNaN(parseFloat(value)); };

function JesusQuote(aVerse, vNum) {

    if (redLetterDefault) {
        aVerse = aVerse.replace('`', '<span class="cs-emphasis">');
        aVerse = aVerse.replace('´', '</span>');
    } else {
        aVerse = aVerse.replace('`', '');
        aVerse = aVerse.replace('´', '');
    };
    return `<span class="cs-verseNumber">${vNum}</span>${aVerse}`;
};

function lightTheme() {
    document.documentElement.style.setProperty('--bodyBackground', '#f3f3f3');
    document.documentElement.style.setProperty('--bannerBackground', '#022a69');
    document.documentElement.style.setProperty('--mainBackground', 'white');
    document.documentElement.style.setProperty('--blackText', 'black');
    document.documentElement.style.setProperty('--whiteText', 'white');
    document.documentElement.style.setProperty('--verseNumber', '#0505da');
    document.documentElement.style.setProperty('--lighterMaroonEmphasis', '#ba0e0e');
    document.documentElement.style.setProperty('--navyEmphasis', 'navy');
    document.documentElement.style.setProperty('--searchResults', '#ba0e0e');
    document.documentElement.style.setProperty('--gradientLight', '#0064d9');
    document.documentElement.style.setProperty('--gradientDark', '#11428c');
};

function locateBox(topBox, nextBox, mrgn = 0) {
    const firstDiv = document.getElementById(topBox);
    const secondDiv = document.getElementById(nextBox);
    const contentHeight = firstDiv.clientHeight;
    const firstDivBottom = firstDiv.offsetTop + contentHeight - mrgn;
    if (mrgn) {
        secondDiv.style.position = 'relative';
        secondDiv.style.marginTop = `${firstDivBottom}px`;
        secondDiv.style.position = 'static';
    } else {
        secondDiv.style.top = `${firstDivBottom}px`;
    };
};

function openBoxes() {

    this.event.preventDefault();
    this.event.stopPropagation();
    this.event.stopImmediatePropagation();

    const params = new URLSearchParams(window.location.search);
    let vh = params.get('vh');
    let holdSelectedVerseID;
    if (vh) { holdSelectedVerseID = `id-verse${vh}`; };
    closeBoxes();
    let ID = this.event.target.id;
    let id = null;
    let aSelection = null;

    switch (ID) {
        case "id-MenuBtn1":
            id = 'id-versions';
            if  (boxOpen === 1) { boxOpen = 0; return; };
            if (vh) {
                setQuerystring('vh', vh);
                selectedVerseID = holdSelectedVerseID;
            };
            aSelection = activeVersionID;
            boxOpen = 1;
            break;
        case "id-MenuBtn2":
            id = 'id-books';
            if  (boxOpen === 2) { boxOpen = 0; return; };
            boxOpen = 2;
            aSelection = activeBookID;
            break;
        case "id-MenuBtn3":
            id = 'id-chapters';
            if  (boxOpen === 3) { boxOpen = 0; return; };
            boxOpen = 3;
            aSelection = activeChapterID;
            break;
        case "id-MenuBtn4":
            id = 'id-verses';
            if  (boxOpen === 4) { boxOpen = 0; return; };
            boxOpen = 4;
            aSelection = selectedVerseID;
            break;
        default:
            boxOpen = 0;
            return;
    };

    if (boxesOpen) {
        closeBoxes();
    } else {
        boxesOpen = true;
        locateBox('id-header1', id);
        document.getElementById(id).style.display = 'block';
        if (aSelection) {
            document.getElementById(aSelection).scrollIntoView({ block: 'center' });
        }
    };
};

function paragraphLayout() {

    if (paragraphLayoutDefault) {
        document.getElementById('id-paragraphLayout').textContent = 'Paragraph Layout';
        paragraphLayoutDefault = 0;
    } else {
        document.getElementById('id-paragraphLayout').textContent = 'Line Layout';
        paragraphLayoutDefault = 1;
    };
    getChapter();
    localStorage.setItem("paragraphLayout", paragraphLayoutDefault);
};

function redLetter() {

    if (redLetterDefault) {
        document.getElementById('id-redLetter').textContent = 'Red Letter';
        redLetterDefault = 0;
    } else {
        document.getElementById('id-redLetter').textContent = 'Black Letter';
        redLetterDefault = 1;
    };
    getChapter();
    localStorage.setItem("redLetter", redLetterDefault);
}

function removeElements(id) {

    let target = document.getElementById(id);
    while (target.firstChild) {
        target.removeChild(target.firstChild);
    };
};

function removeQueryParam(param) {
    var url = new URL(window.location.href);
    url.searchParams.delete(param);
    window.history.replaceState({}, '', url);
};

function removeQueryString() {
    var url = new URL(window.location.href);
    window.history.replaceState({}, '', url);
};

function resetDefaults() {

    let theme = document.getElementById("id-theme");

    rotateTheme = false;
    changeTheme();
    theme.textContent = "☀️";
    if (theme.classList.contains('cs-darkTheme')) {
        theme.classList.remove('cs-darkTheme');
    };
    rotateTheme = true;
    changeFontSize('d');
    localStorage.removeItem('setTheme');
    localStorage.removeItem('activeFontSizeCount');
    localStorage.removeItem('activeFontSize');
    localStorage.removeItem('activeBookID');
    localStorage.removeItem('activeChapterID');
    localStorage.removeItem('activeVersionID');
    localStorage.removeItem('redLetter');
    document.getElementById('id-redLetter').textContent = 'Red Letter';
    redLetterDefault = 0;
    localStorage.removeItem('paragraphLayout');
    document.getElementById('id-paragraphLayout').textContent = 'Paragraph Layout';
    paragraphLayoutDefault = 0;
    removeQueryParam('vh');
    activeVersionID = defaultVersionID;
    activeBookID = defaultBookID;
    activeChapterID = defaultChapterID;
    getVersion();
    document.getElementById('top').scrollIntoView({ block: 'start' });

};

function selected(id, container) {

    let unselected = null;

    switch (container) {
        case "id-versions":
            unselected = pastSelectedVersionID;
            pastSelectedVersionID = id;
            break;
        case "id-books":
            unselected = pastSelectedBookID;
            pastSelectedBookID = id;
            break;
        case "id-chapters":
            unselected = pastSelectedChapterID;
            pastSelectedChapterID = id;
            break;
        case "id-verses":
            unselected = pastSelectedVerseID;
            pastSelectedVerseID = id;
            break;
    };
    if (id) { document.getElementById(id).classList.add('cs-bvSelected'); };
    if (unselected) { document.getElementById(unselected).classList.remove('cs-bvSelected'); }
};

async function setFontSize() {
    const allP = document.querySelectorAll('p');
    for (const ps of allP) {
        if (ps.id !== 'id-endLine') { ps.style.fontSize = `${activeFontSize}rem`; };
    };
};

function setQuerystring(key, value) {

    let url = new URL(window.location);
    let params = new URLSearchParams(url.search);

    url.searchParams.set(key, value);
    if (params.has(key)) {
        window.history.replaceState({}, '', url);
    } else {
        window.history.pushState({}, '', url);
    };
};

function sortBooks() {

    if (bookSort) {
        oldBooks.sort((a, b) => a.id - b.id);
        newBooks.sort((a, b) => a.id - b.id);
        bookSort = false;
    } else {
        oldBooks.sort((a, b) => a.t.localeCompare(b.t));
        newBooks.sort((a, b) => a.t.localeCompare(b.t));
        bookSort = true;
    };
    LoadBooks();
};

function startUp() {

    let id = null;

    if (activeVersionID) {
        id = Number(activeVersionID.slice("id-version".length));
        setQuerystring('verid', id);
        selected(activeVersionID, 'id-versions');
     };
    if (activeBookID) {
        id = Number(activeBookID.slice("id-book".length));
        setQuerystring('bid', id);
        selected(activeBookID, 'id-books');
    };
    if (activeChapterID) {
        id = Number(activeChapterID.slice("id-chapter".length));
        setQuerystring('cn', id);
        selected(activeChapterID, 'id-chapters');
    };
    if (selectedVerseID) {
        id = Number(selectedVerseID.slice("id-versNumber".length));
        setQuerystring('vh', id);
        selected(selectedVerseID, 'id-verses');
    };
};

function toggleTheme() {
    //document.body.classList.toggle("dark-mode");
    let theme = document.getElementById("id-theme");
    theme.classList.toggle("cs-darkTheme");
    theme.textContent = theme.classList.contains("cs-darkTheme") ?  "🌙" : "☀️";
}

function unHighlight() {
    document.getElementById('id-MenuBtn4').textContent = '1';
    selected(selectedVerseID, 'id-verses');
    removeQueryParam('vh');
    selectedVerseID = null;
    pastSelectedVerseID = null;
};

async function unregisterServiceWorkers() {

    if ('serviceWorker' in navigator) {
            try {
                const registrations = await navigator.serviceWorker.getRegistrations();
                if (registrations.length > 0) {
                    const keys = await caches.keys();
                    await Promise.all(keys.map(async (key) => { await caches.delete(key); }));
                    for (const registration of registrations) {
                        const unregistered = await registration.unregister();
                        console.log('Service worker unregistered:', unregistered);
                    };
                };
            } catch (error) {
                console.error('Error during unregistering:', error);
            };
    };
};

function updateQueryParams(removeParams, addParams) {
    var url = new URL(window.location.href);
    // Remove specified query parameters
    removeParams.forEach(param => url.searchParams.delete(param));
    // Add new query parameters
    Object.keys(addParams).forEach(key => url.searchParams.set(key, addParams[key]));
    // Update the URL without reloading the page
    window.history.replaceState({}, '', url);
};

function verseHighlight(id) {

    let vh = document.getElementById(id).textContent;
    document.getElementById('id-MenuBtn4').textContent = vh;
    selectedVerseNumberID = `id-versNumber${vh}`;
    const spa = document.getElementById(selectedVerseNumberID);
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(spa);
    selection.removeAllRanges();
    selection.addRange(range);
    spa.scrollIntoView({ block: 'center' });
    closeBoxes();
    boxOpen = 0;
};

// Hold selected1 until not needed
    function selected1(id, container) {

        document.querySelectorAll(`#${container} *`).forEach(element => {
            if (element.classList.contains('cs-bvSelected')) {
                element.classList.remove('cs-bvSelected');
            };
        });
        document.getElementById(id).classList.add('cs-bvSelected');
    };
// End Hold until not needed