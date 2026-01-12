// Footer management module
const FooterManager = {
    footer: null,
    isInitialized: false,
    pendingTexts: [],
    pendingButtons: [],
    pendingElements: [],
    defaultStyles: {
        text: "margin: 10px 0; color: #333; font-size: 14px;",
        button: "margin: 10px; padding: 5px 10px; font-size: 14px; cursor: pointer;",
        link: "margin: 10px; color: #007bff; text-decoration: none; font-size: 14px;",
        divider: "margin: 15px 0; border: none; border-top: 1px solid #ddd;",
        image: "margin: 10px; max-width: 100%; height: auto;",
        container: ""
    },

    init() {
        if (this.isInitialized) return;

        const tryInit = () => {
            this.footer = document.getElementById("masterFooter");
            if (this.footer) {
                // Remove existing paragraphs
                const paragraphs = this.footer.querySelectorAll("p");
                paragraphs.forEach(p => p.remove());
                
                this.isInitialized = true;
                
                // Add any pending texts
                this.pendingTexts.forEach(({ text, style }) => {
                    this.addText(text, style);
                });
                this.pendingTexts = [];
                
                // Add any pending buttons
                this.pendingButtons.forEach(({ text, onClick, style }) => {
                    addButtonFooter(text, onClick, style);
                });
                this.pendingButtons = [];
                
                // Add any pending custom elements
                this.pendingElements.forEach(({ element }) => {
                    this.footer.appendChild(element);
                });
                this.pendingElements = [];
                
                return true;
            }
            return false;
        };

        // Try immediately
        if (!tryInit()) {
            // Watch for footer to appear
            const observer = new MutationObserver(() => {
                if (tryInit()) {
                    observer.disconnect();
                }
            });
            
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        }
    },

    addText(text, style = "") {
        if (!this.isInitialized || !this.footer) {
            this.pendingTexts.push({ text, style });
            return;
        }

        const p = document.createElement("p");
        p.innerHTML = text;
        p.style.cssText = style || this.defaultStyles.text;
        this.footer.appendChild(p);
    },

    addElement(element) {
        if (!this.isInitialized || !this.footer) {
            this.pendingElements.push({ element });
            return;
        }
        this.footer.appendChild(element);
    },

    addLink(text, href, style = "", openInNewTab = false) {
        if (!this.isInitialized || !this.footer) {
            this.pendingElements.push({ 
                element: this.createLink(text, href, style, openInNewTab)
            });
            return;
        }

        const link = this.createLink(text, href, style, openInNewTab);
        this.footer.appendChild(link);
    },

    createLink(text, href, style, openInNewTab) {
        const a = document.createElement("a");
        a.innerHTML = text;
        a.href = href;
        
        if (openInNewTab) {
            a.target = "_blank";
            a.rel = "noopener noreferrer";
        }
        
        a.style.cssText = style || this.defaultStyles.link;
        return a;
    },

    addDivider(style = "") {
        if (!this.isInitialized || !this.footer) {
            const hr = document.createElement("hr");
            hr.style.cssText = style || this.defaultStyles.divider;
            this.pendingElements.push({ element: hr });
            return;
        }

        const hr = document.createElement("hr");
        hr.style.cssText = style || this.defaultStyles.divider;
        this.footer.appendChild(hr);
    },

    addImage(src, alt = "", style = "") {
        if (!this.isInitialized || !this.footer) {
            const img = this.createImage(src, alt, style);
            this.pendingElements.push({ element: img });
            return;
        }

        const img = this.createImage(src, alt, style);
        this.footer.appendChild(img);
    },

    createImage(src, alt, style) {
        const img = document.createElement("img");
        img.src = src;
        img.alt = alt;
        img.style.cssText = style || this.defaultStyles.image;
        return img;
    },

    clearFooter() {
        if (this.footer) {
            this.footer.innerHTML = "";
        }
    },

    addContainer(innerHTML = "", style = "") {
        if (!this.isInitialized || !this.footer) {
            const div = document.createElement("div");
            div.innerHTML = innerHTML;
            if (style) div.style.cssText = style;
            this.pendingElements.push({ element: div });
            return;
        }

        const div = document.createElement("div");
        div.innerHTML = innerHTML;
        if (style) div.style.cssText = style;
        this.footer.appendChild(div);
    },

    // Add spacing
    addSpacing(height = "20px") {
        const spacer = document.createElement("div");
        spacer.style.cssText = `height: ${height};`;
        this.addElement(spacer);
    },

    // Add a list (ul or ol)
    addList(items, ordered = false, style = "") {
        if (!this.isInitialized || !this.footer) {
            const list = this.createList(items, ordered, style);
            this.pendingElements.push({ element: list });
            return;
        }

        const list = this.createList(items, ordered, style);
        this.footer.appendChild(list);
    },

    createList(items, ordered, style) {
        const list = document.createElement(ordered ? "ol" : "ul");
        items.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = item;
            list.appendChild(li);
        });
        if (style) list.style.cssText = style;
        return list;
    },

    // Add an input field
    addInput(placeholder = "", type = "text", id = "", style = "") {
        if (!this.isInitialized || !this.footer) {
            const input = this.createInput(placeholder, type, id, style);
            this.pendingElements.push({ element: input });
            return input;
        }

        const input = this.createInput(placeholder, type, id, style);
        this.footer.appendChild(input);
        return input;
    },

    createInput(placeholder, type, id, style) {
        const input = document.createElement("input");
        input.type = type;
        input.placeholder = placeholder;
        if (id) input.id = id;
        if (style) {
            input.style.cssText = style;
        } else {
            input.style.cssText = "margin: 10px; padding: 5px; font-size: 14px;";
        }
        return input;
    },

    // Add a textarea
    addTextarea(placeholder = "", rows = 3, id = "", style = "") {
        if (!this.isInitialized || !this.footer) {
            const textarea = this.createTextarea(placeholder, rows, id, style);
            this.pendingElements.push({ element: textarea });
            return textarea;
        }

        const textarea = this.createTextarea(placeholder, rows, id, style);
        this.footer.appendChild(textarea);
        return textarea;
    },

    createTextarea(placeholder, rows, id, style) {
        const textarea = document.createElement("textarea");
        textarea.placeholder = placeholder;
        textarea.rows = rows;
        if (id) textarea.id = id;
        if (style) {
            textarea.style.cssText = style;
        } else {
            textarea.style.cssText = "margin: 10px; padding: 5px; font-size: 14px; width: 90%;";
        }
        return textarea;
    },

    // Add icon (using text symbols or emoji)
    addIcon(icon, style = "") {
        const span = document.createElement("span");
        span.innerHTML = icon;
        if (style) {
            span.style.cssText = style;
        } else {
            span.style.cssText = "margin: 5px; font-size: 24px;";
        }
        this.addElement(span);
    },

    // Add a flex row container for horizontal layout
    addRow(items = [], style = "") {
        const row = document.createElement("div");
        row.style.cssText = style || "display: flex; gap: 10px; align-items: center; margin: 10px 0;";
        items.forEach(item => row.appendChild(item));
        this.addElement(row);
        return row;
    },

    // Set default styles globally
    setDefaultStyles(element, styles) {
        if (this.defaultStyles.hasOwnProperty(element)) {
            this.defaultStyles[element] = styles;
        }
    },

    // Apply custom class to footer
    setFooterClass(className) {
        if (this.footer) {
            this.footer.className = className;
        }
    },

    // Apply custom styles to footer itself
    setFooterStyle(style) {
        if (this.footer) {
            this.footer.style.cssText = style;
        }
    }
};

