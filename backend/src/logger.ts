import {createLogger, format, transports} from 'winston';
import DailyRotateFile from "winston-daily-rotate-file";

const transport: DailyRotateFile = new DailyRotateFile({
    filename: 'logs/app-%DATE%.log',
    dirname: 'logs',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '40m',
    auditFile: 'logs/audit.json',
    maxFiles: '14d',
    format: format.combine(
            format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
            format.align(),
            format.printf(info => `[${info.level}]: ${[info.timestamp]}: ${info.message}`),
        )
});

transport.on('rotate', function(oldFilename, newFilename) {
    // do something fun
});

const AppLogger = createLogger({
    exitOnError: false,
    transports: transport

        // new transports.File({
        //     filename: 'logs/app.log',
        //     format: format.combine(
        //         format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
        //         format.align(),
        //         format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
        //     )
        // }),
});

export {AppLogger};



