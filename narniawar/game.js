/* ============================================
   NARNIA: THE ETERNAL CYCLE - GAME LOGIC
   A territory control strategy game through 7 eras
   ============================================ */

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================

const ERAS = {
    GENESIS: {
        id: 1,
        name: 'The Magician\'s Nephew',
        subtitle: 'Genesis',
        description: 'In the beginning, there was only the void. Now, a world blooms from nothingness. Claim your place in creation.',
        turnsToNext: 8,
        mechanicName: 'Plant',
        mechanicDescription: 'Plant territories to claim them',
        mapEffect: 'genesis',
        colors: { primary: '#2a1a3d', secondary: '#6b4e8a', accent: '#d4af37' }
    },
    WINTER: {
        id: 2,
        name: 'The Lion, The Witch, and The Wardrobe',
        subtitle: 'The Long Winter',
        description: 'Always winter, never Christmas. The White Witch holds dominion. Beware the petrifying cold.',
        turnsToNext: 10,
        mechanicName: 'Petrify',
        mechanicDescription: 'Defeated units turn to stone',
        mapEffect: 'snowfall',
        colors: { primary: '#e8f4f8', secondary: '#5a8ea8', accent: '#ffffff' }
    },
    GOLDEN_AGE: {
        id: 3,
        name: 'The Horse and His Boy',
        subtitle: 'The Golden Age',
        description: 'Peace reigns from Cair Paravel. But to the south, Calormen stirs. The desert tests all who cross it.',
        turnsToNext: 10,
        mechanicName: 'Raid',
        mechanicDescription: 'Cavalry moves twice as fast',
        mapEffect: 'desert-heat',
        colors: { primary: '#d4a574', secondary: '#8b5a2b', accent: '#f4d03f' }
    },
    DARK_AGE: {
        id: 4,
        name: 'Prince Caspian',
        subtitle: 'The Dark Age',
        description: 'Old Narnia awakens from the deep forests. The Telmarines rule, but their castles crumble. The Horn calls.',
        turnsToNext: 10,
        mechanicName: 'The Horn',
        mechanicDescription: 'Summon reinforcements from forests',
        mapEffect: 'forest-density',
        colors: { primary: '#3d5a3d', secondary: '#1a2e1a', accent: '#7a9d7a' }
    },
    SEAFARER: {
        id: 5,
        name: 'The Voyage of the Dawn Treader',
        subtitle: 'The Seafarer',
        description: 'The eastern seas call. Islands hold both treasure and terror. Beware the Dark Island\'s madness.',
        turnsToNext: 10,
        mechanicName: 'Naval Supremacy',
        mechanicDescription: 'Coastal territories worth double',
        mapEffect: 'ocean-waves',
        colors: { primary: '#2c5f7c', secondary: '#1a3d52', accent: '#7fc7d9' }
    },
    UNDERLAND: {
        id: 6,
        name: 'The Silver Chair',
        subtitle: 'The Underland',
        description: 'Beneath the world, shadows deepen. The Green Witch weaves her enchantments. Reality bends.',
        turnsToNext: 8,
        mechanicName: 'Enchantment',
        mechanicDescription: 'Mind control enemy units',
        mapEffect: 'shadow-realm',
        colors: { primary: '#3d2955', secondary: '#1e1433', accent: '#8a6fa8' }
    },
    APOCALYPSE: {
        id: 7,
        name: 'The Last Battle',
        subtitle: 'The Apocalypse',
        description: 'The world unmakes itself. Darkness swallows all. Only those who reach the Stable Door shall endure.',
        turnsToNext: 12,
        mechanicName: 'Evacuation',
        mechanicDescription: 'Reach the center before the end',
        mapEffect: 'burning-edge',
        colors: { primary: '#4a3055', secondary: '#2d1a3d', accent: '#b87aa0' }
    }
};

const UNIT_TYPES = {
    FAUN: { name: 'Faun', strength: 1, cost: 1, alignment: 'GOOD' },
    DWARF: { name: 'Dwarf', strength: 2, cost: 2, alignment: 'NEUTRAL' }, // Will split in Era 4
    CENTAUR: { name: 'Centaur', strength: 3, cost: 3, alignment: 'GOOD' },
    MINOTAUR: { name: 'Minotaur', strength: 3, cost: 3, alignment: 'EVIL' }, // Switches in Era 4
    WOLF: { name: 'Wolf', strength: 2, cost: 2, alignment: 'EVIL' },
    CAVALRY: { name: 'Cavalry', strength: 2, cost: 2, alignment: 'GOOD', special: 'fast' },
    GIANT: { name: 'Giant', strength: 4, cost: 4, alignment: 'NEUTRAL' }
};

const LEGACY_TRAITS = [
    { name: 'Friend of the Stars', description: 'Start with +3 territories', effect: 'STARTING_TERRITORIES' },
    { name: 'Ancient Bloodline', description: 'All units +1 strength', effect: 'UNIT_BONUS' },
    { name: 'Deep Magic', description: 'Draw an extra card each turn', effect: 'EXTRA_CARD' },
    { name: 'Lamppost\'s Light', description: 'See through fog of war', effect: 'VISION' },
    { name: 'Aslan\'s Blessing', description: 'Cannot lose first territory each era', effect: 'PROTECTION' }
];

// ============================================
// UNIT CLASS
// ============================================

class Unit {
    constructor(type, owner, position) {
        this.type = type;
        this.owner = owner; // 1 or 2
        this.position = position;
        this.baseStrength = UNIT_TYPES[type].strength;
        this.alignment = UNIT_TYPES[type].alignment;
        this.isPetrified = false;
        this.isEnchanted = false;
    }

    /**
     * CRITICAL METHOD: Updates unit alignment based on current era
     * This is where Minotaurs switch sides, Dwarfs split, etc.
     */
    updateAlignment(currentEra) {
        const eraId = currentEra.id;
        
        // Era 2 (Winter): Minotaurs and Wolves are EVIL (White Witch faction)
        if (eraId === 2) {
            if (this.type === 'MINOTAUR' || this.type === 'WOLF') {
                this.alignment = 'EVIL';
            }
        }
        
        // Era 4 (Dark Age): Minotaurs switch to GOOD (Old Narnia faction)
        if (eraId === 4) {
            if (this.type === 'MINOTAUR') {
                this.alignment = 'GOOD';
                console.log(`🔄 Alignment Shift: Minotaur joins Old Narnia (GOOD)`);
            }
            // Dwarfs split into factions (simplified: stay NEUTRAL but get bonus)
            if (this.type === 'DWARF') {
                this.alignment = 'NEUTRAL';
            }
        }
        
        // Add more alignment rules here for other eras
        // Example: if (eraId === 6 && this.isEnchanted) { this.alignment = 'EVIL'; }
    }

    getEffectiveStrength(era) {
        let strength = this.baseStrength;
        
        if (this.isPetrified) return 0;
        
        // Era 3: Cavalry gets bonus
        if (era.id === 3 && this.type === 'CAVALRY') {
            strength += 1;
        }
        
        // Era 5: Units on coastal territories get bonus
        // (Would need territory type checking here)
        
        return strength;
    }

    petrify() {
        this.isPetrified = true;
        console.log(`❄️ ${this.type} has been petrified!`);
    }

    enchant(duration = 1) {
        this.isEnchanted = true;
        console.log(`🌀 ${this.type} is now enchanted!`);
    }
}

// ============================================
// TERRITORY CLASS
// ============================================

class Territory {
    constructor(id, name, x, y, connections, type = 'LAND') {
        this.id = id;
        this.name = name;
        this.x = x; // Position on canvas
        this.y = y;
        this.connections = connections; // Array of territory IDs
        this.owner = null; // Player 1, 2, or null
        this.units = [];
        this.type = type; // LAND, COASTAL, FOREST, DESERT, MOUNTAIN
        this.isStable = false; // For Era 7
        this.isDestroyed = false; // For Era 7
    }

