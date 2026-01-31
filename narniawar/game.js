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
            this.ctx.globalCompositeOperation = 'overlay';
            this.ctx.globalAlpha = 0.4;
            
            const overlay = this.ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
            
            switch (era.id) {
                case 1: // Genesis - Deep purple mystical
                    overlay.addColorStop(0, '#6a4a8a');
                    overlay.addColorStop(1, '#3a2a5a');
                    break;
                case 2: // Winter - Icy blue-white
                    overlay.addColorStop(0, '#e8f4f8');
                    overlay.addColorStop(1, '#b8d4e0');
                    break;
                case 3: // Golden Age - Warm golden glow
                    overlay.addColorStop(0, '#f5e5c5');
                    overlay.addColorStop(1, '#e4c594');
                    break;
                case 4: // Dark Age - Deep forest green
                    overlay.addColorStop(0, '#6a7a5a');
                    overlay.addColorStop(1, '#4a5a3a');
                    break;
                case 5: // Seafarer - Ocean blue
                    overlay.addColorStop(0, '#afdfef');
                    overlay.addColorStop(1, '#7abacd');
                    break;
                case 6: // Underland - Purple shadow
                    overlay.addColorStop(0, '#7a6a8a');
                    overlay.addColorStop(1, '#4a3a6a');
                    break;
                case 7: // Apocalypse - Darkening purple-black
                    overlay.addColorStop(0, '#8a7a96');
                    overlay.addColorStop(1, '#5a4a76');
                    break;
                default:
                    overlay.addColorStop(0, '#f8ecca');
                    overlay.addColorStop(1, '#d4c8a0');
            }
            
            this.ctx.fillStyle = overlay;
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
        const isSelected = this.parent && 
                          (this.parent.selectedTerritory === territory || 
                           this.parent.attackFromTerritory === territory);
        
        // Draw territory as a region polygon (like a country border)
        this.drawTerritoryRegion(territory, era, isSelected);
        
        // Draw iconic landmark for the territory
        this.drawTerritoryLandmark(territory, era);
        
        // Draw unit count and info
        this.drawTerritoryInfo(territory, era);
    }
    
    /**
     * Draw territory as a region with borders (like Risk countries)
     */
    drawTerritoryRegion(territory, era, isSelected) {
        // Define region size - MUCH LARGER for visibility
        const regionSize = 80; // Increased from 60
        
        // Determine colors
        let fillColor = 'rgba(139, 122, 106, 0.4)'; // Neutral parchment - more opaque
        let strokeColor = '#5a4a3a';
        let glowColor = 'transparent';
        
        if (territory.owner === 1) {
            fillColor = 'rgba(90, 124, 157, 0.65)'; // Player 1 blue overlay - more opaque
            strokeColor = '#2d3d52';
            glowColor = 'rgba(90, 124, 157, 0.4)';
        } else if (territory.owner === 2) {
            fillColor = 'rgba(184, 90, 90, 0.65)'; // Player 2 red overlay - more opaque
            strokeColor = '#6b3333';
            glowColor = 'rgba(184, 90, 90, 0.4)';
        }
        
        // Selection glow
        if (isSelected) {
            this.ctx.shadowBlur = 30;
            this.ctx.shadowColor = '#d4af37';
        }
        
        // Draw region glow first
        if (territory.owner) {
            this.ctx.beginPath();
            this.ctx.arc(territory.x, territory.y, regionSize + 15, 0, Math.PI * 2);
            this.ctx.fillStyle = glowColor;
            this.ctx.fill();
        }
        
        // Draw irregular region shape (like a country)
        this.ctx.beginPath();
        const points = 8;
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const variance = (Math.sin(i * 2.1 + territory.id) * 15) + (Math.cos(i * 1.8 + territory.id) * 12);
            const r = regionSize + variance;
            const x = territory.x + Math.cos(angle) * r;
            const y = territory.y + Math.sin(angle) * r;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                // Smooth curves between points
                const prevAngle = ((i - 1) / points) * Math.PI * 2;
                const prevVariance = (Math.sin((i-1) * 2.1 + territory.id) * 15) + (Math.cos((i-1) * 1.8 + territory.id) * 12);
                const prevR = regionSize + prevVariance;
                const prevX = territory.x + Math.cos(prevAngle) * prevR;
                const prevY = territory.y + Math.sin(prevAngle) * prevR;
                
                const cpX = (prevX + x) / 2 + (Math.random() - 0.5) * 10;
                const cpY = (prevY + y) / 2 + (Math.random() - 0.5) * 10;
                this.ctx.quadraticCurveTo(cpX, cpY, x, y);
            }
        }
        this.ctx.closePath();
        
        // Fill the region
        this.ctx.fillStyle = fillColor;
        this.ctx.fill();
        
        // Border with thick stroke
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = 4;
        this.ctx.stroke();
        
        // Inner highlight
        if (territory.owner) {
            this.ctx.strokeStyle = `${strokeColor}60`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
        
        // Reset shadow
        this.ctx.shadowBlur = 0;
    }
    
    /**
     * Draw iconic landmarks for each territory
     */
    drawTerritoryLandmark(territory, era) {
        this.ctx.save();
        
        switch(territory.name) {
            case 'Lantern Waste':
                this.drawLampPost(territory.x, territory.y);
                break;
            case 'Cair Paravel':
                this.drawCastle(territory.x, territory.y);
                break;
            case 'The Stone Table':
                this.drawStoneTable(territory.x, territory.y);
                break;
            case 'Beaversdam':
                this.drawDam(territory.x, territory.y);
                break;
            case 'Ettinsmoor':
            case 'Archenland':
                this.drawMountain(territory.x, territory.y);
                break;
            case 'The Lone Islands':
            case 'Galma':
                this.drawIsland(territory.x, territory.y);
                break;
            case 'Calormen':
            case 'Tashbaan':
                this.drawDesertCity(territory.x, territory.y);
                break;
            case 'The Great Desert':
                this.drawDesertDune(territory.x, territory.y);
                break;
            case 'Dancing Lawn':
                this.drawTrees(territory.x, territory.y);
                break;
            case 'The Western Wild':
                this.drawWilderness(territory.x, territory.y);
                break;
            case 'Witch\'s Castle':
                this.drawWitchCastle(territory.x, territory.y);
                break;
            case 'Tumnus Cave':
            case 'Cauldron Pool':
                this.drawCave(territory.x, territory.y);
                break;
            case 'Aslan\'s How':
                this.drawHowMound(territory.x, territory.y);
                break;
            default:
                // Generic landmark
                this.drawGenericLandmark(territory.x, territory.y);
        }
        
        this.ctx.restore();
    }
    
    // Landmark drawing methods
    drawLampPost(x, y) {
        this.ctx.fillStyle = '#8b7a6a';
        this.ctx.strokeStyle = '#4a3a2a';
        this.ctx.lineWidth = 2;
        
        // Post
        this.ctx.fillRect(x - 3, y - 15, 6, 30);
        this.ctx.strokeRect(x - 3, y - 15, 6, 30);
        
        // Lamp top
        this.ctx.beginPath();
        this.ctx.arc(x, y - 18, 8, 0, Math.PI * 2);
        this.ctx.fillStyle = '#f4d03f';
        this.ctx.fill();
        this.ctx.strokeStyle = '#8b7500';
        this.ctx.stroke();
        
        // Glow
        this.ctx.beginPath();
        this.ctx.arc(x, y - 18, 12, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(244, 208, 63, 0.3)';
        this.ctx.fill();
    }
    
    drawCastle(x, y) {
        this.ctx.fillStyle = '#8b7a6a';
        this.ctx.strokeStyle = '#4a3a2a';
        this.ctx.lineWidth = 2;
        
        // Main tower
        this.ctx.fillRect(x - 12, y - 8, 24, 20);
        this.ctx.strokeRect(x - 12, y - 8, 24, 20);
        
        // Left turret
        this.ctx.fillRect(x - 18, y - 2, 8, 14);
        this.ctx.strokeRect(x - 18, y - 2, 8, 14);
        
        // Right turret
        this.ctx.fillRect(x + 10, y - 2, 8, 14);
        this.ctx.strokeRect(x + 10, y - 2, 8, 14);
        
        // Flags
        this.ctx.fillStyle = '#d4af37';
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - 8);
        this.ctx.lineTo(x + 8, y - 5);
        this.ctx.lineTo(x, y - 2);
        this.ctx.fill();
    }
    
    drawStoneTable(x, y) {
        this.ctx.fillStyle = '#9b9b9b';
        this.ctx.strokeStyle = '#5a5a5a';
        this.ctx.lineWidth = 2;
        
        // Table top
        this.ctx.fillRect(x - 20, y - 5, 40, 8);
        this.ctx.strokeRect(x - 20, y - 5, 40, 8);
        
        // Legs
        this.ctx.fillRect(x - 18, y + 3, 4, 10);
        this.ctx.fillRect(x + 14, y + 3, 4, 10);
        
        // Cracks
        this.ctx.strokeStyle = '#4a4a4a';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(x - 10, y - 5);
        this.ctx.lineTo(x - 5, y + 3);
        this.ctx.stroke();
    }
    
    drawDam(x, y) {
        this.ctx.fillStyle = '#8b6a3d';
        this.ctx.strokeStyle = '#5a4a2d';
        this.ctx.lineWidth = 2;
        
        // Dam structure
        for (let i = 0; i < 4; i++) {
            this.ctx.fillRect(x - 15 + i * 8, y - 8 + i * 3, 8, 15 - i * 3);
        }
        
        // Water
        this.ctx.fillStyle = 'rgba(90, 154, 184, 0.5)';
        this.ctx.fillRect(x - 20, y - 10, 15, 8);
    }
    
    drawMountain(x, y) {
        this.ctx.fillStyle = '#7a7a7a';
        this.ctx.strokeStyle = '#4a4a4a';
        this.ctx.lineWidth = 2;
        
        // Mountain peak
        this.ctx.beginPath();
        this.ctx.moveTo(x - 15, y + 10);
        this.ctx.lineTo(x, y - 15);
        this.ctx.lineTo(x + 15, y + 10);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Snow cap
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.moveTo(x - 5, y - 5);
        this.ctx.lineTo(x, y - 15);
        this.ctx.lineTo(x + 5, y - 5);
        this.ctx.fill();
    }
    
    drawIsland(x, y) {
        this.ctx.fillStyle = '#8b7a5a';
        this.ctx.strokeStyle = '#f4e8d4';
        this.ctx.lineWidth = 2;
        
        // Island shape
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, 20, 12, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Palm tree
        this.ctx.strokeStyle = '#5a4a2a';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + 2, y - 12);
        this.ctx.stroke();
        
        // Palm leaves
        this.ctx.strokeStyle = '#4a7a3a';
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x + 2, y - 12);
            this.ctx.lineTo(x + 2 + Math.cos(angle) * 8, y - 12 + Math.sin(angle) * 8);
            this.ctx.stroke();
        }
    }
    
    drawDesertCity(x, y) {
        this.ctx.fillStyle = '#d4a574';
        this.ctx.strokeStyle = '#8b5a2b';
        this.ctx.lineWidth = 2;
        
        // Domed building
        this.ctx.fillRect(x - 12, y - 2, 24, 15);
        this.ctx.strokeRect(x - 12, y - 2, 24, 15);
        
        // Dome
        this.ctx.beginPath();
        this.ctx.arc(x, y - 2, 12, Math.PI, 0, false);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Spire
        this.ctx.beginPath();
        this.ctx.moveTo(x - 2, y - 14);
        this.ctx.lineTo(x, y - 20);
        this.ctx.lineTo(x + 2, y - 14);
        this.ctx.fill();
    }
    
    drawDesertDune(x, y) {
        this.ctx.fillStyle = 'rgba(222, 184, 135, 0.6)';
        
        // Dunes
        this.ctx.beginPath();
        this.ctx.ellipse(x - 10, y + 5, 15, 8, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.ellipse(x + 8, y + 8, 12, 6, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawTrees(x, y) {
        this.ctx.fillStyle = '#3a5a3a';
        
        // Multiple trees
        for (let i = 0; i < 3; i++) {
            const offsetX = (i - 1) * 12;
            // Tree trunk
            this.ctx.fillStyle = '#5a4a2a';
            this.ctx.fillRect(x + offsetX - 2, y, 4, 10);
            
            // Tree top
            this.ctx.fillStyle = '#3a5a3a';
            this.ctx.beginPath();
            this.ctx.arc(x + offsetX, y - 3, 8, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawWilderness(x, y) {
        this.ctx.fillStyle = '#4a5a4a';
        
        // Rough terrain
        for (let i = 0; i < 5; i++) {
            const offsetX = (Math.random() - 0.5) * 20;
            const offsetY = (Math.random() - 0.5) * 15;
            this.ctx.beginPath();
            this.ctx.arc(x + offsetX, y + offsetY, 5, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawGenericLandmark(x, y) {
        // Simple marker
        this.ctx.beginPath();
        this.ctx.arc(x, y, 5, 0, Math.PI * 2);
        this.ctx.fillStyle = '#8b7a6a';
        this.ctx.fill();
        this.ctx.strokeStyle = '#4a3a2a';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    drawWitchCastle(x, y) {
        // Dark, foreboding castle
        this.ctx.fillStyle = '#3a3a4a';
        this.ctx.strokeStyle = '#1a1a2a';
        this.ctx.lineWidth = 2;
        
        // Main dark tower
        this.ctx.fillRect(x - 15, y - 10, 30, 25);
        this.ctx.strokeRect(x - 15, y - 10, 30, 25);
        
        // Pointed towers
        this.ctx.beginPath();
        this.ctx.moveTo(x - 15, y - 10);
        this.ctx.lineTo(x - 8, y - 20);
        this.ctx.lineTo(x - 1, y - 10);
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(x + 1, y - 10);
        this.ctx.lineTo(x + 8, y - 20);
        this.ctx.lineTo(x + 15, y - 10);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Icy effect
        this.ctx.strokeStyle = '#c8e0f0';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x - 15 + i * 10, y - 10);
            this.ctx.lineTo(x - 15 + i * 10, y + 15);
            this.ctx.stroke();
        }
    }
    
    drawCave(x, y) {
        // Cave entrance
        this.ctx.fillStyle = '#3a3a2a';
        this.ctx.strokeStyle = '#6a5a4a';
        this.ctx.lineWidth = 2;
        
        // Cave opening (arch)
        this.ctx.beginPath();
        this.ctx.arc(x, y + 5, 12, Math.PI, 0, true);
        this.ctx.lineTo(x + 12, y + 15);
        this.ctx.lineTo(x - 12, y + 15);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Dark interior
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.beginPath();
        this.ctx.arc(x, y + 5, 8, Math.PI, 0, true);
        this.ctx.fill();
    }
    
    drawHowMound(x, y) {
        // Grassy mound
        this.ctx.fillStyle = '#5a7a4a';
        this.ctx.strokeStyle = '#3a5a2a';
        this.ctx.lineWidth = 2;
        
        // Mound shape
        this.ctx.beginPath();
        this.ctx.ellipse(x, y + 5, 18, 12, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Entrance
        this.ctx.fillStyle = '#2a2a2a';
        this.ctx.fillRect(x - 5, y + 5, 10, 8);
    }
    
    /**
     * Draw territory name and unit count
     */
    drawTerritoryInfo(territory, era) {
        const strokeColor = territory.owner === 1 ? '#2d3d52' : territory.owner === 2 ? '#6b3333' : '#5a4a3a';
        
        // Territory name
        this.ctx.fillStyle = strokeColor;
        this.ctx.font = 'bold 12px Cinzel, serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Text background
        this.ctx.shadowBlur = 4;
        this.ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillText(territory.name, territory.x, territory.y + 45);
        this.ctx.shadowBlur = 0;
        
        // Unit count with circular badge
        if (territory.units.length > 0) {
            const unitCount = territory.units.filter(u => !u.isPetrified).length;
            
            // Badge position (top right of territory)
            const badgeX = territory.x + 35;
            const badgeY = territory.y - 30;
            
            // Badge background
            this.ctx.beginPath();
            this.ctx.arc(badgeX, badgeY, 18, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            this.ctx.fill();
            this.ctx.strokeStyle = strokeColor;
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
            
            // Unit icon/number
            this.ctx.fillStyle = strokeColor;
            this.ctx.font = 'bold 18px Cinzel, serif';
            this.ctx.fillText(unitCount, badgeX, badgeY + 1);
        }
        
        // Petrified units indicator
        const petrifiedCount = territory.units.filter(u => u.isPetrified).length;
        if (petrifiedCount > 0) {
            this.ctx.fillStyle = '#e8f4f8';
            this.ctx.font = 'bold 12px serif';
            this.ctx.fillText(`❄️${petrifiedCount}`, territory.x + 35, territory.y + 35);
        }
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
        this.hornUsedThisTurn = false;
        this.hasExplainedCombat = false;
        this.resizeTimeout = null;
        
        this.initializeUI();
        this.applyEraTheme();
        this.showIntro();
    }

    initializeTerritories() {
        // Create 25 territories positioned across the Narnia map with good spacing
        const canvas = document.getElementById('map-canvas');
        const w = canvas.parentElement.clientWidth || 800;
        const h = canvas.parentElement.clientHeight || 600;
        
        // 25 territories spread across the map to prevent overlap
        const territories = [
            // FAR NORTHWEST (Row 1)
            new Territory(1, 'Lantern Waste', w * 0.15, h * 0.20, [2, 6], 'FOREST'),
            new Territory(2, 'The Shuddering Wood', w * 0.25, h * 0.15, [1, 3, 7], 'FOREST'),
            new Territory(3, 'Witch\'s Castle', w * 0.35, h * 0.18, [2, 4, 8], 'MOUNTAIN'),
            new Territory(4, 'Ettinsmoor', w * 0.48, h * 0.12, [3, 5, 9], 'MOUNTAIN'),
            new Territory(5, 'The Wild Lands', w * 0.62, h * 0.15, [4, 10], 'FOREST'),
            
            // NORTHWEST (Row 2)
            new Territory(6, 'The Western Wild', w * 0.10, h * 0.35, [1, 11], 'FOREST'),
            new Territory(7, 'Tumnus Cave', w * 0.22, h * 0.32, [2, 8, 12], 'FOREST'),
            new Territory(8, 'Beaversdam', w * 0.32, h * 0.35, [3, 7, 9, 13], 'FOREST'),
            new Territory(9, 'The Great River', w * 0.45, h * 0.30, [4, 8, 10, 14], 'LAND'),
            new Territory(10, 'Owlwood', w * 0.60, h * 0.28, [5, 9, 15], 'FOREST'),
            
            // CENTRAL (Row 3)
            new Territory(11, 'Cauldron Pool', w * 0.08, h * 0.52, [6, 16], 'MOUNTAIN'),
            new Territory(12, 'Dancing Lawn', w * 0.20, h * 0.50, [7, 13, 17], 'LAND'),
            new Territory(13, 'Beruna Ford', w * 0.33, h * 0.52, [8, 12, 14, 18], 'LAND'),
            new Territory(14, 'Aslan\'s How', w * 0.47, h * 0.48, [9, 13, 15, 19], 'MOUNTAIN'),
            new Territory(15, 'Cair Paravel', w * 0.68, h * 0.45, [10, 14, 20], 'COASTAL'),
            
            // SOUTH CENTRAL (Row 4)
            new Territory(16, 'The Stone Table', w * 0.12, h * 0.68, [11, 17, 21], 'MOUNTAIN'),
            new Territory(17, 'Glasswater Creek', w * 0.25, h * 0.65, [12, 16, 18, 22], 'LAND'),
            new Territory(18, 'The Fords', w * 0.38, h * 0.68, [13, 17, 19, 23], 'LAND'),
            new Territory(19, 'The Lone Islands', w * 0.70, h * 0.62, [14, 15, 20, 24], 'COASTAL'),
            new Territory(20, 'Galma', w * 0.78, h * 0.55, [15, 19], 'COASTAL'),
            
            // FAR SOUTH (Row 5)
            new Territory(21, 'Archenland', w * 0.18, h * 0.82, [16, 22], 'MOUNTAIN'),
            new Territory(22, 'The Great Desert', w * 0.30, h * 0.85, [17, 21, 23], 'DESERT'),
            new Territory(23, 'Tashbaan', w * 0.45, h * 0.88, [18, 22, 24, 25], 'DESERT'),
            new Territory(24, 'Anvard', w * 0.60, h * 0.85, [19, 23, 25], 'MOUNTAIN'),
            new Territory(25, 'Calormen', w * 0.72, h * 0.82, [23, 24], 'DESERT')
        ];
        
        // Set starting territories - Northwest vs Far South (maximum distance)
        territories[0].owner = 1; // Lantern Waste (Player 1)
        territories[0].addUnit(new Unit('FAUN', 1, 1));
        territories[0].addUnit(new Unit('FAUN', 1, 1));
        territories[0].addUnit(new Unit('FAUN', 1, 1));
        
        territories[24].owner = 2; // Calormen (Player 2)
        territories[24].addUnit(new Unit('FAUN', 2, 25));
        territories[24].addUnit(new Unit('FAUN', 2, 25));
        territories[24].addUnit(new Unit('FAUN', 2, 25));
        
        return territories;
    }

    initializeUI() {
        // Start Game button
        document.getElementById('btn-start-game').addEventListener('click', () => {
            this.startGame();
        });
        
        // Fullscreen button
        document.getElementById('btn-fullscreen').addEventListener('click', () => {
            this.toggleFullscreen();
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
        
        // Listen for fullscreen changes
        document.addEventListener('fullscreenchange', () => {
            this.onFullscreenChange();
        });
        document.addEventListener('webkitfullscreenchange', () => {
            this.onFullscreenChange();
        });
        
        // Listen for window resize
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
    }
    
    onWindowResize() {
        // Debounce resize to avoid too many updates
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.updateTerritoryPositions();
            this.mapRenderer.resizeCanvas();
            this.render();
        }, 150);
    }
    
    toggleFullscreen() {
        const container = document.getElementById('game-container');
        
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            // Enter fullscreen
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            } else if (container.mozRequestFullScreen) {
                container.mozRequestFullScreen();
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
    
    onFullscreenChange() {
        const btn = document.getElementById('btn-fullscreen');
        const icon = btn.querySelector('.fullscreen-icon');
        
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            // In fullscreen - show exit icon
            icon.textContent = '⛶';
            this.showNotification('📱 Fullscreen Mode', 'Press the button again or ESC to exit fullscreen', 2000);
        } else {
            // Not in fullscreen - show enter icon
            icon.textContent = '⛶';
        }
        
        // Wait for resize to complete, then update territory positions
        setTimeout(() => {
            this.updateTerritoryPositions();
            this.mapRenderer.resizeCanvas();
            this.render();
        }, 100);
    }
    
    /**
     * Update territory positions to match new canvas dimensions
     */
    updateTerritoryPositions() {
        const canvas = document.getElementById('map-canvas');
        const w = canvas.parentElement.clientWidth;
        const h = canvas.parentElement.clientHeight;
        
        // 25 territories in a grid layout to prevent overlap
        const positions = [
            // Row 1 (Far North)
            { x: 0.15, y: 0.20 }, // 0: Lantern Waste
            { x: 0.25, y: 0.15 }, // 1: Shuddering Wood
            { x: 0.35, y: 0.18 }, // 2: Witch's Castle
            { x: 0.48, y: 0.12 }, // 3: Ettinsmoor
            { x: 0.62, y: 0.15 }, // 4: Wild Lands
            
            // Row 2 (Northwest)
            { x: 0.10, y: 0.35 }, // 5: Western Wild
            { x: 0.22, y: 0.32 }, // 6: Tumnus Cave
            { x: 0.32, y: 0.35 }, // 7: Beaversdam
            { x: 0.45, y: 0.30 }, // 8: Great River
            { x: 0.60, y: 0.28 }, // 9: Owlwood
            
            // Row 3 (Central)
            { x: 0.08, y: 0.52 }, // 10: Cauldron Pool
            { x: 0.20, y: 0.50 }, // 11: Dancing Lawn
            { x: 0.33, y: 0.52 }, // 12: Beruna Ford
            { x: 0.47, y: 0.48 }, // 13: Aslan's How
            { x: 0.68, y: 0.45 }, // 14: Cair Paravel
            
            // Row 4 (South Central)
            { x: 0.12, y: 0.68 }, // 15: Stone Table
            { x: 0.25, y: 0.65 }, // 16: Glasswater Creek
            { x: 0.38, y: 0.68 }, // 17: The Fords
            { x: 0.70, y: 0.62 }, // 18: Lone Islands
            { x: 0.78, y: 0.55 }, // 19: Galma
            
            // Row 5 (Far South)
            { x: 0.18, y: 0.82 }, // 20: Archenland
            { x: 0.30, y: 0.85 }, // 21: Great Desert
            { x: 0.45, y: 0.88 }, // 22: Tashbaan
            { x: 0.60, y: 0.85 }, // 23: Anvard
            { x: 0.72, y: 0.82 }  // 24: Calormen
        ];
        
        this.territories.forEach((territory, index) => {
            if (positions[index]) {
                territory.x = w * positions[index].x;
                territory.y = h * positions[index].y;
            }
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
        
        // Show dice combat explanation on first battle
        if (!this.hasExplainedCombat) {
            this.showNotification(
                '🎲 How Combat Works', 
                'DICE BATTLE (like Risk):\n\n' +
                '• Attacker rolls up to 3 dice (1 unit must stay behind)\n' +
                '• Defender rolls up to 2 dice\n' +
                '• Highest dice compare: Higher number wins\n' +
                '• Ties go to the DEFENDER\n' +
                '• Losers lose 1 unit per comparison\n\n' +
                'Example: ATK [6,4,2] vs DEF [5,3]\n' +
                '6 > 5: Defender loses 1\n' +
                '4 > 3: Defender loses 1\n' +
                'Result: Defender loses 2 units!'
            );
            this.hasExplainedCombat = true;
        }
        
        // Show combat notification
        this.showNotification('⚔️ BATTLE!', `${attacker.name} attacks ${defender.name}!`, 2000);
        
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
            case 4: // Era 4: The Horn - ONE USE PER TURN, NO ATTACKS AFTER
                if (this.hornUsedThisTurn) {
                    this.showNotification('❌ Horn Already Used', 'You can only blow the Horn once per turn!');
                    return;
                }
                
                this.showNotification('📯 The Horn of Narnia!', 'Old Narnia awakens! Centaurs emerge from your forests. You cannot attack this turn.');
                this.soundManager.play('hornCall');
                
                let unitsAdded = 0;
                // Add units to forest territories owned by current player
                this.territories.forEach(t => {
                    if (t.owner === this.currentPlayer && t.type === 'FOREST') {
                        t.addUnit(new Unit('CENTAUR', this.currentPlayer, t.id));
                        unitsAdded++;
                    }
                });
                
                if (unitsAdded === 0) {
                    this.showNotification('❌ No Forests!', 'You don\'t control any forest territories to summon reinforcements!');
                } else {
                    // Mark horn as used and skip to fortify phase (no attacks)
                    this.hornUsedThisTurn = true;
                    this.phase = 'FORTIFY';
                    this.updatePhaseUI();
                }
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
        this.hornUsedThisTurn = false;
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
                
                // Explain special mechanics after transition
                this.explainEraMechanic();
            }, 500);
        }, 4000);
    }
    
    explainEraMechanic() {
        switch(this.currentEra.id) {
            case 2: // Winter - Petrification
                this.showNotification(
                    '❄️ Petrification Mechanic',
                    'THE LONG WINTER:\n\n' +
                    'When you defeat enemy units, they turn to STONE instead of dying!\n\n' +
                    '• Frozen units shown as ❄️ with a number\n' +
                    '• They block the territory but can\'t fight\n' +
                    '• They stay frozen until the era ends\n\n' +
                    'The White Witch\'s curse preserves them in ice!'
                );
                break;
            case 3: // Golden Age
                this.showNotification(
                    '🏇 Cavalry Raids',
                    'THE GOLDEN AGE:\n\n' +
                    'Cavalry units move faster and hit harder in this era of peace and prosperity!'
                );
                break;
            case 4: // Dark Age
                this.showNotification(
                    '📯 The Horn of Narnia',
                    'THE DARK AGE:\n\n' +
                    'Use the Special Action button to blow the Horn!\n\n' +
                    '• Summons Centaurs to all your FOREST territories\n' +
                    '• Can only use ONCE per turn\n' +
                    '• You CANNOT attack the same turn you use it\n\n' +
                    'Choose wisely: reinforcements or conquest?'
                );
                break;
            case 5: // Seafarer
                this.showNotification(
                    '⛵ Naval Supremacy',
                    'THE VOYAGE:\n\n' +
                    '• ALL coastal territories can now attack each other by sea!\n' +
                    '• Islands are worth double points\n' +
                    '• Control the oceans to control Narnia!'
                );
                break;
            case 7: // Apocalypse
                this.showNotification(
                    '🔥 THE LAST BATTLE',
                    'THE WORLD ENDS:\n\n' +
                    '• The map will disappear from the edges inward\n' +
                    '• Get your units to THE STABLE (center) to survive\n' +
                    '• Most units saved = winner of the cycle\n\n' +
                    'This is the end... and the beginning!'
                );
                break;
        }
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

    showNotification(title, message, duration = 0) {
        const notification = document.getElementById('event-notification');
        const titleEl = notification.querySelector('.notification-title');
        const messageEl = notification.querySelector('.notification-message');
        
        titleEl.textContent = title;
        messageEl.textContent = message;
        
        // Remove any existing OK button
        const existingBtn = notification.querySelector('.btn-ok');
        if (existingBtn) {
            existingBtn.remove();
        }
        
        // Always add OK button so players can read the notification
        const okButton = document.createElement('button');
        okButton.className = 'btn-primary btn-ok';
        okButton.textContent = 'OK';
        okButton.style.marginTop = '16px';
        okButton.style.width = '100%';
        
        okButton.onclick = () => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.classList.add('hidden');
                notification.classList.remove('fade-out');
            }, 300);
        };
        
        notification.querySelector('.notification-content').appendChild(okButton);
        notification.classList.remove('hidden');
        
        // Auto-hide only if duration is set (for very minor notifications)
        if (duration > 0) {
            setTimeout(() => {
                if (!notification.classList.contains('hidden')) {
                    okButton.click();
                }
            }, duration);
        }
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
