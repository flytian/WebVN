/* Command log
 * log -t=info -m='This is the log message'
 */

webvn.use(['script', 'log'], function (s, script, log) {

script.addCommand('log', {
    type: {
        type: 'String',
        shortHand: 't'
    },
    msg: {
        type: 'String',
        shortHand: 'm'
    }
}, function (options, value) {

    var type = options.type,
        msg = options.msg;

    switch (type) {
        case 'error':
            log.error(msg);
            break;
        case 'info':
            log.info(msg);
            break;
        case 'warn':
            log.warn(msg);
            break;
        default:
            log(msg);
    }

});

});