    addUnit(unit) {
        this.units.push(unit);
    }

    removeUnit(unit) {
        this.units = this.units.filter(u => u !== unit);
    }

    getTotalStrength(era) {
        return this.units.reduce((sum, unit) => sum + unit.getEffectiveStrength(era), 0);
    }

    changeOwner(newOwner) {
        this.owner = newOwner;
    }
}

// ============================================
// MAP RENDERER CLASS
// ============================================

class MapRenderer {
    constructor(canvas, parent = null) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.territories = [];
        this.parent = parent; // Reference to GameLoop for selection state
        this.mapImage = new Image();
        this.mapImage.src = 'narnia-map.png';
        this.mapImageLoaded = false;
        
        this.mapImage.onload = () => {
            this.mapImageLoaded = true;
            if (this.parent) {
                this.parent.render();
            }
        };
        
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    /**
     * Draws the map with different "skins" based on the current era
     */
    render(territories, currentEra) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set background based on era
        this.drawBackground(currentEra);
        
        // Draw connections (borders)
        this.drawConnections(territories);
        
        // Draw territories
        territories.forEach(territory => {
            if (!territory.isDestroyed) {
                this.drawTerritory(territory, currentEra);
            }
        });
    }

    drawBackground(era) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Draw the actual Narnia map if loaded
        if (this.mapImageLoaded) {
            // Apply era-specific tinting
            this.ctx.save();
            
            // Draw the map image scaled to canvas
            this.ctx.globalAlpha = 0.8;
            this.ctx.drawImage(this.mapImage, 0, 0, w, h);
            
            // Apply era-specific color overlay
            this.ctx.globalCompositeOperation = 'multiply';
            
            const gradient = this.ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
            
            switch (era.id) {
                case 1: // Genesis - Purple mystical overlay
                    gradient.addColorStop(0, '#4a3a5a');
                    gradient.addColorStop(1, '#2a1a3d');
                    break;
                case 2: // Winter - Blue icy overlay
                    gradient.addColorStop(0, '#c8e0f0');
                    gradient.addColorStop(1, '#8bb4cc');
                    break;
                case 3: // Golden Age - Warm golden overlay
                    gradient.addColorStop(0, '#f5deb3');
                    gradient.addColorStop(1, '#d4a574');
                    break;
                case 4: // Dark Age - Green forest overlay
                    gradient.addColorStop(0, '#7a8a6a');
                    gradient.addColorStop(1, '#4a5a4a');
                    break;
                case 5: // Seafarer - Ocean blue overlay
                    gradient.addColorStop(0, '#9fcfdf');
                    gradient.addColorStop(1, '#5a9ab8');
                    break;
                case 6: // Underland - Deep purple overlay
                    gradient.addColorStop(0, '#5a4a6a');
                    gradient.addColorStop(1, '#2d1f3d');
                    break;
                case 7: // Apocalypse - Dark fading overlay
                    gradient.addColorStop(0, '#6a5a76');
                    gradient.addColorStop(1, '#3d2955');
                    break;
                default:
                    gradient.addColorStop(0, '#e8dcc8');
                    gradient.addColorStop(1, '#c4b8a0');
            }
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, w, h);
            
            // Reset composite operation
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.restore();
        } else {
            // Fallback to solid gradient if image not loaded
            const gradient = this.ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
            gradient.addColorStop(0, '#e8dcc8');
            gradient.addColorStop(1, '#c4b8a0');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, w, h);
        }
        
        // Add era-specific effects ON TOP of the map
        switch (era.id) {
            case 1: // Genesis - Stars appearing
                this.ctx.fillStyle = 'rgba(212, 175, 55, 0.3)';
                for (let i = 0; i < 50; i++) {
                    const x = Math.random() * w;
                    const y = Math.random() * h;
                    const size = Math.random() * 2 + 1;
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, size, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                break;
                
            case 2: // Winter - Frozen rivers and ice
                this.drawFrozenRivers();
                
                // Ice crystals
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
                this.ctx.lineWidth = 2;
                for (let i = 0; i < 20; i++) {
                    const x = Math.random() * w;
                    const y = Math.random() * h;
                    this.drawSnowflake(x, y, Math.random() * 15 + 10);
                }
                break;
                
            case 4: // Dark Age - Forest overgrowth
                this.drawForestCanopy();
                this.drawRuins();
                break;
                
            case 5: // Seafarer - Ocean waves
                this.drawOceanWaves();
                this.drawIslands();
                break;
                
            case 6: // Underland - Caverns
                this.drawCaverns();
                
                // Glowing mushrooms
                this.ctx.fillStyle = 'rgba(138, 111, 168, 0.4)';
                for (let i = 0; i < 15; i++) {
                    const x = Math.random() * w;
                    const y = Math.random() * h;
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, Math.random() * 5 + 3, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                break;
                
            case 7: // Apocalypse - Cracks and the Stable
                this.drawCracks();
                
                // The Stable door (golden center)
                this.ctx.fillStyle = 'rgba(212, 175, 55, 0.3)';
                this.ctx.beginPath();
                this.ctx.arc(w / 2, h / 2, 80, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.strokeStyle = '#d4af37';
                this.ctx.lineWidth = 4;
                this.ctx.stroke();
                break;
        }
    }
    
    drawSnowflake(x, y, size) {
        this.ctx.save();
        this.ctx.translate(x, y);
        for (let i = 0; i < 6; i++) {
            this.ctx.rotate(Math.PI / 3);
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(0, -size);
            this.ctx.stroke();
        }
        this.ctx.restore();
    }
    
    drawFrozenRivers() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Main frozen river
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 25;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(w * 0.15, h * 0.3);
        this.ctx.quadraticCurveTo(w * 0.4, h * 0.4, w * 0.55, h * 0.5);
        this.ctx.quadraticCurveTo(w * 0.65, h * 0.55, w * 0.75, h * 0.7);
        this.ctx.stroke();
        
        // Ice cracks on river
        this.ctx.strokeStyle = 'rgba(200, 220, 235, 0.8)';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            const startX = w * 0.15 + i * w * 0.12;
            const startY = h * 0.3 + i * h * 0.08;
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(startX + Math.random() * 40 - 20, startY + Math.random() * 40 - 20);
            this.ctx.stroke();
        }
    }
    
    drawDesertDunes() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Sandy dunes in the south
        this.ctx.fillStyle = 'rgba(222, 184, 135, 0.4)';
        for (let i = 0; i < 4; i++) {
            this.ctx.beginPath();
            this.ctx.ellipse(w * 0.5 + i * 100, h * 0.85, 80, 30, 0, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawForestCanopy() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Dense forest patches
        this.ctx.fillStyle = 'rgba(30, 50, 30, 0.4)';
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            this.ctx.beginPath();
            this.ctx.arc(x, y, Math.random() * 40 + 30, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Tree trunks
        this.ctx.strokeStyle = 'rgba(60, 40, 20, 0.5)';
        this.ctx.lineWidth = 4;
        for (let i = 0; i < 12; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, y + 30);
            this.ctx.stroke();
        }
    }
    
    drawRuins() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Crumbling castle walls
        this.ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
        this.ctx.fillRect(w * 0.3, h * 0.35, 40, 60);
        this.ctx.fillRect(w * 0.36, h * 0.32, 30, 40);
        
        this.ctx.strokeStyle = 'rgba(80, 80, 80, 0.5)';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(w * 0.3, h * 0.35, 40, 60);
    }
    
    drawOceanWaves() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Wave patterns
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            this.ctx.beginPath();
            const y = h * 0.3 + i * 80;
            for (let x = 0; x < w; x += 40) {
                const waveY = y + Math.sin((x + i * 20) * 0.05) * 15;
                if (x === 0) {
                    this.ctx.moveTo(x, waveY);
                } else {
                    this.ctx.lineTo(x, waveY);
                }
            }
            this.ctx.stroke();
        }
    }
    
    drawIslands() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Small islands (these will be coastal territories)
        const islands = [
            { x: w * 0.75, y: h * 0.4, size: 35 },
            { x: w * 0.8, y: h * 0.65, size: 25 },
            { x: w * 0.65, y: h * 0.75, size: 30 }
        ];
        
        islands.forEach(island => {
            // Island landmass
            this.ctx.fillStyle = 'rgba(139, 122, 106, 0.6)';
            this.ctx.beginPath();
            this.ctx.ellipse(island.x, island.y, island.size, island.size * 0.7, 0, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Beach outline
            this.ctx.strokeStyle = 'rgba(244, 232, 212, 0.5)';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        });
    }
    
    drawCaverns() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Stalactites
        this.ctx.fillStyle = 'rgba(100, 80, 120, 0.4)';
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * w;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x - 5, Math.random() * 50 + 30);
            this.ctx.lineTo(x + 5, Math.random() * 50 + 30);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }
    
    drawCracks() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Reality breaking apart
        this.ctx.strokeStyle = 'rgba(184, 122, 160, 0.5)';
        this.ctx.lineWidth = 3;
        for (let i = 0; i < 15; i++) {
            const startX = Math.random() * w;
            const startY = Math.random() * h;
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            
            let x = startX;
            let y = startY;
            for (let j = 0; j < 5; j++) {
                x += (Math.random() - 0.5) * 60;
                y += (Math.random() - 0.5) * 60;
                this.ctx.lineTo(x, y);
            }
            this.ctx.stroke();
        }
    }

    drawConnections(territories) {
        // Get current era to determine connection rules
        const currentEra = this.parent ? this.parent.currentEra : { id: 1 };
        
        this.ctx.lineCap = 'round';
        
        // Draw all connections with era-specific modifications
        const drawn = new Set();
        
        territories.forEach(territory => {
            // Get era-modified connections
            const connections = this.getEraConnections(territory, currentEra);
            
            connections.forEach(connId => {
                const key = [territory.id, connId].sort().join('-');
                if (drawn.has(key)) return;
                drawn.add(key);
                
                const connTerritory = territories.find(t => t.id === connId);
                if (connTerritory && !territory.isDestroyed && !connTerritory.isDestroyed) {
                    // Era-specific styling
                    this.styleConnectionForEra(currentEra);
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(territory.x, territory.y);
                    
                    // Add slight curve for organic feel
                    const midX = (territory.x + connTerritory.x) / 2;
                    const midY = (territory.y + connTerritory.y) / 2;
                    const offsetX = (Math.random() - 0.5) * 20;
                    const offsetY = (Math.random() - 0.5) * 20;
                    
                    this.ctx.quadraticCurveTo(midX + offsetX, midY + offsetY, connTerritory.x, connTerritory.y);
                    this.ctx.stroke();
                    
                    // Era 2: Add ice bridge indicators
                    if (currentEra.id === 2) {
                        this.drawIceBridge(territory.x, territory.y, connTerritory.x, connTerritory.y);
                    }
                }
            });
        });
    }
    
    /**
     * Returns modified connections based on current era
     * Era 2 (Winter): ALL territories connected via frozen rivers
     * Era 4 (Dark Age): Some connections broken (ruins block paths)
     * Era 5 (Seafarer): Only coastal/island territories fully connected
     */
    getEraConnections(territory, era) {
        let connections = [...territory.connections];
        
        switch(era.id) {
            case 2: // Winter: Everything connected via frozen rivers
                // Add bonus connections for adjacent territories (world is frozen solid)
                const allTerritories = this.parent ? this.parent.territories : [];
                allTerritories.forEach(other => {
                    if (other.id !== territory.id) {
                        const distance = Math.sqrt(
                            Math.pow(territory.x - other.x, 2) + 
                            Math.pow(territory.y - other.y, 2)
                        );
                        // If close enough, add frozen path
                        if (distance < 200 && !connections.includes(other.id)) {
                            connections.push(other.id);
                        }
                    }
                });
                break;
                
            case 4: // Dark Age: Some paths broken by ruins
                // Remove 30% of connections (ruins block paths)
                const brokenPaths = Math.floor(connections.length * 0.3);
                for (let i = 0; i < brokenPaths; i++) {
                    const randomIndex = Math.floor(Math.random() * connections.length);
                    connections.splice(randomIndex, 1);
                }
                break;
                
            case 5: // Seafarer: Coastal territories gain extra naval connections
                if (territory.type === 'COASTAL') {
                    const allTerritories = this.parent ? this.parent.territories : [];
                    allTerritories.forEach(other => {
                        if (other.type === 'COASTAL' && other.id !== territory.id) {
                            // Add naval routes between coastal territories
                            if (!connections.includes(other.id)) {
                                connections.push(other.id);
                            }
                        }
                    });
                }
                break;
        }
        
        return connections;
    }
    
    styleConnectionForEra(era) {
        switch(era.id) {
            case 1: // Genesis: Faint ethereal lines
                this.ctx.strokeStyle = 'rgba(106, 78, 138, 0.3)';
                this.ctx.lineWidth = 2;
                break;
            case 2: // Winter: Icy white/blue
                this.ctx.strokeStyle = 'rgba(200, 220, 235, 0.6)';
                this.ctx.lineWidth = 5;
                break;
            case 3: // Golden Age: Warm golden paths
                this.ctx.strokeStyle = 'rgba(212, 165, 116, 0.4)';
                this.ctx.lineWidth = 3;
                break;
            case 4: // Dark Age: Overgrown, broken
                this.ctx.strokeStyle = 'rgba(61, 77, 61, 0.5)';
                this.ctx.lineWidth = 2;
                this.ctx.setLineDash([10, 5]); // Dashed for broken paths
                break;
            case 5: // Seafarer: Ocean blue
                this.ctx.strokeStyle = 'rgba(127, 199, 217, 0.5)';
                this.ctx.lineWidth = 4;
                this.ctx.setLineDash([]);
                break;
            case 6: // Underland: Shadow purple
                this.ctx.strokeStyle = 'rgba(138, 111, 168, 0.4)';
                this.ctx.lineWidth = 3;
                this.ctx.setLineDash([]);
                break;
            case 7: // Apocalypse: Cracking, fading
                this.ctx.strokeStyle = 'rgba(184, 122, 160, 0.4)';
                this.ctx.lineWidth = 2;
                this.ctx.setLineDash([5, 10]); // Heavy dashing
                break;
            default:
                this.ctx.strokeStyle = 'rgba(61, 49, 38, 0.25)';
                this.ctx.lineWidth = 3;
                this.ctx.setLineDash([]);
        }
    }
    
    drawIceBridge(x1, y1, x2, y2) {
        // Draw ice crystals along the path
        const steps = 5;
        for (let i = 1; i < steps; i++) {
            const t = i / steps;
            const x = x1 + (x2 - x1) * t;
            const y = y1 + (y2 - y1) * t;
            
            this.ctx.save();
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            this.ctx.lineWidth = 1;
            this.drawSnowflake(x, y, 8);
            this.ctx.restore();
        }
    }

    drawTerritory(territory, era) {
        const radius = 45;
        const isSelected = this.parent && 
                          (this.parent.selectedTerritory === territory || 
                           this.parent.attackFromTerritory === territory);
        
        // Determine color based on owner with rich, saturated colors
        let fillColor = '#8b7a6a'; // Neutral parchment
        let strokeColor = '#3d3126';
        let glowColor = 'transparent';
        
        if (territory.owner === 1) {
            fillColor = '#5a7c9d'; // Rich blue
            strokeColor = '#2d3d52';
            glowColor = 'rgba(90, 124, 157, 0.4)';
        } else if (territory.owner === 2) {
            fillColor = '#b85a5a'; // Rich red
            strokeColor = '#6b3333';
            glowColor = 'rgba(184, 90, 90, 0.4)';
        }
        
        // Special styling for Genesis (blooming effect)
        if (era.id === 1 && !territory.owner) {
            fillColor = 'rgba(120, 100, 140, 0.3)';
            strokeColor = 'rgba(150, 120, 170, 0.5)';
        }
        
        // Special styling for Era 7 (Stable)
        if (era.id === 7 && territory.isStable) {
            fillColor = '#d4af37'; // Gold
            strokeColor = '#8b7500';
            glowColor = 'rgba(212, 175, 55, 0.6)';
        }
        
        // Selection glow
        if (isSelected) {
            this.ctx.shadowBlur = 25;
            this.ctx.shadowColor = '#d4af37';
        }
        
        // Draw territory glow
        if (glowColor !== 'transparent') {
            this.ctx.beginPath();
            this.ctx.arc(territory.x, territory.y, radius + 10, 0, Math.PI * 2);
            this.ctx.fillStyle = glowColor;
            this.ctx.fill();
        }
        
        // Draw main territory circle with hand-drawn effect
        this.ctx.beginPath();
        
        // Create irregular hand-drawn circle
        const points = 16;
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const variance = (Math.sin(i * 2.3) * 3) + (Math.cos(i * 1.7) * 2);
            const r = radius + variance;
            const x = territory.x + Math.cos(angle) * r;
            const y = territory.y + Math.sin(angle) * r;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        
        // Fill with gradient
        const gradient = this.ctx.createRadialGradient(
            territory.x - 10, territory.y - 10, 0,
            territory.x, territory.y, radius
        );
        gradient.addColorStop(0, this.lightenColor(fillColor, 20));
        gradient.addColorStop(1, fillColor);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Stroke with texture
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = 4;
        this.ctx.stroke();
        
        // Reset shadow
        this.ctx.shadowBlur = 0;
        
        // Draw inner detail circle
        this.ctx.beginPath();
        this.ctx.arc(territory.x, territory.y, radius - 8, 0, Math.PI * 2);
        this.ctx.strokeStyle = `${strokeColor}40`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Draw territory icon based on type
        this.drawTerritoryIcon(territory, era);
        
        // Draw territory name with elegant text
        this.ctx.fillStyle = strokeColor;
        this.ctx.font = 'bold 13px Cinzel, serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Text shadow for readability
        this.ctx.shadowBlur = 4;
        this.ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        this.ctx.fillText(territory.name, territory.x, territory.y - radius - 18);
        this.ctx.shadowBlur = 0;
        
        // Draw unit count with larger, more visible numbers
        if (territory.units.length > 0) {
            const unitCount = territory.units.filter(u => !u.isPetrified).length;
            
            // Unit count background
            this.ctx.beginPath();
            this.ctx.arc(territory.x, territory.y, 20, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            this.ctx.fill();
            this.ctx.strokeStyle = strokeColor;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Unit count number
            this.ctx.fillStyle = territory.owner === 1 ? '#2d3d52' : '#6b3333';
            this.ctx.font = 'bold 22px Cinzel, serif';
            this.ctx.fillText(unitCount, territory.x, territory.y + 2);
        }
        
        // Draw petrified units indicator
        const petrifiedCount = territory.units.filter(u => u.isPetrified).length;
        if (petrifiedCount > 0) {
            this.ctx.fillStyle = '#e8f4f8';
            this.ctx.font = 'bold 14px serif';
            this.ctx.fillText(`❄️${petrifiedCount}`, territory.x + 25, territory.y + 25);
        }
        
        // Draw territory type badge
        const typeEmoji = {
            'FOREST': '🌲',
            'MOUNTAIN': '⛰️',
            'COASTAL': '🌊',
            'DESERT': '🏜️',
            'LAND': '🌿'
        };
        
        if (typeEmoji[territory.type]) {
            this.ctx.font = '16px serif';
            this.ctx.fillText(typeEmoji[territory.type], territory.x + 30, territory.y - 30);
        }
    }
    
    drawTerritoryIcon(territory, era) {
        // Draw small decorative icon in center based on type/era
        this.ctx.save();
        this.ctx.globalAlpha = 0.2;
        this.ctx.strokeStyle = '#3d3126';
        this.ctx.lineWidth = 2;
        
        // Simple decorative pattern
        switch(territory.type) {
            case 'FOREST':
                // Tree pattern
                this.ctx.beginPath();
                this.ctx.moveTo(territory.x, territory.y - 10);
                this.ctx.lineTo(territory.x - 8, territory.y + 10);
                this.ctx.lineTo(territory.x + 8, territory.y + 10);
                this.ctx.closePath();
                this.ctx.stroke();
                break;
            case 'MOUNTAIN':
                // Peak pattern
                this.ctx.beginPath();
                this.ctx.moveTo(territory.x - 10, territory.y + 10);
                this.ctx.lineTo(territory.x, territory.y - 10);
                this.ctx.lineTo(territory.x + 10, territory.y + 10);
                this.ctx.stroke();
                break;
        }
        
        this.ctx.restore();
    }
    
    lightenColor(color, percent) {
        // Simple color lightening
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
                     (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
                     (B < 255 ? B < 1 ? 0 : B : 255))
                     .toString(16).slice(1);
    }
}

