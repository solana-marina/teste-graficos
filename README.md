### **Rastreamento de Endpoints de Análise para o Frontend**

Aqui está o resumo de cada relatório que implementámos no backend:

#### **1\. Ações por Status**

* **Endpoint:** GET /api/analyses/actions-by-status  
* **Tipo de Relatório:** Gráfico  
* **Visualização Sugerida (Chart.js):** Gráfico de **Pizza** (Doughnut ou Pie) ou de **Barras** (Bar).  
* **Filtros Disponíveis:**  
  * startDate (Data)  
  * endDate (Data)  
  * municipality (Texto)  
  * thematicArea (Enum)  
  * knowledgeArea (Enum)  
  * unitId (Número)

#### **2\. Produtos por Tipo**

* **Endpoint:** GET /api/analyses/products-by-type  
* **Tipo de Relatório:** Gráfico  
* **Visualização Sugerida (Chart.js):** Gráfico de **Barras** (Bar).   
* **Filtros Disponíveis:**  
  * startDate (Data)  
  * endDate (Data)  
  * municipality (Texto)  
  * unitId (Número)  
  * thematicArea (Enum)  
  * knowledgeArea (Enum)

#### **3\. Heatmap de Áreas de Conhecimento vs. Temáticas**

* **Endpoint:** GET /api/analyses/heatmap-thematic-knowledge  
* **Tipo de Relatório:** Gráfico (Especial)  
* **Visualização Sugerida (Chart.js):** Gráfico de **Matriz** (Matrix), que pode ser estilizado como um heatmap.  
* **Filtros Disponíveis:**  
  * startDate (Data)  
  * endDate (Data)  
  * municipality (Texto)  
  * unitId (Número)

#### **4\. Ações por Utilizador (Ranking)**

* **Endpoint:** GET /api/analyses/actions-by-user  
* **Tipo de Relatório:** Gráfico ou Tabela  
* **Visualização Sugerida (Chart.js):** Gráfico de **Barras Horizontais** (Bar com a opção indexAxis: 'y').   
* **Filtros Disponíveis:**  
  * startDate (Data)  
  * endDate (Data)  
  * municipality (Texto)  
  * unitId (Número)  
  * thematicArea (Enum)  
  * knowledgeArea (Enum)

#### **5\. Produção Mensal**

* **Endpoint:** GET /api/analyses/monthly-production  
* **Tipo de Relatório:** Gráfico  
* **Visualização Sugerida (Chart.js):** Gráfico de **Linha** (Line).   
* **Filtros Disponíveis:**  
  * year (Número, **obrigatório**)  
  * unitId (Número)  
  * municipality (Texto)

#### **6\. Acessos por URL**

* **Endpoint:** GET /api/analyses/accesses-by-url  
* **Tipo de Relatório:** Tabular  
* **Visualização Sugerida:** Tabela.   
* **Filtros Disponíveis:**  
  * startDate (Data)  
  * endDate (Data)

#### **7\. Relatório Tabular de Utilizadores**

* **Endpoint:** GET /api/analyses/user-report  
* **Tipo de Relatório:** Tabular  
* **Visualização Sugerida:** Tabela.   
* **Filtros Disponíveis:**  
  * unitId (Número)  
  * municipality (Texto)

#### **8\. Relatório Tabular Completo de Ações**

* **Endpoint:** GET /api/analyses/full-action-report  
* **Tipo de Relatório:** Tabular  
* **Visualização Sugerida:** Tabela.  
* **Filtros Disponíveis:**  
  * unitId (Número)  
  * thematicArea (Enum)  
  * knowledgeArea (Enum)  
  * municipality (Texto)
