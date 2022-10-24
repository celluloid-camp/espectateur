import { ProjectGraphRecord } from '@celluloid/types';
import {
  Grid,
  MuiThemeProvider,
  WithStyles,
  withStyles,
  Divider
} from '@material-ui/core';
import ProjectSummary from 'components/ProjectSummary';
import * as React from 'react';
import { Dark } from 'utils/ThemeUtils';
import SideBar from './components/SideBar';
import { styles } from './ProjectStyles';
import Video from './scenes/Video';
import { WithI18n, withI18n } from 'react-i18next';
import MetaDataComponent from './components/MetaData/MetaDataComponent';

interface Props extends WithStyles<typeof styles> {
  project?: ProjectGraphRecord;
  onVideoChange(): void;
  onLoadingError(): void;
}

export default withStyles(styles)(withI18n()(({
  project,
  classes,
  t,
  onLoadingError
}: Props & WithI18n) => (
    <div className={classes.root}>
      <MuiThemeProvider theme={Dark}>
        <div className={classes.videoContainer}>
          <div className={classes.video}>
            {project &&
              <Video
                project={project}
                onLoadingError={onLoadingError}
              />
            }
          </div>
        </div>
      </MuiThemeProvider>
      <div
        className={classes.content}
      >
        {project &&
          <div>
            <Grid
              container={true}
              direction="row"
              alignItems="flex-start"
              spacing={24}
            >
              <Grid item={true} xs={12} md={8} lg={9}>
                <ProjectSummary project={project} />
              </Grid>
              <Grid
                className={classes.sideBar}
                item={true}
                xs={12}
                md={4}
                lg={3}
              >
                <SideBar
                  project={project}
                />
              </Grid>
            </Grid>
            <Divider 
              className={classes.divider}
            />
            <MetaDataComponent project={project}/>
          </div>
        }
      </div>
    </div>
  )));