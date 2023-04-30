import { spawn } from 'child_process'

// TODO: Add a way to change the password

export const checkIfTerminalPasswordExists = async () => {
  return new Promise(async (resolve, reject) => {
    const child = await spawn(`sudo ls`, [])
    child.on('close', (code: number) => {
      resolve(code == 0)
    })
    child.on('error', (error) => {
      reject(false)
    })
  })
}

export const changeTerminalPassword = async () => {
  return new Promise(async (resolve, reject) => {
    const child = await spawn(`sudo ls`, [])
    child.on('close', (code: number) => {
      resolve(code == 0)
    })
    child.on('error', (error) => {
      reject(false)
    })
  })
}

export const setDefaultTerminalPassword = async () => {
  return new Promise(async (resolve, reject) => {
    const child = await spawn(`sudo ls`, [])
    child.on('close', (code: number) => {
      resolve(code == 0)
    })
    child.on('error', (error) => {
      reject(false)
    })
  })
}

export const clearTerminalPassword = async () => {
  return new Promise(async (resolve, reject) => {
    const child = await spawn(`sudo ls`, [])
    child.on('close', (code: number) => {
      resolve(code == 0)
    })
    child.on('error', (error) => {
      reject(false)
    })
  })
}
