import statusCodes from "../statusCodes"

export const internalError = {
  ok: false,
  status: statusCodes.ERROR, 
  message: 'Internal error on server',
  data: {}
}