const transports = [console];

export const logger = {
  info(...args: any[]) {
    transports.forEach((transport) => transport.info(args));
  },
  error(...args: any[]) {
    transports.forEach((transport) => transport.error(args));
  },
};