// ============================================
// CYCLE MANAGER CLASS (Handles New Game+)
// ============================================

class CycleManager {
    constructor() {
        this.currentCycle = this.loadCycle();
        this.legacyPoints = this.loadLegacyPoints();
    }

    loadCycle() {
        const saved = localStorage.getItem('narnia_cycle');
        return saved ? parseInt(saved) : 1;
    }

    loadLegacyPoints() {
        const saved = localStorage.getItem('narnia_legacy');
        return saved ? JSON.parse(saved) : { player1: [], player2: [] };
    }

    saveCycle() {
        localStorage.setItem('narnia_cycle', this.currentCycle);
    }

    saveLegacyPoints() {
        localStorage.setItem('narnia_legacy', JSON.stringify(this.legacyPoints));
    }

    endCycle(winner) {
        this.currentCycle++;
        
        // Award random legacy trait to winner
        const availableTraits = LEGACY_TRAITS.filter(trait => {
            const playerLegacy = winner === 1 ? this.legacyPoints.player1 : this.legacyPoints.player2;
            return !playerLegacy.some(t => t.name === trait.name);
        });
        
        if (availableTraits.length > 0) {
            const newTrait = availableTraits[Math.floor(Math.random() * availableTraits.length)];
            if (winner === 1) {
                this.legacyPoints.player1.push(newTrait);
            } else {
                this.legacyPoints.player2.push(newTrait);
            }
        }
        
        this.saveCycle();
        this.saveLegacyPoints();
        
        console.log(`🔄 Cycle ${this.currentCycle} begins! Winner: Player ${winner}`);
    }

