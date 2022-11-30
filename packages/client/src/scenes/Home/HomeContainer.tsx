import { UserRecord } from '@celluloid/types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { loadVideoThunk } from 'actions/HomeActions';
import { openStudentSignup } from 'actions/Signin';
import { openJoinProject } from 'actions/HomeActions';
import classnames from 'classnames';
import * as React from 'react';
import { WithI18n, withI18n } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AsyncAction, EmptyAction } from 'types/ActionTypes';
import { AppState } from 'types/StateTypes';
import { Video } from 'types/VideoPlayerTypes';
import VideoInput from './components/VideoInput';
import NewProject from './components/NewProject';
import JoinProject from './components/JoinProject';
import ProjectGrid from './components/ProjectGrid';
import StudentsPict from './images/Students';
import TeacherPict from './images/Teacher';
import { NativeSelect, Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import NewProjectButton from './components/NewProjectButton';

const styles = ({ spacing, palette }: Theme) => createStyles({
  center: {
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  block: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  gridWrapper: {
    padding: spacing.unit * 2.5
  },
  grid: {
    height: '100%',
    padding: spacing.unit * 3,
  },
  formItem: {
    marginTop: spacing.unit * 3,
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    height: spacing.unit * 16,
  },
  title: {
    height: spacing.unit * 11,
    marginTop: spacing.unit,
    marginBottom: spacing.unit,
    color: palette.grey[600]
  },
  buttonWrapper: {
    bottom: 0,
    width: 300,
    paddingTop: spacing.unit * 2,
    paddingBottom: spacing.unit * 1
  },
  description: {
    lineHeight: 1.5
  },
  selector : {
    width: '100px',
    margin: '10px 0px 0px 0px'
  },
  formats : {
    width: '300px',
    color: 'gray'
  }
});

interface Props extends WithStyles<typeof styles>, WithI18n {
  user?: UserRecord;
  errors: {
    video?: string;
    projects?: string;
  };
  uploadtime: number;
  openJoinProject: boolean;
  onClickJoinProjectAsNewStudent(): EmptyAction;
  onClickJoinProjectAsConnectedUser(): EmptyAction;
  onClickNewProject(player: string, url: string, user?: UserRecord, file?: File): AsyncAction<Video, string>;
}

interface State {
  newProjectVideoUrl: string;
  player: string;
  newVideoFile: File;
  newVideoFileName: string;
  open: boolean;
  openUploadFeedback: boolean;
}

const mapStateToProps = (state: AppState) => {
  return {
    user: state.user,
    errors: state.home.errors,
    uploadtime: state.home.loadingTime,
    openJoinProject: state.home.openJoinProject
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onClickJoinProjectAsNewStudent: () => dispatch(openStudentSignup()),
    onClickJoinProjectAsConnectedUser: () => dispatch(openJoinProject()),
    onClickNewProject: (player: string, url: string, user?: UserRecord, file?: File) => 
      loadVideoThunk(player, url, user, file)(dispatch)
  };
};

export default withI18n()(withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(
    class extends React.Component<Props, State> {
      state = {
        newProjectVideoUrl: '',
        player: 'Youtube',
        newVideoFileName: 'No File Selected',
        open: false,
        openUploadFeedback: false
      } as State;

      render() {
        const { onClickJoinProjectAsNewStudent, onClickJoinProjectAsConnectedUser, user, classes, t } = this.props;

        const onClickJoinProject = () => {
          if (user) {
            onClickJoinProjectAsConnectedUser();
          } else {
            onClickJoinProjectAsNewStudent();
          }
        };

        const handleVideoUrlChanged = (
          event: React.ChangeEvent<HTMLInputElement>
        ) => {
          this.setState({ newProjectVideoUrl: event.target.value });
        };

        const handlePlayerTypeChanged = (
          event: React.ChangeEvent<HTMLSelectElement>
        ) => {
          this.setState({ player: event.target.value });
        };

        const handleChangeVideoFile = (
          event: React.ChangeEvent<HTMLInputElement>
        ) => {
          const target = event.target as HTMLInputElement;
          const file: File = (target.files as FileList)[0];
          this.setState({newVideoFile : file});
          this.setState({newVideoFileName : file.name});
        }; 

        const handleOpen = () => {
          this.setState({openUploadFeedback: false});
          this.setState({open: true});
        };

        const onClickNewProject = (player: string, url: string, connectedUser: UserRecord, file?: File) => {
          if (this.state.player === 'Local' && file) {
            this.setState({openUploadFeedback: true});
          }
          return this.props.onClickNewProject(player, url, connectedUser, file);
        };

        const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
          if (reason === 'clickaway') {
            return;
          }
          this.setState({open: false});
        };

        const handleCloseUploadFeedback = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
          if (reason === 'clickaway') {
            return;
          }
          this.setState({openUploadFeedback: false});
        };

        return (
          <>
            <div style={{ padding: 40 }}>
              <Grid
                container={true}
                spacing={40}
                direction="row"
                justify="center"
                alignItems="stretch"
                alignContent="stretch"
                className={classes.grid}
              >
                <Grid
                  item={true}
                  sm={12}
                  lg={4}
                  xl={3}
                >
                  <Typography variant="h3" color="primary" gutterBottom={true}>
                    {t('home.title')}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    className={classes.description}
                    gutterBottom={true}
                  >
                    {t('home.description')}
                  </Typography>
                </Grid>
                <Grid
                  item={true}
                  sm={12}
                  lg={4}
                  xl={6}
                  className={classes.center}
                >
                  <div className={classes.block}>
                    <Typography
                      variant="h4"
                      className={classes.title}
                    >
                      {t('home.teachers')}
                    </Typography>
                    <TeacherPict />
                    <NativeSelect
                      onChange={handlePlayerTypeChanged}
                      className={classes.selector}
                      inputProps={{
                        name: 'name',
                        id: 'name-native-disabled',
                      }}
                    >
                        <option value="Youtube">Youtube</option>
                        <option value="Local">Local</option>
                    </NativeSelect>
                    <div
                      className={classes.formItem}
                    >   
                        {this.state.player === 'Local'
                          ? <span
                            className={classes.formats}
                          >
                            {t('home.acceptedFormats')}
                          </span>
                          : <> </>
                        }
                        <Snackbar
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                          }}
                          open={this.state.open}
                          autoHideDuration={4000}
                          onClose={handleClose}
                          message={this.props.errors.video}
                          action={
                            <React.Fragment>
                              <IconButton aria-label="close" color="inherit" onClick={handleClose}>
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </React.Fragment>
                          }
                        />
                        <Snackbar
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                          }}
                          open={this.state.openUploadFeedback}
                          autoHideDuration={10000}
                          onClose={handleCloseUploadFeedback}
                          message={t('home.waitForUpload')}
                          action={
                            <React.Fragment>
                              <IconButton aria-label="close" color="inherit" onClick={handleCloseUploadFeedback}>
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </React.Fragment>
                          }
                        />

                        <VideoInput 
                          player={this.state.player} 
                          newProjectVideoUrl={this.state.newProjectVideoUrl} 
                          onTextChange={handleVideoUrlChanged}
                          errors={this.props.errors}
                          onVideoChange={handleChangeVideoFile}
                          selectedFileName={this.state.newVideoFileName} 
                          uploadtime={this.props.uploadtime}
                        />
                      <div className={classes.buttonWrapper}>
                        <NewProjectButton
                          player={this.state.player} 
                          newProjectVideoUrl={this.state.newProjectVideoUrl} 
                          errors={this.props.errors}
                          user={user}
                          newVideoFile={this.state.newVideoFile}
                          handleOpen={handleOpen}
                          onClickNewProject={onClickNewProject}
                        />
                     </div>
                     {this.props.openJoinProject
                       ? <JoinProject />
                       : <NewProject />
                     }
                    </div>
                  </div>
                </Grid>
                <Grid
                  item={true}
                  sm={12}
                  lg={4}
                  xl={3}
                  className={classes.center}
                >
                  <div className={classes.block}>
                    <Typography
                      variant="h4"
                      className={classes.title}
                    >
                      {t('home.students')}
                    </Typography>
                    <StudentsPict />
                    <div className={classnames(classes.formItem, classes.buttonWrapper)}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth={true}
                        onClick={() => onClickJoinProject()}
                      >
                        {t('home.joinProject')}
                      </Button>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
            <div style={{ padding: 20 }}>
              <ProjectGrid />
            </div>
          </>
        );
      }
    }
  )));
