const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  getDatabaseStatus: () => ipcRenderer.invoke('get-database-status'),
  getDatabaseTable: (tableName) => ipcRenderer.invoke('get-table-DB', tableName),

  getCurUPTable: (data) => ipcRenderer.invoke('get-cur-UP', data),
  getCurPersonalPlan: (data) => ipcRenderer.invoke('get-cur-PP', data),
  getCurHoursTeachers: (data) => ipcRenderer.invoke('get-cur-hours-person', data),
  getCurStatsTeachers: (data) => ipcRenderer.invoke('get-cur-stats-person', data),
  getCurPPDatabase: () => ipcRenderer.invoke('get-cur-pp-database'),
  getActualDataPPUP: (data) => ipcRenderer.invoke('get-actual-pp-up', data),
  getCurFlows: (data) => ipcRenderer.invoke('get-cur-flows', data),
  getCurGroups: (data) => ipcRenderer.invoke('get-cur-groups', data),
  getCurDisciplines: (data) => ipcRenderer.invoke('get-cur-disciplines', data),
  getCurTypes: (data) => ipcRenderer.invoke('get-cur-types', data),
  getCurSyllabusTable: (data) => ipcRenderer.invoke('get-cur-syllabus', data),
  

  updateFlowsTable: (data) => ipcRenderer.invoke('update-table-flows', data),
  updateGroupsTable: (data) => ipcRenderer.invoke('update-table-groups', data),
  updateKafTable: (data) => ipcRenderer.invoke('update-table-kaf', data),
  updateUPTable: (data) => ipcRenderer.invoke('update-table-up', data),
  updatePPTable: (data) => ipcRenderer.invoke('update-table-pp', data),

  insertKafTable: (data) => ipcRenderer.invoke('insert-table-kaf', data),
  insertFlowsTable: (data) => ipcRenderer.invoke('insert-table-flows', data),
  insertGroupsTable: (data) => ipcRenderer.invoke('insert-table-groups', data),
  insertUPTable: (data) => ipcRenderer.invoke('insert-table-up', data),
  insertPPTable: (data) => ipcRenderer.invoke('insert-table-pp', data),
  insertDisciplineTable: (data) => ipcRenderer.invoke('insert-table-disciplines', data),
  insertTypesTable: (data) => ipcRenderer.invoke('insert-table-types', data),

  deleteKafTable: (data) => ipcRenderer.invoke('delete-table-kaf', data),
  deleteFlowsTable: (data) => ipcRenderer.invoke('delete-table-flows', data),
  deleteGroupsTable: (data) => ipcRenderer.invoke('delete-table-groups', data),
  deleteUPTable: (data) => ipcRenderer.invoke('delete-table-up', data),
  deletePPTable: (data) => ipcRenderer.invoke('delete-table-pp', data),
  deleteTypesTable: (data) => ipcRenderer.invoke('delete-table-types', data),
  deleteDisciplineTable: (data) => ipcRenderer.invoke('delete-table-disciplines', data),
})