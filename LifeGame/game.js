<link rel="stylesheet" class="aplayer-secondary-style-marker" href="\assets\css\APlayer.min.css"><script src="\assets\js\APlayer.min.js" class="aplayer-secondary-script-marker"></script>class GameOfLife {
    constructor(width, height, cellSize) {
        console.trace('GameOfLife constructor called');
        console.log('Constructor arguments:', { width, height, cellSize });

        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.cols = Math.floor(width / cellSize);
        this.rows = Math.floor(height / cellSize);
        this.grid = this.createGrid();
        this.isRunning = false;
        this.intervalId = null;
        this.updateInterval = 100;
        this.torusMode = false;
        this.density = 0.3;
        this.i = 0;
        console.log("i", this.i);

        this.canvas = document.getElementById('gameCanvas');


        const containerWidth = this.canvas.parentElement.clientWidth - 40;


        this.canvas.width = width;
        this.canvas.height = height;

        this.ctx = this.canvas.getContext('2d');

        this.bindEvents();

        this.patterns = {
            glider: [
                [0, 1, 0],
                [0, 0, 1],
                [1, 1, 1]
            ],
            blinker: [
                [0, 0, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            beacon: [
                [1, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 0, 1, 1],
                [0, 0, 1, 1]
            ],
            toad: [
                [0, 1, 1, 1],
                [1, 1, 1, 0]
            ],
            spaceship: [
                [0, 1, 1, 1, 1],
                [1, 0, 0, 0, 1],
                [0, 0, 0, 0, 1],
                [1, 0, 0, 1, 0]
            ],
            pulsar: [
                [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
                [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
                [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0]
            ],
            cross: [
                [0, 1, 1, 0],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [0, 1, 1, 0]
            ],
            loafer: [
                [0, 1, 1, 0],
                [1, 0, 0, 1],
                [0, 1, 0, 1],
                [0, 0, 1, 1]
            ],
            gosperGun: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ],
            simpleGun: [
                [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
                [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
                [0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
                [1, 1, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ],
            cordership: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ],
            copperhead: [
                [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
                [0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0],
                [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
                [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0],
                [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ]
        };

        this.setupSpeedControl();
        this.bindDensityControls();
        this.stats = this.createNewStats();


        this.draw();
    }

    setupSpeedControl() {

        this.speedLevels = this.calculateSpeedLevels();


        this.updateInterval = this.speedLevels[Math.floor(this.speedLevels.length / 2)];

        this.bindSpeedControls();
    }

    calculateSpeedLevels() {
        const levels = [];
        const ratio = 1.5;
        const minSpeed = 1;
        const maxSpeed = 2000;

        let currentSpeed = maxSpeed;
        while (currentSpeed >= minSpeed) {

            levels.push(Math.max(1, Math.round(currentSpeed)));
            currentSpeed = currentSpeed / ratio;
        }

        return levels.reverse();
    }

    bindSpeedControls() {
        const slider = document.getElementById('speedSlider');
        const speedValue = document.getElementById('speedValue');
        const speedPreset = document.getElementById('speedPreset');


        slider.min = 0;
        slider.max = this.speedLevels.length - 1;
        slider.value = Math.floor(this.speedLevels.length / 2);


        this.updateSpeedDisplay(this.updateInterval);


        slider.addEventListener('input', (e) => {
            const speed = this.speedLevels[e.target.value];
            this.updateSpeed(speed);
            this.updateSpeedDisplay(speed);
        });


        speedPreset.addEventListener('change', (e) => {
            const speedIndex = this.getSpeedPresetIndex(e.target.value);
            slider.value = speedIndex;
            const speed = this.speedLevels[speedIndex];
            this.updateSpeed(speed);
            this.updateSpeedDisplay(speed);
        });
    }

    updateSpeedDisplay(speed) {
        const speedValue = document.getElementById('speedValue');

        if (speed >= 1000) {
            speedValue.textContent = `${(speed / 1000).toFixed(1)}秒/代`;
        } else if (speed === 1) {
            speedValue.textContent = `最大速度`;
        } else {
            speedValue.textContent = `${speed}毫秒/代`;
        }
    }

    getSpeedPresetIndex(preset) {
        const length = this.speedLevels.length;
        switch (preset) {
            case 'slow': return Math.floor(length * 0.85);
            case 'medium': return Math.floor(length * 0.5);
            case 'fast': return Math.floor(length * 0.15);
            case 'max': return 0;
            default: return Math.floor(length * 0.5);
        }
    }

    createGrid() {
        return Array(this.rows).fill().map(() => Array(this.cols).fill(0));
    }

    bindEvents() {
        const toggleBtn = document.getElementById('toggleBtn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                if (this.isRunning) {
                    this.pause();
                } else {
                    this.start();
                }
            });
        }

        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clear();
                const toggleBtn = document.getElementById('toggleBtn');
                if (toggleBtn) {
                    toggleBtn.classList.remove('running');
                    toggleBtn.querySelector('.btn-text').textContent = '开始';
                }
            });
        }

        const patternSelect = document.getElementById('patternSelect');
        if (patternSelect) {
            patternSelect.addEventListener('change', (e) => {
                if (e.target.value) {
                    this.createPattern(e.target.value);
                }
            });
        }


        let isMouseDown = false;
        let toggleValue = null;

        if (this.canvas) {
            this.canvas.addEventListener('mousedown', (e) => {
                isMouseDown = true;
                this.handleCanvasDraw(e, true);
            });

            this.canvas.addEventListener('mousemove', (e) => {
                if (isMouseDown) {
                    this.handleCanvasDraw(e, false);
                }
            });

            document.addEventListener('mouseup', () => {
                isMouseDown = false;
                toggleValue = null;
            });
        }

        const torusMode = document.getElementById('torusMode');
        if (torusMode) {
            torusMode.addEventListener('change', (e) => {
                this.torusMode = e.target.checked;
                this.draw();
            });
        }


        this.handleCanvasDraw = (e, toggle) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const col = Math.floor(x / this.cellSize);
            const row = Math.floor(y / this.cellSize);

            if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
                if (toggleValue === null && toggle) {
                    toggleValue = this.grid[row][col] ? 0 : 1;
                }
                if (toggleValue !== null) {
                    this.grid[row][col] = toggleValue;
                    this.draw();
                }
            }
        };
    }


    draw() {

        this.ctx.clearRect(0, 0, this.width, this.height);


        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 0.5;

        this.ctx.beginPath();
        for (let i = 0; i <= 0 1 this.rows; i++) { this.ctx.moveto(0, i * this.cellsize); this.ctx.lineto(this.width, } for (let <="this.cols;" this.ctx.moveto(i this.cellsize, 0); this.ctx.lineto(i this.height); this.ctx.stroke(); this.ctx.fillstyle="#08f" ; row="0;" row++) col="0;" this.cols; col++) if (this.grid[row][col]) this.ctx.fillrect( this.cellsize + 1, - ); countneighbors(row, col) let count="0;" j="-1;" j++) (i="==" && 0) continue; newrow, newcol; (this.torusmode) newrow="(row" this.rows) % newcol="(col" this.cols) else i; j; (newrow ||>= this.rows ||
                        newCol < 0 || newCol >= this.cols) {
                        continue;
                    }
                }

                count += this.grid[newRow][newCol];
            }
        }
        return count;
    }

    update() {
        if (this.stats.cycleFound) {
            this.updateGridOnly();
        } else {
            this.updateWithStats();
        }
    }


    updateGridOnly() {
        const newGrid = this.createGrid();
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const neighbors = this.countNeighbors(row, col);
                if (this.grid[row][col]) {
                    newGrid[row][col] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
                } else {
                    newGrid[row][col] = neighbors === 3 ? 1 : 0;
                }
            }
        }
        this.grid = newGrid;
    }

    updateWithStats() {
        const beforeCount = this.countAliveCells();
        const beforeHash = this.calculateGridHash();


        const newGrid = this.createGrid();
        let aliveCount = 0;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const neighbors = this.countNeighbors(row, col);
                if (this.grid[row][col]) {
                    newGrid[row][col] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
                } else {
                    newGrid[row][col] = neighbors === 3 ? 1 : 0;
                }
                aliveCount += newGrid[row][col];
            }
        }

        this.grid = newGrid;


        this.updateStats(beforeCount, aliveCount, beforeHash);
        this.updateStatsDisplay();
    }

    updateStats(beforeCount, afterCount, currentHash) {
        this.stats.generation++;


        const births = Math.max(0, afterCount - beforeCount);
        const deaths = Math.max(0, beforeCount - afterCount);
        this.stats.births += births;
        this.stats.deaths += deaths;
        this.stats.currentAlive = afterCount;


        if (!this.stats.cycleFound) {
            if (this.stats.stateHistory.has(currentHash)) {
                const previousGen = this.stats.stateHistory.get(currentHash);
                this.stats.cycleFound = true;
                this.stats.cycleLength = this.stats.generation - previousGen;
                this.stats.cycleStart = previousGen;
            } else {
                this.stats.stateHistory.set(currentHash, this.stats.generation);
            }
        }
    }

    updateStatsDisplay() {
        const statsDiv = document.getElementById('gameStats');
        if (!statsDiv) return;

        let html = `
            <div class="stats-container">
                <div class="stat-item">
                    <span class="stat-label">代数</span>
                    <span class="stat-value">${this.stats.generation}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">当前存活</span>
                    <span class="stat-value">${this.stats.currentAlive}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">总出生数</span>
                    <span class="stat-value">${this.stats.births}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">总死亡数</span>
                    <span class="stat-value">${this.stats.deaths}</span>
                </div>
                <div class="stat-item cycle-info">
                    ${this.stats.cycleFound ?
                `<span class="stat-label">发现循环!周期: ${this.stats.cycleLength}</span>
                         <span class="stat-value">开始于第 ${this.stats.cycleStart} 代</span>`
                :
                `<span class="stat-label">循环状态</span>
                        <span class="stat-value">正在寻找循环...</span>`}
                </div>`;

        html += `</div>`;
        statsDiv.innerHTML = html;
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastUpdate = performance.now();
            const loop = (now) => {
                if (!this.isRunning) return;

                const elapsed = now - this.lastUpdate;
                if (elapsed >= this.updateInterval) {
                    this.update();
                    this.draw();
                    this.lastUpdate = now;
                }

                this.animationFrameId = requestAnimationFrame(loop);
            };
            this.animationFrameId = requestAnimationFrame(loop);

            const toggleBtn = document.getElementById('toggleBtn');
            if (toggleBtn) {
                toggleBtn.classList.add('running');
                toggleBtn.querySelector('.btn-text').textContent = '暂停';
            }
        }
    }

    pause() {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        const toggleBtn = document.getElementById('toggleBtn');
        if (toggleBtn) {
            toggleBtn.classList.remove('running');
            toggleBtn.querySelector('.btn-text').textContent = '开始';
        }
    }


    clear() {
        this.pause();
        this.grid = this.createGrid();
        this.stats = this.createNewStats();
        if (this.isRunning) {
            this.updateStatsDisplay();
        }
        this.draw();
    }

    randomize() {
        this.clear();
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col] = Math.random() < this.density ? 1 : 0;
            }
        }
        this.draw();
    }

    createPattern(patternName) {
        this.clear();
        const pattern = this.patterns[patternName];
        if (!pattern) return;

        const startRow = Math.floor(this.rows / 2 - pattern.length / 2);
        const startCol = Math.floor(this.cols / 2 - pattern[0].length / 2);

        for (let i = 0; i < pattern.length; i++) {
            for (let j = 0; j < pattern[i].length; j++) {
                if (startRow + i >= 0 && startRow + i < this.rows &&
                    startCol + j >= 0 && startCol + j < this.cols) {
                    this.grid[startRow + i][startCol + j] = pattern[i][j];
                }
            }
        }
        this.draw();
    }

    updateSpeed(newSpeed) {
        this.updateInterval = newSpeed;

        if (this.isRunning) {
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
            this.intervalId = setInterval(() => {
                if (this.isRunning) {
                    this.update();
                    this.draw();
                }
            }, this.updateInterval);
        }
    }

    bindDensityControls() {
        const slider = document.getElementById('densitySlider');
        const densityValue = document.getElementById('densityValue');
        const randomizeBtn = document.getElementById('randomizeBtn');


        slider.addEventListener('input', (e) => {
            this.density = parseInt(e.target.value) / 100;
            densityValue.textContent = `${e.target.value}%`;
            this.updateRandomizeButtonText();
        });


        randomizeBtn.addEventListener('click', () => {
            if (this.isRunning) {
                this.pause();
            }
            this.randomize();
        });


        this.updateRandomizeButtonText();
    }

    updateRandomizeButtonText() {
        const btn = document.getElementById('randomizeBtn');
        const density = Math.round(this.density * 100);

        let description;
        if (density <= 20) description="稀疏" ; else if (density <="40)" btn.textcontent="`随机生成" (${description})`; } setdensitypreset(preset) { const slider="document.getElementById('densitySlider');" densityvalue="document.getElementById('densityValue');" let density; switch (preset) case 'sparse': density="15;" break; 'low': 'medium': 'high': 'extreme': default: slider.value="density;" this.density="density" 100; densityvalue.textcontent="`${density}%`;" this.updaterandomizebuttontext(); calculategridhash() return this.grid.map(row> row.join('')).join('');
    }

    createNewStats() {
        return {
            generation: 0,
            births: 0,
            deaths: 0,
            cycleFound: false,
            cycleLength: 0,
            cycleStart: 0,
            stateHistory: new Map(),
            currentAlive: 0
        };
    }

    countAliveCells() {
        let count = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                count += this.grid[row][col];
            }
        }
        return count;
    }
}


let gameInstance = null;
console.log('Script loaded');

window.addEventListener('load', () => {
    console.log('Load event fired');
    if (!gameInstance) {
        console.log('Creating new instance');
        gameInstance = new GameOfLife(1760, 800, 5);
        gameInstance.draw();
    }
}, { once: true });  </=></=>