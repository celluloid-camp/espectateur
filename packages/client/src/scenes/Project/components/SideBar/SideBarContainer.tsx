import { ProjectGraphRecord, UserRecord, AnnotationRecord } from '@celluloid/types';
import {
  deleteProjectThunk,
  openShareProject,
  setProjectCollaborativeThunk,
  setProjectPublicThunk,
  unshareProjectThunk,
  setAnnotationShowingMode,
  switchOwnAnnotations
} from 'actions/ProjectActions';
import { triggerCancelAnnotation } from 'actions/AnnotationsActions';
import { playerSwitchMode } from 'actions/PlayerActions';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AsyncAction, EmptyAction } from 'types/ActionTypes';
import { AppState } from 'types/StateTypes';

import SideBarComponent from './SideBarComponent';
import { WithI18n, withI18n } from 'react-i18next';
import { playerSwitchSequencing } from '../../../../actions/PlayerActions';

interface Props {
  user?: UserRecord;
  project: ProjectGraphRecord;
  setPublicLoading: boolean;
  setCollaborativeLoading: boolean;
  unshareLoading: boolean;
  deleteLoading: boolean;
  setPublicError?: string;
  setCollaborativeError?: string;
  unshareError?: string;
  deleteError?: string;
  performance_mode: boolean;
  sequencing: boolean;
  ownAnnotations: boolean;
  annotations: AnnotationRecord[];
  onClickSetPublic(projectId: string, value: boolean):
    AsyncAction<ProjectGraphRecord, string>;
  onClickSetCollaborative(projectId: string, value: boolean):
    AsyncAction<ProjectGraphRecord, string>;
  openShareDialog(): EmptyAction;
  unshareProject(projectId: string):
    AsyncAction<ProjectGraphRecord, string>;
  onClickDelete(projectId: string): AsyncAction<null, string>;
  onClickSwitchPlayerMode(): void;
  onClickSwitchSequencing(): void;
  onClickSwitchOwnAnnotations(): void;
  onChangeAnnotationShowingMode(event: React.ChangeEvent<HTMLSelectElement>): void;
}

const mapStateToProps = (state: AppState) => ({
  setPublicLoading: state.project.details.setPublicLoading,
  setCollaborativeLoading: state.project.details.setCollaborativeLoading,
  unshareLoading: state.project.details.unshareLoading,
  deleteLoading: state.project.details.deleteLoading,
  setPublicError: state.project.details.setPublicError,
  setCollaborativeError: state.project.details.setCollaborativeError,
  unshareError: state.project.details.unshareError,
  deleteError: state.project.details.deleteError,
  user: state.user,
  performance_mode: state.project.player.performance_mode,
  sequencing: state.project.player.sequencing,
  ownAnnotations: state.project.details.ownAnnotations,
  annotations: state.project.video.annotations
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openShareDialog: () => dispatch(openShareProject()),
  unshareProject: (projectId: string) =>
    unshareProjectThunk(projectId)(dispatch),
  onClickDelete: (projectId: string) =>
    deleteProjectThunk(projectId)(dispatch),
  onClickSetPublic: (projectId: string, value: boolean) =>
    setProjectPublicThunk(projectId, value)(dispatch),
  onClickSetCollaborative: (projectId: string, value: boolean) =>
    setProjectCollaborativeThunk(projectId, value)(dispatch),
  onClickSwitchPlayerMode: () =>
    dispatch(playerSwitchMode()) && dispatch(triggerCancelAnnotation()),
  onClickSwitchSequencing: () =>
    dispatch(playerSwitchSequencing()) && dispatch(triggerCancelAnnotation()),
  onClickSwitchOwnAnnotations: () =>
    dispatch(switchOwnAnnotations()) && dispatch(triggerCancelAnnotation()),
  onChangeAnnotationShowingMode: (event: React.ChangeEvent<HTMLSelectElement>) => 
    dispatch(setAnnotationShowingMode(event.target.value)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withI18n()(class extends React.Component<Props & WithI18n> {
  render() {
    const {
      project,
      openShareDialog,
      unshareProject,
      t
    } = this.props;

    const content = new Set([
      { subtitle: t('project.creatorRole'), ...project.user },
      ...project.members
    ]);

    const onClickShare = () => {
      if (project.shared) {
        unshareProject(project.id);
      } else {
        openShareDialog();
      }
    };

    return (
      <SideBarComponent
        {...this.props}
        onClickShare={onClickShare}
        members={content}
      />
    );
  }
}));