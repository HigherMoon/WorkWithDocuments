const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  getDatabaseStatus: () => ipcRenderer.invoke('get-database-status'),
  getDatabaseTable: (data) => ipcRenderer.invoke('get-table-database', data),
  
  getCurTeachers: (data) => ipcRenderer.invoke('get-cur-teachers', data),
  getCurListTeachers: (data) => ipcRenderer.invoke('get-cur-list-teachers', data),

  getCurUPTable: (data) => ipcRenderer.invoke('get-cur-UP', data),
  getPersonalPlan: (data) => ipcRenderer.invoke('get-cur-PP', data),
  getCurHoursTeachers: (data) => ipcRenderer.invoke('get-cur-hours-person', data),
  getCurStatsTeachers: (data) => ipcRenderer.invoke('get-cur-stats-person', data),
  getCurPPDatabase: () => ipcRenderer.invoke('get-cur-pp-database'),
  getActualDataPPUP: (data) => ipcRenderer.invoke('get-actual-pp-up', data),
  getFlows: (data) => ipcRenderer.invoke('get-cur-flows', data),
  getGroups: (data) => ipcRenderer.invoke('get-cur-groups', data),
  getDisciplines: (data) => ipcRenderer.invoke('get-cur-disciplines', data),
  getTypes: (data) => ipcRenderer.invoke('get-cur-types', data),
  getSyllabus: (data) => ipcRenderer.invoke('get-cur-syllabus', data),

  updateFlowsTable: (data) => ipcRenderer.invoke('update-table-flows', data),
  updateGroupsTable: (data) => ipcRenderer.invoke('update-table-groups', data),
  updateKafTable: (data) => ipcRenderer.invoke('update-table-kaf', data),
  updateUPTable: (data) => ipcRenderer.invoke('update-table-up', data),
  updatePPTable: (data) => ipcRenderer.invoke('update-table-pp', data),
  updateTypesTable: (data) => ipcRenderer.invoke('update-table-types', data),
  updateDisciplinesTable: (data) => ipcRenderer.invoke('update-table-disciplines', data),
  updateSyllabusTable: (data) => ipcRenderer.invoke('update-table-syllabus', data),
  updatePersonalHours: (data) => ipcRenderer.invoke('update-table-personal-plan', data),

  insertPerson: (data) => ipcRenderer.invoke('insert-table-kafedra', data),
  insertFlow: (data) => ipcRenderer.invoke('insert-table-flows', data),
  insertGroup: (data) => ipcRenderer.invoke('insert-table-groups', data),
  insertSyllabus: (data) => ipcRenderer.invoke('insert-table-up', data),
  insertPersonalPlan: (data) => ipcRenderer.invoke('insert-table-pp', data),
  insertDiscipline: (data) => ipcRenderer.invoke('insert-table-disciplines', data),
  insertType: (data) => ipcRenderer.invoke('insert-table-types', data),

  deletePerson: (data) => ipcRenderer.invoke('delete-table-kaf', data),
  deleteFlow: (data) => ipcRenderer.invoke('delete-table-flows', data),
  deleteGroup: (data) => ipcRenderer.invoke('delete-table-groups', data),
  deleteSyllabus: (data) => ipcRenderer.invoke('delete-table-up', data),
  deletePersonalPlan: (data) => ipcRenderer.invoke('delete-table-pp', data),
  deleteType: (data) => ipcRenderer.invoke('delete-table-types', data),
  deleteDiscipline: (data) => ipcRenderer.invoke('delete-table-disciplines', data),
})