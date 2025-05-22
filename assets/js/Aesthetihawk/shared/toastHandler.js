// toastHandler.js

export function toastifyCustomClose(el) {
    const parent = el.closest('.toastify');
    const close = parent.querySelector('.toast-close');
    if (close) close.click();
}

// Register the function globally so onclick still works inside the HTML
window.toastifyCustomClose = toastifyCustomClose;

export function showToast({
    message = "",
    icon = "",
    duration = 3000
} = {}) {
    const toastMarkup = `
        <div class="bottom-4 right-4 max-w-xs bg-neutral-800 border border-neutral-700 rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.5)] outline outline-1 outline-white/10"
            role="alert" tabindex="-1">
            <div class="flex items-start p-4 gap-4">
                <div class="shrink-0 pt-0.5">
                    ${icon}
                </div>
                <div class="flex-1">
                    <p class="text-sm text-neutral-300">
                        ${message}
                    </p>
                </div>
                <button type="button" onclick="toastifyCustomClose(this)"
                    class="size-6 inline-flex justify-center items-center rounded-lg text-white hover:opacity-100 opacity-70 transition-opacity"
                    aria-label="Close">
                    <span class="sr-only">Close</span>
                    <svg class="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 6L6 18" />
                        <path d="M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    `;

    Toastify({
        text: toastMarkup,
        className: "hs-toastify-on:opacity-100 opacity-0 fixed -bottom-37.5 right-5 z-90 transition-all duration-300 [&>.toast-close]:hidden",
        duration: duration,
        close: true,
        escapeMarkup: false,
        style: {
            background: "none",
            padding: "0px 0px",
            boxShadow: "none"
        }
    }).showToast();
}
