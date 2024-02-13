import * as uuid from 'uuid';

export const isUUID = (value: any) => uuid.validate(value)