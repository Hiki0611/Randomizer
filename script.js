Document.addEventListener('DOMContentLoaded', () => {
    const a = document.getElementById('student-list');
    const b = document.getElementById('generate-button');
    const c = document.getElementById('groups-output');
    const d = document.getElementById('groups-section');
    const e = document.getElementById('student-list-section');
    const f = document.getElementById('reset-button');
    const g = document.getElementById('shuffling-area');
    const h = document.getElementById('flying-students-container');
    let i = [];
    const j = 500;


    async function k() {
        try {
            const m = await fetch('students.json');
            if (!m.ok) {
                throw new Error(`HTTP error! status: ${m.status}`);
            }
            const n = await m.json();
            i = n;
            
            // Удалена логика поиска studentA и studentB и присвоения T и U
            
            l();
        } catch (o) {
            console.error('Could not fetch students data:', o);
            a.innerHTML = '<p class="error-message">Error loading student data. Make sure "students.json" is correct and accessible.</p>';
        }
    }
    function l() {
        a.innerHTML = '';
        i.forEach(m => {
            const n = document.createElement('div');
            n.className = 'student-item';
            n.innerHTML = `<input type="checkbox" id="student-${m.id}" value="${m.full_name}" checked><label for="student-${m.id}">${m.id}. ${m.full_name}</label>`;
            a.appendChild(n);
        });
    }
    
    function p() {
        c.innerHTML = '';
        const m = document.querySelectorAll('#student-list input[type="checkbox"]:checked');
        let n = Array.from(m).map(o => o.value);
        const o = n.length;
        
        if (o < 3) {
            c.innerHTML = '<p class="error-message">Please select at least 3 students to form a group.</p>';
            d.classList.remove('hidden');
            e.classList.add('hidden');
            return;
        }
        
        // 1. Случайное перемешивание (Fisher-Yates shuffle)
        for (let q = o - 1; q > 0; q--) {
            const r = Math.floor(Math.random() * (q + 1));
            [n[q], n[r]] = [n[r], n[q]];
        }
        
        // Удален весь блок условного вмешательства (накрутки)
        
        // 2. Определение размеров групп (минимальный размер A=3)
        const A = 3;
        let B = Math.floor(o / A);
        let C = o % A;
        let D = Array(B).fill(A);
        
        // Распределение остатка (C) по первым группам
        for (let q = 0; q < C; q++) {
            if (q < B) {
                D[q]++;
            }
        }
        
        // 3. Формирование групп
        let E = []; // Группы (массивы имен)
        let F = []; // Студенты с назначенным groupIndex для анимации
        let G = 0; // Индекс начала среза
        
        for (let q = 0; q < D.length; q++) {
            const H = D[q];
            const I = n.slice(G, G + H);
            E.push(I);
            
            I.forEach(J => {
                F.push({ name: J, groupIndex: q + 1 });
            });
            G += H;
        }
        
        // 4. Перемешивание F для случайного порядка анимации
        for (let q = F.length - 1; q > 0; q--) {
            const r = Math.floor(Math.random() * (q + 1));
            [F[q], F[r]] = [F[r], F[q]];
        }
        
        // 5. Запуск анимации
        d.classList.remove('hidden');
        e.classList.add('hidden');
        g.classList.remove('hidden');
        h.innerHTML = '';
        
        F.forEach(m => {
            const n = document.createElement('div');
            n.className = 'flying-student-block';
            n.textContent = m.name;
            h.appendChild(n);
        });
        K(E, F);
    }
    
    function K(L, M) {
        c.innerHTML = L.map((m, n) => `<div class="group-card group-preview" id="group-${n + 1}"><h3>Group ${n + 1} (<span class="group-count">0</span>/${m.length} students)</h3><ul>${Array(m.length).fill('<li><span class="placeholder-name">Waiting...</span></li>').join('')}</ul></div>`).join('');
        
        const N = setInterval(() => {
            if (M.length === 0) {
                clearInterval(N);
                g.classList.add('hidden');
                return;
            }
            
            const m = M.shift();
            const n = m.name;
            const o = m.groupIndex;
            const P = document.getElementById(`group-${o}`);
            
            if (P) {
                const Q = P.querySelector('ul');
                const R = P.querySelector('.group-count');
                const S = parseInt(R.textContent);
                const T = Q.children[S];
                
                if (T) {
                    T.innerHTML = n;
                    T.classList.add('fading-in-member');
                    T.querySelector('.placeholder-name')?.remove();
                }
                
                const U = S + 1;
                R.textContent = U;
                
                const V = Array.from(h.children).find(
                    W => W.textContent === n
                );
                
                if (V) {
                    V.classList.add('fly-to-group');
                    
                    setTimeout(() => {
                        V.remove();
                        if (U === L[o - 1].length) {
                            P.classList.remove('group-preview');
                            P.classList.add('group-completed');
                        }
                    }, j);
                }
            }
        }, j);
    }

    b.addEventListener('click', p);
    
    f.addEventListener('click', () => {
        d.classList.add('hidden');
        g.classList.add('hidden');
        e.classList.remove('hidden');
        c.innerHTML = '';
        k();
    });
    
    k();
});
