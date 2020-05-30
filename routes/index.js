const express = require('express');
const router = express.Router();
const path = require('path');
const angularBuild = path.resolve(__dirname, '../dist/loppurealtime');

/**angular takes care of page navigation so here if we have GET-request that is
 * not for the api we redirect to angular index-page. Doing this we can refresh
 * the browser page even when we are not in the root.
 */
router.use(express.static(angularBuild));
router.get('/*', function (req, res, next) {
  if (req.url.startsWith('/api')) {
    return next();
  }
  res.sendFile(angularBuild + '/index.html');
});

module.exports = router;
