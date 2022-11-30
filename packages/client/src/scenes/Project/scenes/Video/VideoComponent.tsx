import 'rc-slider/assets/index.css';

import {
  AnnotationRecord,
  ProjectGraphRecord,
  UserRecord
} from '@celluloid/types';
import {
  Button,
  Grow,
  WithStyles,
  withStyles,
  Zoom
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { triggerAddAnnotation } from 'actions/AnnotationsActions';
import classnames from 'classnames';
import * as React from 'react';
import Fullscreen from 'react-full-screen';
import { connect } from 'react-redux';
import { TransitionGroup } from 'react-transition-group';
import { Dispatch } from 'redux';
import { EmptyAction } from 'types/ActionTypes';
import { AppState } from 'types/StateTypes';
import {
  PlayerChangeEvent,
  PlayerReadyEvent
} from 'types/VideoPlayerTypes';
import { canAnnotate } from 'utils/ProjectUtils';

import AnnotationContent from './components/AnnotationContent';
import AnnotationEditor from './components/AnnotationEditor';
import AnnotationHints from './components/AnnotationHints';
import Controls from './components/Controls';
import { styles } from './VideoStyles';
import VideoPlayer from './components/VideoPlayer';

interface Props extends WithStyles<typeof styles> {
  user?: UserRecord;
  project: ProjectGraphRecord;
  annotations: AnnotationRecord[];
  focusedAnnotation?: AnnotationRecord;
  visibleAnnotations: AnnotationRecord[];
  position: number;
  duration: number;
  playing: boolean;
  editing: boolean;
  fullscreen: boolean;
  showControls: boolean;
  showHints: boolean;
  ownAnnotations: boolean;
  annotationShowingMode: string;
  sequencing_mode: boolean;
  onUserAction(): void;
  onPlayerReady(event: PlayerReadyEvent): void;
  onPlayerStateChange(event: PlayerChangeEvent): void;
  onFullscreenChange(newState: boolean): void;
  onTogglePlayPause(): void;
  onToggleFullscreen(): void;
  onToggleHints(): void;
  onClickHint(annotation: AnnotationRecord): void;
  onClickAnnotate(): EmptyAction;
  onSeek(position: number, pause: boolean, seekAhead: boolean): void;
  onLoadingError(): void;
}

const mapStateToProps = (state: AppState) => ({
  editing: state.project.video.editing,
  focusedAnnotation: state.project.video.focusedAnnotation,
  ownAnnotations: state.project.details.ownAnnotations,
  annotationShowingMode: state.project.details.annotationShowingMode,
  sequencing_mode: state.project.player.sequencing
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onClickAnnotate: () => dispatch(triggerAddAnnotation())
});

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(({
    user,
    project,
    annotations,
    focusedAnnotation,
    visibleAnnotations,
    position,
    duration,
    playing,
    fullscreen,
    showControls,
    showHints,
    editing,
    ownAnnotations,
    annotationShowingMode,
    sequencing_mode,
    onUserAction,
    onPlayerReady,
    onPlayerStateChange,
    onFullscreenChange,
    onTogglePlayPause,
    onToggleFullscreen,
    onToggleHints,
    onClickHint,
    onClickAnnotate,
    onSeek,
    onLoadingError,
    classes
  }: Props) => {
    const controlsOpacity = showControls || showHints ?
      classes.visible : classes.hidden;

    const hintBoxHeight = showHints ?
      classes.hintBoxExpanded : classes.hintBoxCollapsed;

    const focusedAnnotationId = focusedAnnotation
      ? focusedAnnotation.id
      : undefined;

    annotations = annotations.filter(annotation =>
      (
        (
          annotationShowingMode === 'All' ||
          (annotationShowingMode === 'Performance' && annotation.performance_mode) ||
          (annotationShowingMode === 'Analyze' && !annotation.performance_mode)
        ) && (
        (ownAnnotations && user && annotation.userId === user.id) ||
        !ownAnnotations
        ) && (
          (sequencing_mode && annotation.sequencing ) ||
          !sequencing_mode
        )
      )
    );

    return (
      <Fullscreen
        enabled={fullscreen}
        onChange={onFullscreenChange}
      >
        <div
          className={classnames(
            'full-screenable-node',
            classes.videoWrapper
          )}
        >
          <div>
            <VideoPlayer 
              player={project.video.player} 
              path={project.video.path}
              className={classes.videoIframe}
              onPlayerReady={onPlayerReady}
              onPlayerStateChange={onPlayerStateChange}
              onLoadingError={onLoadingError}
            />
            <div
              className={classes.glassPane}
              onMouseMove={onUserAction}
              onClick={onTogglePlayPause}
            />
            {!showHints &&
              <div
                className={classes.annotationFrame}
                onMouseMove={onUserAction}
              >
                <Grow
                  appear={true}
                  in={editing}
                >
                  <div>
                    {user && editing &&
                      <AnnotationEditor
                        user={user}
                        projectId={project.id}
                        video={{
                          position: position,
                          duration: duration
                        }}
                        onSeek={onSeek}
                      />
                    }
                  </div>
                </Grow>
                <TransitionGroup appear={true}>
                  {!editing && Array.from(visibleAnnotations.values())
                    .map(annotation =>
                      <Grow
                        appear={true}
                        in={!editing}
                        key={annotation.id}
                      >
                        <div>
                          <AnnotationContent
                            project={project}
                            focused={
                              annotation.id === focusedAnnotationId
                            }
                            annotation={annotation}
                          />
                        </div>
                      </Grow>
                    )
                  }
                </TransitionGroup>
              </div>
            }
            {(user && canAnnotate(project, user)) &&
              <Zoom
                appear={true}
                exit={true}
                in={!editing && !showHints && showControls}
              >
                <Button
                  color="secondary"
                  variant="fab"
                  className={classes.annotateButton}
                  onClick={() => onClickAnnotate()}
                >
                  <EditIcon />
                </Button>
              </Zoom>
            }
            <div
              onMouseMove={onUserAction}
              className={classnames(classes.hintBox, controlsOpacity, hintBoxHeight)}
            >
              <AnnotationHints
                duration={duration}
                position={position}
                annotations={annotations}
                visible={showHints}
                onClick={onClickHint}
              />
            </div>
            <div
              onMouseMove={onUserAction}
              className={classnames([
                classes.controlFrame, controlsOpacity
              ])}
            >
              <Controls
                annotations={annotations}
                position={position}
                duration={duration}
                fullscreen={fullscreen}
                playing={playing}
                onSeek={onSeek}
                onToggleFullscreen={onToggleFullscreen}
                onTogglePlayPause={onTogglePlayPause}
                onToggleHints={onToggleHints}
              />
            </div>
          </div>
        </div>
      </Fullscreen>
    );
  })
);