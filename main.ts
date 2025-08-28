declare const Chart: any; // Declaramos o Chart como global
declare const MatrixController: any; // Declaramos o controller do Heatmap
declare const MatrixElement: any; // Declaramos o elemento do Heatmap

// URL base da nossa API
const API_BASE_URL = 'http://localhost:8080/api/analyses';

// --- Funções para Gráficos ---

async function createActionsByStatusChart() {
    const response = await fetch(`${API_BASE_URL}/actions-by-status`);
    const data: { status: string; quantity: number }[] = await response.json();
    const ctx = (document.getElementById('actionsByStatusChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.map(item => item.status),
            datasets: [{
                label: 'Quantidade',
                data: data.map(item => item.quantity),
                backgroundColor: ['rgba(75, 192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)'],
            }]
        }
    });
}

async function createProductsByTypeChart() {
    const response = await fetch(`${API_BASE_URL}/products-by-type`);
    const data: { type: string; quantity: number }[] = await response.json();
    const ctx = (document.getElementById('productsByTypeChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.type),
            datasets: [{
                label: 'Total de Produtos',
                data: data.map(item => item.quantity),
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });
}

async function createMonthlyProductionChart() {
    const year = 2024;
    const response = await fetch(`${API_BASE_URL}/monthly-production?year=${year}`);
    const data: { month: number; quantity: number }[] = await response.json();
    const ctx = (document.getElementById('monthlyProductionChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
            datasets: [{
                label: `Produção em ${year}`,
                data: data.map(item => item.quantity),
                borderColor: 'rgb(255, 159, 64)',
                tension: 0.1
            }]
        }
    });
}

async function createActionsByUserChart() {
    const response = await fetch(`${API_BASE_URL}/actions-by-user`);
    const data: { userName: string; actionCount: number }[] = await response.json();
    const ctx = (document.getElementById('actionsByUserChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.userName),
            datasets: [{
                label: 'Nº de Ações Coordenadas',
                data: data.map(item => item.actionCount),
                backgroundColor: 'rgba(153, 102, 255, 0.7)',
            }]
        },
        options: { indexAxis: 'y', scales: { x: { beginAtZero: true } } }
    });
}

async function createHeatmapChart() {
    const response = await fetch(`${API_BASE_URL}/heatmap-thematic-knowledge`);
    const data: { thematicArea: string, knowledgeArea: string, quantity: number }[] = await response.json();
    const ctx = (document.getElementById('heatmapChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;

    const thematicLabels = [...new Set(data.map(d => d.thematicArea))].sort();
    const knowledgeLabels = [...new Set(data.map(d => d.knowledgeArea))].sort();
    const matrixData = thematicLabels.map(thematic => 
        knowledgeLabels.map(knowledge => {
            const point = data.find(d => d.thematicArea === thematic && d.knowledgeArea === knowledge);
            return point ? point.quantity : 0;
        })
    );
    
    new Chart(ctx, {
        type: 'matrix',
        data: {
            labels: knowledgeLabels,
            datasets: thematicLabels.map((thematic, i) => ({
                label: thematic,
                data: matrixData[i].map((value, j) => ({ x: knowledgeLabels[j], y: thematic, v: value })),
                // --- CORREÇÃO APLICADA AQUI: Adicionada a tipagem 'any' ---
                backgroundColor: (c: any) => {
                    const value = (c.dataset.data[c.dataIndex] as any).v;
                    if (value === 0) return 'rgba(240, 240, 240, 0.5)';
                    const alpha = value / Math.max(...data.map(d => d.quantity));
                    return `rgba(255, 99, 132, ${alpha})`;
                },
                borderWidth: 1,
                // --- CORREÇÃO APLICADA AQUI: Adicionada a tipagem 'any' ---
                width: ({ chart }: { chart: any }) => (chart.chartArea || {}).width / knowledgeLabels.length - 1,
                // --- CORREÇÃO APLICADA AQUI: Adicionada a tipagem 'any' ---
                height: ({ chart }: { chart: any }) => (chart.chartArea || {}).height / thematicLabels.length - 1,
            })),
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        title: () => '',
                        // --- CORREÇÃO APLICADA AQUI: Adicionada a tipagem 'any' ---
                        label: (context: any) => {
                            const d = context.dataset.data[context.dataIndex] as any;
                            return [
                                `Temática: ${d.y}`,
                                `Conhecimento: ${d.x}`,
                                `Ações: ${d.v}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: { type: 'category', labels: knowledgeLabels, ticks: { autoSkip: false } },
                y: { type: 'category', labels: thematicLabels, offset: true, ticks: { autoSkip: false } }
            }
        }
    });
}

// --- Funções para Tabelas ---

function createTable(containerId: string, headers: string[], data: any[], rowRenderer: (item: any) => string) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    thead.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = rowRenderer(item);
        tbody.appendChild(tr);
    });
    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
}

async function createFullActionReportTable() {
    const response = await fetch(`${API_BASE_URL}/full-action-report`);
    const data = await response.json();
    createTable('fullActionReportTable', 
        ['ID', 'Nome da Ação', 'Unidades', 'Autores', 'Áreas Temáticas', 'Produtos'], 
        data, 
        (item: any) => `
            <td>${item.actionId}</td>
            <td>${item.actionName}</td>
            <td><ul>${item.units.map((u: string) => `<li>${u}</li>`).join('')}</ul></td>
            <td><ul>${item.authors.map((a: string) => `<li>${a}</li>`).join('')}</ul></td>
            <td>${item.thematicAreas.join(', ')}</td>
            <td><ul>${item.products.map((p: any) => `<li>${p.title}</li>`).join('')}</ul></td>
        `
    );
}

async function createUserReportTable() {
    const response = await fetch(`${API_BASE_URL}/user-report`);
    const data = await response.json();
    createTable('userReportTable', 
        ['Nome do Utilizador', 'Tipo', 'Unidade', 'Ações Associadas'], 
        data, 
        (item: any) => `
            <td>${item.userName}</td>
            <td>${item.userType}</td>
            <td>${item.unitName}</td>
            <td><ul>${item.actions.map((a: any) => `<li>${a.title}</li>`).join('')}</ul></td>
        `
    );
}

async function createAccessesByUrlTable() {
    const response = await fetch(`${API_BASE_URL}/accesses-by-url`);
    const data = await response.json();
    createTable('accessesByUrlTable', 
        ['URL', 'Contagem de Acessos'], 
        data, 
        (item: any) => `
            <td>${item.url}</td>
            <td>${item.accessCount}</td>
        `
    );
}

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
    // Gráficos
    createActionsByStatusChart();
    createProductsByTypeChart();
    createMonthlyProductionChart();
    createActionsByUserChart();
    createHeatmapChart();
    // Tabelas
    createFullActionReportTable();
    createUserReportTable();
    createAccessesByUrlTable();
});
