class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.startup = new StartupSequence(this.canvas, this.ctx);
        this.isStartupComplete = false;
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.startup.start(() => {
            this.isStartupComplete = true;
            this.startMainGame();
        });
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    startMainGame() {
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '24px monospace';
        this.ctx.fillText('SPACE COLONY SYSTEM ONLINE', 50, 100);

        this.basePrompt = 'Press any key to begin';
        this._dotState = 1;
        this._dotsInterval = setInterval(() => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.fillText('SPACE COLONY SYSTEM ONLINE', 50, 100);
            const dots = '.'.repeat(this._dotState);
            this.ctx.fillText(this.basePrompt + dots, 50, 150);

            this._dotState = (this._dotState + 1) % 4;
        }, 500);

        const _stopDots = () => {
            clearInterval(this._dotsInterval);
            document.removeEventListener('keydown', _stopDots);
        };
        document.addEventListener('keydown', _stopDots);
        
        document.addEventListener('keydown', () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.displaySpaceColonyLogo();
        }, { once: true });
    }
    
    displaySpaceColonyLogo() {
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '12px monospace';
        
        const logo = [
            "########################################################################################################",
            "#                                                                                                      #",
            "#  ███████╗██████╗  █████╗  ██████╗███████╗      ██████╗ ██████╗ ██╗      ██████╗ ███╗   ██╗██╗   ██╗  #",
            "#  ██╔════╝██╔══██╗██╔══██╗██╔════╝██╔════╝     ██╔════╝██╔═══██╗██║     ██╔═══██╗████╗  ██║╚██╗ ██╔╝  #",
            "#  ███████╗██████╔╝███████║██║     █████╗       ██║     ██║   ██║██║     ██║   ██║██╔██╗ ██║ ╚████╔╝   #",
            "#  ╚════██║██╔═══╝ ██╔══██║██║     ██╔══╝       ██║     ██║   ██║██║     ██║   ██║██║╚██╗██║  ╚██╔╝    #",
            "#  ███████║██║     ██║  ██║╚██████╗███████╗     ╚██████╗╚██████╔╝███████╗╚██████╔╝██║ ╚████║   ██║     #",
            "#  ╚══════╝╚═╝     ╚═╝  ╚═╝ ╚═════╝╚══════╝      ╚═════╝ ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝     #",
            "#                                                                                                      #",
            "#                                 ╔═══════════════════════════════════╗                                #",
            "#                                 ║     COLONY MANAGEMENT SYSTEM      ║                                #",
            "#                                 ╠═══════════════════════════════════╣                                #",
            "#                                 ║   BUILD • EXPLORE • SURVIVE       ║                                #",
            "#                                 ║                                   ║                                #",
            "#                                 ║      Galactic Colonial Auth.      ║                                #",
            "#                                 ║         Version 2.1.47            ║                                #",
            "#                                 ╚═══════════════════════════════════╝                                #",
            "#                                                                                                      #",
            "########################################################################################################"
        ];
        
        const startX = 6;
        const startY = 8;
        const lineHeight = 15;
        
        logo.forEach((line, index) => {
            this.ctx.fillText(line, startX, startY + (index * lineHeight));
        });
        
        const boxWidthChars = 90;
        const boxHeightLines = logo.length;

        const logoLineWidthPx = this.ctx.measureText(logo[0]).width;
        const gapPx = 24;
        const startX2 = startX + logoLineWidthPx + gapPx;

        const lineHeightPx = lineHeight; 

        const boxPxWidth = logoLineWidthPx;
        const boxPxHeight = boxHeightLines * lineHeightPx;

        this.rightBoxStats = {
            health: 75,
            oxygen: 92,
            energy: 100,
            crew: 1,
            time: 0
        };

        const makeBar = (value, max, innerWidth) => {
            const pct = Math.max(0, Math.min(1, value / max));
            const filled = Math.round(pct * innerWidth);
            const empty = innerWidth - filled;
            return '[' + '#'.repeat(filled) + '-'.repeat(empty) + ']';
        };

        const buildContentLines = () => {
            const innerWidthChars = boxWidthChars - 2;
            const innerWidthForBar = Math.max(10, Math.min(40, innerWidthChars - 12));

            const lines = [];
            lines.push(' COLONY STATS'.padEnd(innerWidthChars));
            lines.push(''.padEnd(innerWidthChars));

            // Health
            const healthLine = ` HEALTH ${makeBar(this.rightBoxStats.health, 100, innerWidthForBar)} ${String(this.rightBoxStats.health).padStart(3)}%`;
            lines.push(healthLine.substring(0, innerWidthChars).padEnd(innerWidthChars));

            // Oxygen
            const oxyLine = ` OXYGEN ${makeBar(this.rightBoxStats.oxygen, 100, innerWidthForBar)} ${String(this.rightBoxStats.oxygen).padStart(3)}%`;
            lines.push(oxyLine.substring(0, innerWidthChars).padEnd(innerWidthChars));

            // Energy
            const engLine = ` ENERGY ${makeBar(this.rightBoxStats.energy, 100, innerWidthForBar)} ${String(this.rightBoxStats.energy).padStart(3)}%`;
            lines.push(engLine.substring(0, innerWidthChars).padEnd(innerWidthChars));

            lines.push(''.padEnd(innerWidthChars));
            lines.push(` CREW: ${String(this.rightBoxStats.crew).padStart(3)}`.padEnd(innerWidthChars));

            lines.push(''.padEnd(innerWidthChars));
            lines.push(` TIME ELAPSED: ${String(this.rightBoxStats.time).padStart(3)} seconds`.padEnd(innerWidthChars));
            lines.push(''.padEnd(innerWidthChars));

            lines.push(' YOUR GOAL, SURVIVE.'.padEnd(innerWidthChars));
            lines.push(''.padEnd(innerWidthChars));

            return lines;
        };

        const composeBoxLines = (contentLines) => {
            const full = '#'.repeat(boxWidthChars);
            const result = [];
            result.push(full);
            for (let i = 0; i < boxHeightLines - 2; i++) {
                const content = (contentLines[i] || '').padEnd(boxWidthChars - 2).slice(0, boxWidthChars - 2);
                result.push('#' + content + '#');
            }
            result.push(full);
            return result;
        };

        const drawRightBox = () => {
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(startX2 - 6, startY - lineHeightPx - 6, boxPxWidth + 12, boxPxHeight + 12);

            const contentLines = buildContentLines();
            const fullBox = composeBoxLines(contentLines);

            this.ctx.fillStyle = '#00ff00';
            this.ctx.font = '12px monospace';
            fullBox.forEach((line, idx) => {
                this.ctx.fillText(line, startX2, startY + (idx * lineHeightPx));
            });
        };

        drawRightBox();

        this.updateRightBoxStats = (newValues) => {
            Object.assign(this.rightBoxStats, newValues);
            drawRightBox();
        };

        let vim = null;
        let healthWarned = false;
        let gameEnded = false;

        const modifyEnergy = (i) => {
            this.rightBoxStats.energy = Math.max(0, Math.min(100, this.rightBoxStats.energy + i));
            drawRightBox();
        };
        
        const modifyHealth = (i) => {
            this.rightBoxStats.health = Math.max(0, Math.min(100, this.rightBoxStats.health + i));
            
            if (this.rightBoxStats.health <= 20 && !healthWarned) {
                if (vim && vim.contentLines) {
                    vim.contentLines.push('⚠️ WARNING: Colony health critical! Immediate repairs needed!');
                    vim.contentLines.push('> ');
                    healthWarned = true;
                }
            } else if (this.rightBoxStats.health > 20) {
                healthWarned = false;
            }
            
            if (this.rightBoxStats.health <= 0 && !gameEnded) {
                gameEnded = true;
                endGame();
            }
            
            drawRightBox();
        };

        const endGame = () => {
            stopTimer();
            if (this._energyDecreaseInterval) clearInterval(this._energyDecreaseInterval);
            if (this._energyIncreaseInterval) clearInterval(this._energyIncreaseInterval);
            if (this._oxygenDecreaseInterval) clearInterval(this._oxygenDecreaseInterval);
            if (this._oxygenIncreaseInterval) clearInterval(this._oxygenIncreaseInterval);
            if (this._oxygenCrisisInterval) clearInterval(this._oxygenCrisisInterval);
            
            if (typeof crewAssignments !== 'undefined') {
                Object.values(crewAssignments).forEach(assignment => {
                    if (assignment && assignment.intervalId) clearInterval(assignment.intervalId);
                });
            }
            if (typeof crewAssignments !== 'undefined') {
                Object.values(crewAssignments).forEach(assignment => {
                    if (assignment && assignment.intervalId) clearInterval(assignment.intervalId);
                });
            }

            if (typeof crewAssignments !== 'undefined') {
                Object.keys(crewAssignments).forEach(crewName => {
                    const assignment = crewAssignments[crewName];
                    if (assignment && assignment.intervalId) {
                        clearInterval(assignment.intervalId);
                    }
                    delete crewAssignments[crewName];
                });
            }
            
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#ff0000';
            this.ctx.font = 'bold 32px monospace';
            this.ctx.fillText('COLONY FAILURE', 50, 100);
            
            this.ctx.font = '24px monospace';
            this.ctx.fillText('ALL SYSTEMS LOST', 50, 150);
            
            this.ctx.font = '18px monospace';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText('Your colony has fallen. The crew did not survive.', 50, 200);
            this.ctx.fillText('Press F5 to restart and try again.', 50, 230);
            
            if (vim && vim.contentLines) {
                vim.contentLines = [];
                vim.contentLines.push('🚨 COLONY FAILURE - ALL SYSTEMS LOST');
                vim.contentLines.push('The colony has fallen. Press F5 to restart.');
                vim.contentLines.push('> ');
            }
            
            drawRightBox();
            
            console.log('Game Over - Colony Failed');
        };
        
        const modifyOxygen = (i) => {
            this.rightBoxStats.oxygen = Math.max(0, Math.min(100, this.rightBoxStats.oxygen + i));
            drawRightBox();
        };
        
        const modifyCrew = (i) => {
            this.rightBoxStats.crew = Math.max(0, this.rightBoxStats.crew + i);
            drawRightBox();
        };
        
        this.modifyEnergy = modifyEnergy;
        this.modifyHealth = modifyHealth;
        this.modifyOxygen = modifyOxygen;
        this.modifyCrew = modifyCrew;
        
        // Now this should work - increase crew count:
        // modifyCrew(1);

        this.powerEfficiency = 1.0; // 1.0 = normal, higher = more efficient (slower drain)

        function startTimer() {
            this._timerInterval = setInterval(() => {
                this.rightBoxStats.time += 1;
                drawRightBox();
            }, 1000);
        }

        function stopTimer() { 
            const time = this.rightBoxStats.time;
            if (this._timerInterval) {
                clearInterval(this._timerInterval);
                this._timerInterval = null;
            }
            this.rightBoxStats.time = time;
        }
        this.stopTimer = stopTimer;
        this.startTimer = startTimer;
        this.startTimer();
        
        function decreaseEnergyRate(amount) {
            if (this._energyDecreaseInterval) clearInterval(this._energyDecreaseInterval);
            this._energyDecreaseInterval = setInterval(() => {
                modifyEnergy(-1);
            }, amount * this.powerEfficiency);
        }
        this.decreaseEnergyRate = decreaseEnergyRate;

        this.updatePowerEfficiency = (newEfficiency) => {
            this.powerEfficiency = newEfficiency;
            const rate = 1500 * this.powerEfficiency;
            decreaseEnergyRate.call(this, rate);
        };

        this.setPowerMode = (mode) => {
            if (this._energyDecreaseInterval) {
                clearInterval(this._energyDecreaseInterval);
                this._energyDecreaseInterval = null;
            }
            if (this._energyIncreaseInterval) {
                clearInterval(this._energyIncreaseInterval);
                this._energyIncreaseInterval = null;
            }
            
            if (mode === 'increase') {
                // Power Grid Maintenance - energy increases
                this._energyIncreaseInterval = setInterval(() => {
                    modifyEnergy(1); // +1% per 1.5 seconds
                }, 1500);
            } else if (mode === 'efficient') {
                // More efficient decrease (slower drain)
                this._energyDecreaseInterval = setInterval(() => {
                    modifyEnergy(-1);
                }, 3000); // Every 3 seconds instead of 1.5
            } else if (mode === 'normal') {
                // Normal decrease rate
                this._energyDecreaseInterval = setInterval(() => {
                    modifyEnergy(-1);
                }, 1500); // Normal rate
            }
        };

        this.setOxygenMode = (mode) => {
            if (this._oxygenDecreaseInterval) {
                clearInterval(this._oxygenDecreaseInterval);
                this._oxygenDecreaseInterval = null;
            }
            if (this._oxygenIncreaseInterval) {
                clearInterval(this._oxygenIncreaseInterval);
                this._oxygenIncreaseInterval = null;
            }
            
            if (mode === 'increase') {
                this._oxygenIncreaseInterval = setInterval(() => {
                    modifyOxygen(2); // +2% per 2 seconds (faster than energy)
                }, 2000);
            } else if (mode === 'normal') {
                // Normal oxygen consumption
                this._oxygenDecreaseInterval = setInterval(() => {
                    if (this.rightBoxStats.crew > 0) {
                        const oxygenLoss = -1 * this.rightBoxStats.crew;
                        
                        if (this.rightBoxStats.energy <= 0) {
                            modifyOxygen(oxygenLoss * 3); // 3x faster depletion when no power
                        } else {
                            modifyOxygen(oxygenLoss); // Normal depletion
                        }
                    }
                }, 2000);
            }
        };

        decreaseEnergyRate.call(this, 1500); // decrease energy by 1 every 1.5 seconds
        // Initialize oxygen system with normal consumption
        this.setOxygenMode('normal');

        // Critical oxygen system - health decreases rapidly when oxygen is 0
        // Also warn when energy is 0 (causing faster oxygen depletion)
        this._oxygenCrisisInterval = setInterval(() => {
            if (this.rightBoxStats.oxygen <= 0) {
                // Oxygen depleted - health decreases rapidly (7 per second)
                modifyHealth(-7);
                
                if (vim && vim.contentLines && !gameEnded) {
                    const lastLine = vim.contentLines[vim.contentLines.length - 1];
                    if (!lastLine.includes('OXYGEN CRITICAL')) {
                        vim.contentLines.push('🚨 OXYGEN CRITICAL! Colony health declining rapidly!');
                        vim.contentLines.push('> ');
                    }
                }
            } else if (this.rightBoxStats.energy <= 0 && this.rightBoxStats.oxygen > 0) {
                // Energy depleted - show power failure warning (oxygen will deplete faster)
                if (vim && vim.contentLines && !gameEnded) {
                    const lastLine = vim.contentLines[vim.contentLines.length - 1];
                    if (!lastLine.includes('POWER FAILURE') && !lastLine.includes('OXYGEN CRITICAL')) {
                        vim.contentLines.push('⚡ POWER FAILURE! Life support systems failing - oxygen depleting rapidly!');
                        vim.contentLines.push('> ');
                    }
                }
            } else if (this.rightBoxStats.oxygen > 10 && this.rightBoxStats.energy > 0) {
                if (vim && vim.contentLines && !gameEnded) {
                    const lastLine = vim.contentLines[vim.contentLines.length - 1];
                    if (lastLine.includes('OXYGEN CRITICAL') || lastLine.includes('POWER FAILURE')) {
                        vim.contentLines.push('✅ Systems restored. Colony stabilized.');
                        vim.contentLines.push('> ');
                    }
                }
            }
        }, 1000);

        const initializeGame = () => {

            // start 2 minute timer
            let timeLeft = 120; // 2 minutes in seconds
            let firstCrewFound = false;
            const timerInterval = setInterval(() => {
                timeLeft--;
                if (timeLeft <= 0 && !firstCrewFound) {
                    modifyCrew(1);
                    firstCrewFound = true;
                    timeleft = 0;
                }
            }, 1000);
            vim = {
                headerLines: [
                    'Welcome to Space Colony Terminal. Type "help" for commands.',
                    '────────────────────────────────────────────────────────────────────',
                    ''
                ],
                contentLines: [],
                font: '14px monospace',
                lineHeight: 18,
                x: 20,
                y: startY + (logo.length * lineHeight) + 20,
                width: this.canvas.width - 40,
                height: Math.max(120, this.canvas.height - (startY + (logo.length * lineHeight) + 40))
            };

            vim.maxVisibleLines = Math.floor(vim.height / vim.lineHeight) - 1;
            vim.maxContentLines = vim.maxVisibleLines - vim.headerLines.length;

            let crewAssignments = {};

            let commandState = {
                mode: 'normal', // 'normal', 'assign_job_select_crew', 'assign_job_select_task'
                selectedCrew: null,
                availableCrew: [],
                availableTasks: []
            };

            const crewDatabase = {
                "Engineer Sarah": {
                    specialization: "Engineering & Hydroponics",
                    allowedTasks: [
                        'Engineering Repairs - Increase Colony Health Over Time',
                        'Hydroponics Maintenance - Increase Oxygen Production',
                        'System Diagnostics - Improve Power Efficiency',
                        'Power Grid Maintenance - Increase Energy Over Time'
                    ]
                },
                "Pilot Chen": {
                    specialization: "Navigation & Flight Operations",
                    allowedTasks: [
                        'Navigation Systems - Discover New Missions',
                        'Communications Array - Maintain Contact',
                        'Ship Maintenance - Keep Vessels Operational',
                        'Supply Run Coordination - Regular Resource Drops'
                    ]
                },
                "Dr. Martinez": {
                    specialization: "Medical Officer",
                    allowedTasks: [
                        'Medical Duties - Continuous Crew Healing',
                        'Health Monitoring - Prevent Health Loss',
                        'Medical Research - Advanced Treatments',
                        'Emergency Response - Major Healing Treatments'
                    ]
                },
                "Security Chief Johnson": {
                    specialization: "Defense & Security",
                    allowedTasks: [
                        'Security Patrol - Protect From Threats',
                        'Defense Systems - Reinforce All Systems',
                        'Emergency Protocols - Crisis Management',
                        'Perimeter Monitoring - Early Warning System'
                    ]
                },
                "Scientist Williams": {
                    specialization: "Research & Development",
                    allowedTasks: [
                        'Research Project - Improve All Systems',
                        'Environmental Analysis - Optimize Atmosphere',
                        'Technology Development - Advanced Solutions',
                        'Data Analysis - System Optimization'
                    ]
                },
                "Mechanic Rodriguez": {
                    specialization: "Maintenance & Repairs",
                    allowedTasks: [
                        'Equipment Maintenance - Maintain Power Systems',
                        'Vehicle Repairs - Keep Transport Working',
                        'Tool Calibration - Optimize Equipment',
                        'Facility Upkeep - Maintain All Systems'
                    ]
                }
            };

            const clearCrewAssignment = (crewName) => {
                const assignment = crewAssignments[crewName];
                if (!assignment) return;

                if (assignment.intervalId) {
                    clearInterval(assignment.intervalId);
                }

                if (assignment.task === 'Power Grid Maintenance - Increase Energy Over Time') {
                    this.setPowerMode('normal'); // Return to normal power consumption
                } else if (assignment.task === 'System Diagnostics - Improve Power Efficiency') {
                    this.setPowerMode('normal'); // Return to normal power consumption
                } else if (assignment.task === 'Hydroponics Maintenance - Increase Oxygen Production') {
                    this.setOxygenMode('normal'); // Return to normal oxygen consumption
                }

                delete crewAssignments[crewName];
            };

            const commands = {
                'help': () => {
                    return [
                        'Available commands:',
                        '  crew - List all crew members and their assignments',
                        '  assign job - Assign job to crew member',
                        '  ai - Talk to colony AI',
                        '  clear - Clear terminal (keeps welcome message)'
                    ];
                },
                'crew': () => {
                    if(this.rightBoxStats.crew < 1) {
                        return [
                            'No crew members currently present in the colony.',
                            'Complete missions to unlock new crew members.'
                        ];
                    }
                    const crewNames = Object.keys(crewDatabase);
                    const unlockedCrew = crewNames.slice(0, this.rightBoxStats.crew);
                    
                    const response = ['Current Crew Members:'];
                    unlockedCrew.forEach(crewName => {
                        const specialization = crewDatabase[crewName].specialization;
                        const assignment = crewAssignments[crewName];
                        if (assignment) {
                            response.push(`  ${crewName} - ${specialization} [ASSIGNED: ${assignment.task}]`);
                        } else {
                            response.push(`  ${crewName} - ${specialization} [AVAILABLE]`);
                        }
                    });
                    
                    return response;
                },
                'assign job': () => {
                    const crewNames = Object.keys(crewDatabase);
                    const unlockedCrew = crewNames.slice(0, this.rightBoxStats.crew);
                    if (unlockedCrew.length === 0) {
                        return ['No crew members available to assign jobs.'];
                    }
                    
                    commandState.mode = 'assign_job_select_crew';
                    commandState.availableCrew = unlockedCrew;
                    
                    const response = ['Select a crew member by number:'];
                    unlockedCrew.forEach((crew, index) => {
                        const specialization = crewDatabase[crew].specialization;
                        const assignment = crewAssignments[crew];
                        const status = assignment ? `[BUSY: ${assignment.task}]` : '[AVAILABLE]';
                        response.push(`  ${index + 1}. ${crew} (${specialization}) ${status}`);
                    });
                    response.push('Type the number or "cancel" to abort.');
                    
                    return response;
                },
                'ai': () => {
                    const aiResponses = [
                        'COLONY AI: "All systems functioning within normal parameters."',
                        'COLONY AI: "Scanning for optimal resource allocation..."',
                        'COLONY AI: "Weather patterns suggest optimal farming conditions."',
                        'COLONY AI: "Deep space communications array detecting signals."',
                        'COLONY AI: "Recommend routine maintenance on atmospheric processors."'
                    ];
                    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
                    return [randomResponse];
                },
                'clear': () => {
                    vim.contentLines = [];
                    return [];
                }
                // 'emergency': () => {
                //     return [
                //         'EMERGENCY PROTOCOLS ACTIVATED',
                //         'All personnel report to designated stations.',
                //         'Sealing blast doors... Complete.',
                //         'Activating emergency power... Complete.',
                //         'Colony is now in lockdown mode.'
                //     ];
                // }
            };

            const processCommand = (command) => {
                const cmd = command.toLowerCase().trim();
                
                if (commandState.mode === 'assign_job_select_crew') {
                    if (cmd === 'cancel') {
                        commandState.mode = 'normal';
                        vim.contentLines.push('');
                        vim.contentLines.push('Job assignment cancelled.');
                        vim.contentLines.push('');
                    } else {
                        const crewIndex = parseInt(cmd) - 1;
                        if (!isNaN(crewIndex) && crewIndex >= 0 && crewIndex < commandState.availableCrew.length) {
                            commandState.selectedCrew = commandState.availableCrew[crewIndex];
                            
                            const currentAssignment = crewAssignments[commandState.selectedCrew];
                            if (currentAssignment) {
                                clearCrewAssignment(commandState.selectedCrew);
                                vim.contentLines.push('');
                                vim.contentLines.push(`${commandState.selectedCrew} reassigned from: ${currentAssignment.task}`);
                                vim.contentLines.push('');
                            }
                            
                            commandState.mode = 'assign_job_select_task';
                            
                            commandState.availableTasks = crewDatabase[commandState.selectedCrew].allowedTasks;
                            const specialization = crewDatabase[commandState.selectedCrew].specialization;
                            
                            const response = [
                                `Selected: ${commandState.selectedCrew}`,
                                `Specialization: ${specialization}`,
                                '', 
                                'Available tasks for this crew member:'
                            ];
                            commandState.availableTasks.forEach((task, index) => {
                                response.push(`  ${index + 1}. ${task}`);
                            });
                            response.push('Type the number or "cancel" to abort.');
                            
                            vim.contentLines.push('');
                            response.forEach(line => vim.contentLines.push(line));
                            vim.contentLines.push('');
                        } else {
                            vim.contentLines.push('');
                            vim.contentLines.push('Invalid selection. Please enter a valid number or "cancel".');
                            vim.contentLines.push('');
                        }
                    }
                } else if (commandState.mode === 'assign_job_select_task') {
                    if (cmd === 'cancel') {
                        commandState.mode = 'normal';
                        commandState.selectedCrew = null;
                        vim.contentLines.push('');
                        vim.contentLines.push('Job assignment cancelled.');
                        vim.contentLines.push('');
                    } else {
                        const taskIndex = parseInt(cmd) - 1;
                        if (!isNaN(taskIndex) && taskIndex >= 0 && taskIndex < commandState.availableTasks.length) {
                            const selectedTask = commandState.availableTasks[taskIndex];
                            
                            clearCrewAssignment(commandState.selectedCrew);
                            
                            let intervalId = null;
                            let taskEffect = '';
                            
                            if (selectedTask === 'Power Grid Maintenance - Increase Energy Over Time') {
                                this.setPowerMode('increase'); // Stop all, then start increasing power
                                taskEffect = 'Power grid optimized! Energy now increasing!';
                            } else if (selectedTask === 'System Diagnostics - Improve Power Efficiency') {
                                this.setPowerMode('efficient'); // Stop all, then efficient decrease
                                taskEffect = 'System efficiency improved! Power drain reduced!';
                            } else if (selectedTask === 'Hydroponics Maintenance - Increase Oxygen Production') {
                                this.setOxygenMode('increase'); // Start continuous oxygen production
                                taskEffect = 'Hydroponics systems optimized! Oxygen now increasing!';
                            } else if (selectedTask === 'Engineering Repairs - Increase Colony Health Over Time') {
                                // Start health increase interval
                                intervalId = setInterval(() => {
                                    modifyHealth(1);
                                }, 3000); // +1 health every 3 seconds
                                taskEffect = 'Colony structural integrity improved! Health now increasing!';
                            
                            // PILOT TASKS
                            } else if (selectedTask === 'Navigation Systems - Discover New Missions' || selectedTask === 'Communications Array - Maintain Contact') {
                                intervalId = setInterval(() => {
                                    const missions = ['Supply Cache Found!', 'Rescue Mission Successful!', 'Resource Depot Located!', 'Trade Route Established!', 'New Colony Discovered!'];
                                    const randomMission = missions[Math.floor(Math.random() * missions.length)];
                                    if (vim && vim.contentLines) {
                                        vim.contentLines.push(`🚀 PILOT: ${randomMission}`);
                                        vim.contentLines.push('> ');
                                    }
                                    if (randomMission == 'New Colony Discovered!' && this.rightBoxStats.crew < 6) {
                                        modifyCrew(1); // Gain a new crew member
                                    }
                                    if (randomMission == 'Supply Cache Found!') {
                                        modifyEnergy(10);
                                        modifyOxygen(10);
                                    }
                                    if (randomMission == 'Resource Depot Located!') {
                                        modifyEnergy(5);
                                        modifyOxygen(5);
                                    }
                                    if (randomMission == 'Rescue Mission Successful!') {
                                        modifyHealth(10);
                                    }
                                    if (randomMission == 'Trade Route Established!') {
                                        modifyEnergy(5);
                                        modifyOxygen(5);
                                        modifyHealth(5);
                                    }
                                }, 15000); // New mission every 15 seconds
                                taskEffect = 'Navigation systems active! Pilot will locate new opportunities!';
                            } else if (selectedTask === 'Supply Run Coordination - Regular Resource Drops') {
                                intervalId = setInterval(() => {
                                    modifyEnergy(5);
                                    modifyOxygen(7);
                                    if (vim && vim.contentLines) {
                                        vim.contentLines.push('📦 Supply drop delivered! Resources replenished!');
                                        vim.contentLines.push('> ');
                                    }
                                }, 20000); // Supply drop every 20 seconds
                                taskEffect = 'Supply coordination active! Regular resource deliveries incoming!';
                            
                            // MEDICAL OFFICER TASKS  
                            } else if (selectedTask === 'Medical Duties - Continuous Crew Healing') {
                                // Continuous healing
                                intervalId = setInterval(() => {
                                    if (this.rightBoxStats.health < 100) {
                                        modifyHealth(2);
                                    }
                                }, 2000); // +2 health every 2 seconds
                                taskEffect = 'Medical bay operational! Continuous crew healing active!';
                            } else if (selectedTask === 'Health Monitoring - Prevent Health Loss') {
                                // Prevent health loss and slow healing
                                intervalId = setInterval(() => {
                                    if (this.rightBoxStats.health < 90) {
                                        modifyHealth(1);
                                    }
                                }, 4000); // +1 health every 4 seconds, slower but consistent
                                taskEffect = 'Health monitoring active! Preventing health degradation!';
                            } else if (selectedTask === 'Emergency Response - Major Healing Treatments') {
                                // Large health boost every 30 seconds
                                intervalId = setInterval(() => {
                                    modifyHealth(15);
                                    if (vim && vim.contentLines) {
                                        vim.contentLines.push('🏥 Emergency medical treatment administered!');
                                        vim.contentLines.push('> ');
                                    }
                                }, 30000); // Big heal every 30 seconds
                                taskEffect = 'Emergency response ready! Major healing treatments scheduled!';
                            
                            // SECURITY TASKS
                            } else if (selectedTask === 'Security Patrol - Protect From Threats') {
                                // Prevent random damage events
                                intervalId = setInterval(() => {
                                    // Small protection bonus - prevents some damage
                                    if (this.rightBoxStats.health > 10) {
                                        const protectionBonus = Math.random() > 0.7 ? 1 : 0; // 30% chance of +1 health
                                        if (protectionBonus) {
                                            modifyHealth(protectionBonus);
                                        }
                                    }
                                    if (Math.random() > 0.8 && vim && vim.contentLines) { // 20% chance
                                        vim.contentLines.push('🛡️ Security patrol prevented potential damage!');
                                        vim.contentLines.push('> ');
                                    }
                                }, 8000); // Check every 8 seconds
                                taskEffect = 'Security patrol active! Colony protected from threats!';
                            } else if (selectedTask === 'Defense Systems - Reinforce All Systems') {
                                // Boost all stats periodically (representing better defense)
                                intervalId = setInterval(() => {
                                    modifyHealth(1);
                                    modifyEnergy(1);
                                    if (vim && vim.contentLines) {
                                        vim.contentLines.push('⚔️ Defense systems optimized! All systems reinforced!');
                                        vim.contentLines.push('> ');
                                    }
                                }, 12000); // Every 12 seconds
                                taskEffect = 'Defense systems online! All colony systems reinforced!';
                            
                            // SCIENTIST TASKS
                            } else if (selectedTask === 'Research Project - Improve All Systems') {
                                // Efficiency improvements for all systems
                                intervalId = setInterval(() => {
                                    // Small boosts to everything
                                    modifyHealth(1);
                                    modifyOxygen(1);
                                    modifyEnergy(1);
                                    if (Math.random() > 0.6 && vim && vim.contentLines) {
                                        vim.contentLines.push('🔬 Research breakthrough! System efficiency improved!');
                                        vim.contentLines.push('> ');
                                    }
                                }, 10000); // Every 10 seconds
                                taskEffect = 'Research project active! All systems being optimized!';
                            } else if (selectedTask === 'Environmental Analysis - Optimize Atmosphere') {
                                // Oxygen boost focus
                                intervalId = setInterval(() => {
                                    modifyOxygen(3);
                                    if (Math.random() > 0.7 && vim && vim.contentLines) {
                                        vim.contentLines.push('🌱 Environmental optimization complete! Air quality improved!');
                                        vim.contentLines.push('> ');
                                    }
                                }, 8000); // Every 8 seconds
                                taskEffect = 'Environmental analysis active! Atmospheric conditions optimized!';
                            
                            // MECHANIC TASKS
                            } else if (selectedTask === 'Equipment Maintenance - Maintain Power Systems') {
                                // Prevent energy loss, small energy boost
                                intervalId = setInterval(() => {
                                    if (this.rightBoxStats.energy < 95) {
                                        modifyEnergy(4);
                                    }
                                }, 1000);
                                taskEffect = 'Equipment maintenance active! Power systems running smoothly!';
                            } else if (selectedTask === 'Facility Upkeep - Maintain All Systems') {
                                // All-around maintenance
                                intervalId = setInterval(() => {
                                    if (this.rightBoxStats.health < 95) modifyHealth(1);
                                    if (this.rightBoxStats.energy < 95) modifyEnergy(1);
                                    if (this.rightBoxStats.oxygen < 95) modifyOxygen(1);
                                }, 7000); // Every 7 seconds
                                taskEffect = 'Facility maintenance active! All systems maintained!';
                            } else {
                                // Default case for other tasks - still provide some generic benefit
                                modifyHealth(3); // Small one-time boost
                                taskEffect = 'Task assigned successfully! Minor colony improvement!';
                            }
                            
                            crewAssignments[commandState.selectedCrew] = {
                                task: selectedTask,
                                intervalId: intervalId,
                                assignedAt: Date.now()
                            };
                            
                            vim.contentLines.push('');
                            vim.contentLines.push(`✓ Assigned ${commandState.selectedCrew} to ${selectedTask}`);
                            if (taskEffect) {
                                vim.contentLines.push(`  ${taskEffect}`);
                            }
                            vim.contentLines.push('Job assignment complete!');
                            vim.contentLines.push('');
                            
                            commandState.mode = 'normal';
                            commandState.selectedCrew = null;
                            commandState.availableTasks = [];
                        } else {
                            vim.contentLines.push('');
                            vim.contentLines.push('Invalid selection. Please enter a valid number or "cancel".');
                            vim.contentLines.push('');
                        }
                    }
                } else if (commands[cmd]) {
                    const response = commands[cmd]();
                    if (response.length > 0) {
                        vim.contentLines.push(''); // Add blank line
                        response.forEach(line => vim.contentLines.push(line));
                        vim.contentLines.push(''); // Add blank line after response
                    }
                } else if (cmd === '') {
                    // Do nothing for empty commands
                } else {
                    vim.contentLines.push('');
                    vim.contentLines.push(`Unknown command: "${command}"`);
                    vim.contentLines.push('Type "help" for available commands.');
                    vim.contentLines.push('');
                }
                
                if (vim.contentLines.length > vim.maxContentLines * 2) {
                    vim.contentLines = vim.contentLines.slice(-vim.maxContentLines);
                }
                
                vim.contentLines.push('> ');
            };

            let blinkOn = true;
            let lastBlink = performance.now();
            let rafId = null;

            const drawVim = () => {
                this.ctx.fillStyle = '#000000';
                this.ctx.fillRect(vim.x - 4, vim.y - vim.lineHeight, vim.width + 8, vim.height + 8);

                this.ctx.strokeStyle = '#00ff00';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(vim.x - 6, vim.y - vim.lineHeight - 4, vim.width + 12, vim.height + 12);

                this.ctx.fillStyle = '#00ff00';
                this.ctx.font = vim.font;
                
                let currentY = vim.y;
                
                vim.headerLines.forEach((line, index) => {
                    this.ctx.fillText(line, vim.x, currentY);
                    currentY += vim.lineHeight;
                });

                let displayContentLines = vim.contentLines;
                if (vim.contentLines.length > vim.maxContentLines) {
                    displayContentLines = vim.contentLines.slice(-vim.maxContentLines);
                }

                displayContentLines.forEach((line, index) => {
                    this.ctx.fillText(line, vim.x, currentY);
                    currentY += vim.lineHeight;
                });

                if (vim.contentLines.length > 0) {
                    const lastContentLine = vim.contentLines[vim.contentLines.length - 1] || '';
                    const cursorLineIndex = displayContentLines.length - 1;
                    
                    if (cursorLineIndex >= 0) {
                        const cursorX = vim.x + this.ctx.measureText(lastContentLine).width;
                        const cursorY = vim.y + (vim.headerLines.length * vim.lineHeight) + (cursorLineIndex * vim.lineHeight);

                        if (blinkOn) {
                            this.ctx.fillRect(cursorX, cursorY - vim.lineHeight + 4, 8, vim.lineHeight - 6);
                        }
                    }
                }
            };

            const animate = (ts) => {
                if (ts - lastBlink >= 500) {
                    blinkOn = !blinkOn;
                    lastBlink = ts;
                }
                drawVim();
                rafId = requestAnimationFrame(animate);
            };

            const onKeyDown = (ev) => {
                if (ev.key === 'Backspace' || ev.key === 'Tab') ev.preventDefault();

                if (vim.contentLines.length === 0) {
                    vim.contentLines.push('> ');
                }

                const lastIndex = vim.contentLines.length - 1;
                
                if (ev.key === 'Backspace') {
                    if (vim.contentLines[lastIndex].length > 2) {
                        vim.contentLines[lastIndex] = vim.contentLines[lastIndex].slice(0, -1);
                    }
                } else if (ev.key === 'Enter') {
                    const currentLine = vim.contentLines[lastIndex];
                    const command = currentLine.substring(2); // Remove "> " prefix
                    
                    processCommand(command);
                } else if (ev.key.length === 1 && !ev.ctrlKey && !ev.metaKey) {
                    vim.contentLines[lastIndex] += ev.key;
                } else {
                    return;
                }

                blinkOn = true;
                lastBlink = performance.now();
                drawVim();
            };

            vim.contentLines.push('> ');

            rafId = requestAnimationFrame(animate);

            this.canvas.tabIndex = 0;
            this.canvas.style.outline = 'none';
            this.canvas.focus();
            this.canvas.addEventListener('keydown', onKeyDown);

            this._teardownVim = () => {
            if (rafId) cancelAnimationFrame(rafId);
            this.canvas.removeEventListener('keydown', onKeyDown);
            if (this._oxygenDecreaseInterval) clearInterval(this._oxygenDecreaseInterval);
            if (this._oxygenIncreaseInterval) clearInterval(this._oxygenIncreaseInterval);
            if (this._healthIncreaseInterval) clearInterval(this._healthIncreaseInterval);
            if (this._oxygenCrisisInterval) clearInterval(this._oxygenCrisisInterval);
            
            Object.values(crewAssignments).forEach(assignment => {
                if (assignment.intervalId) {
                    clearInterval(assignment.intervalId);
                }
            });
            };
        };

        initializeGame();
    }
}

