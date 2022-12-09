import { Grid, Typography } from '@material-ui/core';
import * as React from 'react';
import { WithI18n, withI18n } from 'react-i18next';

const logoIcp = require('./images/lr.png');
const logoFsm = require('./images/espectateur.png');
const logoLp = require('./images/CRHIA.jpg');
const logoBlog = require('./images/logo-blog-celluloid.jpg');
const logoEr = require('./images/er.png');
const logoAquitaine=require('./images/nl.jpg');
const logoUp=require('./images/up.png');
export default withI18n()(({ t }: WithI18n) => (
  <div
    style={{
      padding: 48,
      maxWidth: 1024,
      margin: '0 auto'
    }}
  >
    <Typography variant="h2" gutterBottom={true}>
      {t('about.title')}
    </Typography>
    <Typography variant="subtitle1" gutterBottom={true}>
      {t('about.intro.prefix')}<b>e-spect@teur</b>{t('about.intro.suffix')}
    </Typography>
    <Typography variant="subtitle1" gutterBottom={true}>
      {t('about.support')}
    </Typography>
    <Typography variant="subtitle1" gutterBottom={true}>
      {t('about.opensource.prefix')}<a href="https://github.com/celluloid-camp/">{t('about.opensource.github')}</a>
    </Typography>
    <div
      style={{
        padding: 48,
        textAlign: 'center'
      }}
    >
      <Grid container={true} spacing={40} direction="row" justify="center">
        <Grid item={true}>
          <a href="https://www.univ-larochelle.fr/" target="_blank">
            <img src={logoIcp} height="100px" alt="La Rochelle Université" />
          </a>
        </Grid>
        <Grid item={true}>
          <a href="https://espectateur.huma-num.fr/" target="_blank">
            <img src={logoFsm} height="100px" alt="Espectateur" />
          </a>
        </Grid>
        <Grid item={true}>
          <a href="https://www.crhia.fr/" target="_blank">
            <img src={logoLp} height="100px" alt="CRHIA" />
          </a>
        </Grid>
        <Grid item={true}>
          <a href="https://celluloid.hypotheses.org" target="_blank">
            <img src={logoBlog} height="100px" alt="Le blog Celluloid" />
          </a>
        </Grid>
        <Grid item={true}>
          <a href="https://info.erasmusplus.fr/" target="_blank">
            <img src={logoEr} height="100px" alt="Erasmus" />
          </a>
        </Grid>
        <Grid item={true}>
          <a href="https://www.nouvelle-aquitaine.fr/" target="_blank">
            <img src={logoAquitaine} height="100px" alt="Nouvelle Aquitaine" />
          </a>
        </Grid>
        <Grid item={true}>
          <a href="https://www.univ-poitiers.fr/" target="_blank">
            <img src={logoUp} height="100px" alt="Université de Poitiers" />
          </a>
        </Grid>
      </Grid>
    </div>
  </div>
));