    getLegacyTraits(player) {
        return player === 1 ? this.legacyPoints.player1 : this.legacyPoints.player2;
    }

    reset() {
        localStorage.removeItem('narnia_cycle');
        localStorage.removeItem('narnia_legacy');
        this.currentCycle = 1;
        this.legacyPoints = { player1: [], player2: [] };
    }
}

// ============================================
// SOUND MANAGER CLASS (Placeholder)
// ============================================

class SoundManager {
    constructor() {
        this.sounds = {
            swordClash: { type: 'metallic', description: 'Combat sound' },
            iceCrack: { type: 'crystalline', description: 'Era 2 transition' },
            roar: { type: 'deep', description: 'Victory/Aslan' },
            gentleWind: { type: 'ambient', description: 'Era 1 atmosphere' },
            hornCall: { type: 'brass', description: 'Era 4 special ability' },
            waves: { type: 'water', description: 'Era 5 atmosphere' }
        };
        
        console.log('🔊 SoundManager initialized (placeholder)');
    }

    play(soundName) {
        if (this.sounds[soundName]) {
            console.log(`🔊 Playing sound: ${soundName} (${this.sounds[soundName].description})`);
            // In a real implementation, you would play actual audio files here
            // Example: new Audio(`sounds/${soundName}.mp3`).play();
        }
    }