class StartupSequence {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.lines = [];
        this.currentLine = 0;
        this.charIndex = 0;
        this.isComplete = false;
        this.callback = null;
        
        this.bootMessages = [
            "INITIALIZING SPACE COLONY MANAGEMENT SYSTEM...",
            "Loading kernel modules...",
            "[ OK ] Starting atmospheric processors",
            "[ OK ] Initializing life support systems", 
            "[ OK ] Connecting to orbital navigation",
            "[ OK ] Loading terraforming protocols",
            "[ OK ] Starting resource management daemon",
            "[ OK ] Initializing colony population database",
            "[ OK ] Loading environmental controls",
            "[ OK ] Starting automated mining systems",
            "[ OK ] Connecting to deep space communications",
            "[ OK ] Loading artificial gravity generators",
            "[ OK ] Starting planetary defense systems",
            "[ OK ] Initializing hydroponics bay",
            "[ OK ] Loading colony expansion protocols",
            "",
            "System diagnostics complete.",
            "All systems nominal.",
            "",
            "SPACE COLONY OS v2.1.47",
            "Copyright 2387 Galactic Colonial Authority",
            "",
            "Welcome, Colony Administrator.",
            "",
            "████████████████████████████████████████",
            "█  SPACE COLONY MANAGEMENT INTERFACE   █",
            "████████████████████████████████████████",
            "",
            "Establishing connection to colony mainframe..."
        ];
        
