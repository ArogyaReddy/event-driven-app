// Event types for the application
export const EventTypes = {
  // Auth events
  USER_LOGIN: 'user.login',
  USER_LOGOUT: 'user.logout',
  
  // Company events
  COMPANY_SETUP_REQUESTED: 'company.setup.requested',
  COMPANY_CREATED: 'company.created',
  COMPANY_UPDATED: 'company.updated',
  
  // Employee events
  EMPLOYEE_ADD_REQUESTED: 'employee.add.requested',
  EMPLOYEE_CREATED: 'employee.created',
  EMPLOYEE_UPDATED: 'employee.updated',
  EMPLOYEE_DELETED: 'employee.deleted',
  
  // Chat events
  CHAT_MESSAGE: 'chat.message',
  CHAT_COMMAND: 'chat.command',
} as const;

export type EventType = typeof EventTypes[keyof typeof EventTypes];
