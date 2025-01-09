const { createLogger, transports, format } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const userLogger = createLogger({
    transports: [
        new DailyRotateFile({
            filename: 'logs/user-%DATE%.log', 
            datePattern: 'YYYY-MM-DD',      
            level: 'info',
            format: format.combine(
                format.timestamp(),
                format.json()
            )
        }),
        new DailyRotateFile({
            filename: 'logs/user-error-%DATE%.log', 
            datePattern: 'YYYY-MM-DD',             
            level: 'error',
            format: format.combine(
                format.timestamp(),
                format.json()
            )
        })
    ]
});

module.exports = { userLogger };
