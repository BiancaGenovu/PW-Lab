import { getCircuites } from './circuites.model.js';

export async function circuitDetails() {
  const circuitesRows = await getCircuites();
  if (!circuitesRows) {
    throw new Error('circuites can not be get');
  }
  return circuitesRows;
}
