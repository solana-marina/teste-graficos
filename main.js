"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// URL base da nossa API
const API_BASE_URL = 'http://localhost:8080/api/analyses';
// --- Funções para Gráficos ---
function createActionsByStatusChart() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const response = yield fetch(`${API_BASE_URL}/actions-by-status`);
        const data = yield response.json();
        const ctx = (_a = document.getElementById('actionsByStatusChart')) === null || _a === void 0 ? void 0 : _a.getContext('2d');
        if (!ctx)
            return;
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
    });
}
function createProductsByTypeChart() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const response = yield fetch(`${API_BASE_URL}/products-by-type`);
        const data = yield response.json();
        const ctx = (_a = document.getElementById('productsByTypeChart')) === null || _a === void 0 ? void 0 : _a.getContext('2d');
        if (!ctx)
            return;
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
    });
}
function createMonthlyProductionChart() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const year = 2024;
        const response = yield fetch(`${API_BASE_URL}/monthly-production?year=${year}`);
        const data = yield response.json();
        const ctx = (_a = document.getElementById('monthlyProductionChart')) === null || _a === void 0 ? void 0 : _a.getContext('2d');
        if (!ctx)
            return;
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
    });
}
function createActionsByUserChart() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const response = yield fetch(`${API_BASE_URL}/actions-by-user`);
        const data = yield response.json();
        const ctx = (_a = document.getElementById('actionsByUserChart')) === null || _a === void 0 ? void 0 : _a.getContext('2d');
        if (!ctx)
            return;
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
    });
}
function createHeatmapChart() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const response = yield fetch(`${API_BASE_URL}/heatmap-thematic-knowledge`);
        const data = yield response.json();
        const ctx = (_a = document.getElementById('heatmapChart')) === null || _a === void 0 ? void 0 : _a.getContext('2d');
        if (!ctx)
            return;
        const thematicLabels = [...new Set(data.map(d => d.thematicArea))].sort();
        const knowledgeLabels = [...new Set(data.map(d => d.knowledgeArea))].sort();
        const matrixData = thematicLabels.map(thematic => knowledgeLabels.map(knowledge => {
            const point = data.find(d => d.thematicArea === thematic && d.knowledgeArea === knowledge);
            return point ? point.quantity : 0;
        }));
        new Chart(ctx, {
            type: 'matrix',
            data: {
                labels: knowledgeLabels,
                datasets: thematicLabels.map((thematic, i) => ({
                    label: thematic,
                    data: matrixData[i].map((value, j) => ({ x: knowledgeLabels[j], y: thematic, v: value })),
                    // --- CORREÇÃO APLICADA AQUI: Adicionada a tipagem 'any' ---
                    backgroundColor: (c) => {
                        const value = c.dataset.data[c.dataIndex].v;
                        if (value === 0)
                            return 'rgba(240, 240, 240, 0.5)';
                        const alpha = value / Math.max(...data.map(d => d.quantity));
                        return `rgba(255, 99, 132, ${alpha})`;
                    },
                    borderWidth: 1,
                    // --- CORREÇÃO APLICADA AQUI: Adicionada a tipagem 'any' ---
                    width: ({ chart }) => (chart.chartArea || {}).width / knowledgeLabels.length - 1,
                    // --- CORREÇÃO APLICADA AQUI: Adicionada a tipagem 'any' ---
                    height: ({ chart }) => (chart.chartArea || {}).height / thematicLabels.length - 1,
                })),
            },
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: () => '',
                            // --- CORREÇÃO APLICADA AQUI: Adicionada a tipagem 'any' ---
                            label: (context) => {
                                const d = context.dataset.data[context.dataIndex];
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
    });
}
// --- Funções para Tabelas ---
function createTable(containerId, headers, data, rowRenderer) {
    const container = document.getElementById(containerId);
    if (!container)
        return;
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
function createFullActionReportTable() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${API_BASE_URL}/full-action-report`);
        const data = yield response.json();
        createTable('fullActionReportTable', ['ID', 'Nome da Ação', 'Unidades', 'Autores', 'Áreas Temáticas', 'Produtos'], data, (item) => `
            <td>${item.actionId}</td>
            <td>${item.actionName}</td>
            <td><ul>${item.units.map((u) => `<li>${u}</li>`).join('')}</ul></td>
            <td><ul>${item.authors.map((a) => `<li>${a}</li>`).join('')}</ul></td>
            <td>${item.thematicAreas.join(', ')}</td>
            <td><ul>${item.products.map((p) => `<li>${p.title}</li>`).join('')}</ul></td>
        `);
    });
}
function createUserReportTable() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${API_BASE_URL}/user-report`);
        const data = yield response.json();
        createTable('userReportTable', ['Nome do Utilizador', 'Tipo', 'Unidade', 'Ações Associadas'], data, (item) => `
            <td>${item.userName}</td>
            <td>${item.userType}</td>
            <td>${item.unitName}</td>
            <td><ul>${item.actions.map((a) => `<li>${a.title}</li>`).join('')}</ul></td>
        `);
    });
}
function createAccessesByUrlTable() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${API_BASE_URL}/accesses-by-url`);
        const data = yield response.json();
        createTable('accessesByUrlTable', ['URL', 'Contagem de Acessos'], data, (item) => `
            <td>${item.url}</td>
            <td>${item.accessCount}</td>
        `);
    });
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