    playEraMusic(eraId) {
        console.log(`🎵 Playing Era ${eraId} music`);
    }
}

// ============================================
// GAME LOOP CLASS (Main State Machine)
// ============================================

class GameLoop {
    constructor() {
        this.state = 'INTRO'; // INTRO, CLAIMING, DEPLOYMENT, PLAYING, ERA_TRANSITION, COMBAT, VICTORY
        this.phase = 'CLAIMING'; // CLAIMING, DEPLOYMENT, ATTACK, FORTIFY
        this.currentEra = ERAS.GENESIS;
        this.turnNumber = 1;
        this.turnsInEra = 0;
        this.currentPlayer = 1;
        this.territories = this.initializeTerritories();
        this.mapRenderer = new MapRenderer(document.getElementById('map-canvas'), this);
        this.cycleManager = new CycleManager();
        this.soundManager = new SoundManager();
        
        this.selectedTerritory = null;
        this.attackFromTerritory = null;
        this.unclaimedTerritories = this.territories.filter(t => !t.owner);
        this.reinforcementsToPlace = 0;
        this.hasAttacked = false;
        
        this.initializeUI();
        this.applyEraTheme();
        this.showIntro();
    }

    initializeTerritories() {
        // Create territories positioned on the actual Narnia map
        // Coordinates are percentages of canvas size to match map features
        const canvas = document.getElementById('map-canvas');
        const w = canvas.parentElement.clientWidth || 800;
        const h = canvas.parentElement.clientHeight || 600;
        
        // Strategic map layout based on the actual Narnia map
        const territories = [
            // Western Narnia - Forests
            new Territory(1, 'Lantern Waste', w * 0.20, h * 0.35, [2, 5, 8], 'FOREST'),
            new Territory(2, 'The Western Wild', w * 0.15, h * 0.55, [1, 8, 13], 'FOREST'),
            
            // Northern Narnia - Mountains and wilderness
            new Territory(3, 'Ettinsmoor', w * 0.45, h * 0.20, [4, 6], 'MOUNTAIN'),
            new Territory(4, 'The Wild Lands', w * 0.65, h * 0.25, [3, 6, 7], 'FOREST'),
            
            // Central Narnia - Heartland
            new Territory(5, 'Beaversdam', w * 0.35, h * 0.45, [1, 6, 8, 10], 'FOREST'),
            new Territory(6, 'Dancing Lawn', w * 0.50, h * 0.45, [3, 4, 5, 7, 11], 'LAND'),
            new Territory(7, 'Cair Paravel', w * 0.70, h * 0.45, [4, 6, 9, 11], 'COASTAL'),
            
            // Southern Central - Stone Table region
            new Territory(8, 'The Stone Table', w * 0.25, h * 0.65, [1, 2, 5, 10], 'MOUNTAIN'),
            new Territory(9, 'The Lone Islands', w * 0.80, h * 0.60, [7, 12], 'COASTAL'),
            
            // Southern Narnia - Archenland border
            new Territory(10, 'Archenland', w * 0.35, h * 0.75, [5, 8, 11, 13, 14], 'MOUNTAIN'),
            new Territory(11, 'Glasswater Creek', w * 0.55, h * 0.70, [6, 7, 10, 12, 15], 'LAND'),
            new Territory(12, 'Galma', w * 0.75, h * 0.75, [9, 11, 15], 'COASTAL'),
            
            // Far South - Desert kingdoms
            new Territory(13, 'The Great Desert', w * 0.25, h * 0.88, [2, 10, 14], 'DESERT'),
            new Territory(14, 'Tashbaan', w * 0.45, h * 0.90, [10, 13, 15], 'DESERT'),
            new Territory(15, 'Calormen', w * 0.65, h * 0.88, [11, 12, 14], 'DESERT')
        ];
        
        // Set starting territories - North vs South divide
        territories[0].owner = 1; // Lantern Waste (Northwest)
        territories[0].addUnit(new Unit('FAUN', 1, 1));
        territories[0].addUnit(new Unit('FAUN', 1, 1));
        territories[0].addUnit(new Unit('FAUN', 1, 1));
        
        territories[14].owner = 2; // Calormen (Far South)
        territories[14].addUnit(new Unit('FAUN', 2, 15));
        territories[14].addUnit(new Unit('FAUN', 2, 15));
        territories[14].addUnit(new Unit('FAUN', 2, 15));
        
        return territories;
    }

    initializeUI() {
        // Start Game button
        document.getElementById('btn-start-game').addEventListener('click', () => {
            this.startGame();
        });
        
        // End Turn button
        document.getElementById('btn-end-turn').addEventListener('click', () => {
            this.endTurn();
        });
        
        // Special Action button
        document.getElementById('btn-special-action').addEventListener('click', () => {
            this.useSpecialAbility();
        });
        
        // Restart button
        document.getElementById('btn-restart').addEventListener('click', () => {
            this.restartCycle();
        });
        
        // Canvas click for territory selection
        document.getElementById('map-canvas').addEventListener('click', (e) => {
            this.handleCanvasClick(e);
        });
    }

    showIntro() {
        document.getElementById('intro-screen').classList.remove('hidden');
        
        // Display legacy traits if any
        const p1Legacy = this.cycleManager.getLegacyTraits(1);
        const p2Legacy = this.cycleManager.getLegacyTraits(2);
        
        if (p1Legacy.length > 0 || p2Legacy.length > 0) {
            this.updateLegacyDisplay();
        }
    }

    startGame() {
        document.getElementById('intro-screen').classList.add('fade-out');
        setTimeout(() => {
            document.getElementById('intro-screen').classList.add('hidden');
        }, 500);
        
        this.state = 'CLAIMING';
        this.phase = 'CLAIMING';
        
        // Apply legacy bonuses
        this.applyLegacyBonuses();
        
        // Start with claiming phase
        this.showTutorial();
        
        this.soundManager.play('gentleWind');
        this.updatePhaseUI();
        this.render();
    }
    
    showTutorial() {
        const tutorialSteps = [
            {
                title: '📜 Welcome to Narnia',
                message: 'This is a strategic territory game across 7 eras. You start with one territory. Take turns claiming unclaimed territories until all are taken.'
            },
            {
                title: '🎯 Phase 1: Claiming',
                message: 'Players alternate claiming empty territories. Click any gray territory to claim it. Each territory gives you 1 reinforcement per turn.'
            },
            {
                title: '⚔️ Phase 2: Deployment & Attack',
                message: 'After claiming, each turn you\'ll: 1) Place reinforcements, 2) Attack adjacent enemies, 3) Fortify your positions.'
            },
            {
                title: '🌟 The Eternal Cycle',
                message: 'Every few turns, a new Era begins with different rules. After Era 7, the winner earns a Legacy Trait and the world resets!'
            }
        ];
        
        let step = 0;
        const showStep = () => {
            if (step < tutorialSteps.length) {
                this.showNotification(tutorialSteps[step].title, tutorialSteps[step].message, 15000);
                step++;
                setTimeout(showStep, 5500);
            } else {
                this.showNotification('🎮 Player 1\'s Turn', 'Click a gray territory to claim it!', 15000);
            }
        };
        
        showStep();
    }
    
