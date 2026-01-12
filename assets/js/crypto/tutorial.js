import { javaURI, fetchOptions } from '../api/config.js';

console.log("tutorial.js is loaded.");

// Make functions globally available
window.startTutorial = startTutorial;
window.skipTutorial = skipTutorial;
window.neverShowTutorial = neverShowTutorial;

document.addEventListener('DOMContentLoaded', function() {
    // Only check if user has chosen to never show the tutorial
    if (!localStorage.getItem('neverShowTutorial')) {
        document.getElementById('tutorial-welcome').classList.remove('hidden');
    }
});
function startTutorial() {
    document.getElementById('tutorial-welcome').classList.add('hidden');
    const tour = introJs();
    tour.setOptions({
        scrollToElement: true,
        scrollTo: 'element',
        scrollContainer: '.main-content',
        tooltipPosition: 'bottom',
        steps: [
            {
                title: 'Wallet Overview',
                intro: 'Your wallet shows your crypto balance, pending rewards, and USD value. Click "View all crypto balances" to see all your cryptocurrencies.',
                element: document.querySelector('.dashboard-card:nth-child(1)'),
                position: 'bottom'
            },
            {
                title: 'Mining Statistics',
                intro: 'Track your mining performance with hashrate and shares. Higher hashrate means more mining power!',
                element: document.querySelector('.dashboard-card:nth-child(2)'),
                position: 'bottom'
            },
            {
                title: 'Hardware Status',
                intro: 'Monitor your GPU temperature and power consumption. Keep your hardware cool for optimal performance!',
                element: document.querySelector('.dashboard-card:nth-child(3)'),
                position: 'bottom'
            },
            {
                title: 'Profitability',
                intro: 'See your daily revenue and power costs. This helps you calculate your mining profitability.',
                element: document.querySelector('.dashboard-card:nth-child(4)'),
                position: 'bottom'
            },
            {
                title: 'Cryptocurrency Selection',
                intro: 'Click here to view and switch between different cryptocurrencies. Each cryptocurrency has different mining characteristics and rewards.',
                element: document.querySelector('.text-blue-400.cursor-pointer'),
                position: 'bottom'
            },
            {
                title: 'Energy Plan',
                intro: 'View your current energy plan details and efficiency metrics. A good energy plan can significantly impact your mining profitability.',
                element: document.querySelector('a[href*="energy"]'),
                position: 'bottom'
            },
            {
                title: 'Energy Store',
                intro: 'Visit the Energy Store to purchase different energy plans from various suppliers. Choose plans with better efficiency to maximize your mining profits.',
                element: document.querySelector('a[href*="energy-store"]'),
                position: 'bottom'
            },
            {
                title: 'Mining Control',
                intro: 'Click here to start/stop mining. Watch your hashrate and earnings grow!',
                element: document.getElementById('start-mining'),
                position: 'bottom'
            },
            {
                title: 'GPU Management',
                intro: 'Visit the GPU Shop to upgrade your mining power. Better GPUs = Higher hashrate!',
                element: document.getElementById('gpu-shop'),
                position: 'bottom'
            },
            {
                title: 'Performance Monitoring',
                intro: 'Monitor your mining performance and earnings with real-time charts.',
                element: document.querySelector('.chart-container'),
                position: 'bottom'
            }
        ],
        showProgress: true,
        showBullets: true,
        exitOnOverlayClick: false,
        exitOnEsc: false,
        prevLabel: '← Back',
        nextLabel: 'Next →',
        doneLabel: 'Got it!',
        tooltipClass: 'customTooltip',
        showButtons: true,
        showStepNumbers: false,
        showCloseButton: false
    });
    // Add the skip button before starting the tour
    tour.onbeforechange(function() {
        setTimeout(() => {
            const tooltipButtons = document.querySelector('.introjs-tooltipbuttons');
            if (tooltipButtons && !document.querySelector('.custom-skip-button')) {
                const skipButton = document.createElement('a');
                skipButton.className = 'introjs-button custom-skip-button';
                skipButton.innerHTML = 'Skip';
                skipButton.onclick = function() {
                    tour.exit();
                };
                const nextButton = tooltipButtons.querySelector('.introjs-nextbutton');
                if (nextButton) {
                    tooltipButtons.insertBefore(skipButton, nextButton);
                }
            }
        }, 0);
    });
    tour.start();
}
function skipTutorial() {
    document.getElementById('tutorial-welcome').classList.add('hidden');
    localStorage.setItem('tutorialSeen', 'true');
    localStorage.setItem('lastLogin', new Date().getTime().toString());
}
function neverShowTutorial() {
    document.getElementById('tutorial-welcome').classList.add('hidden');
    localStorage.setItem('tutorialSeen', 'true');
    localStorage.setItem('neverShowTutorial', 'true');
    localStorage.setItem('lastLogin', new Date().getTime().toString());
}