// Initialize the manager
FooterManager.init();

// Public API functions
function addTextFooter(text, style = "") {
    FooterManager.addText(text, style);
}

function addButtonFooter(text, onClick, style = "") {
    if (!FooterManager.isInitialized || !FooterManager.footer) {
        FooterManager.pendingButtons = FooterManager.pendingButtons || [];
        FooterManager.pendingButtons.push({ text, onClick, style });
        return;
    }

    const button = document.createElement("button");
    button.innerHTML = text;
    button.style.cssText = style || FooterManager.defaultStyles.button;
    button.addEventListener("click", onClick);
    FooterManager.footer.appendChild(button);
}

function addLinkFooter(text, href, style = "", openInNewTab = false) {
    FooterManager.addLink(text, href, style, openInNewTab);
}

function addDividerFooter(style = "") {
    FooterManager.addDivider(style);
}

function addImageFooter(src, alt = "", style = "") {
    FooterManager.addImage(src, alt, style);
}

function addContainerFooter(innerHTML = "", style = "") {
    FooterManager.addContainer(innerHTML, style);
}

function addElementFooter(element) {
    FooterManager.addElement(element);
}

function addSpacingFooter(height = "20px") {
    FooterManager.addSpacing(height);
}

function addListFooter(items, ordered = false, style = "") {
    FooterManager.addList(items, ordered, style);
}

function addInputFooter(placeholder = "", type = "text", id = "", style = "") {
    return FooterManager.addInput(placeholder, type, id, style);
}

function addTextareaFooter(placeholder = "", rows = 3, id = "", style = "") {
    return FooterManager.addTextarea(placeholder, rows, id, style);
}

function addIconFooter(icon, style = "") {
    FooterManager.addIcon(icon, style);
}

function addRowFooter(items = [], style = "") {
    return FooterManager.addRow(items, style);
}

function setDefaultStylesFooter(element, styles) {
    FooterManager.setDefaultStyles(element, styles);
}

function setFooterClass(className) {
    FooterManager.setFooterClass(className);
}

function setFooterStyle(style) {
    FooterManager.setFooterStyle(style);
}

function clearFooter() {
    FooterManager.clearFooter();
}