    updatePhaseUI() {
        const specialBtn = document.getElementById('btn-special-action');
        const endTurnBtn = document.getElementById('btn-end-turn');
        
        switch(this.phase) {
            case 'CLAIMING':
                specialBtn.textContent = 'Claiming Phase';
                specialBtn.disabled = true;
                endTurnBtn.textContent = 'Skip (Auto)';
                break;
            case 'DEPLOYMENT':
                specialBtn.textContent = `Place ${this.reinforcementsToPlace} Units`;
                specialBtn.disabled = this.reinforcementsToPlace === 0;
                endTurnBtn.textContent = 'Continue to Attack';
                break;
            case 'ATTACK':
                specialBtn.textContent = this.currentEra.mechanicName;
                specialBtn.disabled = false;
                endTurnBtn.textContent = 'End Attacks';
                break;
            case 'FORTIFY':
                specialBtn.textContent = 'Fortify Position';
                specialBtn.disabled = false;
                endTurnBtn.textContent = 'End Turn';
                break;
        }
    }

    applyLegacyBonuses() {
        const p1Traits = this.cycleManager.getLegacyTraits(1);
        const p2Traits = this.cycleManager.getLegacyTraits(2);
        
        // Example: Friend of the Stars gives starting territories
        if (p1Traits.some(t => t.effect === 'STARTING_TERRITORIES')) {
            // Give player 1 extra starting territories
            console.log('✨ Player 1 starts with bonus territories');
        }
        
        if (p2Traits.some(t => t.effect === 'STARTING_TERRITORIES')) {
            console.log('✨ Player 2 starts with bonus territories');
        }
    }

    handleCanvasClick(e) {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Find clicked territory
        const clicked = this.territories.find(t => {
            const dx = t.x - x;
            const dy = t.y - y;
            return Math.sqrt(dx * dx + dy * dy) < 40 && !t.isDestroyed;
        });
        
        if (clicked) {
            this.handleTerritoryClick(clicked);
        }
    }

    handleTerritoryClick(territory) {
        if (this.state === 'ERA_TRANSITION' || this.state === 'VICTORY') return;
        
        // CLAIMING PHASE: Alternate claiming unclaimed territories
        if (this.state === 'CLAIMING') {
            if (!territory.owner) {
                territory.changeOwner(this.currentPlayer);
                territory.addUnit(new Unit('FAUN', this.currentPlayer, territory.id));
                
                this.soundManager.play('gentleWind');
                
                // Remove from unclaimed list
                this.unclaimedTerritories = this.unclaimedTerritories.filter(t => t.id !== territory.id);
                
                // Check if all claimed
                if (this.unclaimedTerritories.length === 0) {
                    this.state = 'PLAYING';
                    this.phase = 'DEPLOYMENT';
                    this.calculateReinforcements();
                    this.showNotification('🎖️ Claiming Complete!', 'Now begins the age of conquest. Place your reinforcements!', 15000);
                } else {
                    // Switch to next player
                    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
                    this.showNotification(`Player ${this.currentPlayer}'s Turn`, `Claim a territory! ${this.unclaimedTerritories.length} remaining.`, 15000);
                }
                
                this.updatePhaseUI();
                this.render();
            }
            return;
        }
        
        // DEPLOYMENT PHASE: Place reinforcements
        if (this.phase === 'DEPLOYMENT') {
            if (territory.owner === this.currentPlayer && this.reinforcementsToPlace > 0) {
                territory.addUnit(new Unit('FAUN', this.currentPlayer, territory.id));
                this.reinforcementsToPlace--;
                
                this.showNotification('Unit Deployed', `${territory.name} reinforced! ${this.reinforcementsToPlace} remaining.`, 15000);
                
                if (this.reinforcementsToPlace === 0) {
                    this.phase = 'ATTACK';
                    this.showNotification('⚔️ Attack Phase', 'Select your territory, then click an enemy adjacent territory to attack!', 15000);
                }
                
                this.updatePhaseUI();
                this.render();
            } else if (territory.owner !== this.currentPlayer) {
                this.showNotification('❌ Invalid', 'You can only deploy to your own territories!', 15000);
            }
            return;
        }
        
        // ATTACK PHASE: Select attacker, then defender
        if (this.phase === 'ATTACK') {
            if (!this.attackFromTerritory) {
                // First click: Select attacking territory
                if (territory.owner === this.currentPlayer && territory.units.length > 1) {
                    this.attackFromTerritory = territory;
                    this.showNotification('Attacker Selected', `${territory.name} ready to attack! Select an adjacent enemy territory.`, 15000);
                    this.render();
                } else if (territory.owner === this.currentPlayer) {
                    this.showNotification('❌ Cannot Attack', 'Need at least 2 units to attack (1 must stay behind)!', 15000);
                }
            } else {
                // Second click: Select defending territory
                const isAdjacent = this.areTerritoriesConnected(this.attackFromTerritory, territory);
                
                if (territory.owner !== this.currentPlayer && isAdjacent) {
                    this.resolveCombat(this.attackFromTerritory, territory);
                    this.attackFromTerritory = null;
                    this.hasAttacked = true;
                    this.render();
                } else if (territory.owner === this.currentPlayer) {
                    // Clicked own territory - cancel attack
                    this.attackFromTerritory = null;
                    this.showNotification('Attack Cancelled', 'Select a territory to attack from.', 15000);
                    this.render();
                } else {
                    this.showNotification('❌ Invalid Target', 'Must attack an adjacent enemy territory!', 15000);
                }
            }
            return;
        }
        
        // FORTIFY PHASE: Move units between friendly territories
        if (this.phase === 'FORTIFY') {
            if (!this.selectedTerritory) {
                if (territory.owner === this.currentPlayer && territory.units.length > 1) {
                    this.selectedTerritory = territory;
                    this.showNotification('Fortify From', `${territory.name} selected. Click an adjacent friendly territory to move units.`, 15000);
                    this.render();
                }
            } else {
                const isAdjacent = this.areTerritoriesConnected(this.selectedTerritory, territory);
                
                if (territory.owner === this.currentPlayer && isAdjacent) {
                    this.fortifyTerritory(this.selectedTerritory, territory);
                    this.selectedTerritory = null;
                    this.render();
                } else {
                    this.selectedTerritory = null;
                    this.showNotification('Fortify Cancelled', '', 15000);
                    this.render();
                }
            }
        }
    }
    
    /**
     * Check if two territories are connected, considering era-specific rules
     * Era 2 (Winter): Frozen rivers connect nearby territories
     * Era 5 (Seafarer): All coastal territories connected by sea routes
     */
    areTerritoriesConnected(territory1, territory2) {
        // Base connections
        let isConnected = territory1.connections.includes(territory2.id) || 
                         territory2.connections.includes(territory1.id);
        
        // Era 2 (Winter): Extra frozen connections
        if (this.currentEra.id === 2) {
            const distance = Math.sqrt(
                Math.pow(territory1.x - territory2.x, 2) + 
                Math.pow(territory1.y - territory2.y, 2)
            );
            if (distance < 200) {
                isConnected = true;
            }
        }
        
        // Era 5 (Seafarer): Coastal territories connected by naval routes
        if (this.currentEra.id === 5) {
            if (territory1.type === 'COASTAL' && territory2.type === 'COASTAL') {
                isConnected = true;
            }
        }
        
        return isConnected;
    }