        this.setupCanvas();
    }
    
    setupCanvas() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = '14px monospace';
        this.ctx.fillStyle = '#00ff00';
        this.lineHeight = 20;
        this.maxLines = Math.floor(this.canvas.height / this.lineHeight) - 2;
        this.startY = 20;
        this.displayLines = [];
    }
    
    start(callback) {
        this.callback = callback;
        this.typeNextCharacter();
    }
    
    typeNextCharacter() {
        if (this.currentLine >= this.bootMessages.length) {
            this.flashSequence();
            return;
        }
        
        const currentMessage = this.bootMessages[this.currentLine];
        
        if (currentMessage === "") {
            this.lines.push("");
            this.currentLine++;
            this.charIndex = 0;
            setTimeout(() => this.typeNextCharacter(), 100);
            return;
        }
        
        if (this.charIndex < currentMessage.length) {
            const partialMessage = currentMessage.substring(0, this.charIndex + 1);
            
            if (this.lines.length <= this.currentLine) {
                this.lines.push(partialMessage);
            } else {
                this.lines[this.currentLine] = partialMessage;
            }
            
            this.charIndex++;
            this.drawScreen();
            
            const delay = Math.random() * 18 + 8;
            setTimeout(() => this.typeNextCharacter(), delay);
        } else {
            this.currentLine++;
            this.charIndex = 0;
            setTimeout(() => this.typeNextCharacter(), 200);
        }
    }
    
    drawScreen() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '14px monospace';
        
        const maxVisibleLines = Math.floor((this.canvas.height - 40) / this.lineHeight);
        
        let displayLines = this.lines;
        let startIndex = 0;
        
        if (this.lines.length > maxVisibleLines) {
            startIndex = this.lines.length - maxVisibleLines;
            displayLines = this.lines.slice(startIndex);
        }
        
        for (let i = 0; i < displayLines.length; i++) {
            const yPos = this.startY + (i * this.lineHeight);
            this.ctx.fillText(displayLines[i], 20, yPos);
        }
        
        if (this.currentLine < this.bootMessages.length && this.lines.length > 0) {
            const currentDisplayIndex = displayLines.length - 1;
            if (currentDisplayIndex >= 0) {
                const cursorY = this.startY + (currentDisplayIndex * this.lineHeight);
                const cursorX = 20 + this.ctx.measureText(displayLines[currentDisplayIndex] || "").width;
                
                if (Math.floor(Date.now() / 500) % 2) {
                    this.ctx.fillText("█", cursorX, cursorY);
                }
            }
        }
    }
    
    flashSequence() {
        let flashCount = 0;
        const maxFlashes = 6;
        
        const flash = () => {
            flashCount++;
            
            if (flashCount % 2 === 0) {
                this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            } else {
                this.drawScreen();
            }
            
            if (flashCount < maxFlashes) {
                setTimeout(flash, 150);
            } else {
                setTimeout(() => {
                    this.ctx.fillStyle = '#000000';
                    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                    
                    this.matrixEffect(() => {
                        if (this.callback) this.callback();
                    });
                }, 300);
            }
        };
        
        flash();
    }
    
    matrixEffect(callback) {
        let frame = 0;
        const maxFrames = 30;
        
        const animate = () => {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#00ff00';
            this.ctx.font = '12px monospace';
            
            for (let i = 0; i < 100; i++) {
                const x = Math.random() * this.canvas.width;
                const y = (frame * 10 + Math.random() * this.canvas.height) % this.canvas.height;
                const char = String.fromCharCode(33 + Math.random() * 94);
                this.ctx.fillText(char, x, y);
            }
            
            frame++;
            if (frame < maxFrames) {
                requestAnimationFrame(animate);
            } else {
                this.ctx.fillStyle = '#000000';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                if (callback) callback();
            }
        };
        
        animate();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Game();
});