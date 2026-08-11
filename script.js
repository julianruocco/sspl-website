document.addEventListener('DOMContentLoaded', () => {
    initStarfield();
    loadExecutiveBoard();
    fetchGitHubStats();
});

/* 1. Starfield Particle Canvas */
function initStarfield() {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    const numStars = 150;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5 + 0.5,
            color: '#ffffff',
            alpha: Math.random(),
            speed: Math.random() * 0.015 + 0.005
        });
    }

    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(star => {
            ctx.save();
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.globalAlpha = star.alpha;
            ctx.fill();
            ctx.restore();

            star.alpha += star.speed;
            if (star.alpha > 1 || star.alpha < 0.2) {
                star.speed = -star.speed;
            }
        });
        requestAnimationFrame(drawStars);
    }
    drawStars();
}

/* 2. Executive Board Loader (Populates 8 Slots) */
async function loadExecutiveBoard() {
    const container = document.getElementById('exec-board-container');
    if (!container) return;

    try {
        const response = await fetch('board_data.json');
        if (!response.ok) throw new Error('Could not load board_data.json');
        const data = await response.json();
        renderBoardCards(data.executive_board, container);
    } catch (err) {
        const fallbackData = Array.from({ length: 8 }, (_, i) => ({
            id: i + 1,
            name: `Board Member ${i + 1}`,
            title: i === 0 ? "Lab Director" : i === 1 ? "Chief Systems Engineer" : `Exec Position ${i + 1}`,
            major: "Aerospace / Engineering Science",
            bio: "Dedicated Penn State student leader contributing to space systems research.",
            email: `sspl-exec${i + 1}@psu.edu`,
            placeholder_label: `Exec Slot ${i + 1}`
        }));
        renderBoardCards(fallbackData, container);
    }
}

function renderBoardCards(members, container) {
    container.innerHTML = members.map(m => `
        <div class="exec-card" data-id="${m.id}">
            <div class="exec-photo-slot">
                ${m.image ? `<img src="${m.image}" alt="${m.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />` : ''}
                <div class="placeholder-icon" style="${m.image ? 'display:none;' : 'display:flex; flex-direction:column; align-items:center;'}">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="1.5">
                        <path d="M20 21v-2a4 4 4 0 0 0-4-4H8a4 4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span style="font-size: 0.65rem; color:#00f0ff; margin-top:4px;">${m.placeholder_label || 'Photo Slot'}</span>
                </div>
            </div>
            <h3 class="exec-name">${m.name}</h3>
            <div class="exec-title">${m.title}</div>
            <div class="exec-major">${m.major}</div>
            <p class="exec-bio">${m.bio}</p>
            <div class="exec-contact">
                <a href="mailto:${m.email}">Email Member</a>
            </div>
        </div>
    `).join('');
}

/* 3. Live GitHub Activity Fetcher */
async function fetchGitHubStats() {
    const feedElement = document.getElementById('github-live-feed');
    if (!feedElement) return;

    try {
        const res = await fetch('https://api.github.com/orgs/psu-sspl/events');
        if (!res.ok) throw new Error('GitHub API offline');
        const events = await res.json();
        feedElement.innerHTML = events.slice(0, 5).map(e => `
            <div style="margin-bottom: 8px; border-bottom: 1px dotted rgba(0,240,255,0.2); padding-bottom: 4px;">
                <span style="color:#ffb703;">[${new Date(e.created_at).toLocaleDateString()}]</span>
                <strong>${e.actor.login}</strong> pushed to <em>${e.repo.name}</em>
            </div>
        `).join('');
    } catch (e) {
        feedElement.innerHTML = `
            <div>[SYS-STATUS] Connected to GitHub Stack repository: psu-sspl/sspl-website</div>
            <div>[URL] https://github.com/psu-sspl</div>
        `;
    }
}