    resolveCombat(attacker, defender) {
        console.log(`⚔️ Combat: ${attacker.name} → ${defender.name}`);
        
        this.soundManager.play('swordClash');
        
        // Show combat notification
        this.showNotification('⚔️ BATTLE!', `${attacker.name} attacks ${defender.name}!`, 15000);
        
        // Dice-based combat (like Risk)
        const attackDice = Math.min(3, attacker.units.length - 1); // Keep 1 behind
        const defendDice = Math.min(2, defender.units.length);
        
        const attackRolls = Array(attackDice).fill(0).map(() => Math.floor(Math.random() * 6) + 1).sort((a, b) => b - a);
        const defendRolls = Array(defendDice).fill(0).map(() => Math.floor(Math.random() * 6) + 1).sort((a, b) => b - a);
        
        let attackerLosses = 0;
        let defenderLosses = 0;
        
        // Compare highest dice
        for (let i = 0; i < Math.min(attackDice, defendDice); i++) {
            if (attackRolls[i] > defendRolls[i]) {
                defenderLosses++;
            } else {
                attackerLosses++;
            }
        }
        
        // Delay for dramatic effect
        setTimeout(() => {
            // Apply losses
            for (let i = 0; i < attackerLosses; i++) {
                if (attacker.units.length > 1) {
                    attacker.units.pop();
                }
            }
            
            for (let i = 0; i < defenderLosses; i++) {
                if (this.currentEra.id === 2 && defender.units.length > 0) {
                    // Era 2: Petrification instead of death
                    const unit = defender.units[0];
                    unit.petrify();
                } else if (defender.units.length > 0) {
                    defender.units.pop();
                }
            }
            
            // Check if defender conquered
            const activeDefenders = defender.units.filter(u => !u.isPetrified).length;
            
            if (activeDefenders === 0) {
                // Attacker wins territory!
                const conqueredName = defender.name;
                
                if (this.currentEra.id === 2) {
                    // Remove petrified units
                    defender.units = defender.units.filter(u => !u.isPetrified);
                }
                
                defender.changeOwner(attacker.owner);
                
                // Move units from attacker to defender
                const unitsToMove = Math.min(attackDice, attacker.units.length - 1);
                for (let i = 0; i < unitsToMove; i++) {
                    const unit = attacker.units.pop();
                    unit.position = defender.id;
                    defender.addUnit(unit);
                }
                
                this.showNotification(
                    '🎖️ VICTORY!', 
                    `${conqueredName} conquered!\n🎲 ATK: [${attackRolls.join(', ')}] vs DEF: [${defendRolls.join(', ')}]\nLosses - Attacker: ${attackerLosses} | Defender: ${defenderLosses}`, 
                    5000
                );
                
                // Check for total victory
                this.checkVictoryCondition();
            } else {
                this.showNotification(
                    '⚔️ Battle Result', 
                    `🎲 ATK: [${attackRolls.join(', ')}] vs DEF: [${defendRolls.join(', ')}]\nLosses - Attacker: ${attackerLosses} | Defender: ${defenderLosses}`, 
                    4000
                );
            }
            
            this.render();
        }, 1500);
    }
    
    fortifyTerritory(from, to) {
        if (from.units.length > 1) {
            const unitsToMove = Math.floor(from.units.length / 2);
            for (let i = 0; i < unitsToMove; i++) {
                const unit = from.units.pop();
                unit.position = to.id;
                to.addUnit(unit);
            }
            this.showNotification('🛡️ Fortified', `Moved ${unitsToMove} units from ${from.name} to ${to.name}.`, 2500);
        }
    }
    
    calculateReinforcements() {
        const territories = this.territories.filter(t => t.owner === this.currentPlayer).length;
        this.reinforcementsToPlace = Math.max(3, Math.floor(territories / 3));
        
        // Bonus for controlling continents (simplified)
        const hasNorth = this.territories.slice(0, 3).every(t => t.owner === this.currentPlayer);
        const hasSouth = this.territories.slice(9, 12).every(t => t.owner === this.currentPlayer);
        
        if (hasNorth) this.reinforcementsToPlace += 2;
        if (hasSouth) this.reinforcementsToPlace += 2;
        
        // Legacy bonuses
        const traits = this.cycleManager.getLegacyTraits(this.currentPlayer);
        if (traits.some(t => t.effect === 'STARTING_TERRITORIES')) {
            this.reinforcementsToPlace += 2;
        }
        
        this.showNotification('📦 Reinforcements', `You have ${this.reinforcementsToPlace} units to deploy!`, 15000);
    }
    
    checkVictoryCondition() {
        const p1Territories = this.territories.filter(t => t.owner === 1).length;
        const p2Territories = this.territories.filter(t => t.owner === 2).length;
        
        if (p1Territories === 0) {
            this.endCycle(2);
            return true;
        }
        if (p2Territories === 0) {
            this.endCycle(1);
            return true;
        }
        
        return false;
    }

    useSpecialAbility() {
        const ability = this.currentEra.mechanicName;
        
        switch (this.currentEra.id) {
            case 4: // Era 4: The Horn
                this.showNotification('The Horn of Narnia', 'Reinforcements emerge from the ancient forests!');
                this.soundManager.play('hornCall');
                // Add units to forest territories owned by current player
                this.territories.forEach(t => {
                    if (t.owner === this.currentPlayer && t.type === 'FOREST') {
                        t.addUnit(new Unit('CENTAUR', this.currentPlayer, t.id));
                    }
                });
                break;
            
            case 6: // Era 6: Enchantment
                this.showNotification('Green Witch\'s Enchantment', 'Choose an enemy unit to control...');
                // Would open a unit selection modal
                break;
            
            default:
                this.showNotification(ability, this.currentEra.mechanicDescription);
        }
        
        this.render();
    }

    endTurn() {
        // Handle different phases
        if (this.phase === 'DEPLOYMENT' && this.reinforcementsToPlace > 0) {
            this.showNotification('⚠️ Deploy Units First', `You still have ${this.reinforcementsToPlace} units to deploy!`, 15000);
            return;
        }
        
        if (this.phase === 'DEPLOYMENT') {
            this.phase = 'ATTACK';
            this.showNotification('⚔️ Attack Phase', 'Select your territory, then an enemy to attack. Or click End Attacks to skip.', 15000);
            this.updatePhaseUI();
            return;
        }
        
        if (this.phase === 'ATTACK') {
            this.phase = 'FORTIFY';
            this.attackFromTerritory = null;
            this.showNotification('🛡️ Fortify Phase', 'Move units between your adjacent territories to strengthen defenses. Or click End Turn.', 15000);
            this.updatePhaseUI();
            return;
        }
        
        // End of full turn
        this.turnNumber++;
        this.turnsInEra++;
        
        // Switch player
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.phase = 'DEPLOYMENT';
        this.hasAttacked = false;
        this.selectedTerritory = null;
        this.attackFromTerritory = null;
        
        // Calculate new reinforcements
        this.calculateReinforcements();
        
        // Update UI
        this.updatePlayerUI();
        this.updatePhaseUI();
        
        // Check for era transition
        if (this.turnsInEra >= this.currentEra.turnsToNext) {
            this.transitionEra();
        }
        
        // Era 7: Map destruction
        if (this.currentEra.id === 7) {
            this.destroyMapEdges();
        }
        
        this.render();
    }

    transitionEra() {
        const eraKeys = Object.keys(ERAS);
        const currentIndex = eraKeys.findIndex(key => ERAS[key].id === this.currentEra.id);
        
        if (currentIndex < eraKeys.length - 1) {
            // Move to next era
            const nextEraKey = eraKeys[currentIndex + 1];
            this.currentEra = ERAS[nextEraKey];
            this.turnsInEra = 0;
            
            this.showEraTransition();
            this.applyEraTheme();
            
            // Update all unit alignments
            this.territories.forEach(territory => {
                territory.units.forEach(unit => {
                    unit.updateAlignment(this.currentEra);
                });
            });
            
            this.soundManager.playEraMusic(this.currentEra.id);
        } else {
            // Era 7 complete: End cycle
            this.endCycle();
        }
    }

