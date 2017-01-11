const CONFIG = require('config');
const webhook = require(CONFIG.Controllers('webhook'));
let router = require('koa-router')();

router.get('/', webhook.verifyToken);
router.post('/', webhook.userPostMsg);

module.exports = router;
