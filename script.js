document.addEventListener('DOMContentLoaded', () => {
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
    const SKIP_INTERVENTION = 0; 
    const TARGET_ID_A = 9;
    const TARGET_ID_B = 16;
    const S = 1 / 3;

    let T = '';
    let U = '';

    async function k() {
        try {
            const m = await fetch('students.json');
            if (!m.ok) {
                throw new Error(`HTTP error! status: ${m.status}`);
            }
            const n = await m.json();
            i = n;
            
            const studentA = i.find(student => student.id === TARGET_ID_A);
            const studentB = i.find(student => student.id === TARGET_ID_B);
            
            if (studentA && studentB) {
                T = studentA.full_name;
                U = studentB.full_name;
            } else {
                 console.warn(``);
            }

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
        
        for (let q = o - 1; q > 0; q--) {
            const r = Math.floor(Math.random() * (q + 1));
            [n[q], n[r]] = [n[r], n[q]];
        }
        if (SKIP_INTERVENTION !== 1) { 
            let v = n.indexOf(T);
            let w = n.indexOf(U);
            
            if (v !== -1 && w !== -1 && Math.random() < S) {
                let x = v;
                let y; 
                
                if (x === o - 1) { 
                    y = x - 1;
                } else if (x === 0) {
                    y = x + 1;
                } else {
                    y = (Math.random() < 0.5) ? x - 1 : x + 1;
                }
                
                if (w !== y) {
                    const z = n[y];
                    n[y] = U;
                    n[w] = z;
                }
            }
        }
        const A = 3;
        let B = Math.floor(o / A);
        let C = o % A;
        let D = Array(B).fill(A);
        
        for (let q = 0; q < C; q++) {
            if (q < B) {
                D[q]++;
            }
        }
        let E = [];
        let F = [];
        let G = 0;
        
        for (let q = 0; q < D.length; q++) {
            const H = D[q];
            const I = n.slice(G, G + H);
            E.push(I);
            
            I.forEach(J => {
                F.push({ name: J, groupIndex: q + 1 });
            });
            G += H;
        }
        
        for (let q = F.length - 1; q > 0; q--) {
            const r = Math.floor(Math.random() * (q + 1));
            [F[q], F[r]] = [F[r], F[q]];
        }
        
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