    showEraTransition() {
        const transition = document.getElementById('era-transition');
        const title = transition.querySelector('.era-title');
        const subtitle = transition.querySelector('.era-subtitle');
        const description = transition.querySelector('.era-description');
        
        title.textContent = this.currentEra.name;
        subtitle.textContent = this.currentEra.subtitle;
        description.textContent = this.currentEra.description;
        
        transition.classList.remove('hidden');
        
        // Special sounds for eras
        if (this.currentEra.id === 2) {
            this.soundManager.play('iceCrack');
        }
        
        setTimeout(() => {
            transition.classList.add('fade-out');
            setTimeout(() => {
                transition.classList.add('hidden');
                transition.classList.remove('fade-out');
            }, 500);
        }, 4000);
    }

    applyEraTheme() {
        const root = document.documentElement;
        const colors = this.currentEra.colors;
        
        root.style.setProperty('--current-primary', colors.primary);
        root.style.setProperty('--current-secondary', colors.secondary);
        root.style.setProperty('--current-accent', colors.accent);
        
        // Update era display
        document.querySelector('.era-number').textContent = `Era ${this.currentEra.id}`;
        document.querySelector('.era-name').textContent = this.currentEra.name;
        
        // Toggle map effects
        document.querySelector('.snowfall').style.opacity = this.currentEra.id === 2 ? '1' : '0';
        document.querySelector('.burning-edge').style.opacity = this.currentEra.id === 7 ? '1' : '0';
        document.querySelector('.fog-of-war').style.opacity = this.currentEra.id === 6 ? '0.6' : '0';
    }

    destroyMapEdges() {
        // Era 7: Territories disappear from edges
        const centerTerritory = this.territories.find(t => t.isStable || t.name === 'The Stable');
        if (centerTerritory) {
            centerTerritory.isStable = true;
        }
        
        // Calculate distances from center
        const centerX = centerTerritory ? centerTerritory.x : this.mapRenderer.canvas.width / 2;
        const centerY = centerTerritory ? centerTerritory.y : this.mapRenderer.canvas.height / 2;
        
        this.territories.forEach(t => {
            const dx = t.x - centerX;
            const dy = t.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Destroy territories beyond certain distance
            if (distance > 300 - (this.turnsInEra * 20)) {
                if (!t.isStable && !t.isDestroyed) {
                    t.isDestroyed = true;
                    console.log(`💥 ${t.name} has been consumed by darkness`);
                }
            }
        });
    }

    endCycle() {
        // Determine winner based on Era 7 objectives
        const p1Score = this.calculateFaithPoints(1);
        const p2Score = this.calculateFaithPoints(2);
        
        const winner = p1Score > p2Score ? 1 : 2;
        
        this.soundManager.play('roar');
        this.showVictoryScreen(winner);
        
        this.cycleManager.endCycle(winner);
    }

    calculateFaithPoints(player) {
        // Count units in stable territories
        const stableTerritory = this.territories.find(t => t.isStable);
        if (!stableTerritory) return 0;
        
        return stableTerritory.units.filter(u => u.owner === player).length * 10;
    }

    showVictoryScreen(winner) {
        const screen = document.getElementById('victory-screen');
        const victorName = screen.querySelector('.victor-name');
        const legacyCard = screen.querySelector('.legacy-trait-card');
        
        victorName.textContent = `Player ${winner}`;
        
        const earnedTrait = this.cycleManager.getLegacyTraits(winner).slice(-1)[0];
        if (earnedTrait) {
            legacyCard.innerHTML = `
                <h4>${earnedTrait.name}</h4>
                <p>${earnedTrait.description}</p>
            `;
        }
        
        screen.classList.remove('hidden');
    }

    restartCycle() {
        document.getElementById('victory-screen').classList.add('hidden');
        
        // Reset to initial game state
        this.state = 'CLAIMING';
        this.phase = 'CLAIMING';
        this.currentEra = ERAS.GENESIS;
        this.turnNumber = 1;
        this.turnsInEra = 0;
        this.currentPlayer = 1;
        this.territories = this.initializeTerritories();
        this.selectedTerritory = null;
        this.attackFromTerritory = null;
        this.unclaimedTerritories = this.territories.filter(t => !t.owner);
        this.reinforcementsToPlace = 0;
        this.hasAttacked = false;
        
        // Reinitialize map renderer with new parent reference
        this.mapRenderer = new MapRenderer(document.getElementById('map-canvas'), this);
        
        this.applyEraTheme();
        this.updateLegacyDisplay();
        this.updatePhaseUI();
        
        this.showNotification('🦁 A New Cycle Begins', 'The world is reborn. Your legacy endures. Claim your territories!', 15000);
        this.render();
    }

    updateLegacyDisplay() {
        const p1Container = document.getElementById('player-1-legacy');
        const p2Container = document.getElementById('player-2-legacy');
        
        p1Container.innerHTML = '';
        p2Container.innerHTML = '';
        
        this.cycleManager.getLegacyTraits(1).forEach(trait => {
            const badge = document.createElement('span');
            badge.className = 'legacy-badge';
            badge.textContent = trait.name;
            badge.title = trait.description;
            p1Container.appendChild(badge);
        });
        
        this.cycleManager.getLegacyTraits(2).forEach(trait => {
            const badge = document.createElement('span');
            badge.className = 'legacy-badge';
            badge.textContent = trait.name;
            badge.title = trait.description;
            p2Container.appendChild(badge);
        });
    }

    updatePlayerUI() {
        // Update turn counter
        document.querySelector('.turn-number').textContent = this.turnNumber;
        
        // Update active player
        const p1Card = document.getElementById('player-1-card');
        const p2Card = document.getElementById('player-2-card');
        
        if (this.currentPlayer === 1) {
            p1Card.classList.add('active');
            p2Card.classList.remove('active');
        } else {
            p2Card.classList.add('active');
            p1Card.classList.remove('active');
        }
        
        // Update territory counts
        const p1Territories = this.territories.filter(t => t.owner === 1).length;
        const p2Territories = this.territories.filter(t => t.owner === 2).length;
        
        p1Card.querySelector('.territories .stat-value').textContent = p1Territories;
        p2Card.querySelector('.territories .stat-value').textContent = p2Territories;
        
        // Update unit counts
        const p1Units = this.territories.reduce((sum, t) => 
            sum + t.units.filter(u => u.owner === 1).length, 0);
        const p2Units = this.territories.reduce((sum, t) => 
            sum + t.units.filter(u => u.owner === 2).length, 0);
        
        p1Card.querySelector('.units .stat-value').textContent = p1Units;
        p2Card.querySelector('.units .stat-value').textContent = p2Units;
    }

    showNotification(title, message, duration = 15000) {
        const notification = document.getElementById('event-notification');
        notification.querySelector('.notification-title').textContent = title;
        notification.querySelector('.notification-message').textContent = message;
        
        notification.classList.remove('hidden');
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.classList.add('hidden');
                notification.classList.remove('fade-out');
            }, 500);
        }, duration);
    }

    render() {
        this.mapRenderer.render(this.territories, this.currentEra);
        this.updatePlayerUI();
    }
}

// ============================================
// INITIALIZE GAME
// ============================================

let game;

window.addEventListener('DOMContentLoaded', () => {
    console.log('🦁 Narnia: The Eternal Cycle - Initializing...');
    game = new GameLoop();
});
