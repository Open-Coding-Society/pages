// this function sets up tab switching for a set of tab ids and an initial tab
export function setupTabSwitcher(tabIds, initialTabId) {
    let currentTab = initialTabId;

    // get underline and tab bar elements
    const underline = document.getElementById('tab-underline');
    const tabBar = document.getElementById('tab-bar');

    // move the underline to the active tab
    function moveUnderline(tabId, animate = true) {
        const tabBtn = document.getElementById('tab-' + tabId);
        if (!tabBtn) return;
        const tabRect = tabBtn.getBoundingClientRect();
        const barRect = tabBar.getBoundingClientRect();
        const left = tabRect.left - barRect.left + tabBar.scrollLeft;
        const width = tabRect.width;
        underline.style.transition = animate ? 'all 0.3s cubic-bezier(.4,0,.2,1)' : 'none';
        underline.style.left = left + 'px';
        underline.style.width = width + 'px';
    }

    // switch to a new tab
    function switchTab(newTab) {
        if (newTab === currentTab) return;
        const oldIdx = tabIds.indexOf(currentTab);
        const newIdx = tabIds.indexOf(newTab);
        const direction = newIdx > oldIdx ? 'left' : 'right';

        const oldContent = document.getElementById('tab-content-' + currentTab);
        const newContent = document.getElementById('tab-content-' + newTab);

        // remove active class from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active', 'text-blue-500', 'border-blue-500');
        });
        // add active class to new tab button
        document.getElementById('tab-' + newTab).classList.add('active', 'text-blue-500', 'border-blue-500');

        // prepare new content for animation
        newContent.classList.remove('hidden', 'slide-in-left', 'slide-in-right', 'active');
        newContent.classList.add('tab-content', direction === 'left' ? 'slide-in-right' : 'slide-in-left', 'animating');

        // animate old content out
        oldContent.classList.remove('slide-in-left', 'slide-in-right', 'active');
        oldContent.classList.add(direction === 'left' ? 'slide-out-left' : 'slide-out-right', 'animating');

        // move underline at the same time as content animation
        moveUnderline(newTab, true);

        setTimeout(() => {
            // hide old content
            oldContent.classList.remove('slide-out-left', 'slide-out-right', 'animating');
            oldContent.classList.add('hidden');
            // animate new content in
            newContent.classList.remove('slide-in-left', 'slide-in-right', 'animating');
            newContent.classList.add('active');
            // set current tab
            currentTab = newTab;
        }, 300);
    }

    // add click listeners to tab buttons
    tabIds.forEach(tab => {
        const tabBtn = document.getElementById('tab-' + tab);
        if (tabBtn) {
            tabBtn.addEventListener('click', function (e) {
                e.preventDefault();
                switchTab(tab);
            });
        }
    });

    // update underline on window resize
    window.addEventListener('resize', () => moveUnderline(currentTab, false));

    // set initial underline position
    setTimeout(() => moveUnderline(currentTab, false), 10);
}