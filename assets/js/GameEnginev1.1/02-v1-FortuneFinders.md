---
layout: opencs
title: Fortune Finders
permalink: /gamify/fortuneFindersv1-1
---

<div id="gameContainer">
    <div id="promptDropDown" class="promptDropDown" style="z-index: 9999"></div>
    <!-- Engine creates its own canvases; hide legacy canvas to avoid visual artifacts -->
    <canvas id='gameCanvas' style="display:none"></canvas>
</div>

<script type="module">
    function showStartupError(error) {
        const container = document.getElementById("gameContainer");
        if (!container) return;

        const details = error?.stack || error?.message || String(error);
        const panel = document.createElement("div");
        panel.style.cssText = `
            color: #fff;
            background: #2b0000;
            border: 1px solid #ff5c5c;
            border-radius: 8px;
            margin: 12px 0;
            padding: 12px;
            font-family: monospace;
            white-space: pre-wrap;
            line-height: 1.4;
        `;
        panel.textContent = `Fortune Finders failed to start.\n${details}`;
        container.prepend(panel);
    }

    window.addEventListener("unhandledrejection", (event) => {
        console.error("Unhandled startup rejection:", event.reason);
    });

    (async () => {
        try {
            const [{ default: FinTech }, { default: GameLevelAirport }, { default: GameLevelFuturesExchange }, { default: GameLevelOptionsHub }, { default: GameLevelWallstreet }, config] = await Promise.all([
                import("{{site.baseurl}}/assets/js/GameEnginev1.1/FinTech.js"),
                import("{{site.baseurl}}/assets/js/GameEnginev1.1/GameLevelAirport.js"),
                import("{{site.baseurl}}/assets/js/GameEnginev1.1/GameLevelFuturesExchange.js"),
                import("{{site.baseurl}}/assets/js/GameEnginev1.1/GameLevelOptionsHub.js"),
                import("{{site.baseurl}}/assets/js/GameEnginev1.1/GameLevelWallstreet.js"),
                import("{{site.baseurl}}/assets/js/api/config.js"),
            ]);

            const gameLevelClasses = [GameLevelAirport, GameLevelFuturesExchange, GameLevelOptionsHub, GameLevelWallstreet];

            const environment = {
                path: "{{site.baseurl}}",
                pythonURI: config.pythonURI,
                javaURI: config.javaURI,
                fetchOptions: config.fetchOptions,
                gameContainer: document.getElementById("gameContainer"),
                gameCanvas: document.getElementById("gameCanvas"),
                gameLevelClasses: gameLevelClasses
            };

            FinTech.main(environment);

            // Injected logic to add Coding Lessons dynamically without modifying game engine files
            const path = environment.path;
            
            function openLessonModal(modalId, frameId, url) {
                let modal = document.getElementById(modalId);
                if (!modal) {
                    modal = document.createElement("div");
                    modal.id = modalId;
                    modal.style.position = "fixed";
                    modal.style.top = "0"; modal.style.left = "0";
                    modal.style.width = "100vw"; modal.style.height = "100vh";
                    modal.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                    modal.style.display = "none"; modal.style.justifyContent = "center";
                    modal.style.alignItems = "center"; modal.style.zIndex = "1000";
                    document.body.appendChild(modal);

                    const iframeWrapper = document.createElement("div");
                    iframeWrapper.style.position = "relative"; iframeWrapper.style.overflow = "hidden";
                    iframeWrapper.style.width = "90%"; iframeWrapper.style.maxWidth = "1000px";
                    iframeWrapper.style.height = "80%"; iframeWrapper.style.border = "2px solid #ccc";
                    iframeWrapper.style.borderRadius = "8px"; iframeWrapper.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";
                    modal.appendChild(iframeWrapper);

                    const frame = document.createElement("iframe");
                    frame.id = frameId; frame.style.width = "100%"; frame.style.height = "100%";
                    frame.style.border = "none";
                    iframeWrapper.appendChild(frame);

                    const closeBtn = document.createElement("button");
                    closeBtn.innerText = "✖"; closeBtn.style.position = "absolute";
                    closeBtn.style.top = "10px"; closeBtn.style.right = "10px";
                    closeBtn.style.fontSize = "20px"; closeBtn.style.background = "#39ffb6";
                    closeBtn.style.color = "#00110c"; closeBtn.style.border = "none";
                    closeBtn.style.padding = "10px 14px"; closeBtn.style.borderRadius = "10px";
                    closeBtn.style.cursor = "pointer"; closeBtn.style.zIndex = "1100";
                    closeBtn.onclick = () => { modal.style.display = "none"; frame.src = ""; };
                    iframeWrapper.appendChild(closeBtn);
                }
                document.getElementById(frameId).src = url;
                modal.style.display = "flex";
            }

            const observer = new MutationObserver((mutations) => {
                for (let mutation of mutations) {
                    for (let node of mutation.addedNodes) {
                        if (node.id === 'custom-dialog-box') {
                            const title = node.querySelector('h2');
                            if (!title) continue;
                            
                            const buttonContainer = node.querySelector('div > div:nth-child(3)');
                            if (!buttonContainer) continue;

                            const addButton = (label, action) => {
                                const btn = document.createElement('button');
                                btn.className = 'dialog-button pixel-corners';
                                btn.innerText = '► ' + label;
                                btn.style.cssText = "margin: 0px; padding: 12px; border: 2px solid rgb(255, 255, 255); background-color: rgb(0, 0, 0); color: rgb(255, 255, 255); cursor: pointer; font-size: 12px; font-family: 'Press Start 2P', cursive; min-width: 200px; text-align: left; position: relative; opacity: 1; transform: translateX(0px);";
                                btn.onmouseover = () => { btn.style.backgroundColor = '#fff'; btn.style.color = '#000'; };
                                btn.onmouseout = () => { btn.style.backgroundColor = '#000'; btn.style.color = '#fff'; };
                                btn.onclick = () => {
                                    action();
                                    if (document.body.contains(node)) document.body.removeChild(node);
                                };
                                buttonContainer.insertBefore(btn, buttonContainer.lastElementChild);
                            };

                            const titleText = title.innerText;
                            const dialogText = node.innerText;

                            if (titleText.includes('J.P. Morgan') && dialogText.includes('opportunity and risk')) {
                                addButton('Learn Coding Behind Quant Trading', () => {
                                    openLessonModal('quantLessonModal', 'quantLessonFrame', `${path}/gamify/fortuneFinders/quant-lesson`);
                                });
                            } else if (titleText.includes('Options Trading NPC')) {
                                addButton('Learn Coding Behind Options', () => {
                                    window.open(`${path}/gamify/fortuneFinders/options-lesson`, '_blank');
                                });
                            } else if (titleText.includes('Futures Trader') && dialogText.includes('Futures = a contract')) {
                                addButton('Learn Coding Behind Futures', () => {
                                    openLessonModal('futuresLessonModal', 'futuresLessonFrame', `${path}/gamify/fortuneFinders/futures-lesson`);
                                });
                            }
                        }
                    }
                }
            });
            observer.observe(document.body, { childList: true });
        } catch (error) {
            console.error("Fortune Finders startup error:", error);
        }
    })();
</script>