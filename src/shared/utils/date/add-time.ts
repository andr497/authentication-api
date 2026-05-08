import ms from 'ms';

export function addTime(duration: ms.StringValue): Date {
    return new Date(Date.now() + (ms(duration) as number));
}
