import * as crypto from 'crypto';

export const generateSignature = (secretKey: string, queryString: string): string => {
    return crypto
        .createHmac('sha256', secretKey)
        .update(queryString)
        .digest('hex');
};