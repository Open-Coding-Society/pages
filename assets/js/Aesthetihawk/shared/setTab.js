// function to set active tab by element or id
export function setActiveTab(elementOrId) {
    // remove active classes from all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('bg-neutral-700', 'text-neutral-50', 'border-indigo-500');
        item.classList.add('text-neutral-600', 'border-transparent');
    });

    // get element if id string is passed
    let el = elementOrId;
    if (typeof elementOrId === 'string') {
        el = document.getElementById(elementOrId);
    }

    // add active classes to clicked tab
    if (el) {
        el.classList.add('bg-neutral-700', 'text-neutral-50', 'border-indigo-500');
        el.classList.remove('text-neutral-600', 'border-transparent');
        // store active tab id in localstorage
        localStorage.setItem('activeTabId', el.id);
    }
}

// on page load, re-apply active tab from localstorage or front matter
window.addEventListener('DOMContentLoaded', () => {
    let activeId = localStorage.getItem('activeTabId');
    let activeLink = null;

    if (activeId) activeLink = document.getElementById(activeId);

    // if no active tab in localstorage, use the one from front matter
    if (!activeLink) {
        const fallback = "{{ page.act_tab | escape }}";
        if (fallback) {
            setActiveTab(fallback);
            return;
        }
    }
    activeLink && setActiveTab(activeLink);
});
