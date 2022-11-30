import { ProjectGraphRecord, UserRecord } from '@celluloid/types';
import { clearProject, loadProjectThunk } from 'actions/ProjectActions';
import * as R from 'ramda';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Dispatch } from 'redux';
import { AsyncAction, EmptyAction } from 'types/ActionTypes';
import { ProjectRouteParams } from 'types/ProjectTypes';
import { AppState } from 'types/StateTypes';
import { Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { t } from 'i18next';

import ProjectComponent from './ProjectComponent';

interface Props extends
  RouteComponentProps<ProjectRouteParams> {
  user?: UserRecord;
  project?: ProjectGraphRecord;
  error?: string;
  loadProject(projectId: string):
    AsyncAction<ProjectGraphRecord, string>;
  clearProject(): EmptyAction;
}

const mapStateToProps = (state: AppState) => ({
  user: state.user,
  project: state.project.details.project,
  error: state.project.details.error
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loadProject: (projectId: string) =>
    loadProjectThunk(projectId)(dispatch),
  clearProject: () =>
    dispatch(clearProject())
});

interface State {
  openLoadingError: boolean;
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(class extends React.Component<Props, State> {

    state = {
      openLoadingError: false
    } as State;

    componentDidUpdate(prevProps: Props) {
      if (!R.equals(this.props.user, prevProps.user)) {
        this.load();
      }
    }

    componentDidMount() {
      this.load();
    }

    componentWillUnmount() {
      this.props.clearProject();
    }

    load() {
      const projectId = this.props.match.params.projectId;
      this.props.loadProject(projectId);
    }

    loadingError = () => {
      this.setState({openLoadingError: true});
    }

    handleCloseLoadingError = () => {
      this.setState({openLoadingError: false});
    }

    render() {
      const { project } = this.props;
      const load = this.load.bind(this);

      return (
        <>
          <ProjectComponent
            project={project}
            onVideoChange={load}
            onLoadingError={this.loadingError}
          />
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={this.state.openLoadingError}
            onClose={this.handleCloseLoadingError}
            message={t('project.loadingFailed')}
            action={
              <React.Fragment>
                <IconButton aria-label="close" color="inherit" onClick={this.handleCloseLoadingError}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          />
        </>
      );
    }
  })
);